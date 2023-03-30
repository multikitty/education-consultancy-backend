const fs = require('fs')
const mongoose = require('mongoose');
const Email = require('../../models/email.model')
const { uploadToCloudinary } = require('../../utils/upload')
const { checkDuplicate } = require('../../../config/errors')

const path = require('path');

// API to create email template 
exports.create = async (req, res, next) => {
    try {
        let payload = req.body
        const email = await Email.create(payload)
        return res.send({ success: true, message: 'Email template created successfully', email })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Email')
        else
            return next(error)
    }
}

//API that create all Email templates in DB when system will start
exports.createEmailBulkTemplate = async () => {
    try {
        let rawdata = fs.readFileSync(path.resolve(__dirname, '../../../config/emailtemplate.json'));
        let emailTemplates = JSON.parse(rawdata);

        for (let i = 0; i < emailTemplates.length; i++) {
            const template = await Email.findOne({ type: emailTemplates[i].type })
            if (template == null) {
                await Email.create(emailTemplates[i])
            }
        }

        return;
    } catch (error) {
        console.log(error)
    }
}

// API to edit email template
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body
        const email = await Email.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(payload._id) }, { $set: payload }, { new: true })
        // const templates=await Email.find({},'-_id type subject text' )
        // fs.writeFileSync(path.resolve(__dirname, '../../../config/emailtemplate.json'), JSON.stringify(templates));
        return res.send({ success: true, message: 'Email template updated successfully', email })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'Email')
        else
            return next(error)
    }
}

// API to get email template
exports.get = async (req, res, next) => {
    try {
        const { emailId } = req.params
        if (emailId) {
            const email = await Email.findOne({ _id: emailId }, { __v: 0, createdAt: 0, updatedAt: 0 }).lean(true)
            if (email)
                return res.json({ success: true, message: 'Email template retrieved successfully', email })
            else return res.status(400).send({ success: false, message: 'Email template not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Email Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to delete email template
exports.delete = async (req, res, next) => {
    try {
        const { emailId } = req.params
        if (emailId) {
            const email = await Email.deleteOne({ _id: emailId })
            if (email && email.deletedCount)
                return res.send({ success: true, message: 'Email deleted successfully', emailId })
            else return res.status(400).send({ success: false, message: 'Email not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Email Id is required' })
    } catch (error) {
        return next(error)
    }
}


// API to get email list
exports.list = async (req, res, next) => {
    try {
        let { page, limit, type, subject } = req.query
        const filter = {}

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        if (type) {
            filter.type = { $regex: type, $options: "gi" }
        }

        if (subject) {
            filter.subject = { $regex: subject, $options: "gi" }
        }

        const total = await Email.countDocuments(filter)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        const emails = await Email.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    __v: 0, createdAt: 0, updatedAt: 0
                }
            }
        ])

        return res.send({
            success: true, message: 'Email templates fetched successfully',
            data: {
                emails,
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
