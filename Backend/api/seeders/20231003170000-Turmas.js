"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const turmas = [
      {
        name: "1° Semestre",
        ensino: "Ensino Médio",
        turno: "Matutino",
        coordenador: "Fernanda",
        escola: "Escola Estadual",
      },
      {
        name: "2° Semestre",
        ensino: "Ensino Médio",
        turno: "Matutino",
        coordenador: "Fernanda",
        escola: "Escola Estadual",
      },
      {
        name: "3° Semestre",
        ensino: "Ensino Médio",
        turno: "Matutino",
        coordenador: "Fernanda",
        escola: "Escola Estadual",
      },
      {
        name: "4° Semestre",
        ensino: "Ensino Médio",
        turno: "Matutino",
        coordenador: "Fernanda",
        escola: "Escola Estadual",
      },
    ];

    return queryInterface.bulkInsert("turmas", turmas, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("turmas", null, {});
  },
};
