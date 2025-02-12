// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwQ9Mg5JguRfoCkihnTRdr1YQNYDiGOWo",
  authDomain: "buramart-bd714.firebaseapp.com",
  projectId: "buramart-bd714",
  storageBucket: "buramart-bd714.firebasestorage.app",
  messagingSenderId: "555062567759",
  appId: "1:555062567759:web:a24d239674e68fb6db1b3a",
  measurementId: "G-5XPTB3F4GL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);