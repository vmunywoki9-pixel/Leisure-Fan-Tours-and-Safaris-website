mport { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Review Form
const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {

    reviewForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("reviewName").value.trim();
        const country = document.getElementById("reviewCountry").value.trim();
        const rating = Number(document.getElementById("reviewRating").value);
        const review = document.getElementById("reviewMessage").value.trim();

        if (!name || !country || !rating || !review) {
            alert("Please complete all fields.");
            return;
        }

        try {

            await addDoc(collection(db, "reviews"), {
                name: name,
                country: country,
                rating: rating,
                review: review,
                approved: false,
                createdAt: serverTimestamp()
            });

            alert("✅ Thank you! Your review has been submitted for approval.");

            reviewForm.reset();

        } catch (error) {

            console.error(error);
            alert("❌ Failed to submit review.");

        }

    });

}

// Display approved reviews
async function loadReviews() {

    const container = document.getElementById("firebaseReviews");

    if (!container) return;

    container.innerHTML = "";

    const q = query(
        collection(db, "reviews"),
        where("approved", "==", true)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        container.innerHTML = "<p>No customer reviews yet.</p>";
        return;
    }

    snapshot.forEach((doc) => {

        const data = doc.data();

        container.innerHTML += `
            <div class="review-card">
                <h3>${"⭐".repeat(data.rating)}</h3>
                <p>${data.review}</p>
                <h4>${data.name}</h4>
                <small>${data.country}</small>
            </div>
        `;

    });

}

loadReviews();