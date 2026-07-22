// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBbar43VLO99kgMLiC90drSXiVADS-xyaw",

    authDomain:
        "leisure-fan-tours-and-safaris.firebaseapp.com",

    projectId:
        "leisure-fan-tours-and-safaris",

    storageBucket:
        "leisure-fan-tours-and-safaris.firebasestorage.app",

    messagingSenderId:
        "199881242074",

    appId:
        "1:199881242074:web:887ced6c38c7de0712bce3"

};


// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


// ==========================================
// SET LOGIN PERSISTENCE
// ==========================================

setPersistence(
    auth,
    browserSessionPersistence
).catch((error) => {

    console.error(
        "Authentication persistence error:",
        error
    );

});


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const loginSection =
    document.getElementById(
        "loginSection"
    );


const adminDashboard =
    document.getElementById(
        "adminDashboard"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const loginBtn =
    document.getElementById(
        "loginBtn"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


const reviewsList =
    document.getElementById(
        "reviewsList"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================
// CHECK AUTHENTICATION STATUS
// ==========================================

onAuthStateChanged(
    auth,
    (user) => {

        if (user) {

            console.log(
                "Administrator logged in:",
                user.email
            );


            // Hide login

            if (loginSection) {

                loginSection.style.display =
                    "none";

            }


            // Show dashboard

            if (adminDashboard) {

                adminDashboard.style.display =
                    "block";

            }


            // Load reviews

            loadReviews();


        } else {


            console.log(
                "No administrator logged in."
            );


            // Show login

            if (loginSection) {

                loginSection.style.display =
                    "flex";

            }


            // Hide dashboard

            if (adminDashboard) {

                adminDashboard.style.display =
                    "none";

            }

        }

    }
);


// ==========================================
// LOGIN
// ==========================================

if (loginForm) {


    loginForm.addEventListener(
        "submit",
        async (event) => {


            // Prevent page reload

            event.preventDefault();


            // Get email

            const email =
                document
                .getElementById("email")
                .value
                .trim();


            // Get password

            const password =
                document
                .getElementById("password")
                .value;


            // Validate

            if (
                !email ||
                !password
            ) {

                loginMessage.textContent =
                    "Please enter your email and password.";

                loginMessage.style.color =
                    "red";

                return;

            }


            // Show loading

            loginMessage.textContent =
                "Verifying login...";

            loginMessage.style.color =
                "blue";


            loginBtn.disabled =
                true;


            loginBtn.textContent =
                "Logging in...";


            try {


                // Firebase login

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                console.log(
                    "Login successful:",
                    userCredential.user.email
                );


                loginMessage.textContent =
                    "Login successful! Opening dashboard...";

                loginMessage.style.color =
                    "green";


                /*
                 IMPORTANT:

                 We do NOT manually redirect.

                 Firebase will trigger
                 onAuthStateChanged().

                 That will automatically:

                 1. Hide login
                 2. Show dashboard
                 3. Load reviews
                */


            } catch (error) {


                console.error(
                    "LOGIN ERROR:",
                    error
                );


                loginMessage.style.color =
                    "red";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    loginMessage.textContent =
                        "Incorrect email or password.";


                } else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    loginMessage.textContent =
                        "No administrator account found with this email.";


                } else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    loginMessage.textContent =
                        "Incorrect password.";


                } else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    loginMessage.textContent =
                        "Please enter a valid email address.";


                } else {


                    loginMessage.textContent =
                        "Login failed: " +
                        error.message;

                }


            } finally {


                loginBtn.disabled =
                    false;


                loginBtn.textContent =
                    "Login";


            }

        }
    );

}


// ==========================================
// LOAD REVIEWS
// ==========================================

async function loadReviews() {


    if (!reviewsList) {

        console.error(
            "reviewsList element not found."
        );

        return;

    }


    reviewsList.innerHTML =
        "<p>Loading customer reviews...</p>";


    try {


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "reviews"
                )
            );


        console.log(
            "Reviews found:",
            snapshot.size
        );


        reviewsList.innerHTML =
            "";


        if (
            snapshot.empty
        ) {


            reviewsList.innerHTML =
                "<p>No customer reviews found.</p>";


            return;

        }


        snapshot.forEach(
            (reviewDoc) => {


                const data =
                    reviewDoc.data();


                const reviewId =
                    reviewDoc.id;


                const name =
                    data.name ||
                    "Anonymous";


                const country =
                    data.country ||
                    "Not provided";


                const review =
                    data.review ||
                    "No review text";


                const rating =
                    Number(
                        data.rating
                    ) || 0;


                const approved =
                    data.approved === true;


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "review-card";


                card.innerHTML = `

                    <h3>
                        ${name}
                    </h3>

                    <p>
                        <strong>
                            Country:
                        </strong>

                        ${country}
                    </p>

                    <p>
                        <strong>
                            Rating:
                        </strong>

                        ${
                            "⭐".repeat(
                                Math.min(
                                    rating,
                                    5
                                )
                            )
                        }
                    </p>

                    <p>
                        <strong>
                            Review:
                        </strong>

                        ${review}
                    </p>

                    <p>
                        <strong>
                            Status:
                        </strong>

                        ${
                            approved
                            ? "✅ Approved"
                            : "⏳ Pending"
                        }
                    </p>


                    <button
                        class="approve-btn"
                        data-id="${reviewId}"
                        ${
                            approved
                            ? "disabled"
                            : ""
                        }
                    >

                        ${
                            approved
                            ? "Already Approved"
                            : "Approve Review"
                        }

                    </button>


                    <button
                        class="delete-btn"
                        data-id="${reviewId}"
                    >

                        Delete Review

                    </button>

                `;


                reviewsList.appendChild(
                    card
                );

            }
        );


        // ==================================
        // APPROVE REVIEW BUTTONS
        // ==================================

        document
        .querySelectorAll(
            ".approve-btn"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    async () => {


                        const reviewId =
                            button.dataset.id;


                        try {


                            button.disabled =
                                true;


                            button.textContent =
                                "Approving...";


                            await updateDoc(

                                doc(
                                    db,
                                    "reviews",
                                    reviewId
                                ),

                                {
                                    approved:
                                        true
                                }

                            );


                            alert(
                                "Review approved successfully!"
                            );


                            await loadReviews();


                        } catch (error) {


                            console.error(
                                "APPROVE ERROR:",
                                error
                            );


                            alert(
                                "Failed to approve review: " +
                                error.message
                            );


                            button.disabled =
                                false;

                        }

                    }
                );

            }
        );


        // ==================================
        // DELETE REVIEW BUTTONS
        // ==================================

        document
        .querySelectorAll(
            ".delete-btn"
        )
        .forEach(
            (button) => {


                button.addEventListener(
                    "click",
                    async () => {


                        const reviewId =
                            button.dataset.id;


                        const confirmed =
                            confirm(
                                "Are you sure you want to delete this review?"
                            );


                        if (
                            !confirmed
                        ) {

                            return;

                        }


                        try {


                            button.disabled =
                                true;


                            button.textContent =
                                "Deleting...";


                            await deleteDoc(

                                doc(
                                    db,
                                    "reviews",
                                    reviewId
                                )

                            );


                            alert(
                                "Review deleted successfully!"
                            );


                            await loadReviews();


                        } catch (error) {


                            console.error(
                                "DELETE ERROR:",
                                error
                            );


                            alert(
                                "Failed to delete review: " +
                                error.message
                            );


                            button.disabled =
                                false;

                        }

                    }
                );

            }
        );


    } catch (error) {


        console.error(
            "ERROR LOADING REVIEWS:",
            error
        );


        reviewsList.innerHTML = `

            <div class="review-card">

                <p style="color:red;">

                    <strong>
                        Failed to load reviews.
                    </strong>

                    <br><br>

                    ${error.message}

                </p>

            </div>

        `;

    }

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {


    logoutBtn.addEventListener(
        "click",
        async () => {


            try {


                await signOut(
                    auth
                );


                console.log(
                    "Administrator logged out."
                );


                if (loginMessage) {

                    loginMessage.textContent =
                        "You have been logged out.";

                    loginMessage.style.color =
                        "green";

                }


            } catch (error) {


                console.error(
                    "LOGOUT ERROR:",
                    error
                );


                alert(
                    "Logout failed: " +
                    error.message
                );

            }

        }
    );

}