const express = require('express');
const controller = require('../../../controllers/front/auth.controller');
const { profileUpload } = require('../../../utils/upload')
const router = express.Router();


router.route('/register').post(controller.register);
router.route('/login').post(controller.login);
router.route('/forgot-password').post(controller.forgotPassword)
router.route('/reset-password').post(controller.resetPassword)
router.route('/change-password').put(controller.changePassword)
router.route('/edit-profile').put(controller.editProfile)
router.route('/update-banner').put(profileUpload, controller.updateBanner);

module.exports = router;