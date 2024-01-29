const { Router } = require("express");

// Importações de Serviços
const ConditionController = require("../controllers/ConditionController");
const { authMiddleware } = require("../security/authMiddleware");

const conditionController = new ConditionController();
const router = Router();

router.get("/conditions/all", authMiddleware, conditionController.getAll);
router.get("/conditions", authMiddleware, conditionController.get);
router.post("/condition", authMiddleware, conditionController.create);
router.put("/condition/:id", authMiddleware, conditionController.update);
router.delete("/condition/:id", authMiddleware, conditionController.delete);

module.exports = router;
