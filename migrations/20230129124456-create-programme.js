'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Programmes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      selectUniversity: {
        type: Sequelize.STRING
      },
      programmeLevel: {
        type: Sequelize.STRING
      },
      programmeIntake: {
        type: Sequelize.STRING
      },
      programmeDuration: {
        type: Sequelize.STRING
      },
      programmeCategory: {
        type: Sequelize.STRING
      },
      tutionFee: {
        type: Sequelize.INTEGER
      },
      otherFee: {
        type: Sequelize.INTEGER
      },
      engRequirement: {
        type: Sequelize.STRING
      },
      entryRequirement: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Programmes');
  }
};