const db = require("../../models");
const Lead = db.Lead;
const ProgrammeDetails = db.ProgrameDetails;
const LeadsManagmentModuleStatus = db.LeadsManagmentModuleStatus;
const Activity = db.Activity;
const { Branch, Programme, University } = db;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

// create lead
exports.createLead = async (req, res, next) => {
  try {
    // console.log("Req.body Lead =====>", req.body);

    //
    console.log("Req.file Lead =====>", req.file);

    let lead = {
      image: req?.file?.filename,
      name: req.body.name,
      passportNo: req.body.passportNo,
      leadGroup: req.body.leadGroup,
      country: req.body.country,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
      refferalName: req.body.refferalName,
      refferalEmail: req.body.refferalEmail,
      // statusID: 1,
    };

    //save the lead in db
    lead = await Lead.create(lead);

    // console.log("newArrr",newArr.length)
    let programmeDetails = {
      schoolName: req.body.schoolName,
      qualificationType: req.body.qualificationType,
      selectUniversity: req.body.selectUniversity,
      interestedProgramme: req.body.interestedProgramme,
      status: req.body.status,
      cert: req.body.cert,
      comments: req.body.comments,
      leadId: lead.dataValues.id,
      //  UniversityId: university.dataValues.id
    };
    programmeDetails = await ProgrammeDetails.create(programmeDetails);

    await Activity.create({
      action: "new lead created",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.json({
      success: true,
      data: lead,
      // programmeDetails,
      message: "Lead created successfully",
    });
  } catch (err) {
    console.log("Error from Lead Create handling =>", err);
    next();
  }
};

// list lead
exports.listLead = async (req, res, next) => {
  try {
    const uni = await Lead.findAndCountAll();
    // const programeTable = await ProgrammeDetails.findAll();
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

    //  console.log("filter",filter)
    const faqs = await Lead.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: ProgrammeDetails,
          as: "ProgrameDetail",
          include: [
            {
              model: LeadsManagmentModuleStatus,
              // as: "status",
              // foreignKey: "sssss",
            },
          ],
        },
        Branch,
        Programme,
        LeadsManagmentModuleStatus,
        University,
      ],
    });
    // console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Leads fetched successfully",
      data: {
        faqs,
        // programeTable,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.send("programme Error " + err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const uni = await Lead.findAndCountAll();
    // const programeTable = await ProgrammeDetails.findAll();
    let { page, limit } = req.query;
    let { name } = req.body;

    console.log("unitt", uni.count);
    console.log("req.queryy", req.query); //name
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

    //  console.log("filter",filter)
    const faqs = await Lead.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: ProgrammeDetails,
          as: "ProgrameDetail",
          include: [
            {
              model: LeadsManagmentModuleStatus,
              // as: "status",
              // foreignKey: "sssss",
            },
          ],
        },
        Branch,
        Programme,
        LeadsManagmentModuleStatus,
        University,
      ],
    });
    // console.log("faqs", faqs);
    // res.send(uni);
    return res.send({
      success: true,
      message: "Leads fetched successfully",
      data: {
        faqs,
        // programeTable,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    res.send("programme Error " + err);
  }
};

// exports.listLead = async (req, res, next) => {
//   // console.log("req.query",req.query);
//   console.log("hhhhhhhhiiiiiiiiiiiiiiiiiiiiiiiii saqib");
//   try {
//     const uni = await Lead.findAndCountAll();
//     let { page, limit, name } = req.query;

//     console.log("unitt", uni.count);
//     console.log("req.queryy", req.query); //name
//     const filter = {};

//     page = page !== undefined && page !== "" ? parseInt(page) : 1;
//     limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

//     if (name) {
//       filter.name = {
//         [Op.like]: "%" + name + "%",
//       };
//     }

//     const total = uni.count;

//     if (page > Math.ceil(total / limit) && total > 0)
//       page = Math.ceil(total / limit);

//     console.log("filter", filter, page, limit);
//     const faqs = await Lead.findAll({
//       where: filter,

//       order: [["updatedAt", "DESC"]],
//       offest: limit * (page - 1),
//       limit: limit,
//     });

//     return res.send({
//       success: true,
//       message: "Universities fetched successfully",
//       data: {
//         faqs,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
//         },
//       },
//     });
//   } catch (err) {
//     res.send("University Error " + err);
//   }
// };

//  edit lead
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const image = req?.file?.filename;
      payload[`image`] = image;
    } else {
      delete payload["image"];
    }
    const lead = await Lead.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );

    let programme = {
      schoolName: req.body.schoolName,
      qualificationType: req.body.qualificationType,
      selectUniversity: req.body.selectUniversity,
      interestedProgramme: req.body.interestedProgramme,
      status: req.body.status,
      cert: req.body.cert,
      comments: req.body.comments,
      leadId: payload.id,
    };
    console.log("programmassss=>", programme);
    programme = await ProgrammeDetails.update(programme, {
      where: {
        leadId: payload.id,
      },
    });

    await Activity.create({
      action: "new lead updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "lead updated successfully",
      lead,
      // programme,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete lead
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      await ProgrammeDetails.destroy({
        where: { leadId: id },
      });
      const lead = await Lead.destroy({ where: { id: id } });

      await Activity.create({
        action: "new lead deleted",
        name: req.body.Uname,
        role: req.body.role,
      });

      if (lead)
        return res.send({
          success: true,
          message: "lead Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "lead Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "lead Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get a lead
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const lead = await Lead.findByPk(id);
      console.log(">>>>>>>>>>>.\n\n\n\n\n\n>>>>>>>>>>>\n\n", lead);
      console.log("lead id ==>", lead.dataValues.id);
      // const programeTable = await ProgrammeDetails.findByPk(id);
      lead.dataValues.programmeDetails = await ProgrammeDetails.findOne({
        where: {
          leadId: lead.dataValues.id,
        },
        // include: [
        //   {
        //     model: ProgrammeDetails,
        //     as: "ProgrameDetail",
        //   },
        // ],
      });

      if (lead)
        return res.json({
          success: true,
          message: "lead retrieved successfully",
          lead,
          // programeTable,
        });
      else
        return res.status(400).send({
          success: false,
          message: "lead not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "lead Id is required" });
  } catch (error) {
    return next(error);
  }
};
