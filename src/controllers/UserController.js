const User = require("../models/User");
const Post = require("../models/Post");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const UserController = {
  create: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const image = req.file ? req.file.filename : null;

      const newUser = new User({
        username,
        email,
        password,
        image,
        confirmed: false,
      });
      await newUser.save();

      const confirmationToken = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET_CONFIRM || "secretConfirmKey",
        { expiresIn: "1d" }
      );

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const confirmationUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/confirm/${confirmationToken}`;

      const mailOptions = {
        from: `"Tu App" <${process.env.EMAIL_USER}>`,
        to: newUser.email,
        subject: "Confirma tu cuenta",
        html: `<p>Hola ${newUser.username},</p>
               <p>Gracias por registrarte. Por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
               <a href="${confirmationUrl}">${confirmationUrl}</a>`,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message:
          "Usuario creado. Por favor revisa tu correo para confirmar la cuenta.",
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al crear usuario", error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const updates = req.body;
      if (req.file) {
        updates.image = req.file.filename;
      }

      const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });

      if (!updatedUser)
        return res.status(404).json({ message: "Usuario no encontrado" });

      res
        .status(200)
        .json({ message: "Usuario actualizado", user: updatedUser });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al actualizar usuario", error: err.message });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId)
        .select("-password")
        .populate("followers", "username image")
        .populate("following", "username image");

      const posts = await Post.find({ user: userId });

      res.status(200).json({
        user,
        numberOfFollowers: user.followers.length,
        numberOfFollowing: user.following.length,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener perfil del usuario",
        error: error.message,
      });
    }
  },

  getFullProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findById(userId)
        .select("-password")
        .populate("followers", "username")
        .populate("following", "username");

      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      const posts = await Post.find({ user: userId });

      const numberOfFollowers = user.followers.length;

      const followersUsernames = user.followers.map(
        (follower) => follower.username
      );

      res.status(200).json({
        user,
        posts,
        numberOfFollowers,
        followersUsernames,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener perfil completo",
        error: error.message,
      });
    }
  },

  confirmAccount: async (req, res) => {
    try {
      const { token } = req.params;

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_CONFIRM || "secretConfirmKey"
      );

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (user.confirmed) {
        return res.status(400).json({ message: "La cuenta ya fue confirmada" });
      }

      user.confirmed = true;
      await user.save();

      res.status(200).json({ message: "Cuenta confirmada correctamente" });
    } catch (error) {
      res.status(400).json({
        message: "Token inválido o expirado",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      if (!user.confirmed) {
        return res.status(403).json({
          message:
            "Debes confirmar tu correo electrónico antes de iniciar sesión",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "yourSecret",
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        token,
        user: { id: user._id, username: user.username },
      });
    } catch (err) {
      res.status(500).json({
        message: "Error al iniciar sesión",
        error: err.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id)
        .select("-password -tokens")
        .populate("followers", "username image")
        .populate("following", "username image");
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error al buscar usuario", error: err.message });
    }
  },
};

module.exports = UserController;
