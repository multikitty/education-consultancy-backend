"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("ProgrameDetails", "leadId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Leads",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

   await queryInterface.addColumn('ApplicationDetails', 'ApplicantId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Applicants',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.removeColumn("ProgrameDetails", "leadId");
     await queryInterface.removeColumn('ApplicationDetails', 'ApplicantId');

  },
};
