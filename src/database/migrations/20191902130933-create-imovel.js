'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
  
    return queryInterface.createTable('Imovel', { 
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      codigo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      qtd_quartos: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      qtd_banheiros: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      qtd_suites: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      qtd_garagem: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      finalidade: {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        preco: {
          type: Sequelize.FLOAT,
          allowNull: false,
          validate: {
            notEmpty: true
          }
        },
        sobre: {
          type: Sequelize.TEXT,
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
        tipoimovel_id: {
          type: Sequelize.UUID,
          allowNull: false,
          validate: {
            notEmpty: true
          },
          references: {
            model: 'Tipoimovel',
            key: 'id'
          }
        },
        proprietario_id: {
          type: Sequelize.UUID,
          allowNull: false,
          validate: {
            notEmpty: true
          },
          references: {
            model: 'Proprietario',
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
    },
    {
      freezeTableName: true,
    });
    
  },

  down: (queryInterface, Sequelize) => {
  
    return queryInterface.dropTable('Imovel');
  }
};
