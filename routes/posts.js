const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const authenticate = require("../middlewares/authentication");
const controller = require("../controllers/PostController");
const upload = require("../middlewares/upload"); // importamos multer

// Crear post con imagen usando multer
router.post("/", authenticate, upload.single("image"), controller.createPost);

router.put("/:id", authenticate, controller.updatePost);
router.delete("/:id", authenticate, controller.deletePost);
router.get("/", controller.getAllPosts);
router.get("/search", controller.searchByName);
router.get("/:id", controller.getById);
router.post("/:id/like", authenticate, controller.likePost);
router.post("/:id/unlike", authenticate, controller.unlikePost);

// Ruta para agregar comentarios
router.post("/:postId/comments", authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    const comment = new Comment({
      user: userId,
      text,
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).json({ message: "Comentario agregado", comment });
  } catch (err) {
    console.error("Error al agregar comentario:", err);
    res.status(500).json({
      error: "Error al agregar comentario",
      details: err.message,
    });
  }
});

module.exports = router;