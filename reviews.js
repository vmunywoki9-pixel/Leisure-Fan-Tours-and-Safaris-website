// ============================================
// LEISURE FAN TOURS AND SAFARIS
// CUSTOMER REVIEWS
// ============================================

import {
    db
} from "./Firebase.js";

import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// HTML ELEMENTS
// ============================================

const reviewForm =
    document.getElementById("reviewForm");

const reviewsContainer =
    document.getElementById("reviewsContainer");

const reviewStatus =
    document.getElementById("reviewStatus");


// ============================================
// LOAD APPROVED REVIEWS
// ============================================

function loadReviews() {

    if (!reviewsContainer) {
        return;
    }


    const reviewsQuery = query(

        collection(
            db,
            "reviews"
        ),

        where(
            "approved",
            "==",
            true
        ),

        orderBy(
            "createdAt",
            "desc"
        )

    );


    onSnapshot(
        reviewsQuery,

        (snapshot) => {

            reviewsContainer.innerHTML = "";


            if (snapshot.empty) {

                reviewsContainer.innerHTML = `

                    <div class="no-reviews">

                        <p>
                            No reviews available yet.
                        </p>

                    </div>

                `;

                return;
            }


            snapshot.forEach(
                (doc) => {

                    const review =
                        doc.data();


                    const name =
                        review.name ||
                        "Anonymous";


                    const rating =
                        Number(
                            review.rating || 5
                        );


                    const message =
                        review.message ||
                        "";


                    const stars =
                        "★".repeat(rating) +
                        "☆".repeat(5 - rating);


                    const reviewCard =
                        document.createElement(
                            "div"
                        );


                    reviewCard.className =
                        "review-card";


                    reviewCard.innerHTML = `

                        <div class="review-header">

                            <h3>
                                ${escapeHTML(name)}
                            </h3>

                            <div class="review-stars">

                                ${stars}

                            </div>

                        </div>


                        <p class="review-text">

                            ${escapeHTML(message)}

                        </p>

                    `;


                    reviewsContainer.appendChild(
                        reviewCard
                    );

                }
            );

        },

        (error) => {

            console.error(
                "Error loading reviews:",
                error
            );

            reviewsContainer.innerHTML = `

                <p class="error-message">

                    Unable to load reviews.

                </p>

            `;

        }

    );

}


// ============================================
// SUBMIT REVIEW
// ============================================

if (reviewForm) {

    reviewForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "reviewName"
                ).value.trim();


            const emailElement =
                document.getElementById(
                    "reviewEmail"
                );


            const email =
                emailElement
                    ? emailElement.value.trim()
                    : "";


            const rating =
                Number(
                    document.getElementById(
                        "reviewRating"
                    ).value
                );


            const message =
                document.getElementById(
                    "reviewMessage"
                ).value.trim();


            if (
                !name ||
                !message ||
                !rating
            ) {

                showReviewStatus(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            try {

                const submitButton =
                    reviewForm.querySelector(
                        "button[type='submit']"
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Submitting...";

                }


                await addDoc(

                    collection(
                        db,
                        "reviews"
                    ),

                    {

                        name:
                            name,

                        email:
                            email,

                        rating:
                            rating,

                        message:
                            message,

                        approved:
                            false,

                        createdAt:
                            serverTimestamp()

                    }

                );


                showReviewStatus(

                    "Thank you! Your review has been submitted and is awaiting approval.",

                    "success"

                );


                reviewForm.reset();


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Submit Review";

                }


            } catch (error) {

                console.error(
                    "Error submitting review:",
                    error
                );


                showReviewStatus(

                    "Unable to submit your review. Please try again.",

                    "error"

                );


                const submitButton =
                    reviewForm.querySelector(
                        "button[type='submit']"
                    );


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


// ============================================
// STATUS MESSAGE
// ============================================

function showReviewStatus(
    message,
    type
) {

    if (!reviewStatus) {
        return;
    }


    reviewStatus.textContent =
        message;


    reviewStatus.className =
        "review-status " + type;

}


// ============================================
// SECURITY: ESCAPE HTML
// ============================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ============================================
// START REVIEWS
// ============================================

loadReviews();