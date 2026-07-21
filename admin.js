// ============================================
// LEISURE FAN TOURS AND SAFARIS
// ADMIN DASHBOARD
// ============================================

import {
    auth,
    db
} from "./Firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
    collection,
    query,
    orderBy,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// ============================================
// HTML ELEMENTS
// ============================================

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const adminReviewsContainer =
    document.getElementById(
        "adminReviewsContainer"
    );

const totalReviews =
    document.getElementById(
        "totalReviews"
    );

const approvedReviews =
    document.getElementById(
        "approvedReviews"
    );

const pendingReviews =
    document.getElementById(
        "pendingReviews"
    );

const adminMessage =
    document.getElementById(
        "adminMessage"
    );

const refreshReviews =
    document.getElementById(
        "refreshReviews"
    );


// ============================================
// CHECK AUTHENTICATION
// ============================================

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            // User is not logged in
            window.location.replace(
                "Login.html"
            );

            return;
        }


        console.log(
            "Admin logged in:",
            user.email
        );


        // User is authenticated
        loadAdminReviews();

    }
);


// ============================================
// LOAD ALL REVIEWS
// ============================================

function loadAdminReviews() {

    if (!adminReviewsContainer) {
        return;
    }


    adminReviewsContainer.innerHTML = `

        <div class="loading">

            Loading reviews...

        </div>

    `;


    const reviewsQuery = query(

        collection(
            db,
            "reviews"
        ),

        orderBy(
            "createdAt",
            "desc"
        )

    );


    onSnapshot(

        reviewsQuery,

        (snapshot) => {

            adminReviewsContainer.innerHTML = "";


            let total = 0;

            let approved = 0;

            let pending = 0;


            if (snapshot.empty) {

                adminReviewsContainer.innerHTML = `

                    <div class="no-reviews">

                        <h3>
                            No Reviews Found
                        </h3>

                        <p>
                            Customer reviews will appear here.
                        </p>

                    </div>

                `;


                updateStatistics(
                    0,
                    0,
                    0
                );


                return;
            }


            snapshot.forEach(
                (reviewDoc) => {

                    total++;


                    const review =
                        reviewDoc.data();


                    if (
                        review.approved === true
                    ) {

                        approved++;

                    } else {

                        pending++;

                    }


                    createReviewCard(

                        reviewDoc.id,

                        review

                    );

                }
            );


            updateStatistics(

                total,

                approved,

                pending

            );

        },

        (error) => {

            console.error(
                "Firestore error:",
                error
            );


            adminReviewsContainer.innerHTML = `

                <div class="error-message">

                    <h3>
                        Unable to load reviews
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;

        }

    );

}


// ============================================
// CREATE REVIEW CARD
// ============================================

function createReviewCard(
    reviewId,
    review
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "admin-review-card";


    const name =
        review.name ||
        "Anonymous";


    const email =
        review.email ||
        "No email provided";


    const message =
        review.message ||
        "";


    const rating =
        Number(
            review.rating || 5
        );


    const stars =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);


    const status =
        review.approved === true
            ? "Approved"
            : "Pending";


    const statusClass =
        review.approved === true
            ? "approved"
            : "pending";


    card.innerHTML = `

        <div class="admin-review-top">

            <div>

                <h3>

                    ${escapeHTML(name)}

                </h3>

                <p class="review-email">

                    ${escapeHTML(email)}

                </p>

            </div>


            <span
                class="review-status-badge ${statusClass}">

                ${status}

            </span>

        </div>


        <div class="admin-rating">

            ${stars}

        </div>


        <p class="admin-review-message">

            ${escapeHTML(message)}

        </p>


        <div class="review-actions">

            <button
                class="approve-button"
                data-id="${reviewId}">

                ${
                    review.approved === true
                        ? "Unapprove"
                        : "Approve"
                }

            </button>


            <button
                class="delete-button"
                data-id="${reviewId}">

                Delete

            </button>

        </div>

    `;


    adminReviewsContainer.appendChild(
        card
    );


    // APPROVE / UNAPPROVE

    const approveButton =
        card.querySelector(
            ".approve-button"
        );


    approveButton.addEventListener(
        "click",
        () => {

            toggleApproval(

                reviewId,

                review.approved === true

            );

        }
    );


    // DELETE

    const deleteButton =
        card.querySelector(
            ".delete-button"
        );


    deleteButton.addEventListener(
        "click",
        () => {

            deleteReview(
                reviewId
            );

        }
    );

}


// ============================================
// APPROVE / UNAPPROVE REVIEW
// ============================================

async function toggleApproval(
    reviewId,
    currentlyApproved
) {

    try {

        await updateDoc(

            doc(
                db,
                "reviews",
                reviewId
            ),

            {

                approved:
                    !currentlyApproved

            }

        );


        showAdminMessage(

            currentlyApproved
                ? "Review has been unapproved."
                : "Review has been approved.",

            "success"

        );


    } catch (error) {

        console.error(
            error
        );


        showAdminMessage(

            "Unable to update review.",

            "error"

        );

    }

}


// ============================================
// DELETE REVIEW
// ============================================

async function deleteReview(
    reviewId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this review?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(

            doc(
                db,
                "reviews",
                reviewId
            )

        );


        showAdminMessage(

            "Review deleted successfully.",

            "success"

        );


    } catch (error) {

        console.error(
            error
        );


        showAdminMessage(

            "Unable to delete review.",

            "error"

        );

    }

}


// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics(

    total,

    approved,

    pending

) {

    if (totalReviews) {

        totalReviews.textContent =
            total;

    }


    if (approvedReviews) {

        approvedReviews.textContent =
            approved;

    }


    if (pendingReviews) {

        pendingReviews.textContent =
            pending;

    }

}


// ============================================
// LOGOUT
// ============================================

if (logoutButton) {

    logoutButton.addEventListener(

        "click",

        async () => {

            try {

                await signOut(
                    auth
                );


                window.location.replace(
                    "Login.html"
                );


            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

            }

        }

    );

}


// ============================================
// REFRESH REVIEWS
// ============================================

if (refreshReviews) {

    refreshReviews.addEventListener(

        "click",

        () => {

            loadAdminReviews();

        }

    );

}


// ============================================
// ADMIN MESSAGE
// ============================================

function showAdminMessage(
    message,
    type
) {

    if (!adminMessage) {
        return;
    }


    adminMessage.textContent =
        message;


    adminMessage.className =
        "admin-message " + type;


    setTimeout(
        () => {

            adminMessage.textContent =
                "";

            adminMessage.className =
                "admin-message";

        },

        3000

    );

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