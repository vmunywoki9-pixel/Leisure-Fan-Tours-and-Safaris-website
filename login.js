import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getAuth,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
apiKey: "AIzaSyBbar43VLO99kgMLiC90drSXiVADS-xyaw",
authDomain: "leisure-fan-tours-and-safaris.firebaseapp.com",
projectId: "leisure-fan-tours-and-safaris",
storageBucket: "leisure-fan-tours-and-safaris.firebasestorage.app",
messagingSenderId: "199881242074",
appId: "1:199881242074:web:887ced6c38c7de0712bce3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {

e.preventDefault();  

const email = document.getElementById("email").value;  
const password = document.getElementById("password").value;  

try {  

    await signInWithEmailAndPassword(auth, email, password);  

    alert("Login Successful");  

    window.location.href = "admin.html";  

} catch (error) {  

    alert("Invalid email or password.");  

    console.error(error);  

}

});
}