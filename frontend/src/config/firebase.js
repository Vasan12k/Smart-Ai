// Firebase configuration for frontend
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC8A1iq66Edcc4Cp1h8vG0s31iWudsNckU",
  authDomain: "ai-website-df9b4.firebaseapp.com",
  projectId: "ai-website-df9b4",
  storageBucket: "ai-website-df9b4.firebasestorage.app",
  messagingSenderId: "886747020868",
  appId: "1:886747020868:web:b7717d83b2338857b4c611",
  measurementId: "G-RM5PJRRFJW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
