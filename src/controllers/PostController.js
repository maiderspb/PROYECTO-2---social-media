const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.createPost = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.file:", req.file);

const { title, content, authorName } = req.body;

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
       authorName,
  image: req.file ? req.file.filename : undefined,
  user: req.user.id,  
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post || post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    if (req.body.title) post.title = req.body.title.trim();
    if (req.body.content) post.content = req.body.content.trim();

    if (req.file) {
      post.image = req.file.filename;
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  console.log('Eliminar post ID:', req.params.id);
  console.log('Usuario que solicita:', req.user.id);
  
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post no encontrado" });

    await post.remove();
    res.json({ message: "Post eliminado correctamente" });
  } catch (error) {
  console.error("Error al eliminar post:", error);
  res.status(500).json({ message: "Error al eliminar post", error: error.message });
}
}; 

exports.getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20; 
  const skip = (page - 1) * limit;

  try {
    const posts = await Post.find()
      .populate('user', 'username email') 
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username email' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

