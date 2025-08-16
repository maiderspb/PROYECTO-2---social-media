const mongoose = require("mongoose");
const Comment = require("../models/Comment");

module.exports = async (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "ID de comentario inválido" });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.status(404).json({ message: "Comentario no encontrado" });
  }

  if (!comment.user) {
    return res.status(400).json({ message: "El comentario no tiene usuario asignado" });
  }

  const userIdFromToken = req.user.id || req.user._id;

  if (!userIdFromToken) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  if (comment.user.toString() !== userIdFromToken.toString()) {
    return res.status(403).json({ message: "No tienes permiso para modificar este comentario" });
  }

  next();
};
