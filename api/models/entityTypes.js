"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EntityTypes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EntityTypes.hasMany(models.entities, {
        foreignKey: {
          name: "entityTypeId",
        },
      });
    }
  }
  EntityTypes.init(
    {
      name: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "entityTypes",
    }
  );
  return EntityTypes;
};
