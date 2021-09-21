const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authConfig = require('../config/auth');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          isEmail: true,
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
    }, {
      freezeTableName: true,    
      tableName: 'User',
      
    });
    
    User.prototype.compareHash = function(password) {
        
        return bcrypt.compare(password, this.password);
    }

    User.prototype.generateToken = function(duration = "24h") {
        return jwt.sign({ id: this.id }, authConfig.secret, {
                   expiresIn: duration
        })
    }
    User.beforeCreate(function(user, options) {
        return bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
        })
        .catch(err => { 
            throw new Error(); 
        });
    });

    User.beforeUpdate(function(user, options) {
      return bcrypt.hash(user.password, 10)
      .then(hash => {
          user.password = hash;
      })
      .catch(err => { 
          throw new Error(); 
      });
    });

return User
};
