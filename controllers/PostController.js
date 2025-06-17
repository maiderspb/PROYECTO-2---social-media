const Post = require("../models/Post");
const Comment = require("../models/Comment");

// Crear post
exports.createPost = async (req, res) => {
  const { title, content, image } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "El campo 'title' es obligatorio" });
  }
  if (!content || !content.trim()) {
    return res
      .status(400)
      .json({ message: "El campo 'content' es obligatorio" });
  }

  try {
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      image,
      user: req.user.id,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar post
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post || post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar post
exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post || post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener todos los posts con usuarios y comentarios
exports.getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .populate("user", "username email")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username" },
      })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar post por nombre
exports.searchByName = async (req, res) => {
  const { title } = req.query;
  try {
    const posts = await Post.find({ title: new RegExp(title, "i") }).populate(
      "user"
    );
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar post por ID
exports.getById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user")
      .populate({ path: "comments", populate: { path: "user" } });

    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Dar like
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
      await post.save();
    }
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Quitar like
exports.unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user.id
    );
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
