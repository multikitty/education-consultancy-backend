const express = require("express");
const controller = require("../../../controllers/front/properties.controller");
const router = express.Router();
const { cpUpload } = require("../../../utils/upload");

router.route("/create").post(cpUpload,controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
 
module.exports = router;
