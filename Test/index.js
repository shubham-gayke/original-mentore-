/* =====================================
   TYPING ANIMATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const typingText = document.getElementById("typing-text");

    const text = "Mentore Solution";

    let characterIndex = 0;

    function typeText() {

        if (characterIndex < text.length) {

            typingText.textContent += text.charAt(characterIndex);

            characterIndex++;

            setTimeout(typeText, 120);
        }
    }

    if (typingText) {
        typeText();
    }


    /* =====================================
       PAUSE SLIDER ON HOVER
    ===================================== */

    const sliders = document.querySelectorAll(".slider");

    sliders.forEach((slider) => {

        const track = slider.querySelector(".slider-track");

        if (!track) return;

        slider.addEventListener("mouseenter", () => {
            track.style.animationPlayState = "paused";
        });

        slider.addEventListener("mouseleave", () => {
            track.style.animationPlayState = "running";
        });

        slider.addEventListener("touchstart", () => {
            track.style.animationPlayState = "paused";
        });

        slider.addEventListener("touchend", () => {
            track.style.animationPlayState = "running";
        });

    });

});


/* =====================================
   NAVBAR SCROLL
===================================== */

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* =====================================
   MOBILE MENU TOGGLE
===================================== */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", () => {

        mobileMenu.classList.toggle("active");

    });

}


/* =====================================
   COUNTER SECTION
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    const counters =
        document.querySelectorAll(".counter-number");

    const section =
        document.querySelector(".impact-section");

    let counterStarted = false;


    function animateCounter(counter) {

        const target =
            parseInt(counter.dataset.target);

        const duration = 2000;

        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;

            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /* Smooth ease-out */

            const easeOut =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                Math.floor(
                    target * easeOut
                );


            const formattedNumber =
                currentValue.toLocaleString();


            if (target === 100) {

                counter.innerHTML =
                    formattedNumber +
                    "<span>%</span>";

            } else {

                counter.innerHTML =
                    formattedNumber;

            }


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                if (target === 100) {

                    counter.innerHTML =
                        target.toLocaleString() +
                        "<span>%</span>";

                } else {

                    counter.innerHTML =
                        target.toLocaleString();

                }

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }


    function startCounters() {

        if (counterStarted) return;

        counterStarted = true;


        counters.forEach(function (counter) {

            animateCounter(counter);

        });

    }


    /* Counter starts when section is visible */

    if (section) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (entry.isIntersecting) {
                                startCounters();
                            }

                        }
                    );

                },
                {
                    threshold: 0.25
                }
            );


        observer.observe(section);

    }

});


/* =====================================
   BUTTON NAVIGATION
===================================== */

const viewMoreBtn =
    document.getElementById("viewMoreBtn");

if (viewMoreBtn) {

    viewMoreBtn.addEventListener("click", function () {

        window.location.href = "traninig.html";

    });

}


const exploreCoursesBtn =
    document.getElementById("exploreCoursesBtn");

if (exploreCoursesBtn) {

    exploreCoursesBtn.addEventListener("click", function () {

        window.location.href = "traninig.html";

    });

}


/* =====================================
   SECONDARY BUTTON
===================================== */

const secondaryBtn =
    document.querySelector(".secondary-btn");

if (secondaryBtn) {

    secondaryBtn.addEventListener("click", function (e) {

        e.preventDefault();

        alert(
            "Our team will contact you shortly for your free consultation."
        );

    });

}


/* =====================================
   FLOATING BUTTON
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const floatingBtn =
        document.querySelector(".floating-btn");

    if (!floatingBtn) return;

    const mainBtn =
        floatingBtn.querySelector(".main-btn");

    if (!mainBtn) return;

    mainBtn.addEventListener("click", () => {

        floatingBtn.classList.toggle("active");

    });

});


/* =========================================================
   AUTOMATIC CONTINUOUS SUCCESS SLIDER
========================================================= */

const track =
    document.getElementById("successTrack");

if (track) {

    /*
       Duplicate all cards.

       This creates a seamless loop.
    */

    const originalCards =
        Array.from(track.children);

    originalCards.forEach(card => {

        const clone =
            card.cloneNode(true);

        track.appendChild(clone);

    });


    /* =====================================================
       SETTINGS
    ===================================================== */

    const speed = 45;

    let position = 0;

    let lastTime =
        performance.now();


    /* =====================================================
       GET ORIGINAL WIDTH
    ===================================================== */

    function getLoopWidth() {

        let width = 0;

        originalCards.forEach(card => {

            width += card.offsetWidth;

        });


        const gap =
            parseFloat(
                getComputedStyle(track).gap
            ) || 0;


        width +=
            gap * originalCards.length;


        return width;

    }


    /* =====================================================
       ANIMATION
    ===================================================== */

    function animate(currentTime) {

        const delta =
            currentTime - lastTime;

        lastTime = currentTime;


        position +=
            (speed * delta) / 1000;


        const loopWidth =
            getLoopWidth();


        if (position >= loopWidth) {

            position -= loopWidth;

        }


        track.style.transform =
            `translate3d(-${position}px,0,0)`;


        requestAnimationFrame(animate);

    }


    /* =====================================================
       START
    ===================================================== */

    requestAnimationFrame(animate);


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            const loopWidth =
                getLoopWidth();

            if (loopWidth > 0) {

                position =
                    position % loopWidth;

            }

        }
    );

}


/* =========================================================
   MOBILE GET ME A JOB POPUP
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const jobPopup =
        document.getElementById("mobileJobPopup");

    const closeButton =
        document.getElementById("jobPopupClose");


    if (!jobPopup) return;


    /*
       Show popup after 2.5 seconds.
       CSS automatically hides it on desktop.
    */

    const popupTimer =
        setTimeout(() => {

            /*
               Check mobile screen before showing.
            */

            if (window.innerWidth <= 768) {

                jobPopup.classList.add("show");

            }

        }, 2500);


    /* =====================================
       CLOSE POPUP
    ===================================== */

    if (closeButton) {

        closeButton.addEventListener("click", (event) => {

            event.preventDefault();

            event.stopPropagation();

            jobPopup.classList.remove("show");

        });

    }


    /* =====================================
       IF SCREEN BECOMES DESKTOP
       HIDE POPUP
    ===================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {

            jobPopup.classList.remove("show");

        }

    });

});