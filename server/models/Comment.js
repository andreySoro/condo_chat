const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  message: { type: String, required: true },
  author: { type: String, required: true },
  postId: { type: Number, default: null },
  replyId: { type: Number, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upVote: { type: Array, default: [] },
  downVote: { type: Array, default: [] },
  votesCount: { type: Number, default: 0 },
  imageUrl: { type: String, default: null },
});

module.exports = mongoose.model("comments", CommentSchema);
