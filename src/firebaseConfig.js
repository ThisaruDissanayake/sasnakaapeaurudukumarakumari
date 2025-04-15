// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJYwDBARr9lRxD6mDWrsANtqCTWaVcNqM",
  authDomain: "sasnaka-ape-aurudu-2025.firebaseapp.com",
  projectId: "sasnaka-ape-aurudu-2025",
  storageBucket: "sasnaka-ape-aurudu-2025.appspot.com",
  messagingSenderId: "140128153594",
  appId: "1:140128153594:web:aed5c2f26ef83f0dd3be43",
  measurementId: "G-CNTB0C0VME"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

