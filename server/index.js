const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
// const { schema, resolvers } = require("./schema/schema.gql");
const schema = require("./schema/schema");
const requireAuth = require("./middleware/auth.check");

// IMPORTED ROUTES
const auth = require("./routes/auth/");
const contest = require("./routes/contest");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// BACKEND INITIALIZATION-
const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

//AUTH RELATED ROUTES
app.use("/auth", auth);

//Contest
app.use("/contest", contest);

// CONNECT TO DB
connectDB();

//GRAPHQL ROUTE
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    // rootValue: resolvers,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`Server running on port ${port}`));
