const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/faq.controller')
const { cpUpload } = require('../../../utils/upload')

router.route('/create').post(cpUpload, controller.create)
router.route('/edit').put(cpUpload, controller.edit)
router.route('/delete/:faqId').delete(controller.delete)
router.route('/get/:faqId').get(controller.get)
router.route('/list').post(controller.list)

module.exports = router