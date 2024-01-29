"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        name: "Victor G M R Silva",
        email: "victor@valedopacu.com",
        password: await bcrypt.hash("vctrgrgi", Number(process.env.SALT)),
        roleId: 1,
      },
      {
        name: "Ellian Victor",
        email: "ellian@valedopacu.com",
        password: await bcrypt.hash("elavctr", Number(process.env.SALT)),
        roleId: 1,
      },
      {
        name: "Artur Maidana",
        email: "artur@valedopacu.com",
        password: await bcrypt.hash("atradn", Number(process.env.SALT)),
        roleId: 1,
      },
    ];

    return queryInterface.bulkInsert("users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
