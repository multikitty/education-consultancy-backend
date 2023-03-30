const express = require("express");
// const controller = require('../../../controllers/front/university.controller');
const controller = require("../../../controllers/front/commissioninvoiceitem.controller");
const router = express.Router();
const { uploadSingle, cpUpload, upload } = require("../../../utils/upload");

router.route("/create").post(upload.any(), controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(upload.any(), controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);

module.exports = router;
