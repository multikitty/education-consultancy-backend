"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ApplicationDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ApplicationDetails.belongsTo(models.Applicants);
      ApplicationDetails.belongsTo(models.ApplicationModuleStatus, {
        foreignKey: "status",
      });
      ApplicationDetails.belongsTo(models.Branch, {
        foreignKey: "branchID",
      });
    }
  }
  ApplicationDetails.init(
    {
      applicationLevel: DataTypes.STRING,
      interestedProgramme: DataTypes.STRING,
      schoolName: DataTypes.STRING,
      qualificationType: DataTypes.STRING,
      selectUniversity: DataTypes.STRING,
      completionLetter: DataTypes.STRING,
      programmeLevel: DataTypes.STRING,
      healthForm: DataTypes.STRING,
      paymentReceipt: DataTypes.STRING,
      researchProposal: DataTypes.STRING,
      refreeForm: DataTypes.STRING,
      medium: DataTypes.STRING,
      scholorshipForm: DataTypes.STRING,
      otherDocuments: DataTypes.STRING,
      attestationLetter: DataTypes.STRING,
      releaseLetter: DataTypes.STRING,
      status: DataTypes.STRING,
      // applicantsId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "ApplicationDetails",
      tableName: "applicationdetails",
    }
  );
  return ApplicationDetails;
};
