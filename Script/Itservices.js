/* =========================================================
   MENTORE SOLUTION - IT SERVICES JAVASCRIPT
   Smooth + lightweight interactions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       NAVBAR SCROLL
       Existing navbar behavior preserved
    ===================================================== */
    const navbar = document.querySelector(".navbar");

    const updateNavbar = () => {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });


    /* =====================================================
       MOBILE MENU
       Existing mobile menu behavior preserved
    ===================================================== */
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {
        hamburger.setAttribute("role", "button");
        hamburger.setAttribute("tabindex", "0");
        hamburger.setAttribute("aria-label", "Open navigation menu");
        hamburger.setAttribute("aria-expanded", "false");

        const toggleMobileMenu = (event) => {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            const isOpen = mobileMenu.classList.toggle("active");
            hamburger.classList.toggle("active", isOpen);

            hamburger.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            hamburger.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        };

        hamburger.addEventListener("click", toggleMobileMenu);

        hamburger.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                toggleMobileMenu(event);
            }
        });

        mobileMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open navigation menu");
            });
        });

        // Close menu when resizing back to desktop.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 1000) {
                mobileMenu.classList.remove("active");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open navigation menu");
            }
        });
    }


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
       Existing functionality preserved
    ===================================================== */
    const floatingBtn = document.querySelector(".floating-btn");
    const mainBtn = floatingBtn?.querySelector(".main-btn");

    if (floatingBtn && mainBtn) {
        mainBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            floatingBtn.classList.toggle("active");
        });

        document.addEventListener("click", (event) => {
            if (!floatingBtn.contains(event.target)) {
                floatingBtn.classList.remove("active");
            }
        });
    }


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