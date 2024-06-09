// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hassan-s-blog.firebaseapp.com",
  projectId: "hassan-s-blog",
  storageBucket: "hassan-s-blog.appspot.com",
  messagingSenderId: "545706155738",
  appId: "1:545706155738:web:0893b5aef089030c63cfe3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
