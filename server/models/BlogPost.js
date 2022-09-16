const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  comments: { type: Array },
  upVote: { type: Array },
  downVote: { type: Array },
  address: { type: Number, required: true },
});

module.exports = mongoose.model("blogPosts", BlogPostSchema);
