require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Requiere las rutas ANTES de usarlas
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

// Usa las rutas
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Conexión a MongoDB y arranque del servidor después
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB conectado correctamente");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));
