const db = require("../../models");
const CostOfSales = db.CostOfSales;
const Activity = db.Activity;
// create program categorys
exports.create = async (req, res, next) => {
  try {
    console.log("Req.body costOfSales controller =====>", req.body);
    //

    let costOfSales = {
      name: req.body.name,
      description: req.body.description,
      amount: req.body.amount,
      date: req.body.date,
      statusID: req.body.statusID
    };

    //save the costOfSales in db
    costOfSales = await CostOfSales.create(costOfSales);
    await Activity.create({
      action: "New CostOfSales Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: costOfSales,
      // Activity,
      message: "costOfSales created successfully",
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

// list costOfSales
exports.list = async (req, res, next) => {
  try {
    const uni = await CostOfSales.findAndCountAll();
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
    const faqs = await CostOfSales.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "costOfSales fetched successfully",
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
    res.send("costOfSales Error " + err);
  }
  // next();
};

// API to edit costOfSales
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const costOfSales = await CostOfSales.update(
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
      action: "New costOfSales updated",
      name: req.body.Uname, role: req.body.role,
    });

    return res.send({
      success: true,
      message: "costOfSales updated successfully",
      costOfSales,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete costOfSales
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const costOfSales = await CostOfSales.destroy({
        where: { id: id },
      });
      await Activity.create({
        action: " costOfSales deleted",
        name: "samon", role: "superAdmin"
      });

      if (costOfSales)
        return res.send({
          success: true,
          message: "costOfSales Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "costOfSales Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "costOfSales Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a costOfSales
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", CostOfSales);
      const costOfSales = await CostOfSales.findByPk(id);

      if (costOfSales)
        return res.json({
          success: true,
          message: "costOfSales retrieved successfully",
          costOfSales,
        });
      else
        return res.status(400).send({
          success: false,
          message: "costOfSales not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "costOfSales Id is required" });
  } catch (error) {
    return next(error);
  }
};
