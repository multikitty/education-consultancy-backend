const db = require("../../models");
const Expenses = db.Expenses;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body expenses controller =====>", req.body);
    //

    let expenses = {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      statusID: req.body.statusID
    };

    //save the expenses in db
    expenses = await Expenses.create(expenses);
    await Activity.create({
      action: "New Expenses Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: expenses,
      // Activity,
      message: "expenses created successfully",
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

// list expenses
exports.list = async (req, res, next) => {
  try {
    const uni = await Expenses.findAndCountAll();
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
    const faqs = await Expenses.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "expenses fetched successfully",
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
    res.send("expenses Error " + err);
  }
  // next();
};

// API to edit expenses
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const expenses = await Expenses.update(
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
      action: "New expenses updated",
      name: req.body.Uname, role: req.body.role,
    });

    return res.send({
      success: true,
      message: "expenses updated successfully",
      expenses,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete expenses
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const expenses = await Expenses.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " expenses deleted",
        name: "samon", role: "superAdmin"
      });

      if (expenses)
        return res.send({
          success: true,
          message: "expenses Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "expenses Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "expenses Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a expenses
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", Expenses);
      const expenses = await Expenses.findByPk(id);

      if (expenses)
        return res.json({
          success: true,
          message: "expenses retrieved successfully",
          expenses,
        });
      else
        return res.status(400).send({
          success: false,
          message: "expenses not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "expenses Id is required" });
  } catch (error) {
    return next(error);
  }
};
