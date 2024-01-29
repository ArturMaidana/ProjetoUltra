"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const roles = [
      {
        name: "Coordenador de Sistema",
        description:
          "Mantém tudo funcionando perfeitamente nos bastidores, cuidando das configurações globais, segurança e permissões. O objetivo é garantir que todos tenham um ambiente de trabalho tranquilo e eficiente.",
      },
      {
        name: "Gestor de Parceiros",
        description:
          "É o ponto de contato para nossos parceiros. Adiciona, atualiza e organiza as informações sobre eles, garantindo que tudo esteja sempre em dia para manter nossas relações fortes.",
      },
      {
        name: "Curador de Conteúdo",
        description:
          "Responsável por gerenciar os informes relacionados aos nossos parceiros. Cria, aprimora e organiza as notícias de forma clara e envolvente, mantendo todos informados de maneira precisa.",
      },
      {
        name: "Visualizador de Dados",
        description:
          "Responsável por observar e analisar dados críticos. Este papel envolve a visualização de informações essenciais, sem a capacidade de fazer alterações. Contribui para a compreensão global, fornecendo insights valiosos com base na observação atenta dos dados disponíveis.",
      },
    ];

    return queryInterface.bulkInsert("roles", roles, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
