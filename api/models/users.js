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
      Users.belongsTo(models.roles, {
        foreignKey: {
          name: "roleId",
        },
      });
    }
  }
  Users.init(
    {
      name: DataTypes.TEXT,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return Users;
};
