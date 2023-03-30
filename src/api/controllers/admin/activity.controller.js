const Activity = require('../../models/activity.model')

// API to get activity list
exports.list = async (req, res, next) => {
    try {
        let { page, limit } = req.query

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        const total = await Activity.countDocuments()

        const activity = await Activity.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { "$addFields": { "user_Id": { "$toObjectId": "$userId" }}},
            { $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'user_Id',
                as: 'user'
            }
            },
            {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
            { "$addFields": { "admin_Id": { "$toObjectId": "$userId" }}},
            { $lookup: {
                from: 'admins',
                foreignField: '_id',
                localField: 'admin_Id',
                as: 'admin'
            }
            },
            {$unwind: {path: "$admin", preserveNullAndEmptyArrays: true}}
        ])

        return res.send({
            success: true, message: 'Activities fetched successfully',
            data: {
                activity,
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