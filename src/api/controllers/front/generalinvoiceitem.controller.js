const db = require("../../models");
const GeneralInvoiceItem = db.GeneralInvoiceItem;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body generalInvoiceItem controller =====>", req.body);
    //

    let generalInvoiceItem = {
      name: req.body.item.name,
      price: req.body.item.price,
      country: req.body.item.country,
      quantity: req.body.item.quantity,
      invoiceID: req.body.item.invoiceID,
    };

    //save the generalInvoiceItem in db
    generalInvoiceItem = await GeneralInvoiceItem.create(generalInvoiceItem);
    await Activity.create({
      action: "New generalInvoiceItem Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: generalInvoiceItem,
      // Activity,
      message: "generalInvoiceItem created successfully",
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
    const uni = await GeneralInvoiceItem.findAndCountAll();
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
    const faqs = await GeneralInvoiceItem.findAll({
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
    res.send("generalInvoiceItem Error " + err);
  }
  // next();
};

// API to edit generalInvoiceItem
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      name: req.body.item.name,
      price: req.body.item.price,
      country: req.body.item.country,
      quantity: req.body.item.quantity,
      invoiceID: req.body.item.invoiceID,
    };
    const generalInvoiceItem = await GeneralInvoiceItem.update(
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
      action: "New generalInvoiceItem updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "generalInvoiceItem updated successfully",
      generalInvoiceItem,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete generalInvoiceItem
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const generalInvoiceItem = await GeneralInvoiceItem.destroy({
        where: { ID: id },
      });
      await Activity.create({
        action: " generalInvoiceItem deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (generalInvoiceItem)
        return res.send({
          success: true,
          message: "generalInvoiceItem Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "generalInvoiceItem Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "generalInvoiceItem Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a generalInvoiceItem
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", GeneralInvoiceItem);
      const generalInvoiceItem = await GeneralInvoiceItem.findByPk(id);

      if (generalInvoiceItem)
        return res.json({
          success: true,
          message: "generalInvoiceItem retrieved successfully",
          generalInvoiceItem,
        });
      else
        return res.status(400).send({
          success: false,
          message: "generalInvoiceItem not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "generalInvoiceItem Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
