const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  name: { type: String, unique: true },
  province: { type: Number },
});

module.exports = mongoose.model("cities", CitySchema);
