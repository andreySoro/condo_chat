const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  message: { type: String, required: true },
  author: { type: String, required: true },
  postId: { type: Number, required: true },
  upVote: { type: Array },
  downVote: { type: Array },
});

module.exports = mongoose.model("comments", CommentSchema);
