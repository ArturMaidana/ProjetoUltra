const { Router } = require("express");

// Importações de Serviços
const NoteController = require("../controllers/NoteController");
const { authMiddleware } = require("../security/authMiddleware");

const noteController = new NoteController();
const router = Router();

router.get("/note/:id", noteController.getById);
router.get("/notes/all", noteController.getAll);
router.get("/notes", noteController.get);
router.post("/note", authMiddleware, noteController.create);
router.put("/note/:id", authMiddleware, noteController.update);
router.delete("/note/:id", authMiddleware, noteController.delete);

module.exports = router;
