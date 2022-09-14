const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, unique: true },
});

module.exports = mongoose.model("countries", CountrySchema);
