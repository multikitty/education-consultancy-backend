'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ApplicationDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      applicationLevel: {
        type: Sequelize.STRING
      },
      interestedProgramme: {
        type: Sequelize.STRING
      },
      schoolName: {
        type: Sequelize.STRING
      },
      qualificationType: {
        type: Sequelize.STRING
      },
      selectUniversity: {
        type: Sequelize.STRING
      },
      completionLetter: {
        type: Sequelize.STRING
      },
      programmeLevel: {
        type: Sequelize.STRING
      },
      healthForm: {
        type: Sequelize.STRING
      },
      paymentReceipt: {
        type: Sequelize.STRING
      },
      researchProposal: {
        type: Sequelize.STRING
      },
      refreeForm: {
        type: Sequelize.STRING
      },
      medium: {
        type: Sequelize.STRING
      },
      scholorshipForm: {
        type: Sequelize.STRING
      },
      otherDocuments: {
        type: Sequelize.STRING
      },
      attestationLetter: {
        type: Sequelize.STRING
      },
      releaseLetter: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('ApplicationDetails');
  }
};