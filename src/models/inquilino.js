'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Inquilino = sequelize.define('Inquilino', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        msg: 'O campo nome é obrigatório.'
      }
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false,
        msg: 'O campo rg é obrigatório.'
      }
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        msg: 'O campo cpf é obrigatório.'
      }
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
        msg: 'O campo data nascimento é obrigatório.'
      }
    },
    endereco_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true,
        msg: 'O campo endereco é obrigatório.'
      }
    },
  }, {
    freezeTableName: true,    
    tableName: 'Inquilino',
  });

  Inquilino.associate = function(models) {
    Inquilino.belongsTo(models.Endereco, {
      onDelete: "CASCADE",
      foreignKey: 'endereco_id'
    });
    Inquilino.hasMany(models.Contratoimovel, {
      onDelete: "CASCADE",
      foreignKey: 'inquilino_id'
    });
  };
  return Inquilino;
};
