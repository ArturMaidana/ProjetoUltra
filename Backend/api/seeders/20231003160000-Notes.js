"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notes = [
      {
        title:
          "Lançado Edital de Credenciamento e Convocação dos Alunos Classificados no FIC_DEV",
        entityId: 1,
        categoryId: 1,
        body: "A coordenação do Curso FIC_DEV – Programador de Sistemas anunciou a convocação dos 17 melhores alunos de cada trilha – Java, NodeJS, React e Genexus – que se destacaram no programa. Esta convocação é um passo significativo na jornada dos estudantes, marcando o início de uma nova etapa rumo ao ingresso nos estágios profissionalizantes.. O processo de credenciamento, sob a responsabilidade da Fundação de Apoio do Ensino Superior Público Estadual (FAESPE), é detalhado no edital, que inclui seus anexos e Editais Complementares. É vital que os alunos convocados estejam atentos à documentação exigida, conforme especificado no edital. Para acessar todas as informações pertinentes, incluindo a lista de documentos necessários, os interessados podem consultar o edital completo disponível no botão ao fim desta notícia. Este anúncio da coordenação do FIC_DEV marca um momento crucial para o desenvolvimento profissional dos alunos no dinâmico campo da programação de sistemas.",
        source:
          "https://risc.unemat.br/ficdev/2023/12/01/lancado-edital-de-credenciamento-e-convocacao-dos-alunos-classificados-no-fic_dev/",
        conditionId: 1,
      },
    ];

    return queryInterface.bulkInsert("notes", notes, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("notes", null, {});
  },
};
