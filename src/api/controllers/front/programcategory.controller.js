const db = require("../../models");
const ProgramCategory = db.ProgramCategory;
const Activity = db.Activity;
// create program categorys
exports.createProgramCategory = async (req, res, next) => {
  try {
    console.log("Req.body programCategory controller =====>", req.headers);
    //

    let programCategory = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the programCategory in db
    programCategory = await ProgramCategory.create(programCategory);
    await Activity.create({ action: "New programCategory Created", name: req.body.Uname, role: req.body.role });

    return res.json({
      success: true,
      data: programCategory,
      // Activity,
      message: "programCategory created successfully",
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

// list program categorys
exports.listProgramCategorys = async (req, res, next) => {
  try {
    const uni = await ProgramCategory.findAndCountAll();
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
    const faqs = await ProgramCategory.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "program categorys fetched successfully",
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
    res.send("programCategory Error " + err);
  }
  // next();
};

// API to edit programCategory
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const programCategory = await ProgramCategory.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.ID,
        },
      }
    );
    await Activity.create({ action: "New programCategory updated", name: req.body.Uname, role: req.body.role });

    const uni = await ProgramCategory.findAndCountAll();
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
    const faqs = await ProgramCategory.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "program categorys fetched successfully",
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

// API to delete programCategory
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const programCategory = await ProgramCategory.destroy({
        where: { id: ID },
      });
      
      await Activity.create({ action: " programCategory deleted", name: req.body.Uname, role: req.body.role });

      const uni = await ProgramCategory.findAndCountAll();
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
      const faqs = await ProgramCategory.findAll({
        order: [["updatedAt", "DESC"]],
        offset: limit * (page - 1),
        limit: limit,
        where: filter,
      });
      console.log("faqs", faqs);
      // res.send(uni);
      return res.send({
        success: true,
        message: "program categorys fetched successfully",
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

// API to get  by id a programCategory
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", ProgramCategory);
      const programCategory = await ProgramCategory.findByPk(id);

      if (programCategory)
        return res.json({
          success: true,
          message: "programCategory retrieved successfully",
          programCategory,
        });
      else
        return res.status(400).send({
          success: false,
          message: "programCategory not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "programCategory Id is required" });
  } catch (error) {
    return next(error);
  }
};
