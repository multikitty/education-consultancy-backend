const express = require("express");
const controller = require("../../../controllers/front/backup.controller");
const router = express.Router();
const { uploadSingle, cpUpload } = require("../../../utils/upload");

router.route("/create").post(uploadSingle, controller.create);
router.route("/list").get(controller.list);
router.route("/restore/:fileName").put(uploadSingle, controller.restore);
router.route("/delete/:fileName").delete(controller.delete);
router.route("/download/:fileName").get(controller.download);

module.exports = router;