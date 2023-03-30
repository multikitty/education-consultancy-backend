const db = require("../../models");
const Property = db.Property;
const Activity = db.Activity;

// create Property
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    console.log("payload", payload);
    //save the property in db
    let property = await Property.create(payload);
    await Activity.create({ action: "New property Created", name: req.body.Uname, role: req.body.role });

    return res.json({
      success: true,
      data: property,
      message: "property created successfully",
    });
  } catch (err) {
    next();
  }
};

// list Propertyies
exports.list = async (req, res, next) => {
  try {
    const uni = await Property.findAndCountAll();

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
    const faqs = await Property.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Properties fetched successfully",
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
    res.send("property Error " + err);
  }
  // next();
};

// API to edit property
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const property = await Property.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );
    await Activity.create({ action: "property updated", name: req.body.Uname, role: req.body.role });

    return res.send({
      success: true,
      message: "property updated successfully",
      property,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete property
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const property = await Property.destroy({ where: { id: id } });

      await Activity.create({ action: "property deleted",
      name: "samon", role: "superAdmin"
    });
      if (property)
        return res.send({
          success: true,
          message: "property Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "property Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "property Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a property
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const property = await Property.findByPk(id);

      if (property)
        return res.json({
          success: true,
          message: "property retrieved successfully",
          property,
        });
      else
        return res.status(400).send({
          success: false,
          message: "property not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "property Id is required" });
  } catch (error) {
    return next(error);
  }
};
