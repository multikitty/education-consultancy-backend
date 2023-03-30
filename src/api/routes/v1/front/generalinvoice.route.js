// Anasite - Edits: setting up routes
const express = require("express");
//  const controller = require('../../../controllers/front/university.controller')
const controller = require("../../../controllers/front/generalinvoice.controller");
const router = express.Router();
const multer = require("multer");
const upload = multer();
router.route("/create").post(upload.any(), controller.create);
router.route("/list").get(controller.list);
router.route("/edit").put(upload.any(), controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
router.route("/search").post(controller.search);

// router.findAll();

module.exports = router;
