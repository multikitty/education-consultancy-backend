const db = require("../../models");
const LeadsManagmentModuleStatus = db.LeadsManagmentModuleStatus;
const Activity = db.Activity;
// create program categorys
exports.createLeadsManagmentModuleStatus = async (req, res, next) => {
  try {
    console.log(
      "Req.body leadsManagmentModuleStatus controller =====>",
      req.body
    );
    //

    let leadsManagmentModuleStatus = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the leadsManagmentModuleStatus in db
    leadsManagmentModuleStatus = await LeadsManagmentModuleStatus.create(
      leadsManagmentModuleStatus
    );
    await Activity.create({
      action: "New leadsManagmentModuleStatus Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: leadsManagmentModuleStatus,
      // Activity,
      message: "leadsManagmentModuleStatus created successfully",
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
exports.listLeadsManagmentModuleStatuss = async (req, res, next) => {
  try {
    const uni = await LeadsManagmentModuleStatus.findAndCountAll();
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
    const faqs = await LeadsManagmentModuleStatus.findAll({
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
    res.send("leadsManagmentModuleStatus Error " + err);
  }
  // next();
};

// API to edit leadsManagmentModuleStatus
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const leadsManagmentModuleStatus = await LeadsManagmentModuleStatus.update(
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
      action: "New leadsManagmentModuleStatus updated",
      name: req.body.Uname, role: req.body.role,
    });

    const uni = await LeadsManagmentModuleStatus.findAndCountAll();
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
    const faqs = await LeadsManagmentModuleStatus.findAll({
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

// API to delete leadsManagmentModuleStatus
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const leadsManagmentModuleStatus =
        await LeadsManagmentModuleStatus.destroy({
          where: { id: ID },
        });
      await Activity.create({
        action: " leadsManagmentModuleStatus deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await LeadsManagmentModuleStatus.findAndCountAll();
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
      const faqs = await LeadsManagmentModuleStatus.findAll({
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

// API to get  by id a leadsManagmentModuleStatus
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", LeadsManagmentModuleStatus);
      const leadsManagmentModuleStatus =
        await LeadsManagmentModuleStatus.findByPk(id);

      if (leadsManagmentModuleStatus)
        return res.json({
          success: true,
          message: "leadsManagmentModuleStatus retrieved successfully",
          leadsManagmentModuleStatus,
        });
      else
        return res.status(400).send({
          success: false,
          message: "leadsManagmentModuleStatus not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "leadsManagmentModuleStatus Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
