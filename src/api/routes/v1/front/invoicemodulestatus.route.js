// Anasite - Edits: setting up routes
const express = require("express");
//  const controller = require('../../../controllers/front/university.controller')
const controller = require("../../../controllers/front/invoicemodulestatus.controller");
const router = express.Router();
const multer = require("multer");
const upload = multer();
router
  .route("/create")
  .post(upload.any(), controller.createInvoiceModuleStatus);
router
  .route("/listInvoiceModuleStatuss")
  .get(controller.listInvoiceModuleStatuss);
router.route("/edit").put(controller.edit);
router.route("/delete").post(controller.delete);
router.route("/get/:id").get(controller.get);
// router.findAll();

module.exports = router;
