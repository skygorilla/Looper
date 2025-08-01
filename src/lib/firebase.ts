'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ2HXPQK96daVePwiubuyUr6QyovlhT54",
  authDomain: "looper-61c39.firebaseapp.com",
  projectId: "looper-61c39",
  storageBucket: "looper-61c39.appspot.com",
  messagingSenderId: "1058247668506",
  appId: "1:1058247668506:web:c33602615c9d92386df2a3",
  measurementId: "G-G8YLJK4LSG"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Sign in anonymously
signInAnonymously(auth).catch((error) => {
  console.error("Anonymous sign-in failed:", error);
});

export { app, db, auth };
