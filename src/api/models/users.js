"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Users.belongsTo(models.Activity), { foreignKey: "userId" };
      // Users.belongsTo(models.Roles), { foreignKey: "roleId" };
      Users.belongsTo(models.Branch, { foreignKey: "branchID" });
      Users.hasMany(models.Activity, {
        foreignKey: "userID",
      });
    }
  }
  Users.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      [`number`]: DataTypes.STRING,
      role: DataTypes.STRING,
      branch: DataTypes.STRING,
      position: DataTypes.STRING,
      date: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Users",
      tableName: "users",
    }
  );
  return Users;
};
