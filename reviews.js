import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Review Form
const reviewForm = document.getElementById("reviewForm");

if (reviewForm) {

  reviewForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const country = document.getElementById("reviewCountry").value;
    const rating = Number(document.getElementById("reviewRating").value);
    const review = document.getElementById("reviewMessage").value;

    try {

      await addDoc(collection(db, "reviews"), {
        name: name,
        country: country,
        rating: rating,
        review: review,
        approved: false,
        createdAt: serverTimestamp()
      });

      alert("✅ Thank you! Your review has been submitted and is awaiting approval.");

      reviewForm.reset();

    } catch (error) {

      console.error(error);

      alert("❌ Failed to submit review.");

    }

  });

}

// Load Approved Reviews
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
    container.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  snapshot.forEach((doc) => {

    const data = doc.data();

    container.innerHTML += `
      <div class="review">
        <h3>${"⭐".repeat(data.rating)}</h3>
        <p>${data.review}</p>
        <h4>${data.name}</h4>
        <small>${data.country}</small>
        <hr>
      </div>
    `;

  });

}

loadReviews();