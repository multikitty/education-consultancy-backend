const ObjectId = require('mongoose').Types.ObjectId
const User = require('../../models/users.model')
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../../utils/emails/emails')
const randomstring = require("randomstring");
const moment = require('moment');
const { uploadedImgPath,pwdSaltRounds } = require('../../../config/vars')
var Sequelize = require("sequelize");
const Op = Sequelize.Op;

// API to get users list
exports.list = async (req, res, next) => {
    try {
        let { all, page, limit, firstName, lastName, kyc, startDate, endDate } = req.query
        let { email } = req.body
        const filter = {}

        if (email)
            filter.email = email

        if (firstName)
            filter.firstName = { $regex: firstName, $options: "gi" }

        if (lastName)
            filter.lastName = { $regex: lastName, $options: "gi" }

        if (kyc) {
            if (kyc === 'true') {
                filter['kycs.kycStatus'] = true
            }
            else if (kyc === 'false') {
                filter['$or'] = [{ 'kycs.kycStatus': undefined }, { 'kycs.kycStatus': false }]
            }
        }

        if (startDate && endDate) {
            startDate = new Date(startDate)
            endDate = new Date(endDate)
            if (startDate.getTime() == endDate.getTime()) {
                filter.createdAt = { $gte: startDate }
            }
            else {
                filter['$and'] = [{ 'createdAt': { $gte: startDate } }, { 'createdAt': { $lte: endDate } }]
            }
        }

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        if (!all)
            limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await User.countDocuments(filter)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        let pipeline = [
            {
                $lookup: {
                    from: 'kycs',
                    foreignField: 'userId',
                    localField: '_id',
                    as: 'kycs'
                }
            },
            {
                $unwind: {
                    path: "$kycs", preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { createdAt: -1 } },
            { $match: filter },
        ]

        if (!all) {
            pipeline.push({ $skip: limit * (page - 1) })
            pipeline.push({ $limit: limit })
        }

        pipeline.push(
            {
                $project: {
                    _id: 1, firstName: 1, lastName: 1, email: 1, kycStatus: '$kycs.kycStatus', createdAt: 1,
                    status: 1,
                }
            }
        )

        const users = await User.aggregate(pipeline)

        return res.send({
            success: true, message: 'Users fetched successfully',
            data: {
                users,
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

// API to delete user
exports.delete = async (req, res, next) => {
    try {
        const { userId } = req.params
        if (userId) {
            const user = await User.deleteOne({ _id: userId })
            if (user && user.deletedCount)
                return res.send({ success: true, message: 'User deleted successfully', userId })
            else return res.status(400).send({ success: false, message: 'User not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'User Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to delete user
exports.get = async (req, res, next) => {
    try {
        const { userId } = req.params
        if (userId) {
            const user = await User.findOne({ _id: userId }, '-password -resetPasswordToken')
            if (user)
                return res.send({ success: true, message: 'User fetch successfully', user })
            else return res.status(400).send({ success: false, message: 'User not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'User Id is required' })
    } catch (error) {
        return next(error)
    }
}

exports.create = async (req, res, next) => {
    try {


        let { username, email, password } = req.body;
        if (username && email && password) {

            let body = req.body;
            email = email.toLowerCase().trim();
            body.email = email;
            let user = await User.findOne({ email });
            if (user) {
                return res.status(200).send({ success: false, message: 'User already exists' });
            }
            user = await User.create(body);

            const rndmoken = randomstring.generate({ length: 16, charset: 'alphanumeric' })
            let content = { "${url}": `${process.env.REACT_APP_FRONT_URL}/verify-email/${rndmoken}`, "${email}": email, }
            const payload = {}
            payload.token = rndmoken
            payload.email = email
            payload.type = "verify-user"
            payload.data = { url: `${process.env.REACT_APP_FRONT_URL}/verify-email/${rndmoken}`, email: email, }
            payload.status = true
            await sendEmail(email, 'verify-user', content)

            return res.status(200).send({
                success: true,
                message: 'User successfully created',
                data: user
            })
        }
        else return res.status(200).send({ success: false, message: 'Required fields are missing' });
    } catch (error) {
        next(error)
    }
}

exports.edit = async (req, res, next) => {
    try {
        let payload = req.body



        console.log(payload, "payyyy\u303D\uFE0F")
        if (payload._id) {
            if(payload.password) {
                const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
                const hash = await bcrypt.hash(payload.password, rounds);
                payload.password = hash;
            }
         
            await User.findByIdAndUpdate({ _id: payload._id }, { $set: payload }, { new: true })
            let users = await User.find().sort({updatedAt: -1})
            return res.send({ success: true, message: 'User updated successfully', users })
        }
        else
            return res.status(400).send({ success: false, message: 'User Id is required' })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'User')
        else
            return next(error)
    }
}

