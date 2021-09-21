'use strict';
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contratoimovel', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },    
      data_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },      
      qtd_recibo:{
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      valor_aluguel: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      debito_anterior: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      observacao: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imovel_id: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        references: {
          model: 'Imovel',
          key: 'id'
        }
      },
      inquilino_id: {
          type: Sequelize.UUID,
          allowNull: false,
          validate: {
            notEmpty: true
          },
          references: {
            model: 'Inquilino',
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
  
      return queryInterface.dropTable('Contratoimovel');
  }
};
