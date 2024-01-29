"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notes.belongsTo(models.entities, {
        foreignKey: {
          name: "entityId",
        },
      });
      Notes.belongsTo(models.noteCategories, {
        foreignKey: {
          name: "categoryId",
        },
      });
      Notes.belongsTo(models.conditions, {
        foreignKey: {
          name: "conditionId",
        },
      });
    }
  }
  Notes.init(
    {
      title: DataTypes.TEXT,
      entityId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
      body: DataTypes.TEXT,
      source: DataTypes.TEXT,
      conditionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "notes",
    }
  );
  return Notes;
};
