// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const { isSystemCoordinator, isContentCurator } = require("../utils/userUtils");

class NoteController {
  async getById(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      //
      const note = await database.notes.findByPk(id, {
        include: [
          { model: database.entities },
          { model: database.noteCategories },
          { model: database.conditions },
        ],
      });

      if (!note)
        return httpResponse.notFound(
          "Nota não encontrada! Verifique se o ID é válido."
        );
      return httpResponse.ok({ note });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      //
      const notes = await database.notes.findAll({
        include: [
          { model: database.entities },
          { model: database.noteCategories },
          { model: database.conditions },
        ],
        order: [["createdAt", "ASC"]],
      });

      return httpResponse.ok({ notes });
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
      const { count, rows: notes } = await database.notes.findAndCountAll({
        include: [
          { model: database.entities },
          { model: database.noteCategories },
          { model: database.conditions },
        ],
        order: [["createdAt", "ASC"]],
        offset,
        limit: pageSize,
      });

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        notes,
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
      const { title, entityId, categoryId, body, source, conditionId } =
        req.body;

      // Verifica se o usuário logado tem permissão de administrador ou de curador de conteúdo
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isCurator = await isContentCurator(req.userId.id);
      if (!isCoordinator && !isCurator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      // Verifica se todos os campos obrigatórios foram fornecidos e são válidos
      if (
        !title ||
        !entityId ||
        !categoryId ||
        !body ||
        !source ||
        !conditionId
      )
        return httpResponse.badRequest(
          "Por favor, preencha todos os campos obrigatórios!"
        );

      //
      if (entityId) {
        const entityDoesNotExist = await database.entities.findOne({
          where: { id: entityId },
        });
        if (!entityDoesNotExist) {
          return httpResponse.notFound(
            "Entidade não encontrada! Verifique se o ID é válido."
          );
        }
      }
      if (categoryId) {
        const categoryDoesNotExist = await database.noteCategories.findOne({
          where: { id: categoryId },
        });
        if (!categoryDoesNotExist) {
          return httpResponse.notFound(
            "Categoria da Nota não encontrado! Verifique se o ID é válido."
          );
        }
      }
      if (conditionId) {
        const conditionDoesNotExist = await database.conditions.findOne({
          where: { id: conditionId },
        });
        if (!conditionDoesNotExist) {
          return httpResponse.notFound(
            "Condição inválida! Verifique se o ID é válido."
          );
        }
      }

      // Cria a nova nota no banco de dados
      const note = await database.notes.create({
        title,
        entityId,
        categoryId,
        body,
        source,
        conditionId,
      });
      return httpResponse.created(note);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const { title, entityId, categoryId, body, source, conditionId } =
        req.body;

      // Verifica se o usuário logado tem permissão de administrador ou de curador de conteúdo
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isCurator = await isContentCurator(req.userId.id);
      if (!isCoordinator && !isCurator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da nota."
        );

      const noteToUpdate = {};
      const noteExists = await database.notes.findByPk(id);
      if (!noteExists)
        return httpResponse.notFound(
          "Nota não encontrada! Verifique se o ID é válido."
        );

      //
      if (title) noteToUpdate.title = title;
      if (entityId) {
        const entity = await database.entities.findOne({
          where: { id: entityId },
        });
        if (!entity) {
          return httpResponse.notFound(
            "Entidade não encontrada! Verifique se o ID é válido."
          );
        }
        noteToUpdate.entityId = entityId;
      }
      if (categoryId) {
        const category = await database.noteCategories.findOne({
          where: { id: categoryId },
        });
        if (!category) {
          return httpResponse.notFound(
            "Categoria da Nota não encontrado! Verifique se o ID é válido."
          );
        }
        noteToUpdate.categoryId = categoryId;
      }
      if (body) noteToUpdate.body = body;
      if (source) noteToUpdate.source = source;
      if (conditionId) {
        const condition = await database.conditions.findOne({
          where: { id: conditionId },
        });
        if (!condition) {
          return httpResponse.notFound(
            "Condição inválida! Verifique se o ID é válido."
          );
        }
        noteToUpdate.conditionId = conditionId;
      }

      // Realiza a atualização no banco de dados
      await database.notes.update(noteToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Nota atualizada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async delete(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      // Verifica se o usuário logado tem permissão de administrador ou de curador de conteúdo
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isCurator = await isContentCurator(req.userId.id);
      if (!isCoordinator && !isCurator) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da nota."
        );

      const noteExists = await database.notes.findOne({
        where: { id },
      });
      if (!noteExists)
        return httpResponse.notFound(
          "Nota não encontrada! Verifique se o ID é válido."
        );

      // Realiza a exclusão do usuário no banco de dados
      await database.notes.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Nota deletada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = NoteController;
