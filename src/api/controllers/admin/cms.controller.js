const CMS = require('../../models/cms.model')
let slugify = require('slugify')
const { checkDuplicate } = require('../../../config/errors')

// API to create CMS
exports.create = async (req, res, next) => {
    try {
        let payload = req.body
        let cms = await CMS.findOne({ title: { $regex: payload.title, $options: "i" } }).lean(true)
        if (cms) {
            return res.status(400).send({ success: false, message: 'Content page with this title already exist.' })
        }
        payload.slug = slugify(payload.title)
        const content = await CMS.create(payload)
        return res.status(200).send({ success: true, message: 'Content Page created successfully', content })
    } catch (error) {
        return next(error)
    }
}

// API to edit CMS
exports.edit = async (req, res, next) => {
    try {
        let payload = req.body
        // let cms = await CMS.findOne({ title: { $regex: payload.title, $options: "i" } }).lean(true)
        // if (cms) {
        //     return res.status(400).send({ success: false, message: 'Content page with this title already exist.' })
        // }
        payload.slug = slugify(payload.title)
        const content = await CMS.findByIdAndUpdate({ _id: payload._id }, { $set: payload }, { new: true })
        return res.send({ success: true, message: 'Content Page updated successfully', content })
    } catch (error) {
        return next(error)
    }
}

// API to delete content
exports.delete = async (req, res, next) => {
    try {
        const { contentId } = req.params
        if (contentId) {
            const content = await CMS.deleteOne({ _id: contentId })
            if (content && content.deletedCount)
                return res.send({ success: true, message: 'Content Page deleted successfully', contentId })
            else return res.status(400).send({ success: false, message: 'Content Page not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'Content Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get a CMS
exports.get = async (req, res, next) => {
    try {
        const { contentId } = req.params
        if (contentId) {
            const content = await CMS.findOne({ _id: contentId }, { _id: 1, title: 1, status: 1, slug: 1, description: 1, showInFooter: 1 }).lean(true)
            if (content)
                return res.json({ success: true, message: 'Content Page retrieved successfully', content })
            else return res.status(400).send({ success: false, message: 'CMS not found for given Id' })
        } else
            return res.status(400).send({ success: false, message: 'CMS Id is required' })
    } catch (error) {
        return next(error)
    }
}

// API to get CMS list
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
            if (status === 'true') {
                filter.status = true
            }
            else if (status === 'false') {
                filter.status = false
            }
        }

        const total = await CMS.countDocuments(filter)

        if (page > Math.ceil(total / limit) && total > 0)
            page = Math.ceil(total / limit)

        const contentPages = await CMS.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    _id: 1, title: 1, slug: 1, description: 1, status: 1, showInFooter: 1
                }
            }
        ])

        return res.send({
            success: true, message: 'Content Pages fetched successfully',
            data: {
                contentPages,
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