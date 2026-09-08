/* =========================================================
   MENTORE SOLUTION - IT SERVICES JAVASCRIPT
   Smooth + lightweight interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       NAVBAR SCROLL
       (Removed: Now handled in Script.js to avoid duplicates)
    ===================================================== */

    /* =====================================================
       MOBILE MENU
       (Removed: Now handled in Script.js to avoid duplicates)
    ===================================================== */


    /* =====================================================
       SERVICE BOX REVEAL
    ===================================================== */
    const animatedItems = [
        ...document.querySelectorAll(".service-box"),
        ...document.querySelectorAll(".why-box")
    ];

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        animatedItems.forEach((item, index) => {
            // Small stagger without heavy animation work.
            item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
            observer.observe(item);
        });
    } else {
        animatedItems.forEach((item) => {
            item.classList.add("visible");
        });
    }


    /* =====================================================
       SECTION REVEAL
    ===================================================== */
    const revealElements = document.querySelectorAll(
        ".services-section > h2, .services-section > p, .why-title, .why-subtitle, .learning-cta .cta-content"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");
                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.15,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }


    /* =====================================================
       CONSULTATION BUTTONS
       Scroll to contact page / existing contact destination
    ===================================================== */
    const consultationButtons = document.querySelectorAll(".consult-btn");

    consultationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            window.location.href = "./contact.html";
        });
    });


    /* =====================================================
       REQUEST A QUOTE BUTTON
       Existing ID preserved
    ===================================================== */
    const requestCallback = document.getElementById("requestCallback");

    if (requestCallback) {
        requestCallback.addEventListener("click", () => {
            window.location.href = "./contact.html";
        });
    }


    /* =====================================================
       FLOATING CONTACT BUTTON
       (Removed: Now handled in Script.js to avoid duplicates)
    ===================================================== */



    /* =====================================================
       BUTTON RIPPLE - LIGHTWEIGHT
    ===================================================== */
    document.querySelectorAll(".consult-btn, .cta-btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.remove("clicked");

            // Force a tiny reflow so repeated clicks animate correctly.
            void button.offsetWidth;

            button.classList.add("clicked");

            setTimeout(() => {
                button.classList.remove("clicked");
            }, 350);
        });
    });

});