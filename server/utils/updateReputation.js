const User = require("../models/User");

const updateReputation = async (reputationAmount, author) => {
  await User.findOneAndUpdate(
    { id: author },
    { $inc: { reputation: reputationAmount } }
  );
};

module.exports = { updateReputation };
