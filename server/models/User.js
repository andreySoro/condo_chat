const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: { type: String },
  email: { type: String, unique: true },
  unitNumber: { type: String },
  profileImgUri: { type: String },
  address: { type: Number },
  reputation: { type: Number, default: 0 },
  fcmTokens: { type: [String], default: [] },
  contentFilter: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", UserSchema);
