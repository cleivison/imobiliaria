'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Recibocontrato', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },    
      data_vencimento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      data_pagamento: {
        type: Sequelize.DATEONLY,        
      },
      parcela:{
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
      dias_aluguel: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      multa_cl2: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      multa_cl24: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      taxa_agua: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      taxa_luz: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      servicos_adicionais: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      iptu_tcrsu: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      debito_anterior: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      pagamento: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      desconto: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      desconto_ir: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      observacoes: {
        type: Sequelize.STRING,
        allowNull: false,        
      },
      liquido: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      debito: {
        type: Sequelize.FLOAT,
        allowNull: false,        
      },
      contratoimovel_id: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          notEmpty: true
        },
        references: {
          model: 'Contratoimovel',
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
    return queryInterface.dropTable('Recibocontrato');
  }
};
