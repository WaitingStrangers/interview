'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * 删除Interview表中的newData字段
     */
    await queryInterface.removeColumn('Interview', 'newData');
  },

  async down (queryInterface, Sequelize) {
    /**
     * 恢复Interview表中的newData字段
     */
    await queryInterface.addColumn('Interview', 'newData', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
