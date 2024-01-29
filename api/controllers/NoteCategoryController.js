// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class NoteCategoryController {
  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Consulta o banco de dados para obter as informações ordenadas pelo nome
      const noteCategories = await database.noteCategories.findAll({
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ noteCategories });
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

      // Consulta o banco de dados para obter as informações paginadas e ordenadas por nome
      const { count, rows: noteCategories } =
        await database.noteCategories.findAndCountAll({
          order: [["name", "ASC"]],
          offset,
          limit: pageSize,
        });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        noteCategories,
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
      const { name } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      //
      if (typeof name !== "string" || name.trim() === "") {
        return httpResponse.badRequest(
          "Informe um nome para a Categoria da Nota!"
        );
      }

      // Cria o novo cargo no banco de dados
      const noteCategory = await database.noteCategories.create({
        name,
      });
      return httpResponse.created(noteCategory);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Verifica se o usuário logado tem permissão de administrador
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      if (!isCoordinator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da Categoria da Nota."
        );

      const noteCategoryToUpdate = {};
      const noteCategoryExists = await database.noteCategories.findByPk(id);
      if (!noteCategoryExists)
        return httpResponse.notFound(
          "Categoria da Nota não encontrada! Verifique se o ID é válido."
        );

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest(
            "Informe um nome para a Categoria da Nota!"
          );
        }
        noteCategoryToUpdate.name = name;
      }

      // Realiza a atualização no banco de dados
      await database.noteCategories.update(noteCategoryToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Categoria da Nota atualizado com sucesso.",
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

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da Categoria da Nota."
        );

      //
      const noteCategoryExists = await database.noteCategories.findOne({
        where: { id },
      });
      if (!noteCategoryExists)
        return httpResponse.notFound(
          "Categoria da Nota não encontrada! Verifique se o ID é válido."
        );

      // Realiza a exclusão do usuário no banco de dados
      await database.noteCategories.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Categoria da Nota deletada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = NoteCategoryController;
