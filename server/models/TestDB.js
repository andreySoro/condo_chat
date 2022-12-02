const mongoose = require("mongoose");

const TestDBSchema = new mongoose.Schema({
  mandate: {
    type: String,
  },
  votesFor: { type: [String], default: [] },
  votesAgainst: { type: [String], default: [] },
});

module.exports = mongoose.model("TestDB", TestDBSchema);
