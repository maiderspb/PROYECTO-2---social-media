require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

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
