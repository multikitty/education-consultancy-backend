const db = require("../../models");
const InvoiceModuleStatus = db.InvoiceModuleStatus;
const Activity = db.Activity;
// create program categorys
exports.createInvoiceModuleStatus = async (req, res, next) => {
  try {
    console.log("Req.body invoiceModuleStatus controller =====>", req.body);
    //

    let invoiceModuleStatus = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the invoiceModuleStatus in db
    invoiceModuleStatus = await InvoiceModuleStatus.create(invoiceModuleStatus);
    await Activity.create({
      action: "New invoiceModuleStatus Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: invoiceModuleStatus,
      // Activity,
      message: "invoiceModuleStatus created successfully",
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
exports.listInvoiceModuleStatuss = async (req, res, next) => {
  try {
    const uni = await InvoiceModuleStatus.findAndCountAll();
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
    const faqs = await InvoiceModuleStatus.findAll({
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
    res.send("invoiceModuleStatus Error " + err);
  }
  // next();
};

// API to edit invoiceModuleStatus
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const invoiceModuleStatus = await InvoiceModuleStatus.update(
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
      action: "New invoiceModuleStatus updated",
      name: req.body.Uname, role: req.body.role,
    });

    const uni = await InvoiceModuleStatus.findAndCountAll();
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
    const faqs = await InvoiceModuleStatus.findAll({
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

// API to delete invoiceModuleStatus
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const invoiceModuleStatus = await InvoiceModuleStatus.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " invoiceModuleStatus deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await InvoiceModuleStatus.findAndCountAll();
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
      const faqs = await InvoiceModuleStatus.findAll({
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

// API to get  by id a invoiceModuleStatus
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", InvoiceModuleStatus);
      const invoiceModuleStatus = await InvoiceModuleStatus.findByPk(id);

      if (invoiceModuleStatus)
        return res.json({
          success: true,
          message: "invoiceModuleStatus retrieved successfully",
          invoiceModuleStatus,
        });
      else
        return res.status(400).send({
          success: false,
          message: "invoiceModuleStatus not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "invoiceModuleStatus Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
