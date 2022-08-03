const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  skill_test_question: {
    type: String,
    required: true,
  },
  skill_test_answer: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Contest", ContestSchema);
