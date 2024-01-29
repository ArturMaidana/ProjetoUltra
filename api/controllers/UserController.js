// Importações de Bibliotecas e Frameworks
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class UserController {
  async login(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      let { email, password } = req.body;
      // Converte o email para minúsculas
      email = email.toLowerCase();

      // Verifica se ambos email e senha foram fornecidos
      if (!email || !password) {
        return httpResponse.badRequest(
          "Erro de login: É necessário inserir um e-mail e uma senha válidos."
        );
      }

      // Verifica se existe uma conta associada ao email fornecido
      const userExists = await database.users.findOne({ where: { email } });
      if (!userExists) {
        return httpResponse.notFound(
          "Não há uma conta com esse endereço de email."
        );
      }

      // Compara a senha fornecida com a senha armazenada no banco de dados
      const isPasswordValid = await bcrypt.compare(
        password,
        userExists.password
      );
      if (!isPasswordValid) {
        return httpResponse.badRequest(
          "A senha está incorreta! Tente novamente."
        );
      }

      // Gera um token de acesso para o usuário logado
      const accessToken = jwt.sign(
        { id: userExists.id },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES_IN }
      );
      return httpResponse.created({ accessToken });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async getById(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      //
      const user = await database.users.findByPk(id, {
        include: [{ model: database.roles }],
      });

      if (!user)
        return httpResponse.notFound(
          "Usuário não encontrado! Verifique se o ID é válido."
        );
      return httpResponse.ok({ user });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      //
      const users = await database.users.findAll({
        include: [{ model: database.roles }],
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ users });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async get(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Extrai parâmetros da requisição ou define valores padrão
      let { currentPage, pageSize } = req.query;
      currentPage = parseInt(currentPage, 10);
      pageSize = parseInt(pageSize, 10);
      if (isNaN(currentPage) || currentPage <= 0) {
        currentPage = 1;
      }
      if (isNaN(pageSize) || pageSize <= 0) {
        pageSize = 10;
      }

      // Calcula o deslocamento com base na página e no tamanho da página
      const offset = (currentPage - 1) * pageSize;

      //
      const { count, rows: users } = await database.users.findAndCountAll({
        include: [{ model: database.roles }],
        order: [["name", "ASC"]],
        offset,
        limit: pageSize,
      });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        users,
        totalPages,
        currentPage,
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async create(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      let { name, email, password, roleId } = req.body;
      // Converte o email para minúsculas
      email = email.toLowerCase();

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      // Verifica se todos os campos obrigatórios foram fornecidos e são válidos
      if (
        typeof name !== "string" ||
        name.trim() === "" ||
        !email ||
        !password ||
        !roleId
      ) {
        return httpResponse.badRequest(
          "Por favor, preencha todos os campos obrigatórios!"
        );
      }

      // Verifica se já existe uma conta com o mesmo endereço de email
      const userAlreadyExists = await database.users.findOne({
        where: { email },
      });
      if (userAlreadyExists) {
        return httpResponse.badRequest(
          "Já existe uma conta com este endereço de email."
        );
      }
      // Hash da senha antes de armazená-la no banco de dados
      const passwordHashed = await bcrypt.hash(
        password,
        Number(process.env.SALT)
      );
      if (roleId) {
        const roleDoesNotExist = await database.roles.findOne({
          where: { id: roleId },
        });
        if (!roleDoesNotExist) {
          return httpResponse.notFound(
            "Cargo não encontrado! Verifique se o ID é válido."
          );
        }
      }

      // Cria o novo usuário no banco de dados
      const user = await database.users.create({
        name,
        email,
        password: passwordHashed,
        roleId,
      });
      return httpResponse.created({ user });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { name, email, password, roleId } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id) {
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID do usuário."
        );
      }

      const userToUpdate = {};
      const userExists = await database.users.findByPk(id);
      if (!userExists) {
        return httpResponse.notFound(
          "Usuário não encontrado. Verifique se o ID é válido."
        );
      }

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest("Informe um nome para o usuário!");
        }
        userToUpdate.name = name;
      }
      if (email && email !== userExists.email) {
        const userAlreadyExists = await database.users.findOne({
          where: { email },
        });
        if (userAlreadyExists && userAlreadyExists.id !== id) {
          return httpResponse.badRequest(
            "Já existe uma conta com este endereço de email."
          );
        }
        userToUpdate.email = email;
      }
      if (password) {
        // Verifica se a senha contém espaços em branco
        if (/\s/.test(password)) {
          return httpResponse.badRequest(
            "A senha não pode conter espaços em branco."
          );
        }
        const passwordHashed = await bcrypt.hash(
          password,
          Number(process.env.SALT)
        );
        userToUpdate.password = passwordHashed;
      }
      if (roleId) {
        const roleDoesNotExist = await database.roles.findOne({
          where: { id: roleId },
        });
        if (!roleDoesNotExist) {
          return httpResponse.notFound(
            "Cargo não encontrado. Verifique se o ID é válido."
          );
        }
        userToUpdate.roleId = roleId;
      }

      // Realiza a atualização no banco de dados
      await database.users.update(userToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Usuário atualizado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async delete(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      //
      if (!id) {
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID do usuário."
        );
      }

      //
      const userExists = await database.users.findOne({ where: { id } });
      if (!userExists) {
        return httpResponse.notFound(
          "Usuário não encontrado. Verifique se o ID é válido."
        );
      }

      // Realiza a exclusão do usuário no banco de dados
      await database.users.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Usuário deletado com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = UserController;
