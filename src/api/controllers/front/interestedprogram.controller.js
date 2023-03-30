const db = require("../../models");
const InterestedProgram = db.InterestedProgram;
const Activity = db.Activity;
// create program categorys
exports.createInterestedProgram = async (req, res, next) => {
  try {
    console.log("Req.body interestedprogram controller =====>", req.body);
    //

    let interestedprogram = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the interestedprogram in db
    interestedprogram = await InterestedProgram.create(interestedprogram);
    await Activity.create({
      action: "New interestedprogram Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: interestedprogram,
      // Activity,
      message: "interestedprogram created successfully",
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
exports.listInterestedPrograms = async (req, res, next) => {
  try {
    const uni = await InterestedProgram.findAndCountAll();
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
    const faqs = await InterestedProgram.findAll({
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
    res.send("interestedprogram Error " + err);
  }
  // next();
};

// API to edit interestedprogram
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const interestedprogram = await InterestedProgram.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.ID,
        },
      }
    );
    await Activity.create({
      action: "New interestedprogram updated",
      name: req.body.Uname, role: req.body.role,
    });

    const uni = await InterestedProgram.findAndCountAll();
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
    const faqs = await InterestedProgram.findAll({
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

// API to delete interestedprogram
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const interestedprogram = await InterestedProgram.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " interestedprogram deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await InterestedProgram.findAndCountAll();
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
    const faqs = await InterestedProgram.findAll({
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

// API to get  by id a interestedprogram
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", InterestedProgram);
      const interestedprogram = await InterestedProgram.findByPk(id);

      if (interestedprogram)
        return res.json({
          success: true,
          message: "interestedprogram retrieved successfully",
          interestedprogram,
        });
      else
        return res.status(400).send({
          success: false,
          message: "interestedprogram not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "interestedprogram Id is required" });
  } catch (error) {
    return next(error);
  }
};
