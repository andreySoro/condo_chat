const Contest = require("../../models/Contest");

const createContest = async (req, res) => {
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
  try {
    await SingleContest.save();
    res.status(200).send(SingleContest);
    return;
  } catch (error) {
    if (error?.code === 11000) {
      res.status(400).send({
        error: {
          message: `${error?.keyValue?.name} already exists`,
        },
      });
    } else {
      res.status(400).send({
        error: {
          message: `Error creating contest`,
          status: error?.code,
        },
      });
    }
  }
};

module.exports = createContest;
