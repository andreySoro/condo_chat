const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: { type: String },
});

module.exports = mongoose.model("Tags", TagSchema);
