"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     */
    await queryInterface.bulkInsert(
      "Roles",
      [
        //super admin
        {
          title: "Super Admin",

          addUni: true,
          editUni: true,
          deleteUni: true,
          viewUni: true,

          addUProgram: true,
          editUProgram: true,
          deleteUProgram: true,
          viewUProgram: true,

          addLeads: true,
          editLeads: true,
          deleteLeads: true,
          viewLeads: true,

          addApplication: true,
          editApplication: true,
          deleteApplication: true,
          viewApplication: true,

          addApplicationStatus: true,
          editApplicationStatus: true,
          deleteApplicationStatus: true,
          viewApplicationStatus: true,

          addInvCommission: true,
          editInvCommission: true,
          deleteInvCommission: true,
          viewInvCommission: true,

          addInvGeneral: true,
          editInvGeneral: true,
          deleteInvGeneral: true,
          viewInvGeneral: true,

          addAccounting: true,
          editAccounting: true,
          deleteAccounting: true,
          viewAccounting: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        //admin HQ
        {
          title: "Admin HQ",

          addUni: true,
          editUni: true,
          deleteUni: true,
          viewUni: true,

          addUProgram: true,
          editUProgram: true,
          deleteUProgram: true,
          viewUProgram: true,

          addLeads: true,
          editLeads: true,
          deleteLeads: true,
          viewLeads: true,

          addApplication: true,
          editApplication: true,
          deleteApplication: true,
          viewApplication: true,

          addApplicationStatus: true,
          editApplicationStatus: true,
          deleteApplicationStatus: true,
          viewApplicationStatus: true,

          addInvCommission: true,
          editInvCommission: true,
          deleteInvCommission: true,
          viewInvCommission: true,

          addInvGeneral: true,
          editInvGeneral: true,
          deleteInvGeneral: true,
          viewInvGeneral: true,

          addAccounting: true,
          editAccounting: true,
          deleteAccounting: true,
          viewAccounting: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        //Counselor HQ
        {
          title: "Counselor HQ",

          addUni: true,
          editUni: true,
          deleteUni: false,
          viewUni: true,

          addUProgram: true,
          editUProgram: true,
          deleteUProgram: false,
          viewUProgram: true,

          addLeads: true,
          editLeads: true,
          deleteLeads: false,
          viewLeads: true,

          addApplication: true,
          editApplication: true,
          deleteApplication: false,
          viewApplication: true,

          addApplicationStatus: true,
          editApplicationStatus: true,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: false,
          editInvCommission: false,
          deleteInvCommission: false,
          viewInvCommission: false,

          addInvGeneral: false,
          editInvGeneral: false,
          deleteInvGeneral: false,
          viewInvGeneral: false,

          addAccounting: false,
          editAccounting: false,
          deleteAccounting: false,
          viewAccounting: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        //Acountant HQ
        {
          title: "Acountant HQ",

          addUni: false,
          editUni: false,
          deleteUni: false,
          viewUni: false,

          addUProgram: false,
          editUProgram: false,
          deleteUProgram: false,
          viewUProgram: false,

          addLeads: false,
          editLeads: false,
          deleteLeads: false,
          viewLeads: false,

          addApplication: false,
          editApplication: false,
          deleteApplication: false,
          viewApplication: true,

          addApplicationStatus: false,
          editApplicationStatus: false,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: true,
          editInvCommission: true,
          deleteInvCommission: true,
          viewInvCommission: true,

          addInvGeneral: true,
          editInvGeneral: true,
          deleteInvGeneral: true,
          viewInvGeneral: true,

          addAccounting: true,
          editAccounting: true,
          deleteAccounting: true,
          viewAccounting: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        //Admin Branch
        {
          title: "Admin Branch",

          addUni: false,
          editUni: false,
          deleteUni: false,
          viewUni: true,

          addUProgram: false,
          editUProgram: false,
          deleteUProgram: false,
          viewUProgram: true,

          addLeads: true,
          editLeads: true,
          deleteLeads: true,
          viewLeads: true,

          addApplication: true,
          editApplication: true,
          deleteApplication: true,
          viewApplication: true,

          addApplicationStatus: false,
          editApplicationStatus: false,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: false,
          editInvCommission: false,
          deleteInvCommission: false,
          viewInvCommission: false,

          addInvGeneral: true,
          editInvGeneral: true,
          deleteInvGeneral: true,
          viewInvGeneral: true,

          addAccounting: true,
          editAccounting: true,
          deleteAccounting: true,
          viewAccounting: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        //Counselor Branch
        {
          title: "Counselor Branch",

          addUni: false,
          editUni: false,
          deleteUni: false,
          viewUni: true,

          addUProgram: false,
          editUProgram: false,
          deleteUProgram: false,
          viewUProgram: true,

          addLeads: true,
          editLeads: true,
          deleteLeads: false,
          viewLeads: true,

          addApplication: true,
          editApplication: true,
          deleteApplication: false,
          viewApplication: true,

          addApplicationStatus: false,
          editApplicationStatus: false,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: false,
          editInvCommission: false,
          deleteInvCommission: false,
          viewInvCommission: false,

          addInvGeneral: false,
          editInvGeneral: false,
          deleteInvGeneral: false,
          viewInvGeneral: false,

          addAccounting: false,
          editAccounting: false,
          deleteAccounting: false,
          viewAccounting: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        //Accountant Branch
        {
          title: "Accountant Branch",

          addUni: false,
          editUni: false,
          deleteUni: false,
          viewUni: false,

          addUProgram: false,
          editUProgram: false,
          deleteUProgram: false,
          viewUProgram: false,

          addLeads: false,
          editLeads: false,
          deleteLeads: false,
          viewLeads: false,

          addApplication: false,
          editApplication: false,
          deleteApplication: false,
          viewApplication: true,

          addApplicationStatus: false,
          editApplicationStatus: false,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: false,
          editInvCommission: false,
          deleteInvCommission: false,
          viewInvCommission: false,

          addInvGeneral: true,
          editInvGeneral: true,
          deleteInvGeneral: true,
          viewInvGeneral: true,

          addAccounting: true,
          editAccounting: true,
          deleteAccounting: true,
          viewAccounting: true,

          createdAt: new Date(),
          updatedAt: new Date(),
        },

        //Accountant
        {
          title: "Applicant",

          addUni: false,
          editUni: false,
          deleteUni: false,
          viewUni: true,

          addUProgram: false,
          editUProgram: false,
          deleteUProgram: false,
          viewUProgram: true,

          addLeads: false,
          editLeads: false,
          deleteLeads: false,
          viewLeads: true,

          addApplication: false,
          editApplication: false,
          deleteApplication: false,
          viewApplication: true,

          addApplicationStatus: false,
          editApplicationStatus: false,
          deleteApplicationStatus: false,
          viewApplicationStatus: true,

          addInvCommission: false,
          editInvCommission: false,
          deleteInvCommission: false,
          viewInvCommission: true,

          addInvGeneral: false,
          editInvGeneral: false,
          deleteInvGeneral: false,
          viewInvGeneral: true,

          addAccounting: false,
          editAccounting: false,
          deleteAccounting: false,
          viewAccounting: true,

          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * */
    await queryInterface.bulkDelete("Roles", null, {});
  },
};
