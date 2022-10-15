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
const User = require("./models/User");

// IMPORTED ROUTES
const auth = require("./routes/auth/");

//FIREBASE ADMIN SDK INIT
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "condochatapp.appspot.com",
});

// const message = {
//   data: {},
//   notification: {
//     title: "This is very important message",
//     body: "Tomorrow is a day off so ya hoooo"
//   },
//   topic: "backendTest"
// };

//TOPIC MESSAGING
// admin.messaging().send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });

//DIRECT MESSAGING
// admin.messaging().sendToDevice(
//   ["eh9GUWczQKiJ5gNfLdAxK2:APA91bFUcTSqH25fHpwwmoz0NiwhmjECdasMWg0jeVzpFdB3mf9n2hwkZAx_K0BVmqZl1kQKfEl6IKQXRP20Yu8fVkRu1EyHAJWedT4lb5W5mBp-fo-DI_2zcU9Iar3Ul0iGRAeheyck"], // device fcm tokens...
//   {
//     data: {},
//     notification: {
//       body: "This is FCM notification test from ADMIN #2",
//       title: "Message test from Backend"
//     },
//   },
//   {
//     // Required for background/quit data-only messages on iOS
//     contentAvailable: true,
//     // Required for background/quit data-only messages on Android
//     priority: 'high',
//   },
// ).then(res => console.log('SUCCESS', res)).catch(err => console.log('ERROR', err));


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

//IMAGE UPLOAD
app.use("/upload", imageUpload);

//FCM NOTIFICATION test
app.post('/updateFCM', async (req, res) => {
  const fcmToken = req.body.fcmToken
  const userId = req.body.userId
  const existedUser = await User.findOne({ id: userId });
  if(existedUser){
    if(existedUser.fcmTokens.includes(fcmToken)){
      console.log("FCM token already exists");
      res.status(200).json({ message: "FCM token already exists" });
    } else {
      existedUser.fcmTokens.push(fcmToken);
      await existedUser.save();
      res.status(200).json({ message: "FCM token added" });
    }
  }
})
app.post('/sendNotification', async(req, res) => {
  const userIds = req.body.userIds
  const {message, title, chatId} = req.body
  const listOfFcmTokens = () => {
    return userIds.map(async (userId) => {
        const user = await User.findOne({ id: userId });
        return user.fcmTokens
      })
  };
  const result = await Promise.all(listOfFcmTokens()).then(res => res.flat())
  console.log('TOKENS', result);
  await admin.messaging().sendToDevice(result, {
    data: {
      chatId: String(chatId),
    },
    notification: {
      title,
      body: message,
    },
  }).then(res => console.log('SUCCESSFULY SENT NOTIFICATIONS', res)).catch(err => console.log('ERROR', err));

  res.status(200).json({ message: "Notification sent" });
})

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

app.listen(port, console.log(`Server running on port ${port}`));
