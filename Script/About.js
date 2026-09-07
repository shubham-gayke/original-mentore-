// // NAVBAR SCROLL
// window.addEventListener("scroll", () => {
//   const navbar = document.querySelector(".navbar");

//   if (window.scrollY > 40) {
//     navbar.classList.add("scrolled");
//   } else {
//     navbar.classList.remove("scrolled");
//   }
// });

// // MOBILE MENU TOGGLE
// const hamburger = document.getElementById("hamburger");
// const mobileMenu = document.getElementById("mobileMenu");

// hamburger.addEventListener("click", () => {
//   mobileMenu.classList.toggle("active");
// });

//    const navbar = document.querySelector(".navbar");


//         window.addEventListener("scroll", () => {

//             if (window.scrollY > 50) {

//                 navbar.classList.add("scrolled");

//             } else {

//                 navbar.classList.remove("scrolled");

//             }

//         });


//         /* MOBILE MENU */

//         const hamburger = document.getElementById("hamburger");

//         const mobileMenu = document.getElementById("mobileMenu");


//         hamburger.addEventListener("click", () => {

//             mobileMenu.classList.toggle("active");

//         });


//         /* SCROLL REVEAL */

//         const revealElements = document.querySelectorAll(".reveal");


//         const revealObserver = new IntersectionObserver(

//             (entries) => {

//                 entries.forEach((entry) => {

//                     if (entry.isIntersecting) {

//                         entry.target.classList.add("active");

//                         revealObserver.unobserve(entry.target);

//                     }

//                 });

//             },

//             {

//                 threshold: 0.15

//             }

//         );


//         revealElements.forEach((element) => {

//             revealObserver.observe(element);

//         });


//         /* COUNTER ANIMATION */

//         const counters = document.querySelectorAll("[data-target]");


//         const counterObserver = new IntersectionObserver(

//             (entries) => {

//                 entries.forEach((entry) => {

//                     if (entry.isIntersecting) {

//                         const counter = entry.target;

//                         const target = Number(counter.dataset.target);

//                         let current = 0;

//                         const increment = target / 80;


//                         const updateCounter = () => {

//                             current += increment;


//                             if (current < target) {

//                                 counter.innerText = Math.ceil(current);

//                                 requestAnimationFrame(updateCounter);

//                             } else {

//                                 counter.innerText = target + "+";

//                             }

//                         };


//                         updateCounter();

//                         counterObserver.unobserve(counter);

//                     }

//                 });

//             },

//             {

//                 threshold: 0.5

//             }

//         );


//         counters.forEach((counter) => {

//             counterObserver.observe(counter);

//         });


//         /* FLOATING BUTTON */

//         const floatingBtn = document.querySelector(".floating-btn");

//         const mainBtn = document.querySelector(".main-btn");


//         mainBtn.addEventListener("click", () => {

//             floatingBtn.classList.toggle("active");

//         });
/* =====================================================
   NAVBAR SCROLL
===================================================== */

const navbar = document.querySelector(".navbar");

if (navbar) {
    window.addEventListener("scroll", () => {

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

    });
}


/* =====================================================
   MOBILE MENU
===================================================== */

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

if (hamburger && mobileMenu) {

    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
    });

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
   COUNTER ANIMATION
===================================================== */

const counters = document.querySelectorAll("[data-target]");

if (counters.length > 0) {

    const counterObserver = new IntersectionObserver(

        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const counter = entry.target;
                    const target = Number(counter.dataset.target);

                    let current = 0;
                    const duration = 1600;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {

                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        current = Math.floor(progress * target);

                        counter.innerText = current;

                        if (progress < 1) {

                            requestAnimationFrame(updateCounter);

                        } else {

                            counter.innerText = target + "+";

                        }

                    }

                    requestAnimationFrame(updateCounter);

                    observer.unobserve(counter);

                }

            });

        },

        {
            threshold: 0.5
        }

    );

    counters.forEach((counter) => {
        counterObserver.observe(counter);
    });

}


/* =====================================================
   FLOATING BUTTON
===================================================== */

const floatingBtn = document.querySelector(".floating-btn");
const mainBtn = document.querySelector(".main-btn");

if (floatingBtn && mainBtn) {

    mainBtn.addEventListener("click", () => {

        floatingBtn.classList.toggle("active");

    });

}