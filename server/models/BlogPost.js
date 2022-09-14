const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  comments: { type: Array },
  upVote: { type: Number },
  downVote: { type: Number },
  address: { type: Number, required: true },
});

module.exports = mongoose.model("blogPosts", BlogPostSchema);
