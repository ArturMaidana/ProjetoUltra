"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      entityId: {
        references: {
          model: "entities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      categoryId: {
        references: {
          model: "noteCategories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      source: {
        type: Sequelize.TEXT,
      },
      conditionId: {
        references: {
          model: "conditions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "NO ACTION",
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("notes");
  },
};
