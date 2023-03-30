const db = require("../../models");
const LeadGroup = db.LeadGroup;
const Activity = db.Activity;
// create program categorys
exports.createLeadGroup = async (req, res, next) => {
  try {
    console.log("Req.body leadgroup controller =====>", req.body);
    //

    let leadgroup = {
      name: req.body.name,
      Color: req.body.Color,
    };

    //save the leadgroup in db
    leadgroup = await LeadGroup.create(leadgroup);
    await Activity.create({
      action: "New leadgroup Created",
      name: req.body.Uname, role: req.body.role,
    });

    return res.json({
      success: true,
      data: leadgroup,
      // Activity,
      message: "leadgroup created successfully",
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
exports.listLeadGroups = async (req, res, next) => {
  try {
    const uni = await LeadGroup.findAndCountAll();
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
    const faqs = await LeadGroup.findAll({
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
    res.send("leadgroup Error " + err);
  }
  // next();
};

// API to edit leadgroup
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    const leadgroup = await LeadGroup.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.ID,
        },
      }
    );
    const uni = await LeadGroup.findAndCountAll();
    let { page, limit, name } = req.query;
     //name
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
    const faqs = await LeadGroup.findAll({
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
  } catch (error) {
    return next(error);
  }
};

// API to delete leadgroup
exports.delete = async (req, res, next) => {
  try {
    const { ID } = req.body;
    if (ID) {
      const leadgroup = await LeadGroup.destroy({
        where: { id: ID },
      });
      await Activity.create({
        action: " leadgroup deleted",
        name: req.body.Uname, role: req.body.role,
      });

      const uni = await LeadGroup.findAndCountAll();
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
      const faqs = await LeadGroup.findAll({
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
    }
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a leadgroup
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      console.log("oooooooooooooooooooooooo\n", LeadGroup);
      const leadgroup = await LeadGroup.findByPk(id);

      if (leadgroup)
        return res.json({
          success: true,
          message: "leadgroup retrieved successfully",
          leadgroup,
        });
      else
        return res.status(400).send({
          success: false,
          message: "leadgroup not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "leadgroup Id is required" });
  } catch (error) {
    return next(error);
  }
};
