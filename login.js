[21/07/2026, 17:02:54] Leisure Fan Tours and Safaris: 3976533
[21/07/2026, 19:58:46] I2: import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const db = getFirestore(app);

document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(auth, email, password);

        // Hide login section
        document.querySelector(".login-box").style.display = "none";

        // Show admin dashboard
        document.getElementById("adminDashboard").style.display = "block";

        // Load reviews
        loadReviews();

    } catch (error) {

        console.error(error);

        alert("Invalid email or password.");

    }

});


// Load Reviews
async function loadReviews() {

    const reviewsList = document.getElementById("reviewsList");

    reviewsList.innerHTML = "<p>Loading reviews...</p>";

    try {

        const snapshot = await getDocs(
            collection(db, "reviews")
        );

        reviewsList.innerHTML = "";

        if (snapshot.empty) {

            reviewsList.innerHTML =
                "<p>No reviews found.</p>";

            return;

        }

        snapshot.forEach((reviewDoc) => {

            const data = reviewDoc.data();

            const card =
                document.createElement("div");

            card.className = "review-card";

            card.innerHTML = `
                <h3>${data.name}</h3>

                <p>
                    <strong>Country:</strong>
                    ${data.country}
                </p>

                <p>
                    <strong>Rating:</strong>
                    ${"⭐".repeat(data.rating || 0)}
                </p>

                <p>${data.review}</p>

                <p>
                    <strong>Status:</strong>
                    ${data.approved
                        ? "✅ Approved"
                        : "⏳ Pending"}
                </p>

                <button
                    onclick="approveReview('${reviewDoc.id}')">
                    ${data.approved
                        ? "Approved"
                        : "Approve"}
                </button>

                <button
                    onclick="deleteReview('${reviewDoc.id}')">
                    Delete
                </button>
            `;

            reviewsList.appendChild(card);

        });

    } catch (error) {

        console.error(error);

        reviewsList.innerHTML =
            `<p style="color:red;">
                ${error.message}
            </p>`;

    }

}


// Approve Review
window.approveReview = async function(id) {

    try {

        await updateDoc(
            doc(db, "reviews", id),
            {
                approved: true
            }
        );

        alert("Review approved.");

        loadReviews();

    } catch (error) {

        alert(error.message);

    }

};


// Delete Review
window.deleteReview = async function(id) {

    if (!confirm("Delete this review?")) {
        return;
    }

    try {

        await deleteDoc(
            doc(db, "reviews", id)
        );

        alert("Review deleted.");

        loadReviews();

    } catch (error) {

        alert(error.message);

    }

};