const express = require("express");
const controller = require("../../../controllers/front/activities.controller");
const router = express.Router();
const { cpUpload } = require("../../../utils/upload");

router.route("/list").get(controller.list);
 
 
module.exports = router;
