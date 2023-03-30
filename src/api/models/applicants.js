"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Applicants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Applicants.hasOne(models.ApplicationDetails);
      // University.hasMany(models.Campus);
    }
  }
  Applicants.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      country: DataTypes.STRING,
      image: DataTypes.STRING,
      passportNo: DataTypes.STRING,
      fileUpload: DataTypes.STRING,
      // applicantsId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Applicants",
      tableName: "applicants",
    }
  );
  return Applicants;
};
