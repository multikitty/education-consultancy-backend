const express = require("express");
// const controller = require('../../../controllers/front/university.controller');
const controller = require("../../../controllers/front/applicants.controller");
const router = express.Router();
// const { uploadSingle } = require('../../../utils/upload');
const { cpUpload } = require("../../../utils/upload");

router.route("/createApplicant").post(cpUpload, controller.createApplicant);
router.route("/listApplicants").get(controller.listApplicants);
//
router.route("/edit").put(cpUpload, controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
router.route("/search").post(controller.search);

module.exports = router;
