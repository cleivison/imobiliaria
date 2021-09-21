'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Tipoimovel = sequelize.define('Tipoimovel', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo descrição é obrigatório.'
        }
      }
    },
  }, {
    freezeTableName: true,    
    tableName: 'Tipoimovel',
  });

  Tipoimovel.associate = function(models) {
    Tipoimovel.hasMany(models.Imovel, {
      onDelete: "CASCADE",
      foreignKey: 'tipoimovel_id'
    });
  };
  return Tipoimovel;
};
