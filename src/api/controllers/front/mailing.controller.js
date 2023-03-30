const db = require("../../models");
const MailingInfo = db.MailingInfo;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body mailingInfo controller =====>", req.body);
    //

    let mailingInfo = {
      addressOne: req.body.mailing.addressOne,
      addressTwo: req.body.mailing.addressTwo,
      country: req.body.mailing.country,
      phone: req.body.mailing.phone,
      email: req.body.mailing.email,
    };

    //save the mailingInfo in db
    mailingInfo = await MailingInfo.create(mailingInfo);
    await Activity.create({
      action: "New mailingInfo Created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: mailingInfo,
      // Activity,
      message: "mailingInfo created successfully",
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
    const uni = await MailingInfo.findAndCountAll();
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
    const faqs = await MailingInfo.findAll({
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
    res.send("mailingInfo Error " + err);
  }
  // next();
};

// API to edit mailingInfo
exports.edit = async (req, res, next) => {
  try {
    let payload = {
      addressOne: req.body.mailing.addressOne,
      addressTwo: req.body.mailing.addressTwo,
      country: req.body.mailing.country,
      phone: req.body.mailing.phone,
      email: req.body.mailing.email,
    };

    const mailingInfo = await MailingInfo.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          ID: req?.body?.mailing.ID,
        },
      }
    );
    await Activity.create({
      action: "New mailingInfo updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "mailingInfo updated successfully",
      mailingInfo,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete mailingInfo
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const mailingInfo = await MailingInfo.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " mailingInfo deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (mailingInfo)
        return res.send({
          success: true,
          message: "mailingInfo Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "mailingInfo Page not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "mailingInfo Id is required",
      });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a mailingInfo
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", MailingInfo);
      const mailingInfo = await MailingInfo.findByPk(id);

      if (mailingInfo)
        return res.json({
          success: true,
          message: "mailingInfo retrieved successfully",
          mailingInfo,
        });
      else
        return res.status(400).send({
          success: false,
          message: "mailingInfo not found for given Id",
        });
    } else
      return res.status(400).send({
        success: false,
        message: "mailingInfo Id is required",
      });
  } catch (error) {
    return next(error);
  }
};
