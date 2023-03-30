const express = require('express');
const controller = require('../../../controllers/admin/contact.controller');
const router = express.Router();
const { cpUpload } = require('../../../utils/upload')

router.route('/list').post(controller.list);
router.route('/edit').put(cpUpload, controller.edit);

module.exports = router;