const db = require("../../models");
const ProgramLevel = db.ProgramLevel;
const Activity = db.Activity;
// create program levels
exports.createProgramLevel = async (req, res, next) => {
  try {
    console.log("Req.body programLevel controller =====>", req.body);
    //

    let programLevel = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the programLevel in db
    programLevel = await ProgramLevel.create(programLevel);
    await Activity.create({ action: "New programLevel Created", name: req.body.Uname, role: req.body.role });

    return res.json({
      success: true,
      data: programLevel,
      // Activity,
      message: "programLevel created successfully",
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

// list program levels
exports.listProgramLevels = async (req, res, next) => {
  try {
    const uni = await ProgramLevel.findAndCountAll();
    let { page, limit, name } = req.query;

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
    const faqs = await ProgramLevel.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "program levels fetched successfully",
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
    res.send("programLevel Error " + err);
  }
  // next();
};

// API to edit programLevel
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    console.log(payload);
    const programLevel = await ProgramLevel.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.ID,
        },
      }
    );
    await Activity.create({ action: "New programLevel updated", name: req.body.Uname, role: req.body.role });
    const uni = await ProgramLevel.findAndCountAll();
    let { page, limit, name } = req.query;
    limit = 5;
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = uni.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    const faqs = await ProgramLevel.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "program levels fetched successfully",
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
  } catch (error) {
    return next(error);
  }
};

// API to delete programLevel
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const programLevel = await ProgramLevel.destroy({ where: { id: ID } });
      await Activity.create({ action: " programLevel deleted", name: req.body.Uname, role: req.body.role });

      const uni = await ProgramLevel.findAndCountAll();
      let { page, limit, name } = req.query;
      limit = 5;
      const filter = {};
  
      page = page !== undefined && page !== "" ? parseInt(page) : 1;
      limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;
  
      if (name) {
        filter.name = { $LIKE: name, $options: "gi" };
      }
  
      const total = uni.count;
  
      if (page > Math.ceil(total / limit) && total > 0)
        page = Math.ceil(total / limit);
  
      const faqs = await ProgramLevel.findAll({
        order: [["updatedAt", "DESC"]],
        offset: limit * (page - 1),
        limit: limit,
        where: filter,
      });
      console.log("faqs", faqs);
      // res.send(uni);
      return res.send({
        success: true,
        message: "program levels fetched successfully",
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
    }
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a programLevel
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", ProgramLevel);
      const programLevel = await ProgramLevel.findByPk(id);

      if (programLevel)
        return res.json({
          success: true,
          message: "programLevel retrieved successfully",
          programLevel,
        });
      else
        return res.status(400).send({
          success: false,
          message: "programLevel not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "programLevel Id is required" });
  } catch (error) {
    return next(error);
  }
};
