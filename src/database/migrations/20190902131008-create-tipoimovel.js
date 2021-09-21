'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.createTable('Tipoimovel', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      descricao: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },      
    },
    {
      freezeTableName: true,
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('Tipoimovel');
  }
};
