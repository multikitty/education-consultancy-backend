const bcrypt = require('bcryptjs');
const { env } = require('../../../config/vars');
const User = require('../../models/admin.model');
const Role = require('../../models/roles.model');
const { ENV } = require('../../../config/config');
const ObjectId = require('mongoose').Types.ObjectId;
const { checkDuplicate } = require('../../middlewares/error');
const Activity = require('../../models/activity.model');
var CryptoJS = require("crypto-js");
const { sendEmail } = require('../../../api/utils/emails/emails')

// API to create admin staff user
exports.create = async (req, res, next) => {
    try {
        let staff = req.body;
        const { firstName, email, password } = req.body;

        if (staff.roleId !== '') {
            /** 
             * find if user role has permission of partner dashboard then he's user of type partner / Mc. Admin
             * type 2 = Mc. admin, partner or manager
             *  type 3 = Admin staff user
            */
            let role = await Role.findOne({ _id: staff.roleId }, 'partnerDashboard');
            if (role) {
                if (role.partnerDashboard)
                    staff.type = 2;
                else staff.type = 3;
            }
        }
        // saving username also as we're using same model for staff
        var date = new Date();
        staff.username = date.getTime();
        staff.xOauth = CryptoJS.AES.encrypt(password, "SecureWay");
        await User.create(staff);
        res.status(200).send({ success: true, message: 'Staff created successfully' });
        let activityData = {
            module: 'Staff',
            type: 1, // action type =  1 (i.e. CREATED)
            message: 'by $$firstName$$',
            userId: req.user,
            ip: req.ip,
        }
        Activity.create(activityData);

        let emailData = {
            name: firstName,
            email,
            password,
            baseUrl: ENV.baseUrl
        }

        // sendEmail('mathlete_credentials_admin', email, emailData);
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Staff');
        else next(error);
    }
}

// API to edit admin staff user
exports.edit = async (req, res, next) => {
    try {
        let { _id, adminPassword } = req.body;
        let currentPasswordFlag = false;
        let userId = req.user;
        let user = await User.findById({ _id: userId, }).exec();
        User.findOne({ _id }, async (err, staff) => {
            if (err) return res.status(400).send({ success: false, err });
            else if (staff) {
                for (let x in req.body) // making key value pair
                    if (typeof req.body[x] != 'string' && req.body[x] != undefined)
                        staff[x] = req.body[x]; // for type of array, boolean etc.
                    else if (typeof req.body[x] == 'string' && req.body[x] != '' && req.body[x] != undefined)
                        staff[x] = req.body[x];

                if (req.body.password !== '' && req.body.password !== undefined) {
                    currentPasswordFlag = await user.verifyPassword(adminPassword);
                    if (!currentPasswordFlag) {
                        return res.status(403).send({
                            success: false,
                            message: 'Your password is wrong',
                        });
                    }
                    staff.xOauth = CryptoJS.AES.encrypt(staff.password, "SecureWay");
                    console.log('staff.xOauth......', staff.xOauth)
                }

                staff.branchId = req.body.branchId;
                staff.save((err, result) => {
                    if (err) return res.status(422).send({ err, success: false, message: 'Staff with same email already exists' });
                    else {
                        res.status(200).send({ result, success: true, message: 'Staff updated successfully' });
                        let activityData = {
                            module: 'Staff',
                            type: 2, // action type =  1 (i.e. CREATED)
                            message: 'by $$firstName$$',
                            userId: req.user,
                            ip: req.ip,
                        }
                        Activity.create(activityData);
                    }
                });
            } else return res.status(400).send({ success: false, message: 'No staff found for given Id' });
        });
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Staff');
        else next(error);
    }
}

// API to delete admin staff user
exports.delete = async (req, res, next) => {
    try {
        let { _id } = req.query;

        User.remove({ _id }, (err, result) => {
            if (err) return res.status(400).send({ success: false, err });
            else if (result.deletedCount > 0) {
                res.status(200).send({ success: true, message: 'Staff deleted successfully' });
                let activityData = {
                    module: 'Staff',
                    type: 3, // action type =  1 (i.e. CREATED)
                    message: 'by $$firstName$$',
                    userId: req.user,
                    ip: req.ip,
                }
                Activity.create(activityData);
            }
            else return res.status(400).send({ success: false, message: 'No staff found with given id' });
        });
    } catch (error) {
        next(error);
    }
}

// API to get admin staff user
exports.get = (req, res, next) => {
    try {
        let { _id } = req.query;

        User.findOne({ _id }, (err, staff) => {
            if (err) return res.status(400).send({ success: false, err });
            if (staff)
                return res.status(200).send({ success: true, staff });
            else return res.status(400).send({ success: false, message: 'No staff found for given Id' });
        });
    } catch (error) {
        next(error);
    }
}

// API to list all admin staff users
exports.list = async (req, res, next) => {
    try {
        let { page, limit, query, isPartner } = req.query;
        let typeFilter = {
            $or: [
                { type: 2 },
                { type: 3 }
            ]
        };

        if (isPartner === 'true' || isPartner === true)
            typeFilter = { type: 2 };

        page = page != undefined && page != '' ? parseInt(page) : 1;
        limit = limit != undefined && limit != '' ? parseInt(limit) : 10;

        var filter = {};

        if (query) {
            filter.title = {
                $regex: query, $options: "gi"
            }
        }

        var total = await User.countDocuments({
            $and: [typeFilter, filter, { _id: { $ne: ObjectId(req.user) } }]
        });

        let pages = await Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit);

        if (page > pages)
            page = pages;

        var docs = await User.aggregate([
            {
                $match: {
                    $and: [typeFilter, filter, { _id: { $ne: ObjectId(req.user) } }]
                }
            },
            {
                $lookup:
                {
                    from: "roles",
                    localField: "roleId",
                    foreignField: "_id",
                    as: "role",
                }
            },
            {
                $lookup:
                {
                    from: "branches",
                    localField: "branchId",
                    foreignField: "_id",
                    as: "branch",
                }
            },
            {
                $unwind: {
                    path: "$role", preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$branch", preserveNullAndEmptyArrays: true
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    firstName: 1, email: 1, accountStatus: 1, phone: 1, xOauth: 1,
                    // role
                    'role._id': '$role._id',
                    'role.title': 1,
                    // branch
                    'branch._id': '$branch._id',
                    'branch.branchId': 1,
                    'branch.branchName': 1,
                }
            }
        ]);

        return res.status(200).send({ success: true, message: 'Staff retrieved successfully', data: { docs, total, page, limit, pages } });
    } catch (error) {
        next(error);
    }
}