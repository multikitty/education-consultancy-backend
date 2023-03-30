const db = require("../../models");
const { Op } = require("sequelize");
const CommissionInvoice = db.CommissionInvoice;
const Activity = db.Activity;

const {
  University,
  InvoiceModuleStatus,
  CommissionInvoiceItem,
  Branch,
  BillingInfo,
  MailingInfo,
} = db;

// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body commissionInvoice controller =====>", req.body);
    //

    let commissionInvoice = {
      itemdate: "190190939",
      recipient: req.body?.recipient,
      email: req.body?.email,
      service: req.body?.service || "Vps",
      amount: req.body?.amount || "0",
      price: req.body?.price || "0",
      statusID: +req.body?.statusID,
      universityID: +req.body?.universityID,
      branchID: +req.body?.branchID,
      billingID: +req.body?.billingID,
      mailingID: +req.body?.mailingID,
      type: "commission",
    };

    //save the commissionInvoice in db
    commissionInvoice = await CommissionInvoice.create(commissionInvoice);
    await Activity.create({
      action: "New commissionInvoice Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: commissionInvoice,
      // Activity, 
      message: "commissionInvoice created successfully",
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
    const uni = await CommissionInvoice.findAndCountAll();
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
    const faqs = await CommissionInvoice.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: {
        ...filter,
        type: {
          [Op.not]: "general",
        },
      },
      include: [
        University,
        InvoiceModuleStatus,
        CommissionInvoiceItem,
        Branch,
        MailingInfo,
        BillingInfo,
      ],
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "commission invoice fetched successfully",
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
    res.send("commissionInvoice Error " + err);
  }
  // next();
};

// API to edit commissionInvoice
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
    console.log("ID to update", req.body.ID, "..>>", req.params);
    const commissionInvoice = await CommissionInvoice.update(
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
      action: "New commissionInvoice updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "commissionInvoice updated successfully",
      commissionInvoice,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete commissionInvoice
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const commissionInvoice = await CommissionInvoice.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " commissionInvoice deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (commissionInvoice)
        return res.send({
          success: true,
          message: "commissionInvoice Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "commissionInvoice Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "commissionInvoice Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a commissionInvoice
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", CommissionInvoice);
      const commissionInvoice = await CommissionInvoice.findByPk(id, {
        include: [
          University,
          InvoiceModuleStatus,
          CommissionInvoiceItem,
          Branch,
          MailingInfo,
          BillingInfo,
        ],
      });

      if (commissionInvoice)
        return res.json({
          success: true,
          message: "commissionInvoice retrieved successfully",
          commissionInvoice,
        });
      else
        return res.status(400).send({
          success: false,
          message: "commissionInvoice not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "commissionInvoice Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await CommissionInvoice.findAndCountAll();
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
    const faqs = await CommissionInvoice.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        University,
        InvoiceModuleStatus,
        CommissionInvoiceItem,
        Branch,
        MailingInfo,
        BillingInfo,
      ],
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "commission invoice fetched successfully",
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
    res.send("commissionInvoice Error " + err);
  }
};
