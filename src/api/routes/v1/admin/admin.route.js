const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/admin.controller')
const { cpUpload,uploadSingle,uploadContentImage } = require('../../../utils/upload')
const { validationOptions } = require('../../../middlewares/error')


router.route('/login').post(controller.login)
router.route('/create').post(cpUpload, controller.create)
router.route('/edit').put(cpUpload, controller.edit)
router.route('/delete/:adminId').delete(controller.delete)
router.route('/get/:adminId').get(controller.get)
router.route('/list').get(controller.list)
router.route('/edit-password').put(cpUpload, controller.editPassword)
router.route('/forgot-password').post(controller.forgotPassword)
router.route('/reset-password').put(cpUpload, controller.resetPassword)
router.route('/dashboard').get(controller.dashboard)
router.route('/verify-admin-password').post(controller.verify)
router.route('/private-admin').get(controller.privateAdmin)
router.route('/private-admin/create-private-admin').post(controller.createPrivateAdmin)
router.route('/upload-image').post(uploadSingle,controller.imageUpload);
router.route('/test-route').post(controller.testRoute)
router.route('/upload-content').post(uploadContentImage,controller.uploadContent);



module.exports = router