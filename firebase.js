// ============================================
// LEISURE FAN TOURS AND SAFARIS
// FIREBASE CONFIGURATION
// ============================================

// Firebase App
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase Authentication
import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Firestore
import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// FIREBASE CONFIGURATION
// ============================================

const firebaseConfig = {

    apiKey: "AIzaSyBbar43VLO99kgMLiC90drSXiVADS-xyaw",

    authDomain: "leisure-fan-tours-and-safaris.firebaseapp.com",

    projectId: "leisure-fan-tours-and-safaris",

    storageBucket: "leisure-fan-tours-and-safaris.firebasestorage.app",

    messagingSenderId: "199881242074",

    appId: "1:199881242074:web:887ced6c38c7de0712bce3",

    measurementId: "G-4ERCTKSFRY"

};


// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);


// ============================================
// INITIALIZE AUTHENTICATION
// ============================================

const auth = getAuth(app);


// ============================================
// INITIALIZE FIRESTORE
// ============================================

const db = getFirestore(app);


// ============================================
// EXPORT
// ============================================

export {
    app,
    auth,
    db
};