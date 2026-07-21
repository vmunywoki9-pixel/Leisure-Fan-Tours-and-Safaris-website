import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ==========================================
// REVIEW FORM
// ==========================================

const reviewForm =
    document.getElementById("reviewForm");


if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // Get customer information

            const name =
                document
                .getElementById("reviewName")
                .value
                .trim();


            const country =
                document
                .getElementById("reviewCountry")
                .value
                .trim();


            const rating =
                Number(
                    document
                    .getElementById("reviewRating")
                    .value
                );


            const review =
                document
                .getElementById("reviewMessage")
                .value
                .trim();


            // Validate form

            if (
                !name ||
                !country ||
                !rating ||
                !review
            ) {

                alert(
                    "Please complete all fields."
                );

                return;

            }


            // Find submit button

            const submitButton =
                reviewForm.querySelector(
                    "button[type='submit']"
                );


            try {

                // Disable button

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Submitting...";

                }


                // Save review to Firestore

                await addDoc(

                    collection(
                        db,
                        "reviews"
                    ),

                    {

                        name: name,

                        country: country,

                        rating: rating,

                        review: review,

                        // Review must be approved
                        // by administrator first

                        approved: false,

                        createdAt:
                            serverTimestamp()

                    }

                );


                // Success message

                alert(
                    "✅ Thank you! Your review has been submitted successfully and is waiting for approval."
                );


                // Clear form

                reviewForm.reset();


            } catch (error) {

                console.error(
                    "Error submitting review:",
                    error
                );


                alert(
                    "❌ Failed to submit your review. Please try again."
                );


            } finally {

                // Enable button again

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Review";

                }

            }

        }

    );

}


// ==========================================
// LOAD APPROVED REVIEWS
// ==========================================

async function loadReviews() {

    const container =
        document.getElementById(
            "firebaseReviews"
        );


    if (!container) {

        console.error(
            "firebaseReviews container not found."
        );

        return;

    }


    // Show loading message

    container.innerHTML = `

        <div class="review">

            <p>
                Loading customer reviews...
            </p>

        </div>

    `;


    try {

        // Get only approved reviews

        const reviewsQuery =
            query(

                collection(
                    db,
                    "reviews"
                ),

                where(
                    "approved",
                    "==",
                    true
                )

            );


        const snapshot =
            await getDocs(
                reviewsQuery
            );


        // Clear container

        container.innerHTML = "";


        // No approved reviews

        if (snapshot.empty) {

            container.innerHTML = `

                <div class="review">

                    <p>
                        Customer reviews will appear here after approval.
                    </p>

                </div>

            `;

            return;

        }


        // Display approved reviews

        snapshot.forEach(
            (reviewDoc) => {

                const data =
                    reviewDoc.data();


                const name =
                    data.name ||
                    "Anonymous";


                const country =
                    data.country ||
                    "Guest";


                const rating =
                    Number(
                        data.rating
                    ) || 0;


                const review =
                    data.review ||
                    "";


                // Create star rating

                const stars =
                    "⭐".repeat(
                        Math.min(
                            Math.max(
                                rating,
                                0
                            ),
                            5
                        )
                    );


                // Create review card

                const reviewCard =
                    document.createElement(
                        "div"
                    );


                reviewCard.className =
                    "review-card";


                // Name

                const nameElement =
                    document.createElement(
                        "h3"
                    );

                nameElement.textContent =
                    name;


                // Country

                const countryElement =
                    document.createElement(
                        "small"
                    );

                countryElement.textContent =
                    country;


                // Rating

                const ratingElement =
                    document.createElement(
                        "p"
                    );

                ratingElement.textContent =
                    stars;


                // Review text

                const reviewElement =
                    document.createElement(
                        "p"
                    );

                reviewElement.textContent =
                    review;


                // Add elements to card

                reviewCard.appendChild(
                    nameElement
                );

                reviewCard.appendChild(
                    countryElement
                );

                reviewCard.appendChild(
                    ratingElement
                );

                reviewCard.appendChild(
                    reviewElement
                );


                // Add card to website

                container.appendChild(
                    reviewCard
                );

            }

        );


    } catch (error) {

        console.error(
            "Error loading approved reviews:",
            error
        );


        container.innerHTML = `

            <div class="review">

                <p>
                    Unable to load customer reviews at the moment.
                </p>

            </div>

        `;

    }

}


// ==========================================
// LOAD REVIEWS WHEN WEBSITE OPENS
// ==========================================

loadReviews();