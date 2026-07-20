import { app, db } from "./firebase.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth(app);

const reviewsList = document.getElementById("reviewsList");
const logoutBtn = document.getElementById("logoutBtn");

// Protect Admin Page
onAuthStateChanged(auth, (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    loadReviews();

});

// Logout
logoutBtn.addEventListener("click", async () => {

    try {

        await signOut(auth);

        alert("Logged out successfully.");

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

// Load Reviews
async function loadReviews() {

    reviewsList.innerHTML = "<p>Loading reviews...</p>";

    try {

        const querySnapshot = await getDocs(collection(db, "reviews"));

        reviewsList.innerHTML = "";

        if (querySnapshot.empty) {

            reviewsList.innerHTML = "<p>No customer reviews found.</p>";

            return;

        }

        querySnapshot.forEach((review) => {

            const data = review.data();

            const card = document.createElement("div");

            card.className = "review-card";

            card.innerHTML = `
                <h3>${data.name}</h3>

                <p><strong>Country:</strong> ${data.country}</p>

                <p><strong>Rating:</strong> ${"⭐".repeat(data.rating || 0)}</p>

                <p>${data.review}</p>

                <p>
                    <strong>Status:</strong>
                    ${data.approved ? "✅ Approved" : "⏳ Pending"}
                </p>

                <button class="approve-btn" data-id="${review.id}">
                    ${data.approved ? "Approved" : "Approve"}
                </button>

                <button class="delete-btn" data-id="${review.id}">
                    Delete
                </button>

                <hr>
            `;

            reviewsList.appendChild(card);

        });

        // Approve Review

        document.querySelectorAll(".approve-btn").forEach((button) => {

            button.addEventListener("click", async () => {

                const reviewId = button.dataset.id;

                try {

                    await updateDoc(doc(db, "reviews", reviewId), {

                        approved: true

                    });

                    alert("Review approved successfully.");

                    loadReviews();

                } catch (error) {

                    console.error(error);

                    alert(error.message);

                }

            });

        });

        // Delete Review

        document.querySelectorAll(".delete-btn").forEach((button) => {

            button.addEventListener("click", async () => {

                const reviewId = button.dataset.id;

                const confirmDelete = confirm("Are you sure you want to delete this review?");

                if (!confirmDelete) return;

                try {

                    await deleteDoc(doc(db, "reviews", reviewId));

                    alert("Review deleted successfully.");

                    loadReviews();

                } catch (error) {

                    console.error(error);

                    alert(error.message);

                }

            });

        });

    } catch (error) {

        console.error(error);

        reviewsList.innerHTML = `
            <p style="color:red;">
                Error loading reviews.<br>
                ${error.message}
            </p>
        `;

    }

}