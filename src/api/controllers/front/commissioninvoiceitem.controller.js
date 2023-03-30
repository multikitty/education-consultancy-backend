const db = require("../../models");
const CommissionInvoiceItem = db.CommissionInvoiceItem;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body commissionInvoiceItem controller =====>", req.body);
    //

    let commissionInvoiceItem = {
      name: req.body.item.name,
      price: req.body.item.price,
      country: req.body.item.country,
      quantity: req.body.item.quantity,
      invoiceID: req.body.item.invoiceID,
    };

    //save the commissionInvoiceItem in db
    commissionInvoiceItem = await CommissionInvoiceItem.create(
      commissionInvoiceItem
    );
    await Activity.create({
      action: "New commissionInvoiceItem Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: commissionInvoiceItem,
      // Activity,
      message: "commissionInvoiceItem created successfully",
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
    const uni = await CommissionInvoiceItem.findAndCountAll();
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
    const faqs = await CommissionInvoiceItem.findAll({
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
    res.send("commissionInvoiceItem Error " + err);
  }
  // next();
};

// API to edit commissionInvoiceItem
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      name: req.body.item.name,
      price: req.body.item.price,
      country: req.body.item.country,
      quantity: req.body.item.quantity,
      invoiceID: req.body.item.invoiceID,
    };
    const commissionInvoiceItem = await CommissionInvoiceItem.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          ID: req?.body?.item.ID,
        },
      }
    );
    await Activity.create({
      action: "New commissionInvoiceItem updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "commissionInvoiceItem updated successfully",
      commissionInvoiceItem,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete commissionInvoiceItem
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const commissionInvoiceItem = await CommissionInvoiceItem.destroy({
        where: { ID: id },
      });
      await Activity.create({
        action: " commissionInvoiceItem deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (commissionInvoiceItem)
        return res.send({
          success: true,
          message: "commissionInvoiceItem Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "commissionInvoiceItem Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "commissionInvoiceItem Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a commissionInvoiceItem
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", CommissionInvoiceItem);
      const commissionInvoiceItem = await CommissionInvoiceItem.findByPk(id);

      if (commissionInvoiceItem)
        return res.json({
          success: true,
          message: "commissionInvoiceItem retrieved successfully",
          commissionInvoiceItem,
        });
      else
        return res.status(400).send({
          success: false,
          message: "commissionInvoiceItem not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "commissionInvoiceItem Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
