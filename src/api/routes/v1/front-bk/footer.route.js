const express = require('express');
const controller = require('../../../controllers/front/footer.controller');
const { cpUpload } = require('../../../utils/upload')
const router = express.Router();

router.route('/submit').post(cpUpload, controller.submit);
router.route('/get').get(controller.get);
router.route('/cryptocurrency').get(controller.cryptocurrencyListing);


module.exports = router;