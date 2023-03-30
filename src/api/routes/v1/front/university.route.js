// const express = require("express");
// const controller = require("../../../controllers/front/university.controller");
// const router = express.Router();
// const { uploadSingle } = require("../../../utils/upload");

// router.route("/create").post(uploadSingle, controller.create);
// router.route("/listUniversity").get(controller.listUniversity);
// router.route("/edit").put(uploadSingle, controller.edit);
// router.route("/delete/:id").delete(controller.delete);
// router.route("/get/:id").get(controller.get);

// module.exports = router;

const express = require("express");
const router = express.Router();

const controller = require("../../../controllers/front/university.controller");
const { uploadSingle } = require("../../../utils/upload");

router.route("/create").post(uploadSingle, controller.create);
router.route("/listUniversity").get(controller.listUniversity);
router.route("/edit").put(uploadSingle, controller.edit);
router.route("/delete/:id").delete(controller.delete);
router.route("/get/:id").get(controller.get);
router.route("/search").post(controller.search);


module.exports = router;
