"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NoteCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      NoteCategories.hasMany(models.notes, {
        foreignKey: {
          name: "categoryId",
        },
      });
    }
  }
  NoteCategories.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "noteCategories",
    }
  );
  return NoteCategories;
};
