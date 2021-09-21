'use strict';
const uuid = require('uuid/v4');
const sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Contratoimovel = sequelize.define('Contratoimovel', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },  
    data_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },   
    qtd_recibo:{
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
    debito_anterior: {
      type: DataTypes.FLOAT,
      allowNull: false,      
    },
    finalizado: {
      type: DataTypes.BOOLEAN,     
    },
    observacao: {
      type: DataTypes.STRING,
      allowNull: false,      
    },
    imovel_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    inquilino_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true
        }
    },
  }, {
    freezeTableName: true,    
    tableName: 'Contratoimovel',
  });

  Contratoimovel.associate = function(models) {
    Contratoimovel.belongsTo(models.Imovel, {
      onDelete: "CASCADE",
      foreignKey: 'imovel_id'
    });
    Contratoimovel.belongsTo(models.Inquilino, {
      onDelete: "CASCADE",
      foreignKey: 'inquilino_id'
    });
    Contratoimovel.hasMany(models.Recibocontrato, {
      onDelete: "CASCADE",
      foreignKey: 'contratoimovel_id'
    });
  };
  return Contratoimovel;
};
