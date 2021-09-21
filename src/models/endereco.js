'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Endereco = sequelize.define('Endereco', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    rua: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo rua é obrigatório.'
        }
      }
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo bairro é obrigatório.'
        }
      }
    },
    referencia: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo cidade é obrigatório.'
        }
      }
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo estado é obrigatório.'
        }
      }
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true      
    },
  }, {
    freezeTableName: true,    
    tableName: 'Endereco',
  });

  Endereco.associate = function(models) {
    Endereco.hasOne(models.Proprietario, {
      foreignKey: 'endereco_id',
      onDelete: 'CASCADE',      
    });
    Endereco.hasOne(models.Inquilino, {
      foreignKey: 'endereco_id',
      onDelete: 'CASCADE',      
    });
  };
  return Endereco;
};
