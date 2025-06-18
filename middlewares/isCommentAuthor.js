const Comment = require("../models/Comment");

const isCommentAuthor = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "No autenticado" });

    const commentId = req.params.commentId || req.params.id;
    const comment = await Comment.findById(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comentario no encontrado" });

    if (comment.user.toString() !== userId.toString())
      return res.status(403).json({ message: "Este comentario no es tuyo" });

    req.comment = comment;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error comprobando autoría", error: error.message });
  }
};

module.exports = isCommentAuthor;
