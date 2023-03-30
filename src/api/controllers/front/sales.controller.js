const db = require("../../models");
const Sales = db.Sales;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body sales controller =====>", req.body);
    //

    let sales = {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      statusID: req.body.statusID
    };

    //save the sales in db
    sales = await Sales.create(sales);
    await Activity.create({
      action: "New Sales Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: sales,
      // Activity,
      message: "sales created successfully",
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

// list sales
exports.list = async (req, res, next) => {
  try {
    const uni = await Sales.findAndCountAll();
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
    const faqs = await Sales.findAll({
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
    res.send("sales Error " + err);
  }
  // next();
};

// API to edit sales
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const sales = await Sales.update(
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
      action: "New sales updated",
      name: req.body.Uname, role: req.body.role,
    });

    return res.send({
      success: true,
      message: "sales updated successfully",
      sales,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete sales
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const sales = await Sales.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " sales deleted",
        name: "samon", role: "superAdmin"
      });

      if (sales)
        return res.send({
          success: true,
          message: "sales Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "sales Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "sales Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a sales
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", Sales);
      const sales = await Sales.findByPk(id);

      if (sales)
        return res.json({
          success: true,
          message: "sales retrieved successfully",
          sales,
        });
      else
        return res.status(400).send({
          success: false,
          message: "sales not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "sales Id is required" });
  } catch (error) {
    return next(error);
  }
};
