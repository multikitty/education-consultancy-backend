const db = require("../../models");
const UniversityType = db.UniversityType;
const Activity = db.Activity;
// create program categorys
exports.createUniversityType = async (req, res, next) => {
  try {
    console.log("Req.body universitytype controller =====>", req.body);
    //

    let universitytype = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the universitytype in db
    universitytype = await UniversityType.create(universitytype);
    await Activity.create({
      action: "New universitytype Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: universitytype,
      // Activity,
      message: "universitytype created successfully",
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
exports.listUniversityTypes = async (req, res, next) => {
  try {
    const uni = await UniversityType.findAndCountAll();
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

    const faqs = await UniversityType.findAll({
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
    res.send("universitytype Error " + err);
  }
  // next();
};

// API to edit universitytype
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const universitytype = await UniversityType.update(
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
      action: "New universitytype updated",
      name: req.body.Uname, role: req.body.role,
    });

    const uni = await UniversityType.findAndCountAll();
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

    const faqs = await UniversityType.findAll({
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

// API to delete universitytype
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const universitytype = await UniversityType.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " universitytype deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await UniversityType.findAndCountAll();
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

      const faqs = await UniversityType.findAll({
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

// API to get  by id a universitytype
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", UniversityType);
      const universitytype = await UniversityType.findByPk(id);

      if (universitytype)
        return res.json({
          success: true,
          message: "universitytype retrieved successfully",
          universitytype,
        });
      else
        return res.status(400).send({
          success: false,
          message: "universitytype not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "universitytype Id is required" });
  } catch (error) {
    return next(error);
  }
};
