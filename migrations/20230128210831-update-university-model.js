"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn("Universities", "utype", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "counserllerName", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "phone", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "email", {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // });
    // //
    // await queryInterface.addColumn("Universities", "visaAppFee", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "addmissionFee", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "qetcFee", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
    // await queryInterface.addColumn("Universities", "commisionDuration", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    // });
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.removeColumn("Universities", "utype");
    // await queryInterface.removeColumn("Universities", "counserllerName");
    // await queryInterface.removeColumn("Universities", "phone");
    // await queryInterface.removeColumn("Universities", "email");
    // //
    // await queryInterface.removeColumn("Universities", "visaAppFee");
    // await queryInterface.removeColumn("Universities", "addmissionFee");
    // await queryInterface.removeColumn("Universities", "qetcFee");
    // await queryInterface.removeColumn("Universities", "commisionDuration");
  },
};

// visaAppFee: DataTypes.INTEGER,
// addmissionFee: DataTypes.INTEGER,
// qetcFee: DataTypes.INTEGER,
// commisionDuration: DataTypes.INTEGER
