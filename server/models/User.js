const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
