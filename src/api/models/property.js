"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Property.init(
    {
      //4 program level 5 Program Category 6 Qualificaton type 7 university type 8 LeadGroup 9 intreseted program
      type: DataTypes.INTEGER, //1 application status //2 lead status 3 invoice status
      property: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Property",
      tableName: "properties",
    }
  );
  return Property;
};
