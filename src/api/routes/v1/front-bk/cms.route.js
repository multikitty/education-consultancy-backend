const express = require('express');
const controller = require('../../../controllers/front/cms.controller');
const router = express.Router();

router.route('/get/:slug').get(controller.get);
router.route('/list').get(controller.list)

module.exports = router;