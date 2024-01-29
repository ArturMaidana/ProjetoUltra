"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const noteCategories = [
      {
        name: "Editais",
      },
      {
        name: "Documentos Oficiais",
      },
      {
        name: "Comunicados",
      },
      {
        name: "Notícias",
      },
      {
        name: "Eventos",
      },
      {
        name: "Atualizações do Sistema",
      },
      {
        name: "Dicas e Tutoriais",
      },
      {
        name: "Parcerias e Colaborações",
      },
      {
        name: "Projetos em Andamento",
      },
      {
        name: "Recursos",
      },
    ];

    return queryInterface.bulkInsert("noteCategories", noteCategories, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("noteCategories", null, {});
  },
};
