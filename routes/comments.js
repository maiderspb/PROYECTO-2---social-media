const express = require("express");
const router = express.Router();
const multer = require("multer");
const CommentController = require("../controllers/CommentController");
const authentication = require("../middlewares/authentication");
const verifyPostAndComment = require("../middlewares/verifyPostAndComment");
const { like, removeLike } = require("../controllers/LikeComment");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Rutas
router.post(
  "/posts/:postId/comments",
  authentication,
  CommentController.create
);

router.get("/:id", CommentController.getCommentById);

router.post(
  "/:postId/comments/:commentId/like",
  authentication,
  verifyPostAndComment, // Verifica que el post y comentario existan
  like // Asegúrate de que 'like' es una función válida
);

router.delete(
  "/:postId/comments/:commentId/like",
  authentication,
  verifyPostAndComment, // Verifica que el post y comentario existan
  removeLike // Asegúrate de que 'removeLike' es una función válida
);

module.exports = router;
