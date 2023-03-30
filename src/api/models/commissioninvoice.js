"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CommissionInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommissionInvoice.belongsTo(models.University, {
        foreignKey: "universityID",
      });
      CommissionInvoice.belongsTo(models.InvoiceModuleStatus, {
        foreignKey: "statusID",
      });
      CommissionInvoice.belongsTo(models.Branch, {
        foreignKey: "branchID",
      });
      CommissionInvoice.belongsTo(models.BillingInfo, {
        foreignKey: "billingID",
      });
      CommissionInvoice.belongsTo(models.MailingInfo, {
        foreignKey: "mailingID",
      });
      CommissionInvoice.hasMany(models.CommissionInvoiceItem, {
        foreignKey: "invoiceID",
      });
    }
  }
  CommissionInvoice.init(
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
      },
      amount: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: true,
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
        defaultValue: "commission", // or general
      },
    },
    {
      sequelize,
      modelName: "CommissionInvoice",
      tableName: "CommissionInvoice".toLowerCase(),
    }
  );
  // const level = await CommissionInvoice.findAll();
  return CommissionInvoice;
};
