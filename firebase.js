// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUISKPg4mWVFmvuH_PgWgR_iFyiKfG42Q",
  authDomain: "booking-32922.firebaseapp.com",
  projectId: "booking-32922",
  storageBucket: "booking-32922.appspot.com",
  messagingSenderId: "1057868823401",
  appId: "1:1057868823401:web:9fabf9d24da8f24dce1bf8",
  measurementId: "G-BD3W22FJBT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app)