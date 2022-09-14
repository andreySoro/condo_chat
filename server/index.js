const express = require("express");
require("dotenv").config();
require("firebase/compat/auth");
const port = process.env.PORT || 5050;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const helmet = require("helmet");
const schema = require("./schema/schema");

// IMPORTED ROUTES
const auth = require("./routes/auth/");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const City = require("./models/City");
const Address = require("./models/Address");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// BACKEND INITIALIZATION-
const app = express();
app.use(
  helmet({
    contentSecurityPolicy:
      //graphqli would not work otherwise
      process.env.NODE_ENV === "development" ? false : true,
  })
);
app.use(cors());
app.use(bodyParser.json());

//AUTH RELATED ROUTES
app.use("/auth", auth);

// CONNECT TO DB
connectDB();

app.use("/search", async (req, res) => {
  const { query, provinceId, address, cityId } = req.query;
  if (query && provinceId) {
    const citiesReturned = await City.aggregate([
      {
        $search: {
          index: "searchCity",
          autocomplete: {
            query: query,
            path: "name",
            tokenOrder: "sequential",
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $match: {
          province: Number(provinceId),
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     name: 1,
      //   },
      // },
    ]);

    return res.status(200).send(citiesReturned);
  } else {
    const citiesReturned = await Address.aggregate([
      {
        $search: {
          index: "searchAddress",
          autocomplete: {
            query: address,
            path: "name",
            tokenOrder: "sequential",
          },
        },
      },
      {
        $limit: 10,
      },
      {
        $match: {
          city: Number(cityId),
        },
      },
      // {
      //   $project: {
      //     _id: 0,
      //     name: 1,
      //   },
      // },
    ]);
    return res.status(200).send(citiesReturned);
  }

  // City.find({ name: { $regex: query, $options: "i=" } }, (err, cities) => {
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     res.status(200).send(cities);
  //   }
  // }).limit(10);
});

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
