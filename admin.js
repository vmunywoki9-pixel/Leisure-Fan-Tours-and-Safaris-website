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

const reviewsList =
    document.getElementById("reviewsList");

const logoutBtn =
    document.getElementById("logoutBtn");


// ===============================
// CHECK ADMIN LOGIN
// ===============================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        // Not logged in
        window.location.href = "login.html";

        return;

    }


    console.log(
        "Administrator logged in:",
        user.email
    );


    // Load reviews
    loadReviews();

});


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";

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
);


// ===============================
// LOAD REVIEWS
// ===============================

async function loadReviews() {

    reviewsList.innerHTML =
        "<p>Loading reviews...</p>";


    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "reviews"
                )
            );


        reviewsList.innerHTML = "";


        if (snapshot.empty) {

            reviewsList.innerHTML =
                "<p>No reviews found.</p>";

            return;

        }


        snapshot.forEach(
            (reviewDoc) => {

                const data =
                    reviewDoc.data();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "review-card";


                card.innerHTML = `

                    <h3>
                        ${data.name || "Customer"}
                    </h3>

                    <p>
                        <strong>Country:</strong>
                        ${data.country || "Not provided"}
                    </p>

                    <p>
                        <strong>Rating:</strong>
                        ${"⭐".repeat(
                            Number(data.rating) || 0
                        )}
                    </p>

                    <p>
                        ${data.review || ""}
                    </p>

                    <p>
                        <strong>Status:</strong>

                        ${
                            data.approved
                            ? "✅ Approved"
                            : "⏳ Pending"
                        }

                    </p>


                    <button
                        class="approve"
                        data-id="${reviewDoc.id}"
                    >

                        ${
                            data.approved
                            ? "Approved"
                            : "Approve"
                        }

                    </button>


                    <button
                        class="delete"
                        data-id="${reviewDoc.id}"
                    >

                        Delete

                    </button>

                `;


                reviewsList.appendChild(
                    card
                );

            }
        );


        // ===============================
        // APPROVE BUTTON
        // ===============================

        document
            .querySelectorAll(".approve")
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const id =
                                button.dataset.id;


                            try {

                                await updateDoc(

                                    doc(
                                        db,
                                        "reviews",
                                        id
                                    ),

                                    {
                                        approved: true
                                    }

                                );


                                alert(
                                    "Review Approved"
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

                            }

                        }
                    );

                }
            );


        // ===============================
        // DELETE BUTTON
        // ===============================

        document
            .querySelectorAll(".delete")
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        async () => {

                            const id =
                                button.dataset.id;


                            if (
                                !confirm(
                                    "Delete this review?"
                                )
                            ) {

                                return;

                            }


                            try {

                                await deleteDoc(

                                    doc(
                                        db,
                                        "reviews",
                                        id
                                    )

                                );


                                alert(
                                    "Review Deleted"
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

                <br>

                ${error.message}

            </p>

        `;

    }

}