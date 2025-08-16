const Post = require("../models/Post");
const Comment = require("../models/Comment");

const CommentController = {
  create: async (req, res) => {
    console.log("req.params:", req.params);
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const comment = new Comment({
        text,
        post: postId,
        user: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await comment.save();

      res.status(201).json({ message: "Comentario creado", comment });
    } catch (err) {
      console.error("Error creando comentario:", err);
      res.status(500).json({ message: "Error al crear comentario", error: err.message });
    }
  },

update: async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "El texto del comentario es obligatorio" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para editar este comentario" });
    }

    comment.text = text;
    comment.updatedAt = new Date();

    await comment.save();

    res.status(200).json({ message: "Comentario actualizado", comment });
  } catch (err) {
    console.error("Error actualizando comentario:", err);
    res.status(500).json({ message: "Error al actualizar comentario", error: err.message });
  }
},

  delete: async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comentario no encontrado" });

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este comentario" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comentario eliminado" });
  } catch (err) {
    console.error("Error eliminando comentario:", err);
    res.status(500).json({ message: "Error al eliminar comentario", error: err.message });
  }
},

  handleLike: async (req, res, action) => {
    try {
      const { postId, commentId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }

      const comment = await Comment.findById(commentId).populate("post");
      if (!comment) {
        return res.status(404).json({ message: "Comentario no encontrado" });
      }

      const commentPostId =
        comment.post?._id?.toString?.() || comment.post?.toString?.();
      if (commentPostId !== postId) {
        return res.status(400).json({
          message: `El comentario no pertenece al post con ID: ${postId}`,
        });
      }

      if (!Array.isArray(comment.likes)) {
        comment.likes = [];
      }

      const isLiked = comment.likes.some(
        (likeId) => likeId.toString() === userId.toString()
      );

      if (action === "like" && isLiked) {
        return res.status(400).json({ message: "Ya diste like a este comentario" });
      }

      if (action === "unlike" && !isLiked) {
        return res.status(400).json({ message: "Aún no has dado like a este comentario" });
      }

      if (action === "like") {
        comment.likes.push(userId.toString());
      } else if (action === "unlike") {
        comment.likes = comment.likes.filter(
          (likeId) => likeId.toString() !== userId.toString()
        );
      }

      await comment.save();

      return res.status(200).json({
        message: action === "like" ? "Like añadido" : "Like eliminado",
        likes: comment.likes.length,
      });
    } catch (err) {
      console.error(`Error al ${action} like:`, err);
      res.status(500).json({
        message: `Error al ${action} like`,
        error: err.message,
      });
    }
  },

  getAllComments: async (req, res) => {
  try {
    const comments = await Comment.find().populate('user');
    res.status(200).json({ comments });
  } catch (err) {
    res.status(500).json({ message: "Error al obtener comentarios", error: err.message });
  }
},

  like: (req, res) => {
    return CommentController.handleLike(req, res, "like");
  },

  unlike: (req, res) => {
    return CommentController.handleLike(req, res, "unlike");
  },

  updateEmbeddedComment: async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { text } = req.body;

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });

      const comment = post.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comentario no encontrado" });

      comment.text = text;
      comment.updatedAt = new Date();

      await post.save();

      res.status(200).json({ message: "Comentario actualizado", comment });
    } catch (err) {
      res.status(500).json({
        message: "Error al actualizar comentario",
        error: err.message,
      });
    }
  },

  deleteEmbeddedComment: async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });

      const comment = post.comments.id(commentId);
      if (!comment)
        return res.status(404).json({ message: "Comentario no encontrado" });

      comment.remove();
      await post.save();

      res.status(200).json({ message: "Comentario eliminado" });
    } catch (err) {
      res.status(500).json({ message: "Error al eliminar comentario", error: err.message });
    }
  },
};

const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el comentario", error: err.message });
  }
};

CommentController.getCommentById = getCommentById;

module.exports = CommentController;
