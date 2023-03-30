const db = require("../../models");
const DepitAndCredit = db.DepitAndCredit;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body depitAndCredit controller =====>", req.body);
    //

    let depitAndCredit = {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
    };

    //save the depitAndCredit in db
    depitAndCredit = await DepitAndCredit.create(depitAndCredit);
    await Activity.create({
      action: "New DepitAndCredit Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: depitAndCredit,
      // Activity,
      message: "depitAndCredit created successfully",
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

// list depitAndCredit
exports.list = async (req, res, next) => {
  try {
    const uni = await DepitAndCredit.findAndCountAll();
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
    const faqs = await DepitAndCredit.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "depitAndCredit fetched successfully",
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
    res.send("depitAndCredit Error " + err);
  }
  // next();
};

// API to edit depitAndCredit
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const depitAndCredit = await DepitAndCredit.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );
    await Activity.create({
      action: "New depitAndCredit updated",
      name: req.body.Uname, role: req.body.role,
    });

    return res.send({
      success: true,
      message: "depitAndCredit updated successfully",
      depitAndCredit,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete depitAndCredit
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const depitAndCredit = await DepitAndCredit.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " depitAndCredit deleted",
        name: "samon", role: "superAdmin"
      });

      if (depitAndCredit)
        return res.send({
          success: true,
          message: "depitAndCredit Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "depitAndCredit Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "depitAndCredit Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a depitAndCredit
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", DepitAndCredit);
      const depitAndCredit = await DepitAndCredit.findByPk(id);

      if (depitAndCredit)
        return res.json({
          success: true,
          message: "depitAndCredit retrieved successfully",
          depitAndCredit,
        });
      else
        return res.status(400).send({
          success: false,
          message: "depitAndCredit not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "depitAndCredit Id is required" });
  } catch (error) {
    return next(error);
  }
};
