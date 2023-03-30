const express = require("express");
const controller = require("../../../controllers/front/lead.controller");
const router = express.Router();
const { uploadSingle, upload } = require("../../../utils/upload");

router.route("/createLead").post(upload.single("logo"), controller.createLead);
router.route("/listLead").get(controller.listLead);
router.route("/edit").put(upload.single("logo"), controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
router.route("/search").post(controller.search);

module.exports = router;
