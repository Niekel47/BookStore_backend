"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      fullname: DataTypes.TEXT,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      address: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("admin", "user"), 
        defaultValue: "user", 
      },
      phone: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("active", "inactive"), 
        defaultValue: "active", 
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
