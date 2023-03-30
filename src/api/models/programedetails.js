"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProgrameDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgrameDetails.belongsTo(models.LeadsManagmentModuleStatus, {
        foreignKey: "status",
      });
      ProgrameDetails.belongsTo(models.Lead, {
        foreignKey: "leadId",
        as: "ProgrameDetail",
      });
      // ProgrameDetails.belongsTo(models.LeadsManagmentModuleStatus);
      // ProgrameDetails.hasOne(models.LeadsManagmentModuleStatus);
    }
  }
  ProgrameDetails.init(
    {
      schoolName: DataTypes.STRING,
      qualificationType: DataTypes.STRING,
      selectUniversity: DataTypes.STRING,
      interestedProgramme: DataTypes.STRING,
      // status: DataTypes.STRING,
      // status: DataTypes.INTEGER, // Add this line
      cert: DataTypes.STRING,
      comments: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProgrameDetails",
      tableName: "programedetails",
    }
  );
  return ProgrameDetails;
};
