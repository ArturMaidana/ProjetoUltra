require("dotenv").config();

// Verifica se todas as variáveis de ambiente necessárias estão definidas
const requiredEnvVariables = [
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_HOST",
];

// Filtra as variáveis de ambiente ausentes
const missingEnvVariables = requiredEnvVariables.filter(
  (variable) => !process.env[variable]
);

// Se houver variáveis de ambiente ausentes, lança um erro
if (missingEnvVariables.length > 0) {
  throw new Error(
    `As seguintes variáveis de ambiente são necessárias, mas não foram definidas: ${missingEnvVariables.join(
      ", "
    )}`
  );
}

// Configuração do banco de dados usando as variáveis de ambiente
module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: false,
  },
};
