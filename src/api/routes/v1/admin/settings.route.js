const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/settings.controller')
const { cpUpload } = require('../../../utils/upload')

router.route('/edit').put(cpUpload, controller.edit)
router.route('/get').get(controller.get)


module.exports = router