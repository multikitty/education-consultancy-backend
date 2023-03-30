const db = require("../../models");
const BillingInfo = db.BillingInfo;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body billingInfo controller =====>", req.body);
    //

    let billingInfo = {
      addressOne: req.body.billing.addressOne,
      addressTwo: req.body.billing.addressTwo,
      country: req.body.billing.country,
      phone: req.body.billing.phone,
      email: req.body.billing.email,
    };

    //save the billingInfo in db
    billingInfo = await BillingInfo.create(billingInfo);
    await Activity.create({
      action: "New billingInfo Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: billingInfo,
      // Activity,
      message: "billingInfo created successfully",
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
    const uni = await BillingInfo.findAndCountAll();
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
    const faqs = await BillingInfo.findAll({
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
    res.send("billingInfo Error " + err);
  }
  // next();
};

// API to edit billingInfo
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      addressOne: req.body.billing.addressOne,
      addressTwo: req.body.billing.addressTwo,
      country: req.body.billing.country,
      phone: req.body.billing.phone,
      email: req.body.billing.email,
    };
    const billingInfo = await BillingInfo.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          ID: req?.body?.billing.ID,
        },
      }
    );
    await Activity.create({
      action: "New billingInfo updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "billingInfo updated successfully",
      billingInfo,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete billingInfo
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const billingInfo = await BillingInfo.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " billingInfo deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (billingInfo)
        return res.send({
          success: true,
          message: "billingInfo Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "billingInfo Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "billingInfo Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a billingInfo
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", BillingInfo);
      const billingInfo = await BillingInfo.findByPk(id);

      if (billingInfo)
        return res.json({
          success: true,
          message: "billingInfo retrieved successfully",
          billingInfo,
        });
      else
        return res.status(400).send({
          success: false,
          message: "billingInfo not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "billingInfo Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
