'use strict';
const uuid = require('uuid/v4');
const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Recibocontrato = sequelize.define('Recibocontrato', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }, 
    data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    data_pagamento: {
      type: DataTypes.DATEONLY,            
    },
    parcela:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    valor_aluguel: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    dias_aluguel: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    multa_cl2: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    multa_cl24: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    taxa_agua: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    taxa_luz: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    servicos_adicionais: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    iptu_tcrsu: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    debito_anterior: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    pagamento: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    desconto: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    desconto_ir: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    observacoes: {
      type: DataTypes.STRING,
      allowNull: false,        
    },
    liquido: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    debito: {
      type: DataTypes.FLOAT,
      allowNull: false,        
    },
    contratoimovel_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },    
  }, {
    freezeTableName: true,    
    tableName: 'Recibocontrato',
  });

  Recibocontrato.associate = function(models) {
    Recibocontrato.belongsTo(models.Contratoimovel, {
      onDelete: "CASCADE",
      foreignKey: 'contratoimovel_id'
    });    
  };
  return Recibocontrato;
};
