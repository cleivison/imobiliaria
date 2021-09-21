'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
  const Imovel = sequelize.define('Imovel', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    codigo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    qtd_quartos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo quartos é obrigatório é obrigatório.'
        }
      }
    },
    qtd_banheiros: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo banheiros é obrigatório.'
        }
      }
    },
    qtd_suites: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo suites é obrigatório.'
        }
      }
    },
    qtd_garagem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'O campo garagens é obrigatório.'
        }
      }
    },
    finalidade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'O campo finalidade é obrigatório.'
          }
        }
      },
      preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'O campo preço é obrigatório.'
          }
        }
      },
      sobre: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'O campo sobre é obrigatório.'
          }
        }
      },
      destaque: {
        type: DataTypes.BOOLEAN,        
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
      tipoimovel_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'O campo tipo é obrigatório.'
          }
        }
      },
      proprietario_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'Obrigatório selecionar um proprietário.'
          }
        }
      },
  }, {
    freezeTableName: true,    
    tableName: 'Imovel',
  });

  Imovel.associate = function(models) {
    Imovel.belongsTo(models.Endereco, {
      onDelete: "CASCADE",
      foreignKey: 'endereco_id'
    });
    Imovel.belongsTo(models.Tipoimovel, {
      onDelete: "CASCADE",
      foreignKey: 'tipoimovel_id'
    });
    Imovel.belongsTo(models.Proprietario, {
      onDelete: "CASCADE",
      foreignKey: 'proprietario_id'
    });
    Imovel.hasMany(models.Contratoimovel, {
      onDelete: "CASCADE",
      foreignKey: 'imovel_id'
    });
  };
  return Imovel;
};
