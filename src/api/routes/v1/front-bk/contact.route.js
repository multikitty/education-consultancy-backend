const express = require('express');
const controller = require('../../../controllers/front/contact.controller');
const router = express.Router();
const { cpUpload } = require('../../../utils/upload')

router.route('/submit').post(cpUpload, controller.create);

module.exports = router;