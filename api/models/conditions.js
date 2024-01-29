"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conditions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conditions.hasMany(models.entities, {
        foreignKey: {
          name: "conditionId",
        },
      });
      Conditions.hasMany(models.notes, {
        foreignKey: {
          name: "conditionId",
        },
      });
    }
  }
  Conditions.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "conditions",
    }
  );
  return Conditions;
};
