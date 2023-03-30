const express = require("express");
// const controller = require('../../../controllers/front/university.controller');
const controller = require("../../../controllers/front/branch.controller");
const router = express.Router();
const { uploadSingle, cpUpload } = require("../../../utils/upload");

router.route("/create").post( controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/search").post(controller.search);
router.route("/get/:id").get(controller.get);

module.exports = router;
