const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const requireAuth = require("./middleware/auth.check");

// IMPORTED ROUTES
const signUp = require("./routes/auth/signUp");
const signIn = require("./routes/auth/signIn");
const forgotPassword = require("./routes/auth/forgotPassword");
const refreshToken = require("./routes/auth/refreshToken");
const contest = require("./routes/contest/index");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// BACKEND INITIALIZATION-
const app = express();
app.use(cors());
app.use(bodyParser.json());

//AUTH RELATED ROUTES
app.use("/signIn", signIn);
app.use("/signUp", signUp);
app.use("/forgotPassword", forgotPassword);
app.use("/refreshToken", refreshToken);
app.get("/testAuth", requireAuth, (req, res) => {
  res.status(200).send("You are authorized");
});

//Contest
app.use("/contest", contest);

// CONNECT TO DB
connectDB();

//GRAPHQL ROUTE
// app.use(
//   "/graphql",
//   graphqlHTTP({
//     schema,
//     graphiql: process.env.NODE_ENV === "development",
//   })
// );

app.listen(port, console.log(`Server running on port ${port}`));
