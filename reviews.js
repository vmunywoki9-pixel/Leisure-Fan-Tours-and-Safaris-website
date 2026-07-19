import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
<form id="reviewForm">

<input type="text" id="reviewName" placeholder="Your Name" required>

<input type="text" id="reviewCountry" placeholder="Country" required>

<select id="reviewRating" required>

<option value="">Choose Rating</option>

<option value="5">★★★★★ Excellent</option>

<option value="4">★★★★☆ Very Good</option>

<option value="3">★★★☆☆ Good</option>

<option value="2">★★☆☆☆ Fair</option>

<option value="1">★☆☆☆☆ Poor</option>

</select>

<textarea
id="reviewMessage"
placeholder="Write your review..."
required></textarea>

<button type="submit">Submit Review</button>

</form>
<div id="firebaseReviews"></div>

  reviewForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("reviewName").value;
    const country = document.getElementById("reviewCountry").value;
    const rating = parseInt(document.getElementById("reviewRating").value);
    const review = document.getElementById("reviewMessage").value;

    try {

      await addDoc(collection(db, "reviews"), {

        name,
        country,
        rating,
        review,
        approved: false,
        createdAt: serverTimestamp()

      });

      alert("✅ Thank you! Your review has been received and is awaiting approval.");

      reviewForm.reset();

    } catch (error) {

      alert("Failed to submit review.");

      console.error(error);

    }

  });

}

// Display Approved Reviews

async function loadReviews() {

  const container = document.getElementById("firebaseReviews");

  if (!container) return;

  container.innerHTML = "";

  const q = query(
    collection(db, "reviews"),
    where("approved", "==", true)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {

    const data = doc.data();

    container.innerHTML += `

      <div class="review">

          <h3>${"⭐".repeat(data.rating)}</h3>

          <p>"${data.review}"</p>

          <h4>${data.name}</h4>

          <small>${data.country}</small>

      </div>

    `;

  });

}

loadReviews();