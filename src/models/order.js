"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);
      Order.belongsToMany(models.Product, { through: "OrderProduct" });
      Order.hasMany(models.Rate, { foreignKey: "OrderId" });
      Order.hasMany(models.OrderProduct, { foreignKey: "OrderId" });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      payment: DataTypes.STRING,
      status: DataTypes.INTEGER,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      total: DataTypes.FLOAT,
      UserId: DataTypes.UUID,
      transactionId: DataTypes.STRING, // trường này lưu transaction_id từ PayPal
      sessionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
