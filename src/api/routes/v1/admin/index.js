const express = require('express')
const userRoutes = require('./users.route')
const adminRoutes = require('./admin.route')
const roleRoutes = require('./roles.route')
const emailRoutes = require('./email.route')
const settingsRoutes = require('./settings.route')
const faqRoutes = require('./faq.route')
const contactRoutes = require('./contact.route')
const cmsRoutes = require('./cms.route')
const activityRoutes = require('./activity.route')
const newsletterRoutes = require('./newsletter.route')
const faqCategoriesRoutes = require('./faqCategories.route')
const router = express.Router()

/**
 * GET v1/admin
 */
router.use('/staff', adminRoutes)
router.use('/role', roleRoutes)
router.use('/user', userRoutes)
router.use('/email', emailRoutes)
router.use('/settings', settingsRoutes)
router.use('/faq', faqRoutes)
router.use('/contacts', contactRoutes)
router.use('/content', cmsRoutes)
router.use('/activity', activityRoutes)
router.use('/newsletter', newsletterRoutes)
router.use('/faq-categories', faqCategoriesRoutes)

module.exports = router
