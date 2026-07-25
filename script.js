/* =========================================================
   LEISURE FAN TOURS AND SAFARIS
   SCRIPT.JS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {

        menuBtn.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            const icon = menuBtn.querySelector("i");

            if (navLinks.classList.contains("active")) {

                if (icon) {
                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-times");
                }

            } else {

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }

            }

        });


        /* Close mobile menu after clicking a link */

        document.querySelectorAll(".nav-links a").forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                const icon = menuBtn.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-times");

                    icon.classList.add("fa-bars");

                }

            });

        });

    }


    /* =====================================================
       SMOOTH SCROLLING
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {

        anchor.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections = document.querySelectorAll("section[id]");

    const navItems = document.querySelectorAll(".nav-links a");

    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navItems.forEach(function (link) {

            link.classList.remove("active");

            const linkTarget =
                link.getAttribute("href");

            if (
                linkTarget === "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }

    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );

    updateActiveNavigation();


    /* =====================================================
       BACK TO TOP BUTTON
    ===================================================== */

    const topBtn =
        document.getElementById("topBtn");

    if (topBtn) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 500) {

                    topBtn.style.display = "flex";

                } else {

                    topBtn.style.display = "none";

                }

            }
        );


        topBtn.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =====================================================
       SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".about-image, " +
            ".unique-image, " +
            ".experience-card, " +
            ".destination-card, " +
            ".gallery-grid img, " +
            ".review, " +
            ".feature"
        );


    const revealObserver =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.15
            }

        );


    revealElements.forEach(
        function (element) {

            element.classList.add(
                "reveal"
            );

            revealObserver.observe(
                element
            );

        }
    );


    /* =====================================================
       HERO PARALLAX EFFECT
    ===================================================== */

    const hero =
        document.querySelector(".hero");


    if (hero) {

        window.addEventListener(
            "scroll",
            function () {

                const scrollPosition =
                    window.scrollY;

                if (
                    scrollPosition < window.innerHeight
                ) {

                    hero.style.backgroundPosition =
                        "center " +
                        (scrollPosition * 0.35) +
                        "px";

                }

            }
        );

    }


    /* =====================================================
       QUOTE FORM
    ===================================================== */

    const quoteForm =
        document.querySelector(".quote-form");


    if (quoteForm) {

        quoteForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const destination =
                    document.getElementById(
                        "destination"
                    )?.value || "";


                const travelDate =
                    document.getElementById(
                        "travel-date"
                    )?.value || "";


                const travellers =
                    document.getElementById(
                        "travellers"
                    )?.value || "";


                const budget =
                    document.getElementById(
                        "budget"
                    )?.value || "";


                const accommodation =
                    document.getElementById(
                        "accommodation"
                    )?.value || "";


                const message =
                    document.getElementById(
                        "quote-message"
                    )?.value || "";


                const whatsappMessage =

                    "Hello Leisure Fan Tours and Safaris.%0A%0A" +

                    "I would like to request a free safari quote.%0A%0A" +

                    "Destination: " +
                    encodeURIComponent(destination) +

                    "%0ATravel Date: " +
                    encodeURIComponent(travelDate) +

                    "%0ANumber of Travellers: " +
                    encodeURIComponent(travellers) +

                    "%0ABudget: " +
                    encodeURIComponent(budget) +

                    "%0AAccommodation: " +
                    encodeURIComponent(accommodation) +

                    "%0AAdditional Information: " +
                    encodeURIComponent(message);


                const whatsappURL =
                    "https://wa.me/254740677858?text=" +
                    whatsappMessage;


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    /* =====================================================
       IMAGE LAZY LOADING
    ===================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach(
        function (image) {

            image.setAttribute(
                "loading",
                "lazy"
            );

        }
    );


    /* =====================================================
       IMAGE ERROR DETECTION
    ===================================================== */

    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    console.warn(
                        "Image not found: " +
                        image.src
                    );

                }
            );

        }
    );


    /* =====================================================
       YEAR AUTOMATICALLY UPDATES
    ===================================================== */

    const yearElement =
        document.getElementById(
            "currentYear"
        );


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       WELCOME MESSAGE
    ===================================================== */

    console.log(
        "Leisure Fan Tours and Safaris website loaded successfully."
    );

});