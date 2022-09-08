const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: { type: String },
  email: { type: String, unique: true },
  area: {
    addressOne: { type: String },
    addressTwo: { type: String },
    city: { type: String },
    province: { type: String },
    postalCode: { type: String },
  },
});

module.exports = mongoose.model("User", UserSchema);
