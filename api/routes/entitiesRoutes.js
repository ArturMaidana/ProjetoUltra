const { Router } = require("express");

// Importações de Serviços
const EntityController = require("../controllers/EntityController");
const { authMiddleware } = require("../security/authMiddleware");

const entityController = new EntityController();
const router = Router();

router.get("/entity/:id", entityController.getById);
router.get("/entities/all", entityController.getAll);
router.get("/entities", entityController.get);
router.post("/entity", authMiddleware, entityController.create);
router.put("/entity/:id", authMiddleware, entityController.update);
router.delete("/entity/:id", authMiddleware, entityController.delete);

module.exports = router;
