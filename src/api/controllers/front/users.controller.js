const db = require("../../models");
const Users = db.Users;
const Lead = db.Lead;
const ProgrammeDetails = db.ProgrameDetails;
const Activity = db.Activity;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// create Branch
exports.create = async (req, res, next) => {
  try {
    let payload = req.body;
    console.log(bcrypt.hashSync(req.body.password, 10));

    payload.password = bcrypt.hashSync(req.body.password, 10);
    //save the branch in db
    let user = await Users.create(payload);

    await Activity.create({ action: "User created", name: payload.Uname, role: payload.Urole });

    return res.json({
      success: true,
      data: user,
      message: "user created successfully",
    });
  } catch (err) {
    next();
  }
};

// list users
exports.list = async (req, res, next) => {
  try {
    const user = await Users.findAndCountAll();
    let { page, limit, name } = req.query;
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = { $LIKE: name, $options: "gi" };
    }

    const total = user.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    const faqs = await Users.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(user);
    return res.send({
      success: true,
      message: "users fetched successfully",
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
    res.send("User  Error " + err);
  }
  // next();
};

// API to edit branch
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const image = req?.file?.filename;
      payload[`image`] = image;
    }
    if(payload.password) {
      payload.password = bcrypt.hashSync(req.body.password, 10);
    }
    const user = await Users.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: req.body.id
        },
      }
    );
    await Activity.create({ action: "User updated", name: payload.Uname, role: payload.role });

    return res.send({
      success: true,
      message: "user updated successfully",
      user,
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
      const user = await Users.destroy({ where: { id: id } });
      await Activity.create({ action: "User deleted", name: "samon", role: "superAdmin" });

      if (user)
        return res.send({
          success: true,
          message: "user  deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "user  not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "user Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get  by id a branch
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await Users.findByPk(id);

      if (user)
        return res.json({
          success: true,
          message: "user retrieved successfully",
          user,
        });
      else
        return res.status(400).send({
          success: false,
          message: "user not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "user Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API login

exports.login = async (req, res) => {
  try {
    if (req.body.state == 0) {
      const user = await Users.findOne({
        where: {
          email: req.body.mail,
        },
      });

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "Invalid Password!",
        });
      }

      await Activity.create({ action: "User logged in", name: user.name, role: user.role });


      const token = jwt.sign({ id: user.email }, "JWT_SECRET", {
        expiresIn: 86400, // 24 hours
      });


      return res.status(200).send({
        ...user
      });
    } else {
      const lead = await Lead.findOne({
        where: {
          email: req.body.mail,
        },
      });
      
      // console.log("lead id ==>", lead.dataValues.id);
      // const programeTable = await ProgrammeDetails.findByPk(id);
      // lead.dataValues.programmeDetails = await ProgrammeDetails.findOne({
        //   where: {
      //     leadId: lead.dataValues.id,
      //   },
      //   // include: [
        //   //   {
          //   //     model: ProgrammeDetails,
          //   //     as: "ProgrameDetail",
          //   //   },
      //   // ],
      // });
      // console.log(">>>>>>>>>>>.\n\n\n\n\n\n>>>>>>>>>>>\n\n", lead);
      if (lead) {
        console.log("111>>>>>>>>>>>.\n\n\n\n\n\n>>>>>>>>>>>\n\n", lead);
        return res.json({
          success: true,
          message: "lead retrieved successfully",
          ...lead,
          // programeTable,
        });


      }
      else {
        return res.status(400).send({
          success: false,
          message: "lead not found for given Id",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    if (req.body.username && req.body.mail && req.body.password) {
      const user = await Users.create({
        name: req.body.username,
        email: req.body.mail,
        password: bcrypt.hashSync(req.body.password, 8),
        role: "user"
      });
      if (user)
        res.send({ message: "User registered successfully!" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  // Save User to Database
  try {
    await Activity.create({ action: "User logged out", name: req.body.name, role: req.body.role });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.search = async (req, res, next) => {
  try {
    const user = await Users.findAndCountAll();
    let { page, limit} = req.query;
    let { name } = req.body;
    const filter = {};

    page = page !== undefined && page !== "" ? parseInt(page) : 1;
    limit = limit !== undefined && limit !== "" ? parseInt(limit) : 10;

    if (name) {
      filter.name = {
        [Op.like]: "%" + name + "%",
      };
    }

    const total = user.count;

    if (page > Math.ceil(total / limit) && total > 0)
      page = Math.ceil(total / limit);

    const faqs = await Users.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
    });
    console.log("faqs", faqs);
    // res.send(user);
    return res.send({
      success: true,
      message: "users fetched successfully",
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
    res.send("User  Error " + err);
  }
}

exports.getUser = async (req, res) => {
  try {
    if (req.body.state == 0) {
      if(req.body.role !== "leads") {
        const user = await Users.findOne({
          where: {
            name: req.body.name,
            role: req.body.role
          },
        });
  
        return res.status(200).send({
          ...user
        });
      }
      else {
        const lead = await Lead.findOne({
          where: {
            name: req.body.name,
          },
        });
        return res.status(200).send({
          ...lead
        });
      }
    } else {
      const lead = await Lead.findOne({
        where: {
          email: req.body.mail,
        },
      });
      
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
      console.log(">>>>>>>>>>>.\n\n\n\n\n\n>>>>>>>>>>>\n\n", lead);
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
    }

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

