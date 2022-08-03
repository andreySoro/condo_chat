const express = require("express");
const router = express.Router();
const Contest = require("../../models/Contest");

router.post("/create", async (req, res) => {
  const SingleContest = new Contest({
    name: req.body.name,
    description: req.body.description,
    start_date: new Date(req.body.start_date),
    end_date: new Date(req.body.end_date),
    skill_test_question: req.body.skill_test_question,
    skill_test_answer: req.body.skill_test_answer,
    status: req.body.status,
  });
  if (!SingleContest) {
    return res.status(400).send("Contest not created");
  }
  await SingleContest.save();
  res.status(200).send(SingleContest);
  return;
});

module.exports = router;
