import { db } from "./firebase.js";

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

const auth = getAuth();

const reviewsList = document.getElementById("reviewsList");
const logoutBtn = document.getElementById("logoutBtn");

// Check login
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        loadReviews();
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
});

// Load reviews
async function loadReviews() {

    reviewsList.innerHTML = "<p>Loading reviews...</p>";

    try {

        const snapshot = await getDocs(collection(db, "reviews"));

        reviewsList.innerHTML = "";

        if (snapshot.empty) {
            reviewsList.innerHTML = "<p>No reviews found.</p>";
            return;
        }

        snapshot.forEach((reviewDoc) => {

            const data = reviewDoc.data();

            const card = document.createElement("div");

            card.className = "review-card";

            card.innerHTML = `
                <h3>${data.name}</h3>

                <p><strong>Country:</strong> ${data.country}</p>

                <p><strong>Rating:</strong> ${"⭐".repeat(data.rating)}</p>

                <p>${data.review}</p>

                <p>
                    <strong>Status:</strong>
                    ${data.approved ? "✅ Approved" : "⏳ Pending"}
                </p>

                <button class="approve" data-id="${reviewDoc.id}">
                    ${data.approved ? "Approved" : "Approve"}
                </button>

                <button class="delete" data-id="${reviewDoc.id}">
                    Delete
                </button>

                <hr>
            `;

            reviewsList.appendChild(card);

        });

        // Approve buttons
        document.querySelectorAll(".approve").forEach((button) => {

            button.addEventListener("click", async () => {

                const id = button.dataset.id;

                await updateDoc(doc(db, "reviews", id), {
                    approved: true
                });

                alert("Review approved.");

                loadReviews();

            });

        });

        // Delete buttons
        document.querySelectorAll(".delete").forEach((button) => {

            button.addEventListener("click", async () => {

                const id = button.dataset.id;

                if (confirm("Delete this review?")) {

                    await deleteDoc(doc(db, "reviews", id));

                    alert("Review deleted.");

                    loadReviews();

                }

            });

        });

    } catch (error) {

        console.error(error);

        reviewsList.innerHTML = `
            <p style="color:red;">
                Failed to load reviews.<br>
                ${error.message}
            </p>
        `;

    }

}