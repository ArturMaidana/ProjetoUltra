"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const entities = [
      {
        name: "SECITECI - Secretaria de Ciência, Tecnologia e Inovação do Estado de Mato Grosso",
        entityTypeId: 1,
        description:
          "A Secretaria de Estado de Ciência, Tecnologia e Inovação é um órgão da Administração Direta Estadual tem como missão elevar a capacidade científica e tecnológica em setores estratégicos para o desenvolvimento sustentável do Estado, coordenando o Sistema Estadual de Ciência e Tecnologia e integrando o Sistema Estadual de Ensino. ",
        phone: "(65) 3613-0104",
        email: "ouvidoria@secitec.mt.gov.br",
        website: "https://www.secitec.mt.gov.br/inicio",
        cep: "78048135",
        conditionId: 1,
      },
    ];

    return queryInterface.bulkInsert("entities", entities, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("entities", null, {});
  },
};
