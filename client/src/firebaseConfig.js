import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAfz7a3M2b45CxwPxVVSwtFvXKtDkO37jw",
  authDomain: "test-auth-356806.firebaseapp.com",
  projectId: "test-auth-356806",
  storageBucket: "test-auth-356806.appspot.com",
  messagingSenderId: "328111251228",
  appId: "1:328111251228:web:fbfae9a30698a7ad04a4d9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
