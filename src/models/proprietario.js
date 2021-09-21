'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Proprietario = sequelize.define('Proprietario', {
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
        notEmpty: {
          args: true,
          msg: 'O campo nome é obrigatório.'
        }
      }
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: false,  
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo cpf é obrigatório.'
        }
      }
    },
    dataNascimento: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo data de nascimento é obrigatório.'
        }
      }
    },
    endereco_id: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O endereço é obrigatório.'
        }
      }
    },
  }, {
    freezeTableName: true,    
    tableName: 'Proprietario',
  });

  Proprietario.associate = function(models) {
    Proprietario.belongsTo(models.Endereco, {
      onDelete: "CASCADE",
      foreignKey: 'endereco_id'
    });
    Proprietario.hasMany(models.Imovel, {
      onDelete: "CASCADE",
      foreignKey: 'proprietario_id'
    });
  };
  return Proprietario;
};
