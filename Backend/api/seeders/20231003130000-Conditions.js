"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const conditions = [
      {
        name: "No Ar",
      },
      {
        name: "Fora do Ar",
      },
    ];

    return queryInterface.bulkInsert("conditions", conditions, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("conditions", null, {});
  },
};
