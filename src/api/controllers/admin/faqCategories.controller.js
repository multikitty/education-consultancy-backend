const fs = require('fs')
const ObjectId = require('mongoose').Types.ObjectId
const FaqCategories = require('../../models/faqCategories.model')
const { uploadToCloudinary } = require('../../utils/upload')
const { checkDuplicate } = require('../../../config/errors')

// API to create FaqCategories
exports.create = async (req, res, next) => {
    try {
        let payload = req.body

        const faqCategories = await FaqCategories.create(payload)
        return res.send({ success: true, message: 'Faq-Categories created successfully', faqCategories })
    } catch (error) {
        console.log(error)
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'FaqCategories')
        else
            return next(error)
    }
}

// API to edit FaqCategories
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body
        const faqCategories = await FaqCategories.findByIdAndUpdate({ _id: payload._id }, { $set: payload }, { new: true })
        return res.send({ success: true, message: 'FaqCategories updated successfully', faqCategories })
    } catch (error) {
        if (error.code === 11000 || error.code === 11001)
            checkDuplicate(error, res, 'FaqCategories')
        else
            return next(error)
    }
}

// API to delete faqCategories
exports.delete = async (req, res, next) => {
    try {
        const { faqId } = req.params
        if (faqId) {
            const faqCategories = await FaqCategories.deleteOne({ _id: faqId })
            if (faqCategories && faqCategories.deletedCount)
                return res.send({ success: true, message: 'Faq-Categories deleted successfully', faqId })
            else return res.status(400).send({ success: false, message: 'Faq-Categories not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Faq-Categories Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get a FaqCategories
exports.get = async (req, res, next) => {
    try {
        const { faqId } = req.params
        if (faqId) {
            const faqCategories = await FaqCategories.findOne({ _id: faqId }, { _id: 1, title: 1, desc: 1, status: 1 }).lean(true)
            if (faqCategories)
                return res.json({ success: true, message: 'Faq-Categories retrieved successfully', faqCategories })
            else return res.status(400).send({ success: false, message: 'Faq-Categories not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Faq-Categories Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get FaqCategories list
exports.list = async (req, res, next) => {
    try {
        let { page, limit, all, status, title } = req.query
        const filter = {}

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        if (title) {
            filter.title = { $regex: title, $options: "gi" }
        }

        if (status) {
            if (status === 'true') {
                filter.status = true
            }
            else if (status === 'false') {
                filter.status = false
            }
        }

        const total = await FaqCategories.countDocuments(filter)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        let pipeline = []

        if (!all)
            pipeline = [
                { $skip: limit * (page - 1) },
                { $limit: limit },
            ]

        const faqCategories = await FaqCategories.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            ...pipeline,
            {
                $project: {
                    _id: 1, title: 1, status: 1, desc: 1
                }
            }
        ])

        return res.send({
            success: true, message: 'Faq-Categories Fetched Successfully',
            data: {
                faqCategories,
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