// ============================================
// LEISURE FAN TOURS AND SAFARIS
// ADMIN LOGIN
// ============================================

import {
    auth
} from "./Firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// ============================================
// GET HTML ELEMENTS
// ============================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");


// ============================================
// LOGIN FUNCTION
// ============================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !password) {

        showMessage(
            "Please enter your email and password.",
            "error"
        );

        return;
    }


    try {

        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        showMessage(
            "",
            ""
        );


        // Firebase Authentication
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );


        showMessage(
            "Login successful. Redirecting...",
            "success"
        );


        // Redirect to Admin Dashboard
        setTimeout(() => {

            window.location.href =
                "Admin.html";

        }, 800);


    } catch (error) {

        console.error(
            "Login Error:",
            error
        );


        let errorMessage =
            "Login failed. Please try again.";


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            errorMessage =
                "Invalid email or password.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            errorMessage =
                "No admin account found with this email.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            errorMessage =
                "Incorrect password.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage =
                "Please enter a valid email address.";

        }


        showMessage(
            errorMessage,
            "error"
        );


        loginButton.disabled = false;

        loginButton.textContent =
            "Login";

    }

});


// ============================================
// SHOW LOGIN MESSAGE
// ============================================

function showMessage(
    message,
    type
) {

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message " + type;

}