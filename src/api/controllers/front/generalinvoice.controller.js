const db = require("../../models");
const GeneralInvoice = db.GeneralInvoice;
const Activity = db.Activity;
const {
  University,
  InvoiceModuleStatus,
  GeneralInvoiceItem,
  Branch,
  BillingInfo,
  MailingInfo,
} = db;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body generalInvoices controller =====>", req.body);
    //

    let generalInvoices = {
      itemdate: req.body?.itemdate || Date.now(),
      recipient: req.body?.recipient,
      email: req.body?.email,
      service: req.body?.service,
      amount: req.body?.amount,
      price: req.body?.price,
      statusID: +req.body?.statusID,
      universityID: +req.body?.universityID,
      branchID: +req.body?.branchID,
      billingID: +req.body?.billingID,
      mailingID: +req.body?.mailingID,
      type: "general",
    };

    //save the generalInvoices in db
    generalInvoices = await GeneralInvoice.create(generalInvoices);
    await Activity.create({
      action: "New generalInvoices Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: generalInvoices,
      // Activity,
      message: "generalInvoices created successfully",
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
exports.list = async (req, res, next) => {
  try {
    const uni = await GeneralInvoice.findAndCountAll();
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
    const faqs = await GeneralInvoice.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: { ...filter, type: "general" },
      include: [
        University,
        InvoiceModuleStatus,
        GeneralInvoiceItem,
        Branch,
        BillingInfo,
        MailingInfo,
      ],
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "general invoice fetched successfully",
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
    res.send("generalInvoices Error " + err);
  }
  // next();
};

// API to edit generalInvoices
exports.edit = async (req, res, next) => {
  try {
    // let payload = req.body;
    console.log("ID to update", req.body.ID, "..>>", req.params);
    let payload = {
      recipient: req.body?.recipient,
      email: req.body?.email,
      service: req.body?.service,
      amount: req.body?.amount,
      price: req.body?.price,
      statusID: +req.body?.statusID,
      universityID: +req.body?.universityID,
      branchID: +req.body?.branchID,
      // billingID: +req.body?.billingID,
      // mailingID: +req.body?.mailingID,
    };
    const generalInvoices = await GeneralInvoice.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          ID: +req?.body?.ID,
        },
      }
    );
    await Activity.create({
      action: "New generalInvoices updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "generalInvoices updated successfully",
      generalInvoices,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete generalInvoices
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const generalInvoices = await GeneralInvoice.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " generalInvoices deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (generalInvoices)
        return res.send({
          success: true,
          message: "generalInvoices Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "generalInvoices Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "generalInvoices Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a generalInvoices
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", GeneralInvoice);
      const generalInvoices = await GeneralInvoice.findByPk(id, {
        include: [
          University,
          InvoiceModuleStatus,
          GeneralInvoiceItem,
          Branch,
          MailingInfo,
          BillingInfo,
        ],
      });

      if (generalInvoices)
        return res.json({
          success: true,
          message: "generalInvoices retrieved successfully",
          generalInvoices,
        });
      else
        return res.status(400).send({
          success: false,
          message: "generalInvoices not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "generalInvoices Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await GeneralInvoice.findAndCountAll();
    let { page, limit } = req.query;
    let { name } = req.body;

    console.log("unitt", uni.count);
    console.log("req.queryy", req.query); //name
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

    console.log("filter", filter);
    const faqs = await GeneralInvoice.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        University,
        InvoiceModuleStatus,
        GeneralInvoiceItem,
        Branch,
        MailingInfo,
        BillingInfo,
      ],
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "gneral invoice fetched successfully",
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
    res.send("generalInvoice Error " + err);
  }
};
