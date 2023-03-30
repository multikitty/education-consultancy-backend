const db = require("../../models");
const Branch = db.Branch;
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Activity = db.Activity;

// create Branch
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    //save the branch in db
    let branch = await Branch.create(payload);
    await Activity.create({ action: "Branch created", name: req.body.Uname, role: req.body.role });

    return res.json({
      success: true,
      data: branch,
      message: "branch created successfully",
    });
  } catch (err) {
    next();
  }
};

// list Branchies
exports.list = async (req, res, next) => {
  try {
    const uni = await Branch.findAndCountAll();

    let { page, limit, name } = req.query;

    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = uni.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    const faqs = await Branch.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Branch fetched successfully",
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
    res.send("branch Error " + err);
  }
  // next();
};

// API to edit branch
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const branch = await Branch.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );
    await Activity.create({ action: "Branch updated", name: req.body.Uname, role: req.body.role });

    return res.send({
      success: true,
      message: "branch updated successfully",
      branch,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete branch
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const branch = await Branch.destroy({ where: { id: id } });
      await Activity.create({ action: "Branch deleted", name: "samon", role: "superAdmin" });

      if (branch)
        return res.send({
          success: true,
          message: "branch Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "branch Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "branch Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a branch
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id != "undefined") {
      const branch = await Branch.findByPk(id);

      if (branch)
        return res.json({
          success: true,
          message: "branch retrieved successfully",
          branch,
        });
      else
        return res.status(400).send({
          success: false,
          message: "branch not found for given Id",
        });
    } else {

      const branch = await Branch.findAll({});

      return res
        .send({ success: true, branch});
    }
      
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const uni = await Branch.findAndCountAll();

    let { page, limit } = req.query;
    let { name } = req.body;

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

    const faqs = await Branch.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Branch fetched successfully",
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
    res.send("branch Error " + err);
  }
  // next();
};
