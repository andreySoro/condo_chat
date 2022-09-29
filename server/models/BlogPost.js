const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  author: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  comments: { type: Array, default: [] },
  upVote: { type: Array, default: [] },
  downVote: { type: Array, default: [] },
  address: { type: Number, required: true },
  votesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: { type: Array, default: [] },
  imageUrl: { type: String, default: null },
});

module.exports = mongoose.model("blogPosts", BlogPostSchema);
