import {
    getAuth,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href = "login.html";

    }

});

document.getElementById("logoutBtn").addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

});
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});
import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const reviewsList = document.getElementById("reviewsList");

async function loadReviews() {

    reviewsList.innerHTML = "";

    const snapshot = await getDocs(collection(db, "reviews"));

    snapshot.forEach((reviewDoc) => {

        const data = reviewDoc.data();

        const card = document.createElement("div");

        card.className = "review-card";

        card.innerHTML = `
            <h3>${data.name}</h3>
            <p><strong>Country:</strong> ${data.country}</p>
            <p><strong>Rating:</strong> ${"⭐".repeat(data.rating)}</p>
            <p>${data.review}</p>
            <p><strong>Status:</strong> ${data.approved ? "Approved" : "Pending"}</p>

            <button class="approve" data-id="${reviewDoc.id}">
                ${data.approved ? "Approved" : "Approve"}
            </button>

            <button class="delete" data-id="${reviewDoc.id}">
                Delete
            </button>
        `;

        reviewsList.appendChild(card);

    });

    document.querySelectorAll(".approve").forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            await updateDoc(doc(db, "reviews", id), {
                approved: true
            });

            alert("Review Approved");

            loadReviews();

        });

    });

    document.querySelectorAll(".delete").forEach(button => {

        button.addEventListener("click", async () => {

            const id = button.dataset.id;

            if (confirm("Delete this review?")) {

                await deleteDoc(doc(db, "reviews", id));

                alert("Review Deleted");

                loadReviews();

            }

        });

    });

}

loadReviews();