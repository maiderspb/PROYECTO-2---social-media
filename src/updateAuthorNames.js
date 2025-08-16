const mongoose = require("mongoose");
const Post = require("./models/Post");
const User = require("./models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/rediam";

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log("Conectado a MongoDB");

    const posts = await Post.find().populate("user");
    const updates = [];

    for (const post of posts) {
      if (!post.authorName && post.user && post.user.username) {
        post.authorName = post.user.username;
        updates.push(post.save());
        console.log(`✅ Actualizado post "${post.title}" con autor: ${post.user.username}`);
      }
    }

    await Promise.all(updates);
    console.log(`🔁 Se actualizaron ${updates.length} posts`);
    process.exit();
  })
  .catch(err => {
    console.error("❌ Error al conectar:", err);
    process.exit(1);
  });
