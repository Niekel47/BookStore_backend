"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Author, {
        foreignKey: "AuthorId",
      });
      Product.belongsTo(models.Publisher, {
        foreignKey: "PublisherId",
      });
      Product.belongsToMany(models.Category, {
        through: "Product_Category",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      AuthorId: DataTypes.UUID,
      PublisherId: DataTypes.UUID,
      CategoryId: DataTypes.UUID,
      name: DataTypes.TEXT,
      image: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
