const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/front/faq.controller')

router.route('/list/:catId').get(controller.list)
router.route('/list-faq-categories').get(controller.listFaqCategories)

module.exports = router