const express = require("express");
const router = express.Router();
const multer = require("multer");
const CommentController = require("../controllers/CommentController");
const authentication = require("../middlewares/authentication");
const verifyPostAndComment = require("../middlewares/verifyPostAndComment");
const { like, removeLike } = require("../controllers/LikeComment");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/posts/:postId/comments",
  authentication,
  CommentController.create
);

router.get("/:id", CommentController.getCommentById);

router.post(
  "/:postId/comments/:commentId/like",
  authentication,
  verifyPostAndComment,
  like
);

router.delete(
  "/:postId/comments/:commentId/like",
  authentication,
  verifyPostAndComment,
  removeLike
);

module.exports = router;
