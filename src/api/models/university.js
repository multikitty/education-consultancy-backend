"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      University.hasMany(models.Campus);
      University.hasMany(models.CommissionInvoice, {
        foreignKey: "universityID",
      });
      University.hasMany(models.Lead, {
        foreignKey: "universityID",
      });
    }
  }
  University.init(
    {
      logo: DataTypes.STRING,
      name: DataTypes.STRING,
      type: DataTypes.INTEGER,
      counserllerName: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      visaAppFee: DataTypes.INTEGER,
      addmissionFee: DataTypes.INTEGER,
      qetcFee: DataTypes.INTEGER,
      commisionDuration: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "University",
      tableName: "universities",
    }
  );
  return University;
};
