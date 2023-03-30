const express = require("express");
const controller = require("../../../controllers/front/currencies.controller");
const router = express.Router();
const { cpUpload } = require("../../../utils/upload");

router.route("/create").post(cpUpload, controller.create);
router.route("/list").get(controller.list);
router.route("/lists").get(controller.lists);
router.route("/edit").put(cpUpload, controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);

module.exports = router;
