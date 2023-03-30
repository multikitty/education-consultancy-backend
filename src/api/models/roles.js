"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Roles.hasMany(models.Users);
    }
  }

  Roles.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      addUni: { type: DataTypes.BOOLEAN, defaultValue: false },
      editUni: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteUni: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewUni: { type: DataTypes.BOOLEAN, defaultValue: false },

      addUProgram: { type: DataTypes.BOOLEAN, defaultValue: false },
      editUProgram: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteUProgram: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewUProgram: { type: DataTypes.BOOLEAN, defaultValue: false },

      addLeads: { type: DataTypes.BOOLEAN, defaultValue: false },
      editLeads: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteLeads: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewLeads: { type: DataTypes.BOOLEAN, defaultValue: false },

      addApplication: { type: DataTypes.BOOLEAN, defaultValue: false },
      editApplication: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteApplication: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewApplication: { type: DataTypes.BOOLEAN, defaultValue: false },

      addApplicationStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
      editApplicationStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteApplicationStatus: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewApplicationStatus: { type: DataTypes.BOOLEAN, defaultValue: false },

      addInvCommission: { type: DataTypes.BOOLEAN, defaultValue: false },
      editInvCommission: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteInvCommission: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewInvCommission: { type: DataTypes.BOOLEAN, defaultValue: false },

      addInvGeneral: { type: DataTypes.BOOLEAN, defaultValue: false },
      editInvGeneral: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteInvGeneral: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewInvGeneral: { type: DataTypes.BOOLEAN, defaultValue: false },

      addAccounting: { type: DataTypes.BOOLEAN, defaultValue: false },
      editAccounting: { type: DataTypes.BOOLEAN, defaultValue: false },
      deleteAccounting: { type: DataTypes.BOOLEAN, defaultValue: false },
      viewAccounting: { type: DataTypes.BOOLEAN, defaultValue: false },

      // title: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Roles",
      tableName: "roles",
    }
  );
  return Roles;
};
