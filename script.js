// =========================================================
// LEISURE FAN TOURS AND SAFARIS
// LUXURY WEBSITE - MAIN JAVASCRIPT
// =========================================================


// =========================================================
// 1. MOBILE NAVIGATION
// =========================================================

const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (navLinks.classList.contains("active")) {

            icon.classList.remove("fa-bars");

            icon.classList.add("fa-times");

        } else {

            icon.classList.remove("fa-times");

            icon.classList.add("fa-bars");

        }

    });

}


// =========================================================
// 2. CLOSE MOBILE MENU AFTER CLICKING A LINK
// =========================================================

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        if (navLinks) {

            navLinks.classList.remove("active");

        }

        const icon =
            menuBtn ?
            menuBtn.querySelector("i") :
            null;

        if (icon) {

            icon.classList.remove("fa-times");

            icon.classList.add("fa-bars");

        }

    });

});


// =========================================================
// 3. ANIMATED STATISTICS COUNTER
// =========================================================

const counters =
    document.querySelectorAll(".counter");

let counterStarted = false;


function startCounters() {

    if (counterStarted) return;

    counterStarted = true;


    counters.forEach(counter => {

        const target =
            Number(counter.getAttribute("data-target"));

        let count = 0;

        const increment =
            Math.max(1, Math.ceil(target / 100));


        function updateCounter() {

            count += increment;


            if (count < target) {

                counter.innerText =
                    count;

                setTimeout(
                    updateCounter,
                    25
                );

            } else {

                counter.innerText =
                    target + "+";

            }

        }


        updateCounter();

    });

}


// Start counter when About section becomes visible

const aboutSection =
    document.querySelector("#about");


if (aboutSection) {

    const counterObserver =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        startCounters();

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.3
            }

        );


    counterObserver.observe(
        aboutSection
    );

}


// =========================================================
// 4. SCROLL REVEAL ANIMATIONS
// =========================================================

const revealElements =
    document.querySelectorAll(

        ".card, " +
        ".review, " +
        ".price-card, " +
        ".stat, " +
        ".gallery-container img"

    );


function revealElementsOnScroll() {

    const windowHeight =
        window.innerHeight;


    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;


        if (
            elementTop <
            windowHeight - 80
        ) {

            element.classList.add(
                "visible"
            );

        }

    });

}


// Run once when page loads

revealElementsOnScroll();


// Run when scrolling

window.addEventListener(
    "scroll",
    revealElementsOnScroll
);


// =========================================================
// 5. BACK TO TOP BUTTON
// =========================================================

const topBtn =
    document.getElementById(
        "topBtn"
    );


if (topBtn) {

    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY >
                500
            ) {

                topBtn.style.display =
                    "flex";

            } else {

                topBtn.style.display =
                    "none";

            }

        }
    );


    topBtn.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// =========================================================
// 6. SMOOTH SCROLLING
// =========================================================

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const targetElement =
                    document.querySelector(
                        targetId
                    );


                if (targetElement) {

                    event.preventDefault();


                    targetElement.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }

            }
        );

    });


// =========================================================
// 7. ACTIVE NAVIGATION
// =========================================================

const sections =
    document.querySelectorAll(
        "section[id]"
    );


const navItems =
    document.querySelectorAll(
        ".nav-links a"
    );


function updateActiveNavigation() {

    let currentSection =
        "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 180;


        if (
            window.scrollY >=
            sectionTop
        ) {

            currentSection =
                section.getAttribute(
                    "id"
                );

        }

    });


    navItems.forEach(link => {

        link.classList.remove(
            "active"
        );


        const linkTarget =
            link.getAttribute(
                "href"
            );


        if (
            linkTarget ===
            "#" + currentSection
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}


window.addEventListener(
    "scroll",
    updateActiveNavigation
);


updateActiveNavigation();


// =========================================================
// 8. HERO SCROLL EFFECT
// =========================================================

const hero =
    document.querySelector(
        ".hero"
    );


if (hero) {

    window.addEventListener(
        "scroll",
        () => {

            const scrollPosition =
                window.scrollY;


            if (
                scrollPosition <
                window.innerHeight
            ) {

                hero.style.backgroundPosition =
                    ⁠ center ${scrollPosition * 0.3}px ⁠;

            }

        }
    );

}


// =========================================================
// 9. SAFARI PACKAGE SELECTION
// =========================================================

function selectPackage(
    packageName
) {

    const packageField =
        document.getElementById(
            "package"
        );


    const contactPackage =
        document.getElementById(
            "contactPackage"
        );


    if (packageField) {

        packageField.value =
            packageName;

    }


    if (contactPackage) {

        contactPackage.value =
            packageName;

    }


    // Optional: store selected package

    localStorage.setItem(

        "selectedSafariPackage",

        packageName

    );

}


// Make function available globally

window.selectPackage =
    selectPackage;


// =========================================================
// 10. RESTORE SELECTED PACKAGE
// =========================================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const savedPackage =
            localStorage.getItem(
                "selectedSafariPackage"
            );


        if (!savedPackage) {

            return;

        }


        const packageField =
            document.getElementById(
                "package"
            );


        const contactPackage =
            document.getElementById(
                "contactPackage"
            );


        if (packageField) {

            packageField.value =
                savedPackage;

        }


        if (contactPackage) {

            contactPackage.value =
                savedPackage;

        }

    }
);


// =========================================================
// 11. CLEAR SELECTED PACKAGE AFTER FORM SUBMISSION
// =========================================================

const plannerForm =
    document.querySelector(
        "#planner form"
    );


if (plannerForm) {

    plannerForm.addEventListener(
        "submit",
        () => {

            localStorage.removeItem(
                "selectedSafariPackage"
            );

        }
    );

}


// =========================================================
// 12. CONTACT FORM PACKAGE SELECTION
// =========================================================

const contactPackageField =
    document.getElementById(
        "contactPackage"
    );


if (contactPackageField) {

    contactPackageField.addEventListener(
        "click",
        () => {

            const selectedPackage =
                localStorage.getItem(
                    "selectedSafariPackage"
                );


            if (
                selectedPackage &&
                !contactPackageField.value
            ) {

                contactPackageField.value =
                    selectedPackage;

            }

        }
    );

}


// =========================================================
// 13. PREVENT EMPTY FORM SUBMISSION
// =========================================================

const forms =
    document.querySelectorAll(
        "form"
    );


forms.forEach(form => {

    form.addEventListener(
        "submit",
        event => {

            const requiredFields =
                form.querySelectorAll(
                    "[required]"
                );


            let valid = true;


            requiredFields.forEach(
                field => {

                    if (
                        !field.value.trim()
                    ) {

                        valid = false;

                        field.style.borderColor =
                            "#B89B5E";

                    } else {

                        field.style.borderColor =
                            "";

                    }

                }
            );


            if (!valid) {

                event.preventDefault();

                alert(
                    "Please complete all required fields before submitting."
                );

            }

        }
    );

});


// =========================================================
// 14. WELCOME MESSAGE
// =========================================================

window.addEventListener(
    "load",
    () => {

        console.log(
            "Welcome to Leisure Fan Tours and Safaris."
        );

        console.log(
            "Discover Kenya. Experience Africa."
        );

    }
);