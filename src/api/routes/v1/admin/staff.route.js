const router = require('express').Router();
const controller = require('../../controllers/staff.controller');

router.route('/create').post(validate.create, controller.create);
router.route('/edit').put(validate.edit, controller.edit);
router.route('/delete').delete(validate.del, controller.delete);
router.route('/get').get(validate.get, controller.get);
router.route('/list').get(controller.list);

module.exports = router;