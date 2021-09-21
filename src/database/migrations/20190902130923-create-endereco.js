'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Endereco', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      rua: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      numero: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      referencia: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      }, 
      telefone: {
        type: Sequelize.STRING,
        allowNull: true,        
      },      
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },      
    },{
      freezeTableName: true,
    });
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('Endereco');
  }
};
