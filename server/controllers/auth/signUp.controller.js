const User = require("../../models/User");
const { doesUserExistCall, createNewUserCall } = require("../../services/user");
const { sendEmailConfirmationCall } = require("../../services/auth");

const signUp = async (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res.status(400).send("Invalid request");
    return;
  }
  //CHECKING IF NEW USER OR NOT
  const doesUserExist = await doesUserExistCall(req);

  if (doesUserExist) {
    return res.status(400).send({
      error: {
        message: "User already exist, try to sign in or reset your password",
      },
    });
  } else {
    const newUser = await createNewUserCall(req);

    if (newUser) {
      if (req.body.emailVerification) {
        await sendEmailConfirmationCall(newUser.idToken);
      }
      const loacalUser = new User({
        id: newUser.localId,
        email: req.body.email,
      });
      console.log("LOCAL USER==", loacalUser);
      await loacalUser.save().catch((err) =>
        res.status(400).send({
          error: {
            message:
              "User already exist, try to sign in or reset your password",
          },
        })
      );
      return res.status(201).send({
        user: newUser,
        message: "User created successfully",
        emailVerification: req.body.emailVerification,
      });
    } else {
      return res.status(400).send({
        error: {
          message: "User could not be created",
        },
      });
    }
  }
};

module.exports = signUp;
