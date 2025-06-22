const Post = require("../models/Post");
const Comment = require("../models/Comment");

const CommentController = {
  create: async (req, res) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;
      const userId = req.user.id;

      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post no encontrado" });

      const comment = new Comment({ user: userId, text, post: postId });
      await comment.save();

      post.comments.push(comment._id);
      await post.save();

      res.status(201).json({ message: "Comentario creado", comment });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al crear comentario", error: err.message });
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
        return res
          .status(400)
          .json({ message: "Ya diste like a este comentario" });
      }

      if (action === "unlike" && !isLiked) {
        return res
          .status(400)
          .json({ message: "Aún no has dado like a este comentario" });
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
      res
        .status(500)
        .json({ message: "Error al eliminar comentario", error: err.message });
    }
  },
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }
    res.status(200).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el comentario", error: err.message });
  }
};

CommentController.getCommentById = getCommentById;

module.exports = CommentController;
