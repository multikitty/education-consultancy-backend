"use strict";

const { Model } = require("sequelize");
// const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LeadsManagmentModuleStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // LeadsManagmentModuleStatus.belongsTo(models.ProgrameDetails, {
      //   foreignKey: "I",
      // });
      // }
      LeadsManagmentModuleStatus.hasMany(models.ProgrameDetails, {
        foreignKey: "status",
      });
      // edits
      LeadsManagmentModuleStatus.hasMany(models.Lead, {
        foreignKey: "statusID",
      });
      //
      // LeadsManagmentModuleStatus.belongsToMany(models.ProgrameDetails, {
      //   foreignKey: "status",
      // });
    }
  }
  LeadsManagmentModuleStatus.init(
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
      },
      Color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LeadsManagmentModuleStatus",
      tableName: "LeadsManagmentModuleStatus".toLowerCase(),
    }
  );
  // const level = await LeadsManagmentModuleStatus.findAll();
  return LeadsManagmentModuleStatus;
};
