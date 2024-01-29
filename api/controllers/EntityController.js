// Importações de Serviços
const { HttpResponse } = require("../utils/httpResponse");
const database = require("../models");
const {
  isSystemCoordinator,
  isPartnershipManager,
} = require("../utils/userUtils");
const { viaCep } = require("../utils/viaCep");

class EntityController {
  async getById(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      //
      const entity = await database.entities.findByPk(id, {
        include: [
          { model: database.entityTypes },
          { model: database.conditions },
        ],
      });

      if (!entity)
        return httpResponse.notFound(
          "Entidade não encontrada! Verifique se o ID é válido."
        );
      return httpResponse.ok({ entity });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async getAll(_, res) {
    const httpResponse = new HttpResponse(res);
    try {
      //
      const entities = await database.entities.findAll({
        include: [
          { model: database.entityTypes },
          { model: database.conditions },
        ],
        order: [["name", "ASC"]],
      });

      return httpResponse.ok({ entities });
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
      const { count, rows: entities } = await database.entities.findAndCountAll(
        {
          include: [
            { model: database.entityTypes },
            { model: database.conditions },
          ],
          order: [["name", "ASC"]],
          offset,
          limit: pageSize,
        }
      );

      // Calcula a quantidade total de páginas com base na quantidade total de itens e no tamanho da página
      const totalPages = Math.ceil(count / pageSize);

      // Retorna a resposta, incluindo as informações do banco de dados, a quantidade total de páginas disponíveis e a página atual.
      return httpResponse.ok({
        entities,
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
      const {
        name,
        entityTypeId,
        description,
        phone,
        email,
        website,
        cep,
        state,
        city,
        neighborhood,
        avenue,
        conditionId,
      } = req.body;

      // Verifica se o usuário logado tem permissão de administrador ou de gestor de parceiros
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isManager = await isPartnershipManager(req.userId.id);
      if (!isCoordinator && !isManager) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      // Verifica se todos os campos obrigatórios foram fornecidos e são válidos
      if (!name || !entityTypeId || !email || !cep || !conditionId)
        return httpResponse.badRequest(
          "Por favor, preencha todos os campos obrigatórios!"
        );

      //
      if (entityTypeId) {
        const entityType = await database.entityTypes.findOne({
          where: { id: entityTypeId },
        });
        if (!entityType) {
          return httpResponse.notFound(
            "Tipo de Entidade não encontrado! Verifique se o ID é válido."
          );
        }
      }
      const entityAlreadyExists = await database.entities.findOne({
        where: { email },
      });
      if (entityAlreadyExists)
        return httpResponse.badRequest(
          "Já existe uma entidade com este endereço de email."
        );
      const isCEPValid = await viaCep(cep);
      if (!isCEPValid.valid) {
        return httpResponse.badRequest(isCEPValid.error);
      }
      if (conditionId) {
        const condition = await database.conditions.findOne({
          where: { id: conditionId },
        });
        if (!condition) {
          return httpResponse.notFound(
            "Condição inválida! Verifique se o ID é válido."
          );
        }
      }

      // Cria a nova entidade no banco de dados
      const entity = await database.entities.create({
        name,
        entityTypeId,
        description,
        phone,
        email,
        website,
        cep,
        state: isCEPValid.state,
        city: isCEPValid.city,
        neighborhood: isCEPValid.neighborhood,
        avenue: isCEPValid.avenue,
        conditionId,
      });
      return httpResponse.created(entity);
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async update(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;
      const {
        name,
        entityTypeId,
        description,
        phone,
        email,
        website,
        cep,
        state,
        city,
        neighborhood,
        avenue,
        conditionId,
      } = req.body;

      // Verifica se o usuário logado tem permissão de administrador ou de gestor de parceiros
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isManager = await isPartnershipManager(req.userId.id);
      if (!isCoordinator && !isManager) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da entidade."
        );

      const entityToUpdate = {};
      const entityExists = await database.entities.findByPk(id);
      if (!entityExists)
        return httpResponse.notFound(
          "Entidade não encontrada! Verifique se o ID é válido."
        );

      //
      if (name) {
        if (typeof name !== "string" || name.trim() === "") {
          return httpResponse.badRequest("Informe um nome para a entidade!");
        }

        entityToUpdate.name = name;
      }
      if (entityTypeId) {
        const entityType = await database.entityTypes.findOne({
          where: { id: entityTypeId },
        });
        if (!entityType) {
          return httpResponse.notFound(
            "Tipo de Entidade não encontrado! Verifique se o ID é válido."
          );
        }
        entityToUpdate.entityTypeId = entityTypeId;
      }
      if (description) entityToUpdate.description = description;
      if (phone) entityToUpdate.phone = phone;
      if (email && email !== entityExists.email) {
        const entityAlreadyExists = await database.entities.findOne({
          where: { email },
        });
        if (entityAlreadyExists && entityAlreadyExists.id !== id) {
          return httpResponse.badRequest(
            "Já existe uma entidade com este endereço de email."
          );
        }
        entityToUpdate.email = email;
      }
      if (website) entityToUpdate.website = website;
      if (cep) {
        const isCEPValid = await viaCep(cep);
        if (!isCEPValid.valid) {
          return httpResponse.badRequest(isCEPValid.error);
        }
        entityToUpdate.cep = cep;
        (entityToUpdate.state = isCEPValid.state),
          (entityToUpdate.city = isCEPValid.city),
          (entityToUpdate.neighborhood = isCEPValid.neighborhood),
          (entityToUpdate.avenue = isCEPValid.avenue);
      }
      if (conditionId) {
        const condition = await database.conditions.findOne({
          where: { id: conditionId },
        });
        if (!condition) {
          return httpResponse.notFound(
            "Condição inválida! Verifique se o ID é válido."
          );
        }
        entityToUpdate.conditionId = conditionId;
      }

      // Realiza a atualização no banco de dados
      await database.entities.update(entityToUpdate, {
        where: { id },
      });
      return httpResponse.ok({
        message: "Entidade atualizada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }

  async delete(req, res) {
    const httpResponse = new HttpResponse(res);
    try {
      const { id } = req.params;

      // Verifica se o usuário logado tem permissão de administrador ou de gestor de parceiros
      const isCoordinator = await isSystemCoordinator(req.userId.id);
      const isManager = await isPartnershipManager(req.userId.id);
      if (!isCoordinator && !isManager) {
        return httpResponse.forbidden("Você não tem permissão para esta ação.");
      }

      if (!id)
        return httpResponse.badRequest(
          "Parâmetros inválidos! Certifique-se de fornecer o ID da entidade."
        );

      //
      const entityExists = await database.entities.findOne({
        where: { id },
      });
      if (!entityExists)
        return httpResponse.notFound(
          "Entidade não encontrada! Verifique se o ID é válido."
        );

      // Realiza a exclusão do usuário no banco de dados
      await database.entities.destroy({ where: { id } });
      return httpResponse.ok({
        message: "Entidade deletada com sucesso.",
      });
    } catch (error) {
      return httpResponse.internalError(error);
    }
  }
}

module.exports = EntityController;
