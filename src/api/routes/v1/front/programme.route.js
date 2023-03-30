const express = require("express");
//  const controller = require('../../../controllers/front/university.controller')
const controller = require("../../../controllers/front/programme.controller");
const router = express.Router();

router.route("/createProgramme").post(controller.createProgramme);
router.route("/listProgrammes").get(controller.listProgrammes);
router.route("/edit").put(controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
router.route("/search").post(controller.search);

// router.findAll();

module.exports = router;
