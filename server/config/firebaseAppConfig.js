const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDo1IJLuYzhlx3zrLXtiu84_BL8Tg_6G8k",
  authDomain: "condochatapp.firebaseapp.com",
  projectId: "condochatapp",
  storageBucket: "condochatapp.appspot.com",
  messagingSenderId: "358716272565",
  appId: "1:358716272565:web:5e62c0471f1b301144b3fc",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = storage;
