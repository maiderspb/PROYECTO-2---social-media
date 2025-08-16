const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const isAuthor = require("../middlewares/isAuthor");
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/upload");
const UserController = require("../controllers/UserController");

const router = express.Router();

router.get("/:id/liked-posts", authentication, async (req, res) => {
  try {
    const { id } = req.params;

    const likedPosts = await Post.find({ likes: id }).populate("user", "username email image");

    res.json(likedPosts);
  } catch (error) {
    console.error("Error obteniendo posts con like:", error);
    res.status(500).json({ message: "Error obteniendo posts con like" });
  }
});

router.put("/users/:userId", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updateData = {
      username,
      email,
      image: user.image, 
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ message: "Error actualizando usuario", error: error.message });
  }
});

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          "Por favor, rellena todos los campos: username, email y password.",
      });
    }

    const handleFollow = async (userIdToFollow) => {
  try {
    await dispatch(followUserAsync(userIdToFollow)).unwrap();
   
  } catch (error) {
    alert(`No se pudo seguir al usuario: ${error}`);
  }
};
    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashed,
      image,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res.status(500).json({
      message: "Error al registrar",
      error: err.message || err,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

     const { password: pwd, ...userData } = user.toObject();
      res.json({ token, user: userData });

  } catch (err) {
    res.status(500).json({ message: "Error en login", error: err });
  }
});

router.get("/me", authentication, UserController.getProfile);

router.post("/logout", (req, res) => {
  res.json({ message: "Logout realizado en el cliente eliminando el token" });
});

router.put("/posts/:id", authentication, isAuthor, async (req, res) => {
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedPost);
});

router.delete("/posts/:id", authentication, isAuthor, async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post eliminado correctamente" });
});

router.post("/:id/follow", authentication, async (req, res) => {
  try {
    const userId = req.user.id;  
    const toFollowId = req.params.id;  

    console.log("Usuario que sigue:", userId);
    console.log("Usuario a seguir:", toFollowId);

    if (userId === toFollowId)
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });

    const user = await User.findById(userId);
    const toFollowUser = await User.findById(toFollowId);

    if (!toFollowUser) return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.following.includes(toFollowId))
      return res.status(400).json({ message: "Ya sigues a este usuario" });

    user.following.push(toFollowId);
    toFollowUser.followers.push(userId);

    await user.save();
    await toFollowUser.save();

    res.json({ message: `Has seguido a ${toFollowUser.username}` });
  } catch (error) {
  console.error("Error al seguir:", error);
  alert(`No se pudo seguir al usuario: ${error.message || JSON.stringify(error)}`);
}
});

router.get("/:id/followers", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "username email image")
      .populate("following", "username email image");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("Error en GET /api/users/:id/followers:", error);
    res.status(500).json({ message: "Error al obtener seguidores y siguiendo" });
  }
});

router.post("/:id/unfollow", authentication, async (req, res) => {
  try {
    const userId = req.user.id;
    const toUnfollowId = req.params.id;

    if (userId === toUnfollowId)
      return res
        .status(400)
        .json({ message: "No puedes dejar de seguirte a ti mismo" });

    const user = await User.findById(userId);
    const toUnfollowUser = await User.findById(toUnfollowId);

    if (!toUnfollowUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (!user.following.includes(toUnfollowId))
      return res.status(400).json({ message: "No sigues a este usuario" });

    user.following = user.following.filter(
      (id) => id.toString() !== toUnfollowId
    );
    toUnfollowUser.followers = toUnfollowUser.followers.filter(
      (id) => id.toString() !== userId
    );

    await user.save();
    await toUnfollowUser.save();

    res.json({ message: `Has dejado de seguir a ${toUnfollowUser.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al dejar de seguir usuario" });
  }
});

router.get("/search", async (req, res) => {
  const term = req.query.term || req.query.username;

  if (!term) {
    return res
      .status(400)
      .json({ message: "El parámetro 'username' es requerido" });
  }

  try {
    const users = await User.find({
      username: { $regex: term, $options: "i" },
    }).select("username email image");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/confirm/:token", UserController.confirmAccount);

router.get("/profile/full", authentication, UserController.getFullProfile);

router.get("/:id", authentication, UserController.getById);

router.put("/profile", authentication, upload.single("image"), UserController.update);
router.put("/:id", authentication, upload.single("image"), UserController.update);

router.post("/posts", authentication, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Título y contenido requeridos" });
    }

    const newPost = new Post({
      title,
      content,
      user: req.user.id, 
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("❌ Error al crear post:", error);
    res.status(500).json({ message: "Error al crear post", error });
  }
});


module.exports = router;