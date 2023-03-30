const db = require("../../models");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const { ApplicationModuleStatus, Branch } = db;
const Applicants = db.Applicants;
const ApplicationDetails = db.ApplicationDetails;
const Activity = db.Activity;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

const transport = nodemailer.createTransport({
  auth: {
    user: "haodev007@gmail.com",
    pass: "jcyxsvamgupyqpvv",
  },
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
});

// setup e-mail data with unicode symbols



var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

// create applicants
exports.createApplicant = async (req, res, next) => {

  try {
    // console.log("Req.body applicants =====>", req.body);
    console.log("req.files", req.files ? req.files : "!No Files!");
    console.log("req.file", req.file ? req.file : "!No file!");

    let applicants = {
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      address1: req.body.address1,
      address2: req.body.address2,
      country: req.body.country,
      image:
        req?.files?.image && req?.files?.image[0]
          ? req?.files?.image[0].filename
          : "",
      passportNo: req.body.passportNo,
      fileUpload:
        req?.files?.fileUpload && req?.files?.fileUpload[0]
          ? JSON.stringify(req?.files?.fileUpload[0].filename)
          : "",
    };

    //save the lead in db
    applicants = await Applicants.create(applicants);
    // let applicantsId= applicants.dataValues.id;
    // console.log("applicantsid", applicants.dataValues.id);
    //

    let applicantDetails = {
      applicationLevel: req.body.applicationLevel,
      interestedProgramme: req.body.interestedProgramme,
      schoolName: req.body.schoolName,
      qualificationType: req.body.qualificationType,
      selectUniversity: req.body.selectUniversity,
      completionLetter: req.body.completionLetter,
      programmeLevel: req.body.programmeLevel,
      healthForm: req.body.healthForm,
      paymentReceipt: req.body.paymentReceipt,
      researchProposal: req.body.researchProposal,
      refreeForm: req.body.refreeForm,
      medium: req.body.medium,
      scholorshipForm: req.body.scholorshipForm,
      otherDocuments: req.body.otherDocuments,
      attestationLetter: req.body.attestationLetter,
      releaseLetter: req.body.releaseLetter,
      status: req.body.status,
      ApplicantId: applicants.dataValues.id,
      branchID: Math.floor(Math.random() * 4 + 1),
      // Anasite - Edits, Make it come from UI
    };
    applicantDetails = await ApplicationDetails.create(applicantDetails);

    await Activity.create({
      action: "new applicant created",
      name: req.body.Uname,
      role: req.body.role,
    });

    readHTMLFile(__dirname + "/test.html", function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        usercode: "1234",
        name: req.body.fullName
      };
      // res.json({ body: __dirname });
      var htmlToSend = template(replacements);

      const mailOptions = {
        from: "Parasol Finance <no-reply@parasol.finance>", // sender email
        to: req.body.email, // receiver email or list of receiver
        subject: "Welcome to QETC", // Subject line
        text: "", // plaintext body
        html: htmlToSend, // html body
      };
      
      // send mail with defined transport object
      transport.sendMail(mailOptions, function (error) {
        if (error) {
          console.log(error);
          res.status(400).json({ success: false });
        } else {
          console.log("Message sent: " + res.message);
          res.status(200).json({ success: true });

        }
      });
    });

    return res.json({
      success: true,
      data: applicants,
      applicantDetails,
      // programmeDetails,
      message: "applicant created successfully",
    });
  } catch (err) {
    // res.status(500).send({
    //   message:
    //     err.message || "Some error occurred while creating the applicants.",
    // });
    console.log("Error handling =>", err);
    next();
  }
};

// list applicants
// exports.listApplicants = async (req, res, next) => {
//   try {
//     const uni = await Applicants.findAndCountAll();
//     const applicantDetail = await ApplicationDetails.findAll();
//     let { page, limit, name } = req.query;

//     console.log("unitt", uni.count);
//     console.log("req.queryy", req.query); //name
//     const filter = {};

//     page = page !== undefined && page !== "" ? parseInt(page) : 1;
//     limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

//     if (name) {
//       filter.name = { $LIKE: name, $options: "gi" };
//     }

//     const total = uni.count;

//     if (page > Math.ceil(total / limit) && total > 0)
//       page = Math.ceil(total / limit);

//     //  console.log("filter",filter)
//     const faqs = await Applicants.findAll(
//       { $WHERE: filter },
//       { "$ORDER BY": { createdAt: -1 } },
//       { $offest: limit * (page - 1) },
//       { $LIMIT: limit }
//     );

//     return res.send({
//       success: true,
//       message: "Applicants fetched successfully",
//       data: {
//         faqs,
//         applicantDetail,
//         pagination: {
//           page,
//           limit,
//           total,
//           pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit),
//         },
//       },
//     });
//   } catch (err) {
//     res.send("programme Error " + err);
//   }
// };

exports.listApplicants = async (req, res, next) => {
  // console.log("req.query",req.query);
  console.log("hhhhhhhhiiiiiiiiiiiiiiiiiiiiiiiii saqib");
  try {
    const uni = await Applicants.findAndCountAll();
    let { page, limit, name } = req.query;

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

    console.log("filter", filter, page, limit);
    const faqs = await Applicants.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: ApplicationDetails,
          as: "ApplicationDetail",
          include: [
            {
              model: ApplicationModuleStatus,
              // as: "status",
              // foreignKey: "sssss",
            },
            Branch,
          ],
        },
      ],
    });

    return res.send({
      success: true,
      message: "Applicants fetched successfully",
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
    res.send("Applicants Error " + err);
  }
};

// // API to get a applicants
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const applicant = await Applicants.findByPk(id);
      // const applicationDetails = await ApplicationDetails.findAll({
      //   where: { ApplicantId: applicant.id },
      // });

      // applicant.dataValues.ApplicationDetails = applicationDetails;

      applicant.dataValues.programmeDetails = await ApplicationDetails.findOne({
        where: {
          ApplicantId: applicant.dataValues.id,
        },
      });

      if (applicant)
        return res.json({
          success: true,
          message: "applicant retrieved successfully",
          applicant,
        });
      else
        return res.status(400).send({
          success: false,
          message: "applicant not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "applicant Id is required" });
  } catch (error) {
    return next(error);
  }
};

//  api to edit applicant
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    // if (req.file) {
    //   const image = req.file;
    //   const fileUpload = req.file;
    //   payload[`image`] = image.filename;
    //   payload[`fileUpload`] = fileUpload.filename;

    //   // fileUpload
    // }
    if (req.files) {
      const image =
        req?.files?.image && req?.files?.image[0]
          ? req?.files?.image[0].filename
          : "";
      payload[`image`] = image;
    }

    if (req.file) {
      const fileUpload =
        req?.files?.fileUpload && req?.files?.fileUpload[0]
          ? req?.files?.fileUpload[0].filename
          : "";
      payload[`fileUpload`] = fileUpload;
    }
    // fileUpload
    // if (req.file) {
    //   const fileUpload = req.file;
    //   payload[`fileUpload`] = fileUpload.filename;
    // }
    const applicant = await Applicants.update(
      // Values to update

      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );

    let applicants = {
      applicationLevel: req.body.applicationLevel,
      interestedProgramme: req.body.interestedProgramme,
      schoolName: req.body.schoolName,
      qualificationType: req.body.qualificationType,
      selectUniversity: req.body.selectUniversity,
      completionLetter: req.body.completionLetter,
      programmeLevel: req.body.programmeLevel,
      healthForm: req.body.healthForm,
      paymentReceipt: req.body.paymentReceipt,
      researchProposal: req.body.researchProposal,
      refreeForm: req.body.refreeForm,
      medium: req.body.medium,
      scholorshipForm: req.body.scholorshipForm,
      otherDocuments: req.body.otherDocuments,
      attestationLetter: req.body.attestationLetter,
      releaseLetter: req.body.releaseLetter,
      status: req.body.status,
      ApplicantId: payload.id,
    };

    console.log("programmassss=>", applicants);
    applicants = ApplicationDetails.update(applicants, {
      where: {
        id: applicants.ApplicantId,
      },
    });

    await Activity.create({
      action: "applicant updated",
      name: req.body.Uname,
      role: req.body.role,
    });

    return res.send({
      success: true,
      message: "applicant updated successfully",
      applicant,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete applicant
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      await ApplicationDetails.destroy({
        where: { ApplicantId: id },
      });
      const applicant = await Applicants.destroy({ where: { id: id } });

      // <<<<< dawnsee
      await Activity.create({
        action: "applicant deleted",
        name: req.body.Uname,
        role: req.body.role,
      });
      /*
=======
      await Activity.create({ action: "applicant deleted", name: "samon", role: "superAdmin" });
>>> backend*/

      if (applicant)
        return res.send({
          success: true,
          message: "applicant Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "applicant Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "applicant Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await Applicants.findAndCountAll();
    let { page, limit } = req.query;
    let { name } = req.body;
    console.log("sdfsddfdsfdsfds", name);

    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.fullName = {
        [Op.like]: "%" + name + "%",
      };
    }

    const total = uni.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    console.log("filter", filter, page, limit);
    const faqs = await Applicants.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: ApplicationDetails,
          as: "ApplicationDetail",
          include: [
            {
              model: ApplicationModuleStatus,
              // as: "status",
              // foreignKey: "sssss",
            },
            Branch,
          ],
        },
      ],
    });

    return res.send({
      success: true,
      message: "Applicants fetched successfully",
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
    res.send("Applicants Error " + err);
  }
};
