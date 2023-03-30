"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GeneralInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GeneralInvoice.belongsTo(models.University, {
        foreignKey: "universityID",
      });
      GeneralInvoice.belongsTo(models.InvoiceModuleStatus, {
        foreignKey: "statusID",
      });
      GeneralInvoice.belongsTo(models.Branch, {
        foreignKey: "branchID",
      });
      GeneralInvoice.belongsTo(models.BillingInfo, {
        foreignKey: "billingID",
      });
      GeneralInvoice.belongsTo(models.MailingInfo, {
        foreignKey: "mailingID",
      });
      GeneralInvoice.hasMany(models.GeneralInvoiceItem, {
        foreignKey: "invoiceID",
      });
    }
  }
  GeneralInvoice.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      itemdate: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      recipient: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "*@*",
      },
      service: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      statusID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: Math.floor(Math.random() * 4 + 1),
      },
      universityID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: Math.floor(Math.random() * 4 + 1),
      },
      branchID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: Math.floor(Math.random() * 4 + 1),
      },
      billingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: Math.floor(Math.random() * 4 + 1),
      },
      mailingID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: Math.floor(Math.random() * 4 + 1),
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "general", // or general
      },
    },
    {
      sequelize,
      modelName: "GeneralInvoice",
      tableName: "GeneralInvoice".toLowerCase(),
    }
  );
  // const level = await GeneralInvoice.findAll();
  return GeneralInvoice;
};
