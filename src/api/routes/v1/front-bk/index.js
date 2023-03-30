const express = require('express')
const authRoutes = require('./auth.route')
const usersRoutes = require('./users.route')
const settingsRoutes = require('./settings.route')
const faqRoutes = require('./faq.route')
const contactRoutes = require('./contact.route')
const cmsRoutes = require('./cms.route')
const footerRoutes = require('./footer.route')

const router = express.Router()
const { uploadToCloudinary, cpUpload } = require('../../../utils/upload')
/**
 * GET v1/status
 */
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/settings', settingsRoutes)
router.use('/faq', faqRoutes)
router.use('/contact', contactRoutes)
router.use('/cms', cmsRoutes)
router.use('/footer', footerRoutes)
router.use('/test', cpUpload, async (req, res) => {
    const url = []
    const { path } = req.files.image[0];
    const newPath = await uploadToCloudinary(path)
    url.push(newPath)

    res.status(200).json({ data: url, message: "image upload successfully" })
})

module.exports = router
