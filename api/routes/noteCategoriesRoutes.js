const { Router } = require("express");

// Importações de Serviços
const NoteCategoryController = require("../controllers/NoteCategoryController");
const { authMiddleware } = require("../security/authMiddleware");

const noteCategoryController = new NoteCategoryController();
const router = Router();

router.get("/notecategories/all", noteCategoryController.getAll);
router.get("/notecategories", noteCategoryController.get);
router.post("/notecategory", authMiddleware, noteCategoryController.create);
router.put("/notecategory/:id", authMiddleware, noteCategoryController.update);
router.delete(
  "/notecategory/:id",
  authMiddleware,
  noteCategoryController.delete
);

module.exports = router;
