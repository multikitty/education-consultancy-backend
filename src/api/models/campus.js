"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Campus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Campus.belongsTo(models.University), { foreignKey: "universityId" };
    }
  }
  Campus.init(
    {
      name: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      email: DataTypes.STRING,
      isMain: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Campus",
      tableName: "campuses",
    }
  );
  return Campus;
};
