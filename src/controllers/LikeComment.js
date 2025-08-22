exports.like = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const comment = await Comment.findById(commentId).populate("post");
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    if (!comment.post || !comment.post._id.equals(postId)) {
      return res.status(400).json({ message: "El comentario no pertenece a este post" });
    }

    if (!Array.isArray(comment.likes)) comment.likes = [];

    if (comment.likes.some((id) => id.equals(userId))) {
      return res.status(400).json({ message: "Ya has dado like a este comentario" });
    }

    comment.likes.push(userId);
    await comment.save();

    return res.status(200).json(comment);
  } catch (error) {
    console.error("Error al agregar like:", error);
    return res.status(500).json({ message: "Error al agregar like" });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    const comment = await Comment.findById(commentId).populate("post");
    if (!comment) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    console.log("Comentario:", comment);
    console.log("Post asociado:", comment.post);

    if (!comment.post) {
      return res
        .status(400)
        .json({ message: "Comentario no tiene un post asociado" });
    }

    if (comment.post.toString() !== postId) {
      return res
        .status(400)
        .json({ message: "El comentario no pertenece a este post" });
    }

    const index = comment.likes.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: "El like no existe" });
    }

    comment.likes.splice(index, 1);
    await comment.save();

    return res.status(200).json({
      message: "Like eliminado correctamente",
      likes: comment.likes,
    });
  } catch (error) {
    console.error("Error al eliminar like:", error);
    return res.status(500).json({ message: "Error al eliminar like" });
  }
};