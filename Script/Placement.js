/* =========================================================
   MENTORE SOLUTION - MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   NAVBAR SCROLL
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        const handleNavbarScroll = () => {

            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        };

        handleNavbarScroll();

        window.addEventListener("scroll", handleNavbarScroll);

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {

        hamburger.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

            hamburger.classList.toggle("active");

        });


        /* Close mobile menu when clicking a link */

        const mobileLinks = mobileMenu.querySelectorAll("a");

        mobileLinks.forEach((link) => {

            link.addEventListener("click", () => {

                mobileMenu.classList.remove("active");
                hamburger.classList.remove("active");

            });

        });

    }


    /* =====================================================
       THEME
       ===================================================== */

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }


    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if (revealElements.length > 0) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       PLACEMENT COUNTERS
       ===================================================== */

    const counters = document.querySelectorAll("[data-target]");

    if (counters.length > 0) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    const counter = entry.target;

                    const target = Number(counter.dataset.target);

                    if (isNaN(target)) {
                        observer.unobserve(counter);
                        return;
                    }


                    const duration = 1800;

                    const startTime = performance.now();


                    function animateCounter(currentTime) {

                        const progress = Math.min(
                            (currentTime - startTime) / duration,
                            1
                        );


                        const value = Math.floor(
                            progress * target
                        );


                        counter.textContent =
                            value.toLocaleString();


                        if (progress < 1) {

                            requestAnimationFrame(
                                animateCounter
                            );

                        } else {

                            counter.textContent =
                                target.toLocaleString() + "+";

                        }

                    }


                    requestAnimationFrame(animateCounter);


                    observer.unobserve(counter);

                });

            },
            {
                threshold: 0.15
            }
        );


        counters.forEach((counter) => {

            counterObserver.observe(counter);

        });

    }


    /* =====================================================
       PARTNERS - SMOOTH CONTINUOUS HORIZONTAL SLIDER
       ===================================================== */

    const partnerTrack = document.querySelector(".slide-track");
    const partnerSlider = document.querySelector(".partners-slider");

    if (partnerTrack && partnerSlider) {

        /* Clone original logos for seamless loop */

        const originalItems = Array.from(
            partnerTrack.children
        );


        if (originalItems.length > 0) {

            originalItems.forEach((item) => {

                partnerTrack.appendChild(
                    item.cloneNode(true)
                );

            });


            let partnerPosition = 0;

            let partnerSpeed = 0.035;

            let lastPartnerTime = performance.now();


            function runPartnerSlider(currentTime) {

                const deltaTime = Math.min(
                    currentTime - lastPartnerTime,
                    40
                );


                lastPartnerTime = currentTime;


                if (!partnerSlider.matches(":hover")) {

                    partnerPosition -=
                        partnerSpeed * deltaTime;


                    const halfWidth =
                        partnerTrack.scrollWidth / 2;


                    if (
                        Math.abs(partnerPosition) >=
                        halfWidth
                    ) {

                        partnerPosition = 0;

                    }


                    partnerTrack.style.transform =
                        `translate3d(${partnerPosition}px, 0, 0)`;

                }


                requestAnimationFrame(
                    runPartnerSlider
                );

            }


            requestAnimationFrame(
                runPartnerSlider
            );

        }

    }


    /* =====================================================
       SUCCESS STORIES
       SMOOTH CONTINUOUS VERTICAL MOTION
       ===================================================== */

    const successTrack =
        document.getElementById("successTrack");

    const successWindow =
        document.querySelector(".success-window");


    if (successTrack && successWindow) {

        /* Store original cards */

        const originalCards =
            Array.from(successTrack.children);


        if (originalCards.length > 0) {

            /* Clone cards for seamless loop */

            originalCards.forEach((card) => {

                successTrack.appendChild(
                    card.cloneNode(true)
                );

            });


            let successY = 0;

            /*
             * Very slow speed.
             * Increase only if you want it faster.
             */

            const successSpeed = 0.035;


            let lastTime =
                performance.now();


            function getLoopHeight() {

                return successTrack.scrollHeight / 2;

            }


            function runSuccessStories(currentTime) {

                const deltaTime = Math.min(
                    currentTime - lastTime,
                    40
                );


                lastTime = currentTime;


                /*
                 * Pause when mouse is over
                 * success stories.
                 */

                if (!successWindow.matches(":hover")) {

                    successY -=
                        successSpeed * deltaTime;


                    const loopHeight =
                        getLoopHeight();


                    if (
                        Math.abs(successY) >=
                        loopHeight
                    ) {

                        successY = 0;

                    }


                    successTrack.style.transform =
                        `translate3d(0, ${successY}px, 0)`;

                }


                requestAnimationFrame(
                    runSuccessStories
                );

            }


            requestAnimationFrame(
                runSuccessStories
            );

        }

    }


    /* =====================================================
       FLOATING BUTTON
       ===================================================== */

    const floatingBtn =
        document.querySelector(".floating-btn");

    const mainBtn =
        document.querySelector(".main-btn");


    if (floatingBtn && mainBtn) {

        mainBtn.addEventListener("click", () => {

            floatingBtn.classList.toggle("active");

        });

    }


    /* =====================================================
       CLOSE FLOATING BUTTON WHEN CLICKING OUTSIDE
       ===================================================== */

    if (floatingBtn) {

        document.addEventListener("click", (event) => {

            if (
                !floatingBtn.contains(event.target)
            ) {

                floatingBtn.classList.remove("active");

            }

        });

    }

});


/* =========================================================
   THEME TOGGLE
   ========================================================= */

function toggleTheme() {

    document.body.classList.toggle("dark");


    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

}  
/* =====================================================
   COMPANY LOGO SLIDER
===================================================== */

const companySlider = document.querySelector(".company-slider");
const companyTrack = document.querySelector(".company-track");

if (companySlider && companyTrack) {

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            companyTrack.style.animationPlayState = "paused";
        } else {

            if (!companySlider.matches(":hover")) {
                companyTrack.style.animationPlayState = "running";
            }

        }

    });

}