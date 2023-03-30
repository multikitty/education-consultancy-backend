const db = require("../../models");
const Programme = db.Programme;
const Activity = db.Activity;
const ProgramLevel = db.ProgramLevel;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
// create programms
exports.createProgramme = async (req, res, next) => {
  try {
    console.log("Req.body programme controller =====>", req.body);
    //

    let programme = {
      name: req.body.name,
      selectUniversity: req.body.selectUniversity,
      programmeLevel: req.body.programmeLevel,
      programmeIntake: req.body.programmeIntake,
      programmeDuration: req.body.programmeDuration,
      programmeCategory: req.body.programmeCategory,
      tutionFee: req.body.tutionFee,
      otherFee: req.body.otherFee,
      engRequirement: req.body.engRequirement,
      entryRequirement: req.body.entryRequirement,
    };

    //save the programme in db
    programme = await Programme.create(programme);
    await Activity.create({ action: "New programme Created", name: req.body.Uname, role: req.body.role });

    return res.json({
      success: true,
      data: programme,
      // Activity,
      message: "programme created successfully",
    });
  } catch (err) {
    // res.status(500).send({
    //     message:
    //       err.message || "Some error occurred while creating the Tutorial."
    //   });
    console.log("Error handling =>", err);
    // console.log("catch block")
    next();
  }
};

// list programms
exports.listProgrammes = async (req, res, next) => {
  try {
    const uni = await Programme.findAndCountAll();

    let { page, limit, name } = req.query;

    console.log("unitt", uni.count);
    console.log("req.queryy", req.query); //name
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = uni.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    console.log("filter", filter);
    const faqs = await Programme.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [ProgramLevel],
    },
    );
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Programms fetched successfully",
      data: {
        faqs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.send("programme Error " + err);
  }
  // next();
};

// API to edit programme
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const programme = await Programme.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );
    await Activity.create({ action: "New programme updated", name: req.body.Uname, role: req.body.role });

    return res.send({
      success: true,
      message: "programme updated successfully",
      programme,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete programme
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const programme = await Programme.destroy({ where: { id: id } });
      await Activity.create({ action: " programme deleted",         name: "samon", role: "superAdmin"
    });

      if (programme)
        return res.send({
          success: true,
          message: "programme Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "programme Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "programme Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a programme
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const programme = await Programme.findByPk(id);

      if (programme)
        return res.json({
          success: true,
          message: "programme retrieved successfully",
          programme,
        });
      else
        return res.status(400).send({
          success: false,
          message: "programme not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "programme Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await Programme.findAndCountAll();

    let { page, limit } = req.query;
    let { name } = req.body;

    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = {
        [Op.like]: "%" + name + "%",
      };
    }

    const total = uni.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    const faqs = await Programme.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Programms fetched successfully",
      data: {
        faqs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.send("programme Error " + err);
  }
};
