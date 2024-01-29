"use strict";
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");
const db = {};

// Criando uma instância do Sequelize com a configuração do banco de dados
const sequelize = new Sequelize(config);

// Lendo os arquivos no diretório atual
fs.readdirSync(__dirname)
  .filter((file) => {
    // Garantindo que o arquivo não comece com um ponto (.) e não seja o próprio arquivo atual
    // Além disso, verificando se é um arquivo JavaScript (.js) e não é um arquivo de teste (.test.js)
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    // Importando o modelo do arquivo e passando a instância do Sequelize e DataTypes
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    // Adicionando o modelo ao objeto db usando o nome do modelo como chave
    db[model.name] = model;
  });

// Associação automática dos modelos
Object.values(db)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(db));

// Adicionando a instância do Sequelize e o próprio Sequelize ao objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
