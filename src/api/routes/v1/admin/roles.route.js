const router = require('express').Router();
const controller = require('../../../controllers/admin/roles.controller');

router.route('/create').post(controller.create);
router.route('/edit').put(controller.edit);
router.route('/delete').delete(controller.delete);
router.route('/get').get(controller.get);
router.route('/list').get(controller.list);
router.route('/list-names').get(controller.getRolesByName);

module.exports = router;