const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/settings.controller')

router.route('/get').get(controller.get)


module.exports = router