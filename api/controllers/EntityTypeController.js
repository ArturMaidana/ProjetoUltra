// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator } = require("../utils/userUtils");

class EntityTypeController {
  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      // Consulta o banco de dados para obter as informações ordenadas pelo nome
      const entityTypes = await database.entityTypes.findAll({
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ entityTypes });
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
      const { count, rows: entityTypes } =
        await database.entityTypes.findAndCountAll({
          order: [["name", "ASC"]],
          offset,
          limit: pageSize,
        });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        entityTypes,
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
          "Informe um nome para o Tipo da Entidade!"
        );
      }

      // Cria o novo cargo no banco de dados
      const entityType = await database.entityTypes.create({ name });
      return httpResponse.created(entityType);
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
          "Parâmetros inválidos! Certifique-se de fornecer o ID do Tipo da Entidade."
        );

      const entityTypeToUpdate = {};
      const entityTypeExists = await database.entityTypes.findByPk(id);
      if (!entityTypeExists)
        return httpResponse.notFound(
          "Tipo de Entidade não encontrado! Verifique se o ID é válido."
        );

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest(
            "Informe um nome para o Tipo da Entidade!"
          );
        }
        entityTypeToUpdate.name = name;
      }

      // Realiza a atualização no banco de dados
      await database.entityTypes.update(entityTypeToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Tipo de Entidade atualizada com sucesso.",
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
          "Parâmetros inválidos! Certifique-se de fornecer o ID do Tipo da Entidade."
        );

      //
      const entityTypeExists = await database.entityTypes.findOne({
        where: { id },
      });
      if (!entityTypeExists)
        return httpResponse.notFound(
          "Tipo de Entidade não encontrado! Verifique se o ID é válido."
        );

      // Realiza a exclusão do usuário no banco de dados
      await database.entityTypes.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Tipo de Entidade deletada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = EntityTypeController;
