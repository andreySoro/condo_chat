const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  addressName: { type: String, unique: true },
  postalCode: { type: String, required: true },
  city: { type: Number, required: true },
});

module.exports = mongoose.model("addresses", AddressSchema);
