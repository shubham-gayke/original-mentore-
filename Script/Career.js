document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar = document.querySelector(".navbar");
    const siteNav = document.getElementById("siteNav");

    let scrollScheduled = false;

    function updateNavbar() {

        const scrollPosition = window.scrollY;

        if (navbar) {
            navbar.classList.toggle(
                "scrolled",
                scrollPosition > 40
            );
        }

        if (siteNav) {
            siteNav.classList.toggle(
                "scrolled",
                scrollPosition > 20
            );
        }

        scrollScheduled = false;
    }

    window.addEventListener(
        "scroll",
        function () {

            if (!scrollScheduled) {

                requestAnimationFrame(
                    updateNavbar
                );

                scrollScheduled = true;
            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       MOBILE MENU
    ===================================================== */

    const hamburger =
        document.getElementById("hamburger");

    const mobileMenu =
        document.getElementById("mobileMenu");

    if (hamburger && mobileMenu) {

        hamburger.addEventListener(
            "click",
            function () {

                mobileMenu.classList.toggle(
                    "active"
                );

                hamburger.classList.toggle(
                    "active"
                );
            }
        );

        const mobileLinks =
            mobileMenu.querySelectorAll("a");

        mobileLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        mobileMenu.classList.remove(
                            "active"
                        );

                        hamburger.classList.remove(
                            "active"
                        );
                    }
                );
            }
        );
    }


    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-stagger"
        );

    if (
        "IntersectionObserver" in window
    ) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );

        revealElements.forEach(
            function (element) {

                observer.observe(element);
            }
        );

    } else {

        revealElements.forEach(
            function (element) {

                element.classList.add(
                    "is-visible"
                );
            }
        );
    }


    /* =====================================================
       JOB SLIDER
    ===================================================== */

    const track =
        document.getElementById(
            "jobsTrack"
        );

    const prevBtn =
        document.getElementById(
            "prevBtn"
        );

    const nextBtn =
        document.getElementById(
            "nextBtn"
        );

    const dotsWrap =
        document.getElementById(
            "dots"
        );

    if (!track) {
        return;
    }

    const cards =
        Array.from(
            track.querySelectorAll(
                ".job-box"
            )
        );

    if (!cards.length) {
        return;
    }


    /* =====================================================
       CARD STEP
    ===================================================== */

    function getCardStep() {

        const firstCard =
            cards[0];

        if (!firstCard) {
            return 0;
        }

        const style =
            window.getComputedStyle(
                track
            );

        const gap =
            parseFloat(
                style.columnGap
            ) ||
            parseFloat(
                style.gap
            ) ||
            22;

        return (
            firstCard.getBoundingClientRect()
                .width + gap
        );
    }


    /* =====================================================
       CREATE DOTS
    ===================================================== */

    const dots = [];

    if (dotsWrap) {

        const fragment =
            document.createDocumentFragment();

        cards.forEach(
            function (_, index) {

                const dot =
                    document.createElement(
                        "button"
                    );

                dot.type = "button";

                dot.className = "dot";

                dot.setAttribute(
                    "aria-label",
                    "Go to job " +
                    (index + 1)
                );

                if (index === 0) {

                    dot.classList.add(
                        "active"
                    );
                }

                dot.addEventListener(
                    "click",
                    function () {

                        const step =
                            getCardStep();

                        track.scrollTo({
                            left:
                                step * index,

                            behavior:
                                "smooth"
                        });
                    }
                );

                dots.push(dot);

                fragment.appendChild(
                    dot
                );
            }
        );

        dotsWrap.appendChild(
            fragment
        );
    }


    /* =====================================================
       ACTIVE DOT
    ===================================================== */

    let dotUpdateFrame = null;

    function updateActiveDot() {

        if (dotUpdateFrame) {
            return;
        }

        dotUpdateFrame =
            requestAnimationFrame(
                function () {

                    const step =
                        getCardStep();

                    if (!step) {

                        dotUpdateFrame =
                            null;

                        return;
                    }

                    const index =
                        Math.round(
                            track.scrollLeft /
                            step
                        );

                    const safeIndex =
                        Math.min(
                            index,
                            dots.length - 1
                        );

                    dots.forEach(
                        function (
                            dot,
                            i
                        ) {

                            dot.classList.toggle(
                                "active",
                                i === safeIndex
                            );
                        }
                    );

                    dotUpdateFrame =
                        null;
                }
            );
    }

    track.addEventListener(
        "scroll",
        updateActiveDot,
        {
            passive: true
        }
    );


    /* =====================================================
       PREVIOUS
    ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            function () {

                track.scrollBy({

                    left:
                        -getCardStep(),

                    behavior:
                        "smooth"
                });
            }
        );
    }


    /* =====================================================
       NEXT
    ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            function () {

                track.scrollBy({

                    left:
                        getCardStep(),

                    behavior:
                        "smooth"
                });
            }
        );
    }


    /* =====================================================
       DRAG TO SCROLL
    ===================================================== */

    let isDragging = false;

    let startX = 0;

    let startScroll = 0;


    track.addEventListener(
        "pointerdown",
        function (event) {

            if (
                event.pointerType === "mouse" &&
                event.button !== 0
            ) {
                return;
            }

            isDragging = true;

            startX =
                event.clientX;

            startScroll =
                track.scrollLeft;

            track.classList.add(
                "dragging"
            );

            track.setPointerCapture(
                event.pointerId
            );
        }
    );


    track.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }

            const distance =
                event.clientX -
                startX;

            track.scrollLeft =
                startScroll -
                distance;
        },
        {
            passive: true
        }
    );


    function stopDragging() {

        isDragging = false;

        track.classList.remove(
            "dragging"
        );
    }

    track.addEventListener(
        "pointerup",
        stopDragging
    );

    track.addEventListener(
        "pointercancel",
        stopDragging
    );

    track.addEventListener(
        "lostpointercapture",
        stopDragging
    );


    /* =====================================================
       CULTURE MARQUEE
    ===================================================== */

    const marquee =
        document.getElementById(
            "marqueeTrack"
        );

    if (
        marquee &&
        !marquee.dataset.duplicated
    ) {

        marquee.innerHTML +=
            marquee.innerHTML;

        marquee.dataset.duplicated =
            "true";
    }


    /* =====================================================
       INTERNAL SMOOTH LINKS
    ===================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !href ||
                            href === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                href
                            );

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        const navHeight =
                            siteNav?.offsetHeight ||
                            navbar?.offsetHeight ||
                            70;

                        const position =
                            target
                                .getBoundingClientRect()
                                .top +
                            window.scrollY -
                            navHeight;

                        window.scrollTo({

                            top:
                                position,

                            behavior:
                                "smooth"
                        });
                    }
                );
            }
        );


    /* =====================================================
       FLOATING BUTTON
    ===================================================== */

    const floatingBtn =
        document.querySelector(
            ".floating-btn"
        );

    if (floatingBtn) {

        const mainBtn =
            floatingBtn.querySelector(
                ".main-btn"
            );

        if (mainBtn) {

            mainBtn.addEventListener(
                "click",
                function () {

                    floatingBtn.classList.toggle(
                        "active"
                    );
                }
            );
        }
    }


    /* =====================================================
       APPLY BUTTON
    ===================================================== */

    const applyButtons =
        document.querySelectorAll(
            ".apply-btn"
        );

    applyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    const jobBox =
                        button.closest(
                            ".job-box"
                        );

                    if (!jobBox) {
                        return;
                    }

                    const title =
                        jobBox.querySelector(
                            "h3"
                        )?.textContent ||
                        "Job Position";

                    const subject =
                        encodeURIComponent(
                            "Job Application: " +
                            title
                        );

                    const body =
                        encodeURIComponent(
                            "Dear HR Team,\n\n" +
                            "I am writing to apply for the " +
                            title +
                            " position at Mentore Solution.\n\n" +
                            "Please find my resume attached.\n\n" +
                            "Regards,\n" +
                            "[Your Name]"
                        );

                    window.location.href =
                        "mailto:mentoresolution@gmail.com" +
                        "?subject=" +
                        subject +
                        "&body=" +
                        body;
                }
            );
        }
    );


    /* =====================================================
       SEND RESUME
    ===================================================== */

    const sendResumeBtn =
        document.querySelector(
            ".learning-cta .call-btn"
        );

    if (sendResumeBtn) {

        sendResumeBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const subject =
                    encodeURIComponent(
                        "Job Application - My Resume"
                    );

                const body =
                    encodeURIComponent(
                        "Dear HR Team,\n\n" +
                        "Please find my resume attached for consideration.\n\n" +
                        "Regards,\n" +
                        "[Your Name]"
                    );

                window.location.href =
                    "mailto:mentoresolution@gmail.com" +
                    "?subject=" +
                    subject +
                    "&body=" +
                    body;
            }
        );
    }

});