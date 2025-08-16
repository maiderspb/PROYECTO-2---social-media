const Post = require("../models/Post");

const isAuthor = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const postId = req.params.id || req.params._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Este post no te pertenece" });
    }

    req.post = post;
    next();
  } catch (error) {
    console.error("❌ Error en isAuthor middleware:", error);
    res.status(500).json({
      message: "Error al comprobar la autoría del post",
      error: error.message,
    });
  }
};

module.exports = isAuthor;






