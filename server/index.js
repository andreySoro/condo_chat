const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

// IMPORTED ROUTES
const signUp = require("./routes/auth/signUp");
const signIn = require("./routes/auth/signIn");
const forgotPassword = require("./routes/auth/forgotPassword");

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

//SIGN UP
app.use("/signUp", signUp);

//SIGN IN
app.use("/signIn", signIn);

//FORGOT PASSWORD
app.use("/forgotPassword", forgotPassword);

// CONNECT TO DB
connectDB();

//GRAPHQL ROUTE
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
