"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommissionInvoiceItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommissionInvoiceItem.belongsTo(models.CommissionInvoice, {
        foreignKey: "invoiceID",
      });
    }
  }
  CommissionInvoiceItem.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      total: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      invoiceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "CommissionInvoiceItem",
      tableName: "CommissionInvoiceItem".toLowerCase(),
    }
  );
  // const level = await CommissionInvoiceItem.findAll();
  return CommissionInvoiceItem;
};
