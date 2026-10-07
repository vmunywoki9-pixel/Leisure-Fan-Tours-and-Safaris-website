/* =========================================================
   MOBILE MENU
========================================================= */

const menuBtn = document.querySelector(".menu-btn");

const nav = document.querySelector(".main-nav");


if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        const open =
            nav.classList.toggle("open");

        menuBtn.setAttribute(
            "aria-expanded",
            open
        );

    });

}


document
    .querySelectorAll(".main-nav a")
    .forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");

        });

    });



/* =========================================================
   HERO SLIDESHOW
========================================================= */

const slides =
    [...document.querySelectorAll(".hero-slide")];

let currentSlide = 0;


setInterval(() => {

    if (!slides.length) {
        return;
    }

    slides[currentSlide]
        .classList.remove("active");


    currentSlide =
        (currentSlide + 1) %
        slides.length;


    slides[currentSlide]
        .classList.add("active");

}, 5000);



/* =========================================================
   GALLERY AUTO SLIDER
========================================================= */

const gallery =
    document.getElementById("galleryTrack");


if (gallery) {

    let position = 0;


    setInterval(() => {

        const firstImage =
            gallery.querySelector("img");


        if (!firstImage) {
            return;
        }


        const imageWidth =
            firstImage.getBoundingClientRect().width;


        const gap = 15;


        const step =
            imageWidth + gap;


        position++;


        if (
            position >=
            gallery.children.length
        ) {

            position = 0;

        }


        gallery.scrollTo({

            left:
                step * position,

            behavior:
                "smooth"

        });

    }, 4500);

}