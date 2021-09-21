'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
   
    return queryInterface.createTable('Proprietario', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      rg: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      dataNascimento: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      endereco_id: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        references: {
          model: 'Endereco',
          key: 'id'
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
    },{
      freezeTableName: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    
    return queryInterface.dropTable('Proprietario');
  }
};
