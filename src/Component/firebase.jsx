// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAsYhKJiaHc6Y6wZ6xn6q0OeIRIq6s3cA",
  authDomain: "housie-fb968.firebaseapp.com",
  databaseURL: "https://housie-fb968-default-rtdb.firebaseio.com",
  projectId: "housie-fb968",
  storageBucket: "housie-fb968.firebasestorage.app",
  messagingSenderId: "950284111878",
  appId: "1:950284111878:web:67fef91ad9a9249add3387"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


