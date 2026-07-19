// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBbar43VLO99kgMLiC90drSXiVADS-xyaw",
    authDomain: "leisure-fan-tours-and-safaris.firebaseapp.com",
    projectId: "leisure-fan-tours-and-safaris",
    storageBucket: "leisure-fan-tours-and-safaris.firebasestorage.app",
    messagingSenderId: "199881242074",
    appId: "1:199881242074:web:887ced6c38c7de0712bce3",
    measurementId: "G-4ERCTKSFRY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

export { db };