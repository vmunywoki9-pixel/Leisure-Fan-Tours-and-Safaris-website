import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ===============================
// FIREBASE CONFIGURATION
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyBbar43VLO99kgMLiC90drSXiVADS-xyaw",

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


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ===============================
// GET HTML ELEMENTS
// ===============================

const loginSection =
    document.getElementById("loginSection");

const adminDashboard =
    document.getElementById("adminDashboard");

const loginForm =
    document.getElementById("loginForm");

const loginBtn =
    document.getElementById("loginBtn");

const loginMessage =
    document.getElementById("loginMessage");

const reviewsList =
    document.getElementById("reviewsList");

const logoutBtn =
    document.getElementById("logoutBtn");


// ===============================
// CHECK AUTHENTICATION
// ===============================

onAuthStateChanged(auth, (user) => {

    if (user) {

        // User is already logged in

        console.log(
            "Administrator logged in:",
            user.email
        );

        // Hide login

        loginSection.style.display = "none";

        // Show dashboard

        adminDashboard.style.display = "block";

        // Load reviews

        loadReviews();

    } else {

        // User is not logged in

        loginSection.style.display = "flex";

        adminDashboard.style.display = "none";

    }

});


// ===============================
// LOGIN
// ===============================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        loginMessage.textContent =
            "Verifying login...";

        loginMessage.style.color =
            "#00695c";

        loginBtn.disabled = true;

        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            console.log(
                "Login successful"
            );

            loginMessage.textContent =
                "Login successful. Opening dashboard...";

            loginMessage.style.color =
                "green";

            // The onAuthStateChanged function
            // will automatically show the dashboard.

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                "Login failed: " + error.message;

            loginMessage.style.color =
                "red";

            loginBtn.disabled = false;

        }

    }
);


// ===============================
// LOAD REVIEWS
// ===============================

async function loadReviews() {

    reviewsList.innerHTML =
        "<p>Loading customer reviews...</p>";

    try {

        const snapshot =
            await getDocs(
                collection(db, "reviews")
            );

        console.log(
            "Reviews found:",
            snapshot.size
        );

        reviewsList.innerHTML = "";

        if (snapshot.empty) {

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
                    data.name || "Anonymous";

                const country =
                    data.country || "Not provided";

                const review =
                    data.review || "No review text";

                const rating =
                    Number(data.rating) || 0;

                const approved =
                    data.approved === true;


                const card =
                    document.createElement("div");

                card.className =
                    "review-card";


                card.innerHTML = `

                    <h3>${name}</h3>

                    <p>
                        <strong>Country:</strong>
                        ${country}
                    </p>

                    <p>
                        <strong>Rating:</strong>
                        ${"⭐".repeat(rating)}
                    </p>

                    <p>
                        <strong>Review:</strong>
                        ${review}
                    </p>

                    <p class="status">
                        <strong>Status:</strong>
                        ${
                            approved
                            ? "✅ Approved"
                            : "⏳ Pending"
                        }
                    </p>

                    <button
                        class="approve-btn"
                        data-id="${reviewId}"
                        ${approved ? "disabled" : ""}
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


        // ===============================
        // APPROVE BUTTONS
        // ===============================

        document
            .querySelectorAll(".approve-btn")
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
                                        approved: true
                                    }

                                );


                                alert(
                                    "Review approved successfully."
                                );


                                loadReviews();


                            } catch (error) {

                                console.error(
                                    error
                                );

                                alert(
                                    "Failed to approve review: " +
                                    error.message
                                );

                                button.disabled =
                                    false;

                                button.textContent =
                                    "Approve Review";

                            }

                        }
                    );

                }
            );


        // ===============================
        // DELETE BUTTONS
        // ===============================

        document
            .querySelectorAll(".delete-btn")
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


                            if (!confirmed) {

                                return;

                            }


                            try {

                                await deleteDoc(

                                    doc(
                                        db,
                                        "reviews",
                                        reviewId
                                    )

                                );


                                alert(
                                    "Review deleted successfully."
                                );


                                loadReviews();


                            } catch (error) {

                                console.error(
                                    error
                                );

                                alert(
                                    "Failed to delete review: " +
                                    error.message
                                );

                            }

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "Error loading reviews:",
            error
        );


        reviewsList.innerHTML = `

            <p style="color:red;">

                Failed to load reviews.

                <br><br>

                Error:

                ${error.message}

            </p>

        `;

    }

}


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            console.log(
                "Administrator logged out"
            );

            // onAuthStateChanged will
            // automatically show login page

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

            alert(
                "Logout failed: " +
                error.message
            );

        }

    }
