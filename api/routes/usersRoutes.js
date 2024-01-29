const { Router } = require("express");

// Importações de Serviços
const UserController = require("../controllers/UserController");
const { authMiddleware } = require("../security/authMiddleware");

const userController = new UserController();
const router = Router();

router.post("/user/login", userController.login); // Rota para fazer login no sistema
router.get("/user/:id", authMiddleware, userController.getById);
router.get("/users/all", authMiddleware, userController.getAll);
router.get("/users", authMiddleware, userController.get);
router.post("/user", authMiddleware, userController.create); // Rota para cadastrar usuário no sistema
router.put("/user/:id", authMiddleware, userController.update);
router.delete("/user/:id", authMiddleware, userController.delete);

module.exports = router;
