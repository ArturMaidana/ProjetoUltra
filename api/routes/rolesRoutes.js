const { Router } = require("express");

// Importações de Serviços
const RoleController = require("../controllers/RoleController");
const { authMiddleware } = require("../security/authMiddleware");

const roleController = new RoleController();
const router = Router();

router.get("/roles/all", authMiddleware, roleController.getAll);
router.get("/roles", authMiddleware, roleController.get);
router.post("/role", authMiddleware, roleController.create);
router.put("/role/:id", authMiddleware, roleController.update);
router.delete("/role/:id", authMiddleware, roleController.delete);

module.exports = router;
