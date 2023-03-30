const db = require("../../models");
const University = db.University;
const Campus = db.Campus;
const Activity = db.Activity;

var Sequelize = require("sequelize");
const Op = Sequelize.Op;

// create university
exports.create = async (req, res, next) => {
  try {
    console.log("REq.body", req.body);
    console.log("req file", req.file);
    //create new record in db
    let university = {
      image: req?.file?.filename,
      logo: req?.file?.filename,
      name: req.body.name,
      type: req.body.type,
      counserllerName: req.body.counserllerName,
      phone: req.body.phone,
      email: req.body.email,
      visaAppFee: req.body.visaAppFee,
      addmissionFee: req.body.addmissionFee,
      qetcFee: req.body.qetcFee,
      commisionDuration: req.body.commisionDuration,
    };
    university = await University.create(university);
    console.log("universityId", university.dataValues.id);
    console.log("campuss", req.body.campuses);

    let newArr = JSON.parse(req.body.campuses);
    await newArr.map(async (ele, ind) => {
      // await callAsynchronousOperation(item);
      let campus = {
        name: ele.name,
        address1: ele.address1,
        address2: ele.address2,
        phone: ele.phone,
        email: ele.email,
        // isMain: ele.isMain,
        UniversityId: university.dataValues.id,
      };
      await Campus.create(campus);
    });
    
    // for(var i = 0; i < newArr.length; i++) {
    //   let campus = {
    //     name: newArr[i].name,
    //     address1: newArr[i].address1,
    //     address2: newArr[i].address2,
    //     phone: newArr[i].phone,
    //     email: newArr[i].email,
    //     UniversityId: university.dataValues.id,
    //   };
    //   await Campus.create(campus);
    // }
    // let length = newArr.length;
    // await Campus.create({
    //   name: newArr[length-1].name,
    //   address1: newArr[length-1].address1,
    //   address2: newArr[length-1].address2,
    //   phone: newArr[length-1].phone,
    //   email: newArr[length-1].email,
    //   isMain: newArr[length-1].isMain,
    //   UniversityId: university.dataValues.id,
    // });
    // if(newArr[1]) {
    //   Campus.create({
    //     name: newArr[1].name,
    //     address1: newArr[1].address1,
    //     address2: newArr[1].address2,
    //     phone: newArr[1].phone,
    //     email: newArr[1].email,
    //     isMain: newArr[1].isMain,
    //     UniversityId: university.dataValues.id,
    //   });
    // }
    

    await Activity.create({ action: "New University Created", name: req.body.Uname, role: req.body.role });
    return res.send({
      success: true,
      data: university,
      message: "university created successful",
    });
  } catch (err) {
    console.log("Error handling =>", err);
    next();
  }
};

exports.listUniversity = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await University.findAndCountAll();
    let { page, limit, name } = req.query;

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

    const faqs = await University.findAll({
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: Campus,
          as: "Campuses",
        },
      ],
    });

    return res.send({
      success: true,
      message: "Universities fetched successfully",
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
    res.send("University Error " + err);
  }
};

// API to edit University
exports.edit = async (req, res, next) => {
  try {
    let payload = req.body;
    if (req.file) {
      const image = req?.file?.filename;
      payload[`logo`] = image;
    }
    console.log("payload", req.file, req.file);
    const university = await University.update(
      // Values to update
      payload,
      {
        // Clause
        where: {
          id: payload.id,
        },
      }
    );

    const newArr = JSON.parse(req.body.campuses);
    console.log(payload, newArr);
    const mappedArr = newArr.map(async (ele, ind) => {
      if(!ele.id) {
        let campus = {
          name: ele.name,
          address1: ele.address1,
          address2: ele.address2,
          phone: ele.phone,
          email: ele.email,
          isMain: ele.isMain,
          UniversityId: payload.id,
        };
        await Campus.create(campus);
      } else {
        let campus = {
          name: ele.name,
          address1: ele.address1,
          address2: ele.address2,
          phone: ele.phone,
          email: ele.email,
          isMain: ele.isMain,
          UniversityId: payload.id,
        };
        
        console.log("campssssssssa", campus);
        campus = await Campus.update(
          // Values to update
          campus,
          {
            // Clause
            where: {
              id: ele.id,
            },
          }
        );
      }
      });
      

    await Activity.create({ action: "University updated", name: req.body.Uname, role: req.body.role });
    return res.send({
      success: true,
      message: "University updated successfully",
      university,
    });
  } catch (error) {
    return next(error);
  }
};

// API to delete university
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const university = await University.destroy({ where: { id: id } });
      const campuses = await Campus.destroy({
        where: { UniversityId: id },
      });

      await Activity.create({ action: "University deleted", name: "samon", role: "superAdmin" });
      if (university)
        return res.send({
          success: true,
          message: "university Page deleted successfully",
          id,
        });
      else
        return res.status(400).send({
          success: false,
          message: "university Page not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "university Id is required" });
  } catch (error) {
    return next(error);
  }
};

// API to get a University
exports.get = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const university = await University.findByPk(id);
      const campuses = await Campus.findAll({
        where: { UniversityId: university.id },
      });

      university.dataValues.campuses = campuses;

      if (university)
        return res.json({
          success: true,
          message: "university retrieved successfully",
          university,
        });
      else
        return res.status(400).send({
          success: false,
          message: "University not found for given Id",
        });
    } else
      return res
        .status(400)
        .send({ success: false, message: "University Id is required" });
  } catch (error) {
    return next(error);
  }
};

exports.search = async (req, res, next) => {
  // console.log("req.query",req.query);
  try {
    const uni = await University.findAndCountAll();
    let { page, limit } = req.query;
    let { name } = req.body;

    console.log(req.body);

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

    const faqs = await University.findAll({
      // where: {
      //   name: req.body.name
      // },
      order: [["updatedAt", "DESC"]],
      offset: limit * (page - 1),
      limit: limit,
      where: filter,
      include: [
        {
          model: Campus,
          as: "Campuses",
        },
      ],
    });

    return res.send({
      success: true,
      message: "Universities fetched successfully",
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
    res.send("University Error " + err);
  }
};
