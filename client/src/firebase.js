// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "connect-and-rent-2002095.firebaseapp.com",
  projectId: "connect-and-rent-2002095",
  storageBucket: "connect-and-rent-2002095.appspot.com",
  messagingSenderId: "995580130305",
  appId: "1:995580130305:web:83247800845b1085527c00"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);