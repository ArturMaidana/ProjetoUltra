"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const entityTypes = [
      {
        name: "Startups/Empresas de tecnologia",
      },
      {
        name: "ICTs (Instituto de Ciência e Tecnologia)",
      },
      {
        name: "Incubadoras",
      },
      {
        name: "Aceleradoras",
      },
      {
        name: "Corporate Venture",
      },
      {
        name: "Coworking",
      },
      {
        name: "Maker Space",
      },
      {
        name: "Investidor",
      },
      {
        name: "Empresa Júnior",
      },
      {
        name: ".Gov",
      },
      {
        name: "Agentes de Fomento",
      },
      {
        name: "Outros",
      },
    ];

    return queryInterface.bulkInsert("entityTypes", entityTypes, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("entityTypes", null, {});
  },
};
