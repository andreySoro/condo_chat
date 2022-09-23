const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: { type: String },
  email: { type: String, unique: true },
  unitNumber: { type: String },
  address: { type: Number },
  reputation: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
