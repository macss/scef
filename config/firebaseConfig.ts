// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqDVBMjVy6tcPz7D6Q-CauDBGyvoQ54mI",
  authDomain: "sistema-cef.firebaseapp.com",
  projectId: "sistema-cef",
  storageBucket: "sistema-cef.appspot.com",
  messagingSenderId: "60928801115",
  appId: "1:60928801115:web:702646ad978c511806427e",
  measurementId: "G-9YLQ40ZWWR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const firestore = getFirestore(app)