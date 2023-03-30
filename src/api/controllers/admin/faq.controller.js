const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId
const FAQ = require('../../models/faq.model')
const { uploadToCloudinary } = require('../../utils/upload')
const { checkDuplicate } = require('../../../config/errors')

// API to create FAQ
exports.create = async (req, res, next) => {
    try {
        let payload = req.body

        const faq = await FAQ.create(payload)
        return res.send({ success: true, message: 'FAQ created successfully', faq })
    } catch (error) {
        console.log(error)
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'FAQ')
        else
            return next(error)
    }
}

// API to edit FAQ
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body
        const faq = await FAQ.findByIdAndUpdate({ _id: payload._id }, { $set: payload }, { new: true })
        return res.send({ success: true, message: 'FAQ updated successfully', faq })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'FAQ')
        else
            return next(error)
    }
}

// API to delete faq
exports.delete = async (req, res, next) => {
    try {
        const { faqId } = req.params
        if (faqId) {
            const faq = await FAQ.deleteOne({ _id: faqId })
            if (faq && faq.deletedCount)
                return res.send({ success: true, message: 'FAQ deleted successfully', faqId })
            else return res.status(400).send({ success: false, message: 'FAQ not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'FAQ Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get a FAQ
exports.get = async (req, res, next) => {
    try {
        const { faqId } = req.params
        if (faqId) {
            const faq = await FAQ.findOne({ _id: faqId }, { _id: 1, title: 1, desc: 1, status: 1, catId: 1 }).lean(true)
            if (faq)
                return res.json({ success: true, message: 'FAQ retrieved successfully', faq })
            else return res.status(400).send({ success: false, message: 'FAQ not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'FAQ Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get FAQ list
exports.list = async (req, res, next) => {
    try {
        let { page, limit, title, status } = req.query
        const filter = {}

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        if (title) {
            filter.title = { $regex: title, $options: "gi" }
        }
        if (status) {
            if(status === 'true'){
                filter.status = true
            }
            else if(status === 'false'){
                filter.status = false
            }
        }

        const total = await FAQ.countDocuments(filter)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        const faqs = await FAQ.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    _id: 1, title: 1, status: 1, desc: 1
                }
            }
        ])

        return res.send({
            success: true, message: 'FAQs fetched successfully',
            data: {
                faqs,
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