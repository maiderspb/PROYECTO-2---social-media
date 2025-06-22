const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = async (req, res, next) => {
  const { postId, commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).json({ message: "ID de post inválido" });
  }

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "ID de comentario inválido" });
  }

  const post = await Post.findById(postId);
  if (!post) {
    return res.status(404).json({ message: "Post no encontrado" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comentario no encontrado" });
  }
  
  if (comment.post.toString() !== postId) {
    return res.status(400).json({ message: "El comentario no pertenece a este post" });
  }

  next();
};