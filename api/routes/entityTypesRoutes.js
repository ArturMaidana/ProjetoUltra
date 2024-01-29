const { Router } = require("express");

// Importações de Serviços
const EntityTypeController = require("../controllers/EntityTypeController");
const { authMiddleware } = require("../security/authMiddleware");

const entityTypeController = new EntityTypeController();
const router = Router();

router.get("/entitytypes/all", entityTypeController.getAll);
router.get("/entitytypes", entityTypeController.get);
router.post("/entitytype", authMiddleware, entityTypeController.create);
router.put("/entitytype/:id", authMiddleware, entityTypeController.update);
router.delete("/entitytype/:id", authMiddleware, entityTypeController.delete);

module.exports = router;
