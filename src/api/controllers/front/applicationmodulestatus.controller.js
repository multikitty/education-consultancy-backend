const db = require("../../models");
const ApplicationModuleStatus = db.ApplicationModuleStatus;
const Activity = db.Activity;
// create program categorys
exports.createApplicationModuleStatus = async (req, res, next) => {
  try {
    console.log("Req.body applicationModuleStatus controller =====>", req.body);
    //

    let applicationModuleStatus = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the applicationModuleStatus in db
    applicationModuleStatus = await ApplicationModuleStatus.create(
      applicationModuleStatus
    );
    await Activity.create({
      action: "New applicationModuleStatus Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: applicationModuleStatus,
      // Activity,
      message: "applicationModuleStatus created successfully",
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
exports.listApplicationModuleStatuss = async (req, res, next) => {
  try {
    const uni = await ApplicationModuleStatus.findAndCountAll();
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
    const faqs = await ApplicationModuleStatus.findAll({
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
    res.send("applicationModuleStatus Error " + err);
  }
  // next();
};

// API to edit applicationModuleStatus
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const applicationModuleStatus = await ApplicationModuleStatus.update(
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
      action: "New applicationModuleStatus updated",
      name: req.body.Uname, role: req.body.role,
    });

    if(applicationModuleStatus) {

    const uni = await ApplicationModuleStatus.findAndCountAll();
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
    const faqs = await ApplicationModuleStatus.findAll({
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

// API to delete applicationModuleStatus
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const applicationModuleStatus = await ApplicationModuleStatus.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " applicationModuleStatus deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await ApplicationModuleStatus.findAndCountAll();
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
      const faqs = await ApplicationModuleStatus.findAll({
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

// API to get  by id a applicationModuleStatus
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", ApplicationModuleStatus);
      const applicationModuleStatus = await ApplicationModuleStatus.findByPk(
        id
      );

      if (applicationModuleStatus)
        return res.json({
          success: true,
          message: "applicationModuleStatus retrieved successfully",
          applicationModuleStatus,
        });
      else
        return res.status(400).send({
          success: false,
          message: "applicationModuleStatus not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({
          success: false,
          message: "applicationModuleStatus Id is required",
        });
  } catch (error) {
    return next(error);
  }
};
