const db = require("../../models");
const QualificationType = db.QualificationType;
const Activity = db.Activity;
// create program categorys
exports.createQualificationType = async (req, res, next) => {
  try {
    console.log("Req.body qualificationType controller =====>", req.body);
    //

    let qualificationType = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the qualificationType in db
    qualificationType = await QualificationType.create(qualificationType);
    await Activity.create({
      action: "New qualificationType Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: qualificationType,
      // Activity,
      message: "qualificationType created successfully",
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
exports.listQualificationTypes = async (req, res, next) => {
  try {
    const uni = await QualificationType.findAndCountAll();
    let { page, limit, name } = req.query;

    // console.log("unitt", uni.count);
    // console.log("req.queryy", req.query); //name
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
    const faqs = await QualificationType.findAll({
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
    res.send("qualificationType Error " + err);
  }
  // next();
};

// API to edit qualificationType
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const qualificationType = await QualificationType.update(
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
      action: "New qualificationType updated",
      name: req.body.Uname, role: req.body.role,
    });

    const uni = await QualificationType.findAndCountAll();
    let { page, limit, name } = req.query;

    // console.log("unitt", uni.count);
    // console.log("req.queryy", req.query); //name
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
    const faqs = await QualificationType.findAll({
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

// API to delete qualificationType
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const qualificationType = await QualificationType.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " qualificationType deleted",
        name: req.body.Uname, role: req.body.role,
      });

    const uni = await QualificationType.findAndCountAll();
    let { page, limit, name } = req.query;

    // console.log("unitt", uni.count);
    // console.log("req.queryy", req.query); //name
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
    const faqs = await QualificationType.findAll({
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
    });}
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a qualificationType
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", QualificationType);
      const qualificationType = await QualificationType.findByPk(id);

      if (qualificationType)
        return res.json({
          success: true,
          message: "qualificationType retrieved successfully",
          qualificationType,
        });
      else
        return res.status(400).send({
          success: false,
          message: "qualificationType not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "qualificationType Id is required" });
  } catch (error) {
    return next(error);
  }
};
