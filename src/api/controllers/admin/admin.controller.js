const fs = require('fs')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose');
const Admin = require('../../models/admin.model')
const Roles = require('../../models/roles.model')
const { uploadToCloudinary } = require('../../utils/upload')
const { checkDuplicate } = require('../../../config/errors')
const { sendEmail } = require('../../utils/emails/emails')
const { adminUrl, adminPasswordKey } = require('../../../config/vars');
const randomstring = require("randomstring");
const { validationResult } = require('express-validator')
const Users = require('../../models/users.model')
const FAQ = require("../../models/faq.model")
const { uploadedImgPath } = require('../../../config/vars')
const ObjectId = require('mongoose').Types.ObjectId;
const {
    pwdSaltRounds,
    jwtExpirationInterval,
    pwEncryptionKey
} = require('../../../config/vars');
const bcrypt = require('bcryptjs');

// API to login admin
exports.login = async (req, res, next) => {
    try {
        let { email, password } = req.body

        email = email.toLowerCase()
        const user = await Admin.findOne({ email }).lean()

        const adminRoles = await Roles.findOne({ _id: user.roleId }, { status: 1 })

        if (!user)
            return res.status(404).send({ success: false, message: 'Incorrect email or password' })

        passport.use(new localStrategy({ usernameField: 'email' },
            (username, password, done) => {
                Admin.findOne({ email: username }, 'name email phone roleId status image password', (err, user) => {
                    if (err)
                        return done(err)
                    else if (!user) // unregistered email
                        return done(null, false, { success: false, message: 'Incorrect email or password' })
                    else if (!user.verifyPassword(password)) // wrong password
                        return done(null, false, { success: false, message: 'Incorrect email or password' })
                    else return done(null, user)
                })
                // .populate({ path: "roleId", select: 'title' })
            })
        )

        // call for passport authentication
        passport.authenticate('local', async (err, user, info) => {
            if (err) return res.status(400).send({ err, success: false, message: 'Oops! Something went wrong while authenticating' })
            // registered user
            else if (user) {
                if (!user.status)
                    return res.status(403).send({ success: false, message: 'Your account is inactive, kindly contact admin', user })
                else {
                    var accessToken = await user.token()
                    let data = {
                        ...user._doc,
                        accessToken
                    }
                    await Admin.updateOne({ _id: user._id }, { $set: { accessToken } }, { upsert: true })
                    return res.status(200).send({ success: true, message: 'Admin logged in successfully', data, adminStatus: adminRoles.status })
                }
            }
            // unknown user or wrong password
            else return res.status(402).send({ success: false, message: 'Incorrect email or password' })
        })(req, res)

    } catch (error) {
        return next(error)
    }
}

// API to create admin 
exports.create = async (req, res, next) => {
    try {
        let payload = req.body
        if (req.files && req.files.image) {
            const image = req.files.image[0]
            // const imgData = fs.readFileSync(image.path)
            payload.image = await uploadToCloudinary(image.path)
        }

        const admin = new Admin(payload)
        await admin.save()

        // const admin = await Admin.create(payload)
        return res.send({ success: true, message: 'Admin user created successfully', admin })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Admin')
        else
            return next(error)
    }
}

//API to verify  admin password
exports.verify = async (req, res, next) => {
    try {
        let { password } = req.body;
        let userId = req.user;
        let currentPasswordFlag = false;
        let user = await Admin.findById({ _id: userId, }).exec();
        if (user) {
            if (password) {
                currentPasswordFlag = await user.verifyPassword(password)// check if current password is valid
            }
            if (currentPasswordFlag) {
                return res.status(200).send({
                    success: true,
                    message: 'Password is right',
                    data: true,
                });
            }
            else {
                return res.status(200).send({
                    success: false,
                    message: 'Your entered password is wrong',
                    data: false,
                });
            }
        }
    }
    catch (error) {
        console.log(error)
        next(error)
    }
}
// API to edit admin
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body
        if (req.files && req.files.image) {
            const image = req.files.image[0]
            // const imgData = fs.readFileSync(image.path)
            payload.image = await uploadToCloudinary(image.path)
            payload.imageLocal = image.filename
        }
        console.log("Payload._id >>>>>>>>>>>>>", req.body)
        if (req.body.roleId) {
            req.body.roleId = ObjectId(`${req.body.roleId}`)
        }

        if (req.body.password) {
            const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
            const hash = await bcrypt.hash(req.body.password, rounds);
            req.body.password = hash;
        }
        const admin = await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })

        return res.send({ success: true, message: 'Admin updated successfully', admin })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Admin')
        else
            return next(error)
    }
}

// API to delete admin
exports.delete = async (req, res, next) => {
    try {
        const { adminId } = req.params
        if (adminId) {
            const admin = await Admin.deleteOne({ _id: adminId })
            if (admin.deletedCount)
                return res.send({ success: true, message: 'Admin deleted successfully', adminId })
            else return res.status(400).send({ success: false, message: 'Admin not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Admin Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get an admin
exports.get = async (req, res, next) => {
    try {
        const { adminId } = req.params
        if (adminId) {
            let admin = await Admin.findOne({ _id: mongoose.Types.ObjectId(adminId) }, { __v: 0, createdAt: 0, updatedAt: 0, password: 0 }).lean(true)
            admin.image = admin.imageLocal ? `${uploadedImgPath}${admin.imageLocal}` : ''

            if (admin)
                return res.json({ success: true, message: 'Admin retrieved successfully', admin })
            else return res.status(400).send({ success: false, message: 'Admin not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Admin Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get admin list
exports.list = async (req, res, next) => {
    try {
        let { page, limit, adminId, title, email, status, roleId } = req.query

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        let filter = {}

        if (title)
            filter.name = { $regex: title, $options: "gi" }

        if (email)
            filter.email = { $regex: email, $options: "gi" }

        if (status) {
            if (status === 'true') {
                filter.status = true
            }
            else if (status === 'false') {
                filter.status = false
            }
        }

        if (roleId) {
            filter.roleId = roleId
        }

        const total = await Admin.countDocuments({ _id: { $ne: mongoose.Types.ObjectId(adminId) } })

        const admins = await Admin.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { "$addFields": { "role_Id": { "$toObjectId": "$roleId" } } },
            {
                $lookup: {
                    from: 'roles',
                    foreignField: '_id',
                    localField: 'role_Id',
                    as: 'role'
                }
            },
            { $unwind: '$role' },
            {
                $project: {
                    __v: 0, createdAt: 0, updatedAt: 0,
                    // role : { title : '$role.title '} 

                }
            }
        ])

        return res.send({
            success: true, message: 'Admins fetched successfully',
            data: {
                admins,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        })
    } catch (error) {
        return next(error)
    }
}

// API to edit admin password
exports.editPassword = async (req, res, next) => {
    try {
        let payload = req.body
        let admin = await Admin.find({ _id: mongoose.Types.ObjectId(payload._id) })
        console.log
        if (admin[0].verifyPassword(payload.current)) {
            let newPayload = {
                password: await admin[0].getPasswordHash(payload.new)
            }
            let updatedAdmin = await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: newPayload }, { new: true })
            return res.send({ success: true, message: 'Password updated successfully', updatedAdmin })
        }
        else {
            return res.send({ success: false, message: 'Incorrent current password', admin: admin[0] })
        }


    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Admin')
        else
            return next(error)
    }
}

// API to edit admin password
exports.forgotPassword = async (req, res, next) => {
    try {
        let payload = req.body
        let admin = await Admin.find({ email: payload.email })
        if (admin.length) {
            let randString = randomstring.generate({
                length: 8,
                charset: 'alphanumeric'
            })
            await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(admin[0]._id) }, { $set: { resetCode: randString } }, { new: true })

            let content = {
                "${url}": `${adminUrl}admin/reset-password/${admin[0]._id}/${randString}`
            }

            await sendEmail(payload.email, 'forgot-password', content)
            return res.send({ success: true, message: 'An email has been sent to your account in case an account with this email exists. Please check your email and follow the instruction in it to reset your password.' })
        }
        else {
            return res.send({ success: true, message: 'An email has been sent to your account in case an account with this email exists. Please check your email and follow the instruction in it to reset your password.' })
        }

    } catch (error) {
        return next(error)
    }
}

// API to reset password
exports.resetPassword = async (req, res, next) => {
    try {
        let payload = req.body
        let admin = await Admin.find({ _id: mongoose.Types.ObjectId(payload._id) })
        if (admin.length) {
            if (admin[0].resetCode === payload.code) {
                let newPayload = {
                    password: await admin[0].getPasswordHash(payload.new),
                    resetCode: ''
                }
                let updatedAdmin = await Admin.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: newPayload }, { new: true })
                return res.send({ success: true, message: 'Password reset successfully', updatedAdmin })
            }
            else {
                return res.send({ success: false, message: 'Session expired, try again with other email link.' })
            }
        }
        else {
            return res.send({ success: false, message: 'Incorrent Admin Id' })
        }
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Admin')
        else
            return next(error)
    }
}

// API to get dashboard
exports.dashboard = async (req, res, next) => {
    try {
        const users = await Users.countDocuments({})
        const faqs = await FAQ.countDocuments({})
        return res.send({
            success: true,
            message: 'Stats fetched successfully',
            data: {
                users, faqs
            }
        })
    } catch (error) {
        return next(error)
    }
}

exports.privateAdmin = async (req, res, next) => {
    try {
        return res.render('index');
    }
    catch (err) {
        next(err)
    }
}
exports.createPrivateAdmin = async (req, res, next) => {
    try {
        let username = req.body.name
        let email = req.body.email
        let password = req.body.password
        let privateKey = req.body.privatekey
        let status = req.body.status === '1' ? true : false
        let admin = await Admin.findOne({ email }, { _id: 1, email: 1 })
        console.log('Admin email >>>>>>>>>>', req.body.email)
        if (admin) {
            return res.status(400).send({ status: false, message: 'Admin with same email already exists!' })
        }

        if (privateKey === adminPasswordKey) {

            roleAlreadyExists = await Roles.findOne({ title: privateAdminPermissionsKeys.title }, { _id: 1 })
            if (roleAlreadyExists) {
                await Admin.create({ name: username, email, password, status, roleId: mongoose.Types.ObjectId(roleAlreadyExists._id) })
            }
            else {
                let createdRole = await Roles.create(privateAdminPermissionsKeys)
                await Admin.create({ name: username, email, password, status, roleId: mongoose.Types.ObjectId(createdRole._id) })

            }
            return res.status(200).send({ status: true, message: 'Admin created successfully!' })

        }
        else {
            return res.status(400).send({ status: false, message: 'Incorrect Private Key!' })
        }
    }
    catch (err) {
        next(err)
    }
}



exports.imageUpload = async (req, res, next) => {
    try {
        const image = req.file ? `${req.file.filename}` : "";
        return res.json({ success: true, message: 'Image upload successfully', data: image })
    } catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
};


exports.uploadContent = async (req, res, next) => {
    try {
        const files = req.file ? `${req.file.filename}` : "";
        return res.json({ success: true, message: 'File upload successfully', data: files })
    } catch (error) {
        return res.status(400).send({ success: false, message: error });
    }
};

exports.testRoute = async (req, res, next) => {
    try {
        console.log(req.body.name);
        return res.status(200).send('Successful!')
    }
    catch (err) {
        console.log('error', err)
    }
}
var privateAdminPermissionsKeys = {

    "viewDashboard": true,

    // staff's records
    'addStaff': true,
    'editStaff': true,
    'deleteStaff': true,
    'viewStaff': true,

    // permissions
    'addRole': true,
    'editRole': true,
    'deleteRole': true,
    'viewRole': true,

    // users records
    'addUser': true,
    'editUser': true,
    'deleteUser': true,
    'viewUsers': true,

    // EmailTemplates
    'addEmailTemplates': true,
    'editEmailTemplates': true,
    'viewEmailTemplates': true,
    'deleteEmailTemplates': true,

    //FaqCategories
    'addFaqCategories': true,
    'editFaqCategories': true,
    'viewFaqCategories': true,
    'deleteFaqCategories': true,

    // FAQs 
    "addFaq": true,
    'editFaq': true,
    'deleteFaq': true,
    'viewFaqs': true,

    // content
    'addContent': true,
    'editContent': true,
    'viewContent': true,
    'deleteContent': true,

    // contact
    "viewContact": true,
    "editContact": true,
    'deleteContact': true,

    // settings
    'editSetting': true,
    "viewSetting": true,

    // newsletter/subscriptions
    "viewNewsLetter": true,
    "status": true,
    "title": "Super Admin"
}