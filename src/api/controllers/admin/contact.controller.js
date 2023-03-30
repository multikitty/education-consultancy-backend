const mongoose = require('mongoose');
const Contact = require('../../models/contact.model')
const { checkDuplicate } = require('../../../config/errors')


// API to get support list
exports.list = async (req, res, next) => {
  try {
    let { page, limit } = req.query
    let { name, email, game, environment, type, sdk, status } = req.body
    const filter = {}
    console.log(req.body)
    page = page !== undefined && page !== '' ? parseInt(page) : 1
    limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10




    if (name) {
      name = name.trim()
      filter.name = { $regex: name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), $options: 'gi' };
    }

    if (email) {
      filter.email = email.toLowerCase().trim()
    }

    if (game) {
      filter.gameId = mongoose.Types.ObjectId(game)
    }

    if (environment) {
      filter.environment = parseInt(environment)
    }

    if (sdk) {
      filter.sdkId = mongoose.Types.ObjectId(sdk)
    }

    if (type) {
      filter.type = type
    }

    if (status != undefined) {
      filter.status = parseInt(status)
    }

    const total = await Contact.countDocuments(filter)

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit)

    const contact = await Contact.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: limit * (page - 1) },
      { $limit: limit },
      {
        $lookup: {
          from: 'games',
          foreignField: '_id',
          localField: 'gameId',
          as: 'game'
        }
      },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'sdks',
          foreignField: '_id',
          localField: 'sdkId',
          as: 'sdk'
        }
      },
      { $unwind: { path: "$sdk", preserveNullAndEmptyArrays: true } }
    ])

    return res.send({
      success: true, message: 'Support data fetched successfully',
      data: {
        contact,
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







// API to edit contact status
exports.edit = async (req, res, next) => {
  try {
    let newPayload = {
      status: req.body.status
    }
    let updatedContact = await Contact.findByIdAndUpdate({ _id: req.body._id }, { $set: newPayload }, { new: true })
    return res.send({ success: true, message: 'Support form updated successfully', updatedContact })
  } catch (error) {
    if (error.code === 11000 || error.code === 11001)
      checkDuplicate(error, res, 'Contact')
    else
      return next(error)
  }
}



