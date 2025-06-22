const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const authentication = require("../middlewares/authentication");
const controller = require("../controllers/PostController");
const CommentController = require("../controllers/CommentController");
const upload = require("../middlewares/upload");
const isAuthor = require("../middlewares/isAuthor");
const isCommentAuthor = require("../middlewares/isCommentAuthor");

router.post("/", authentication, upload.single("image"), controller.createPost);

router.put(
  "/:id",
  authentication,
  isAuthor,
  upload.single("image"),
  controller.updatePost
);

router.delete("/:id", authentication, isAuthor, controller.deletePost);

router.get("/", controller.getAllPosts);

router.get("/search", controller.searchByName);

router.get("/:id", controller.getById);

router.post("/:id/like", authentication, controller.likePost);
router.post("/:id/unlike", authentication, controller.unlikePost);

router.post(
  "/:postId/comments",
  authentication,
  upload.single("image"),
  async (req, res) => {
    console.log("➡️ Ruta PUT /api/posts/:postId/comments/:commentId alcanzada");
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;

      if (!text || !text.trim()) {
        return res
          .status(400)
          .json({ message: "El campo 'text' es obligatorio" });
      }

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: "Post no encontrado" });

      const commentData = { user: userId, text: text.trim() };
      if (req.file) {
        commentData.image = req.file.filename;
      }

      const comment = new Comment(commentData);
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
  }
);
router.post("/:postId/followers", authentication, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    if (post.followers && post.followers.includes(userId)) {
      return res.status(400).json({ message: "Ya sigues este post" });
    }

    post.followers = post.followers || [];
    post.followers.push(userId);

    await post.save();

    res.status(201).json({ message: "Post seguido correctamente" });
  } catch (err) {
    console.error("Error al seguir post:", err);
    res
      .status(500)
      .json({ error: "Error al seguir post", details: err.message });
  }
});

router.put(
  "/:postId/comments/:commentId",
  authentication,
  isCommentAuthor,
  upload.single("image"),
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { text } = req.body;

      if (!text || !text.trim()) {
        return res
          .status(400)
          .json({ message: "El campo 'text' es obligatorio" });
      }

      // Verificar que el post existe
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ error: "Post no encontrado" });

      // Buscar comentario y actualizar
      const updatedData = { text: text.trim(), updatedAt: new Date() };

      if (req.file) {
        updatedData.image = req.file.filename;
      }

      const updatedComment = await Comment.findOneAndUpdate(
        { _id: commentId, post: postId },
        updatedData,
        { new: true }
      );

      if (!updatedComment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      res.json({ message: "Comentario actualizado", comment: updatedComment });
    } catch (err) {
      console.error("Error al actualizar comentario:", err);
      res.status(500).json({
        error: "Error al actualizar comentario",
        details: err.message,
      });
    }
  }
);

router.delete(
  "/:postId/comments/:commentId",
  authentication,
  isCommentAuthor,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      // Verifica que el post existe
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });

      // Borra el comentario
      const deletedComment = await Comment.findByIdAndDelete(commentId);
      if (!deletedComment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      // Quita el comentario del arreglo comments del post
      post.comments = post.comments.filter((id) => id.toString() !== commentId);
      await post.save();

      res.json({ message: "Comentario eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar comentario:", err);
      res.status(500).json({
        error: "Error al eliminar comentario",
        details: err.message,
      });
    }
  }
);

router.post(
  "/:postId/comments/:commentId/like",
  authentication,
  CommentController.like
);

router.post(
  "/:postId/comments/:commentId/like",
  authentication,
  async (req, res) => {
    const { postId, commentId } = req.params;

    try {
      // Verificar si el post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" }); // Si no existe el post
      }

      // Verificar si el comentario existe dentro del post
      const comment = post.comments.find(
        (comment) => comment.toString() === commentId
      ); // Aquí verificamos que comment exista y sea válido
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" }); // Si no existe el comentario en el post
      }

      // Lógica para dar like
      comment.likes = comment.likes || 0; // Asegúrate de que "likes" exista antes de incrementarlo
      comment.likes += 1; // Incrementa el contador de likes

      await post.save(); // Guarda los cambios en el post

      return res
        .status(200)
        .json({ message: "Like added", likes: comment.likes }); // Responde con el éxito y el nuevo número de likes
    } catch (error) {
      console.error(error); // Log para ver los errores
      return res
        .status(500)
        .json({ message: "Error al dar like", error: error.message });
    }
  }
);

module.exports = router;
