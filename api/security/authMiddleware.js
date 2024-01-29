const jwt = require("jsonwebtoken");

// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");

function authMiddleware(req, res, next) {
  const httpResponse = new HttpResponse(res);

  try {
    // Extraindo o token do cabeçalho 'Authorization' na requisição
    const token = req.headers.authorization;

    // Se o token for indefinido, retorna uma resposta 'Não Autorizado'
    if (token == undefined) {
      return httpResponse.unauthorized();
    }

    // Verificando o token JWT usando o segredo fornecido
    jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET, (error, user) => {
      // Se houver um erro durante a verificação, retorna uma resposta 'Não Autorizado'
      if (error) {
        return httpResponse.unauthorized();
      }

      // Se a verificação for bem-sucedida, anexa as informações do usuário ao objeto de requisição
      req.userId = {
        id: user.id,
      };

      next();
    });
  } catch (error) {
    httpResponse.unauthorized();
  }
}

module.exports = { authMiddleware };
