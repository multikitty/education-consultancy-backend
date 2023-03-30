const Role = require('../../models-bk/roles.model');
const User = require('../../models-bk/admin.model');
const ObjectId = require('mongoose').Types.ObjectId;
// const { checkDuplicate } = require('../middlewares/error');
const Activity = require('../../models-bk/activity.model');

// API to create role
exports.create = async (req, res, next) => {
    try {
        let role = req.body;

        await Role.create(role);
        res.status(200).send({ success: true, message: 'Role created successfully' });
        let activityData = {
            module: 'Role',
            type: 1, // action type =  1 (i.e. CREATED)
            message: 'by $$firstName$$',
            userId: req.user,
            ip: req.ip,
        }
        Activity.create(activityData);
    } catch (error) {
        // if (error.code === 11000 || error.code === 11001)
        // checkDuplicate(error, res, 'Role');
        // else
        next(error);
    }
}

// API to edit role
exports.edit = async (req, res, next) => {
    try {
        let { _id } = req.body;

        Role.findOne({ _id }, async (err, role) => {
            if (err) return res.status(400).send({ success: false, err });
            else if (role) {
                for (let x in req.body) // making key value pair 
                    if (typeof req.body[x] != 'string' && req.body[x] != undefined)
                        role[x] = req.body[x]; // for type of array, boolean etc.
                    else if (typeof req.body[x] == 'string' && req.body[x] != '' && req.body[x] != undefined)
                        role[x] = req.body[x];
                await Role.findByIdAndUpdate({ _id }, { $set: role }, (err, result) => {
                    if (err) return res.status(422).send({ success: false, message: err });
                    else {
                        res.status(200).send({ result, success: true, message: 'Role updated successfully' });
                        let activityData = {
                            module: 'Role',
                            type: 2, // action type =  1 (i.e. CREATED)
                            message: 'by $$firstName$$',
                            userId: req.user,
                            ip: req.ip,
                        }
                        Activity.create(activityData);
                    }
                })
            } else return res.status(400).send({ success: false, message: 'No role found for given Id' });
        });
    } catch (error) {
        // if (error.code === 11000 || error.code === 11001)
        //     // checkDuplicate(error, res, 'Role');
        // else 
        next(error);
    }
}

// API to delete role
exports.delete = async (req, res, next) => {
    try {
        let { _id } = req.query;

        Role.remove({ _id }, (err, result) => {
            if (err) return res.status(400).send({ success: false, err });
            else if (result.deletedCount > 0) {
                res.status(200).send({ success: true, message: 'Role deleted successfully' });
                let activityData = {
                    module: 'Role',
                    type: 3, // action type =  1 (i.e. CREATED)
                    message: 'by $$firstName$$',
                    userId: req.user,
                    ip: req.ip,
                }
                Activity.create(activityData);
                // setting user role to null
                User.updateMany({ role: ObjectId(_id) }, { $set: { role: null } }, (err, res) => {
                    if (res) console.log(res)
                });
            }
            else return res.status(400).send({ success: false, message: 'No role found with given id' });
        });
    } catch (error) {
        next(error);
    }
}

// API to get role
exports.get = (req, res, next) => {
    try {
        let { _id } = req.query;

        Role.findOne({ _id }, (err, role) => {
            if (err) return res.status(400).send({ success: false, err });
            if (role)
                return res.status(200).send({ success: true, role });
            else return res.status(400).send({ success: false, message: 'No role found for given Id' });
        });
    } catch (error) {
        next(error);
    }
}

// API to list all roles
exports.list = async (req, res, next) => {
    try {
        let { page, limit, query, all, title, status } = req.query;
        let filter = {}

        page = page != undefined && page != '' ? parseInt(page) : 1;
        limit = limit != undefined && limit != '' ? parseInt(limit) : 10;

        if (all != undefined && all != '')
            limit = await Role.countDocuments({});

        if (title)
            filter.title = { $regex: title, $options: "gi" }

        if (status) {
            if (status === 'false') {
                filter.status = false
            }
            else if (status === 'true') {
                filter.status = true
            }
        }

        const total = await Role.countDocuments(filter)

        let rolesData = await Role.aggregate([
            {
                $match: filter
            },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit }
        ])
        return res.status(200).send({
            success: true, message: 'Roles retrieved successfully',
            data: rolesData, page,
            pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
            total, limit
        });

    } catch (error) {
        next(error);
    }
}

// API to get roles list by name only
exports.getRolesByName = (req, res, next) => {
    try {
        let { isPartner } = req.query;
        let filter = { status: true };

        if (isPartner === 'true' || isPartner === true) {
            filter = {
                $and: [
                    { status: true },
                    { title: { $ne: 'admin' } }
                ]
            }
        }

        console.log(filter);

        Role.find(filter, 'title', (err, roles) => {
            if (err) return res.status(400).send({ success: false, err });
            else if (roles)
                return res.status(200).send({ success: true, roles });
        }).sort('title');
    } catch (error) {
        next(error);
    }
}