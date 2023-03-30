"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GeneralInvoiceItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GeneralInvoiceItem.belongsTo(models.GeneralInvoice, {
        foreignKey: "invoiceID",
      });
    }
  }
  GeneralInvoiceItem.init(
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
      modelName: "GeneralInvoiceItem",
      tableName: "GeneralInvoiceItem".toLowerCase(),
    }
  );
  // const level = await GeneralInvoiceItem.findAll();
  return GeneralInvoiceItem;
};
