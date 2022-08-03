const mongoose = require("mongoose");

const TicketsSchema = new mongoose.Schema({
  tickets: [
    {
      is_redeemed: {
        type: Boolean,
      },
      redeemed_expiry: {
        type: Date,
      },
      fk_contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contests",
      },
    },
  ],
});

module.exports = mongoose.model("Ticket", TicketsSchema);
