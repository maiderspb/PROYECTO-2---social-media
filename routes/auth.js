const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuthor = require("../middlewares/isAuthor");
const authentication = require("../middlewares/authentication");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message:
          "Por favor, rellena todos los campos: username, email y password.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashed });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    res
      .status(500)
      .json({ message: "Error al registrar", error: err.message || err });
  }
});

// Login
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

router.get("/me", authentication, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el usuario", error: err });
  }
});

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

module.exports = router;
