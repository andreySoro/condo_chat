const mongoose = require("mongoose");

const ProvincesSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String },
  country: { type: Number },
});

module.exports = mongoose.model("provinces", ProvincesSchema);
