const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/newsletter.controller')

router.route('/list').get(controller.list)
router.route('/send-email').post(controller.sendEmailToSubscribers)

module.exports = router