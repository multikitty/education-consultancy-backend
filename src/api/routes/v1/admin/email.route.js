const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/email.controller')
const { cpUpload } = require('../../../utils/upload')

router.route('/create').post(cpUpload, controller.create)
router.route('/edit').put(cpUpload, controller.edit)
router.route('/delete/:emailId').delete(controller.delete)
router.route('/get/:emailId').get(controller.get)
router.route('/list').get(controller.list)
controller.createEmailBulkTemplate()

module.exports = router