const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/activity.controller')

router.route('/list').get(controller.list)

module.exports = router