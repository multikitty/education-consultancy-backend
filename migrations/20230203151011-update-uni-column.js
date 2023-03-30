'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.changeColumn('Universities', 'phone', {
      type: Sequelize.STRING,
      // defaultValue: 3.14,
      allowNull: true
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  // async up (queryInterface, Sequelize) => queryInterface.sequelize.transaction(async transaction => {
  //   await queryInterface.changeColumn('User', 'ip',
  //     {
  //       defaultValue: undefined,
  //     }, { transaction }
  //   );
  // })
  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.changeColumn('Universities', 'phone', {
      type: Sequelize.Number,
      // defaultValue: 3.14,
      allowNull: true
    });

  }
};
