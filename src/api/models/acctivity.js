"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Activity.hasOne(models.Users, { foreignKey: "userId" });
      Activity.belongsTo(models.Users, { foreignKey: "userID" });
    }
  }
  Activity.init(
    {
      action: DataTypes.STRING,
      name: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Activity",
      tableName: "activities",
    }
  );
  return Activity;
};
