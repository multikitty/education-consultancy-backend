"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Programme.hasMany(models.Lead, {
        foreignKey: "programID",
      });
      Programme.belongsTo(models.ProgramLevel, {
        foreignKey: "programmeLevel",
      });
    }
  }
  Programme.init(
    {
      name: DataTypes.STRING,
      selectUniversity: DataTypes.STRING,
      programmeLevel: DataTypes.STRING,
      programmeIntake: DataTypes.STRING,
      programmeDuration: DataTypes.STRING,
      programmeCategory: DataTypes.STRING,
      tutionFee: DataTypes.INTEGER,
      otherFee: DataTypes.INTEGER,
      engRequirement: DataTypes.STRING,
      entryRequirement: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Programme",
      tableName: "programmes",
    }
  );
  return Programme;
};
