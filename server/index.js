const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5050;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
const { schemaWithPermissions } = require("./config/graphql.shield");
const imageUpload = require("./routes/photoUpload");
const user = require("./routes/user");
const { logger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// IMPORTED ROUTES
const auth = require("./routes/auth/");
const fcm = require("./routes/fcm/");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "condochatapp.appspot.com",
});

// BACKEND INITIALIZATION-
const app = express();
app.use(logger);

app.use(
  helmet({
    contentSecurityPolicy:
      //graphqli would not work otherwise
      process.env.NODE_ENV === "development" ? false : true,
  })
);
app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extended: true }));

//AUTH RELATED ROUTES
app.use("/auth", auth);

//IMAGE UPLOAD
app.use("/upload", imageUpload);

//FCM NOTIFICATIONS
app.use("/fcm", fcm);

//USER RELATED routes
app.use("/user", user);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Condochat App");
});

// CONNECT TO DB
connectDB();

//GRAPHQL ROUTE
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaWithPermissions,
    graphiql:
      process.env.NODE_ENV === "development"
        ? {
            headerEditorEnabled: true,
          }
        : false,
  })
);

app.use(errorHandler);

app.listen(port, console.log(`Server running on port ${port}`));
