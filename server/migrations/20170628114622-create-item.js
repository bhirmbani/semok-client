'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      base: {
        type: Sequelize.DECIMAL,
      },
      stretch: {
        type: Sequelize.DECIMAL,
      },
      description: {
        type: Sequelize.STRING
      },
      CategoryId: {
        type: Sequelize.INTEGER
      },
      createdBy: {
        type: Sequelize.STRING
      },
      currentVal: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('red', 'green', 'star'),
        defaultValue: 'red',
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
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Items');
  }
};