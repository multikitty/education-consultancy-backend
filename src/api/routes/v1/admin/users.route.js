const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/admin/users.controller')

router.route('/create').post(controller.create)
router.route('/edit').put(controller.edit)
router.route('/list').post(controller.list)
router.route('/delete/:userId').delete(controller.delete)
router.route('/:userId').get(controller.get)

module.exports = router