require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

const swaggerUI = require("swagger-ui-express");
const docs = require("./docs/index.js");
app.use(cors());

app.use(
  "/api/docs",
  swaggerUI.serve,
  swaggerUI.setup(docs, { explorer: true })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authentication = require("./middlewares/authentication");
const CommentController = require("./controllers/CommentController");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


app.post(
  "/api/posts/:postId/comments/:commentId/like",
  authentication,
  CommentController.like
);

app.delete(
  "/api/posts/:postId/comments/:commentId/like",
  authentication,
  CommentController.unlike
);

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("✅ MongoDB conectado correctamente");

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error de conexión a MongoDB:", err);
  });
