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

    res.json({ token });
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

    if (userId === toFollowId)
      return res.status(400).json({ message: "No puedes seguirte a ti mismo" });

    const user = await User.findById(userId);
    const toFollowUser = await User.findById(toFollowId);

    if (!toFollowUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    if (user.following.includes(toFollowId))
      return res.status(400).json({ message: "Ya sigues a este usuario" });

    user.following.push(toFollowId);
    toFollowUser.followers.push(userId);

    await user.save();
    await toFollowUser.save();

    res.json({ message: `Ahora sigues a ${toFollowUser.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al seguir usuario" });
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
  const { username } = req.query;

  if (!username) {
    return res
      .status(400)
      .json({ message: "El parámetro 'username' es requerido" });
  }

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("username email image");

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/confirm/:token", UserController.confirmAccount);

router.get("/profile/full", authentication, UserController.getFullProfile);

router.get("/:id", authentication, UserController.getById);

module.exports = router;
