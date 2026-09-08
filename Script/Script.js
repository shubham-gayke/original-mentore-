/* =========================================================
   HERO VIDEO PLAYER — SEQUENTIAL PLAYBACK
   Plays videos one after another in a loop without overlap
========================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    var video = document.getElementById("heroVideo");
    var muteBtn = document.getElementById("heroMuteBtn");

    if (!video || !muteBtn) return;

    var videoSources = [
      "mentore home page videos/1 mentore intro 1.mp4",
      "mentore home page videos/2 mentore services 2.mp4",
      "mentore home page videos/3 why mentore 3.mp4"
    ];

    var currentIndex = 0;
    var isMuted = false;
    var transitionTimeout = null;

    /* =================================================
       SYNC MUTE STATE
    ================================================= */

    function updateMuteIcon() {
      var icon = muteBtn.querySelector("i");
      if (!icon) return;

      if (isMuted) {
        icon.className = "fa-solid fa-volume-xmark";
        muteBtn.setAttribute("aria-label", "Unmute video audio");
        muteBtn.setAttribute("title", "Unmute video audio");
      } else {
        icon.className = "fa-solid fa-volume-high";
        muteBtn.setAttribute("aria-label", "Mute video audio");
        muteBtn.setAttribute("title", "Mute video audio");
      }
    }

    muteBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      isMuted = !isMuted;
      video.muted = isMuted;
      updateMuteIcon();
    });


    /* =================================================
       PLAY NEXT VIDEO
    ================================================= */

    function playNextVideo() {
      currentIndex++;
      if (currentIndex >= videoSources.length) {
        currentIndex = 0;
      }
      
      video.src = videoSources[currentIndex];
      video.load();
      video.muted = isMuted;
      
      var playP = video.play();
      if (playP !== undefined) {
        playP.catch(function () {
          // If autoplay fails, force mute and try again
          isMuted = true;
          video.muted = true;
          updateMuteIcon();
          video.play().catch(function () {});
        });
      }
    }

    // When the video ends, wait 1 second then play the next one
    video.addEventListener("ended", function () {
      if (transitionTimeout) clearTimeout(transitionTimeout);
      transitionTimeout = setTimeout(function () {
        playNextVideo();
      }, 1000);
    });


    /* =================================================
       START & SCROLL OBSERVER
    ================================================= */

    isMuted = false;
    video.muted = false;
    video.volume = 1;
    updateMuteIcon();

    var hasInitialized = false;
    var heroSection = document.getElementById("heroVideoSection");

    if (heroSection && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            // Scrolled into view
            if (hasInitialized) {
              // Restart from first video
              currentIndex = 0;
              video.src = videoSources[currentIndex];
              video.load();
              video.currentTime = 0;
              video.muted = isMuted;
            } else {
              hasInitialized = true;
            }
            
            var playP = video.play();
            if (playP !== undefined) {
              playP.catch(function () {
                isMuted = true;
                video.muted = true;
                updateMuteIcon();
                video.play().catch(function () {});
              });
            }
          } else {
            // Scrolled out of view
            hasInitialized = true;
            video.pause();
            if (transitionTimeout) clearTimeout(transitionTimeout);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(heroSection);
    } else {
      // Fallback
      var startPromise = video.play();
      if (startPromise !== undefined) {
        startPromise.catch(function () {
          /* Autoplay with audio blocked — fallback to muted */
          isMuted = true;
          video.muted = true;
          updateMuteIcon();
          video.play().catch(function () {});
        });
      }
    }


    /* =================================================
       VISIBILITY CHANGE — pause/resume
    ================================================= */

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        video.pause();
        if (transitionTimeout) clearTimeout(transitionTimeout);
      } else {
        if (heroSection) {
          var rect = heroSection.getBoundingClientRect();
          var isVisible = (rect.top <= (window.innerHeight || document.documentElement.clientHeight)) && (rect.bottom >= 0);
          if (isVisible) {
            video.play().catch(function () {});
          }
        } else {
          video.play().catch(function () {});
        }
      }
    });

  });

})();


/* =========================================================
   TYPING ANIMATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typing-text");

  const text = "Mentore Solution";
  let characterIndex = 0;

  function typeText() {
    if (!typingText) return;

    if (characterIndex < text.length) {
      typingText.textContent += text.charAt(characterIndex);
      characterIndex++;

      setTimeout(typeText, 120);
    }
  }

  if (typingText) {
    typeText();
  }
});


/* =========================================================
   PAUSE CERTIFICATE SLIDER ON HOVER / TOUCH
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
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
    }, { passive: true });

    slider.addEventListener("touchend", () => {
      track.style.animationPlayState = "running";
    }, { passive: true });
  });
});


/* =========================================================
   NAVBAR SCROLL
========================================================= */

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });


/* =========================================================
   MOBILE MENU TOGGLE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!hamburger || !mobileMenu) return;

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

  const mobileLinks = mobileMenu.querySelectorAll("a");

  mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
          mobileMenu.classList.remove("active");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
          hamburger.setAttribute("aria-label", "Open navigation menu");
      });
  });

  window.addEventListener("resize", () => {
      if (window.innerWidth > 1000) {
          mobileMenu.classList.remove("active");
          hamburger.classList.remove("active");
          hamburger.setAttribute("aria-expanded", "false");
          hamburger.setAttribute("aria-label", "Open navigation menu");
      }
  });
});


/* =========================================================
   COUNTER SECTION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const counters =
    document.querySelectorAll(".counter-number");

  const section =
    document.querySelector(".impact-section");

  let counterStarted = false;


  function animateCounter(counter) {
    const target =
      parseInt(counter.dataset.target, 10) || 0;

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
        1 -
        Math.pow(
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
        counter.textContent =
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
          counter.textContent =
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

    counters.forEach((counter) => {
      animateCounter(counter);
    });
  }


  /* Counter starts when section is visible */

  if (section) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startCounters();
              observer.unobserve(section);
            }
          });
        },
        {
          threshold: 0.25
        }
      );

    observer.observe(section);
  }
});


/* =========================================================
   BUTTON NAVIGATION
========================================================= */

/* =====================================================
   EXPLORE ALL COURSES BUTTON
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const exploreCoursesBtn =
        document.getElementById("exploreCoursesBtn");

    if (exploreCoursesBtn) {

        exploreCoursesBtn.addEventListener("click", () => {

            window.location.href = "Pages/traninig.html";

        });

    }

});
// 
document.addEventListener("DOMContentLoaded", () => {

    const viewMoreBtn =
        document.getElementById("viewMoreBtn");

    if (viewMoreBtn) {

        viewMoreBtn.addEventListener("click", () => {
            window.location.href = "Pages/itservices.html";
        });

    }

});


/* =========================================================
   SECONDARY BUTTON
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const secondaryBtn =
    document.querySelector(".secondary-btn");

  if (!secondaryBtn) return;

  secondaryBtn.addEventListener("click", (event) => {

    event.preventDefault();

    alert(
      "Our team will contact you shortly for your free consultation."
    );
  });
});


/* =========================================================
   FLOATING BUTTON
========================================================= */

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
   SUCCESS STORIES
   AUTOMATIC CONTINUOUS SLIDER
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const track =
    document.getElementById("successTrack");

  if (!track) return;


  /* =====================================================
     GET ORIGINAL CARDS
  ===================================================== */

  const originalCards =
    Array.from(track.children);

  if (originalCards.length === 0) return;


  /* =====================================================
     DUPLICATE ALL CARDS
     
     Example:
     1 2 3 4 5
     1 2 3 4 5
  ===================================================== */

  originalCards.forEach((card) => {

    const clone =
      card.cloneNode(true);

    clone.setAttribute(
      "aria-hidden",
      "true"
    );

    track.appendChild(clone);
  });


  /* =====================================================
     SETTINGS
     
     Smaller = faster
     Larger = slower
     
     55 = slow
     45 = medium
     35 = faster
  ===================================================== */

  const speed = 45;


  let position = 0;

  let lastTime =
    performance.now();

  let isPaused = false;

  let loopWidth = 0;


  /* =====================================================
     CALCULATE ORIGINAL WIDTH
  ===================================================== */

  function getLoopWidth() {

    let width = 0;

    originalCards.forEach((card) => {

      width += card.getBoundingClientRect().width;

    });


    const computedStyle =
      window.getComputedStyle(track);

    const gap =
      parseFloat(
        computedStyle.columnGap ||
        computedStyle.gap
      ) || 0;


    width +=
      gap * originalCards.length;


    return width;
  }


  /* =====================================================
     UPDATE LOOP WIDTH
  ===================================================== */

  function updateLoopWidth() {

    loopWidth =
      getLoopWidth();

    if (loopWidth > 0) {

      position =
        position % loopWidth;

    }
  }


  /* =====================================================
     INITIAL CALCULATION
  ===================================================== */

  updateLoopWidth();


  /* =====================================================
     PAUSE / RESUME
  ===================================================== */

  const successSlider =
    document.querySelector(".success-slider");


  if (successSlider) {

    successSlider.addEventListener(
      "mouseenter",
      () => {
        isPaused = true;
      }
    );


    successSlider.addEventListener(
      "mouseleave",
      () => {
        isPaused = false;

        lastTime =
          performance.now();
      }
    );


    successSlider.addEventListener(
      "touchstart",
      () => {
        isPaused = true;
      },
      {
        passive: true
      }
    );


    successSlider.addEventListener(
      "touchend",
      () => {
        isPaused = false;

        lastTime =
          performance.now();
      },
      {
        passive: true
      }
    );

  }


  /* =====================================================
     AUTOMATIC ANIMATION
  ===================================================== */

  function animate(currentTime) {

    const delta =
      currentTime - lastTime;

    lastTime =
      currentTime;


    if (!isPaused && loopWidth > 0) {

      position +=
        (speed * delta) / 1000;


      /*
          Once the first set has completely
          moved away, reset to the beginning.

          Because the cards are duplicated,
          this reset is invisible.
      */

      if (position >= loopWidth) {

        position -= loopWidth;

      }


      track.style.transform =
        `translate3d(-${position}px, 0, 0)`;
    }


    requestAnimationFrame(
      animate
    );
  }


  /* =====================================================
     START ANIMATION
  ===================================================== */

  requestAnimationFrame(
    animate
  );


  /* =====================================================
     RESIZE
  ===================================================== */

  let resizeTimer;

  window.addEventListener(
    "resize",
    () => {

      clearTimeout(resizeTimer);

      resizeTimer =
        setTimeout(() => {

          updateLoopWidth();

        }, 150);

    }
  );

});


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const hamburger =
    document.getElementById("hamburger");

  const mobileMenu =
    document.getElementById("mobileMenu");


  if (!hamburger || !mobileMenu) return;


  document.addEventListener("click", (event) => {

    const clickedInsideMenu =
      mobileMenu.contains(event.target);

    const clickedHamburger =
      hamburger.contains(event.target);


    if (
      !clickedInsideMenu &&
      !clickedHamburger
    ) {

      mobileMenu.classList.remove("active");

      hamburger.classList.remove("active");

    }

  });

});
// _________________________________________________


/* =====================================================
   MOBILE JOB POPUP FUNCTIONALITY
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const popup = document.getElementById("jobPopup");
    const closeButton = document.getElementById("jobClose");
    const jobButton = document.getElementById("jobButton");


    /* =================================================
       CHECK ELEMENTS
    ================================================= */

    if (!popup || !closeButton || !jobButton) {
        return;
    }


    /* =================================================
       WHATSAPP NUMBER
    ================================================= */

    /*
       Replace this number with your WhatsApp number.

       India example:
       919876543210

       Do NOT use +, spaces or brackets.
    */

    const whatsappNumber = "9881922922";


    /* =================================================
       WHATSAPP MESSAGE
    ================================================= */

    const whatsappMessage =
        "Hello Mentore Solution, I am interested in job opportunities. Please share the available openings and application details.";


    /* =================================================
       POPUP TIMING
    ================================================= */

   const MIN_DELAY = 3000;
const MAX_DELAY = 3000;

const VISIBLE_TIME = 5000;

const WAIT_TIME = 3000;


    /* =================================================
       POPUP POSITIONS
    ================================================= */

    const positions = [
        // "top-left",
        // "top-right",
        // "middle-left",
        "middle-right",
        "bottom-right",
        "bottom-left"
    ];


    /* =================================================
       TIMERS
    ================================================= */

    let showTimer = null;
    let hideTimer = null;
    let nextTimer = null;


    /* =================================================
       MOBILE CHECK
    ================================================= */

    function isMobile() {

        return window.matchMedia(
            "(max-width: 768px)"
        ).matches;

    }


    /* =================================================
       RANDOM DELAY
    ================================================= */

    function randomDelay() {

        return Math.floor(
            Math.random() *
            (
                MAX_DELAY -
                MIN_DELAY +
                1
            )
        ) + MIN_DELAY;

    }


    /* =================================================
       RANDOM POSITION
    ================================================= */

    function setRandomPosition() {

        positions.forEach(function (position) {

            popup.classList.remove(position);

        });


        const randomIndex =
            Math.floor(
                Math.random() *
                positions.length
            );


        popup.classList.add(
            positions[randomIndex]
        );

    }


    /* =================================================
       SHOW POPUP
    ================================================= */

    function showPopup() {

        if (!isMobile()) {
            return;
        }


        setRandomPosition();


        popup.classList.add("show");


        popup.setAttribute(
            "aria-hidden",
            "false"
        );


        clearTimeout(hideTimer);


        hideTimer = setTimeout(
            function () {

                hidePopup();

            },
            VISIBLE_TIME
        );

    }


    /* =================================================
       HIDE POPUP
    ================================================= */

    function hidePopup() {

        popup.classList.remove("show");


        popup.setAttribute(
            "aria-hidden",
            "true"
        );


        clearTimeout(nextTimer);


        nextTimer = setTimeout(
            function () {

                schedulePopup();

            },
            WAIT_TIME
        );

    }


    /* =================================================
       SCHEDULE POPUP
    ================================================= */

    function schedulePopup() {

        if (!isMobile()) {
            return;
        }


        clearTimeout(showTimer);


        showTimer = setTimeout(
            function () {

                showPopup();

            },
            randomDelay()
        );

    }


    /* =================================================
       CLOSE BUTTON
    ================================================= */

    closeButton.addEventListener(
        "click",
        function () {

            clearTimeout(hideTimer);
            clearTimeout(nextTimer);


            popup.classList.remove("show");


            popup.setAttribute(
                "aria-hidden",
                "true"
            );


            nextTimer = setTimeout(
                function () {

                    schedulePopup();

                },
                WAIT_TIME
            );

        }
    );


    /* =================================================
       WHATSAPP REDIRECT
    ================================================= */

    jobButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            const message =
                encodeURIComponent(
                    whatsappMessage
                );


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                message;


            window.location.href =
                whatsappURL;

        }
    );


    /* =================================================
       RESIZE HANDLER
    ================================================= */

    window.addEventListener(
        "resize",
        function () {

            if (!isMobile()) {

                clearTimeout(showTimer);
                clearTimeout(hideTimer);
                clearTimeout(nextTimer);


                popup.classList.remove("show");


                popup.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


    /* =================================================
       START POPUP
    ================================================= */

    schedulePopup();

});


/* =========================================================
   PERFORMANCE / VISIBILITY OPTIMIZATION
========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.hidden
    ) {

      /*
          Browser automatically reduces
          requestAnimationFrame frequency
          when tab is hidden.
      */

      return;
    }

  }
);
document.addEventListener("DOMContentLoaded", function () { /* ================================================= ELEMENTS ================================================= */ const popup = document.getElementById("jobPopup"); const closeButton = document.getElementById("jobClose"); const jobButton = document.getElementById("jobButton"); /* ================================================= TEST WHATSAPP NUMBER ================================================= */ /* Test number. Replace with your real number before using this on your website. Example India: 919876543210 */ const whatsappNumber = "15551234567"; const whatsappMessage = "Hello Mentore Solution, I am interested in job opportunities. Please share the available openings and application details."; /* ================================================= TIMING ================================================= */ /* FIRST APPEARANCE: 0.5 – 1 second VISIBLE: 4 seconds WAIT: 6 seconds THEN REPEAT */ const MIN_DELAY = 500; const MAX_DELAY = 1000; const VISIBLE_TIME = 4000; const WAIT_TIME = 6000; /* ================================================= RANDOM POSITIONS ================================================= */ const positions = ["top-left", "top-right", "middle-left", "middle-right", "bottom-right"]; /* ================================================= TIMERS ================================================= */ let showTimer = null; let hideTimer = null; let nextTimer = null; /* ================================================= MOBILE CHECK ================================================= */ function isMobile() { return window.matchMedia("(max-width: 768px)").matches; } /* ================================================= RANDOM DELAY ================================================= */ function randomDelay() { return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY; } /* ================================================= RANDOM POSITION ================================================= */ function setRandomPosition() { positions.forEach(function (position) { popup.classList.remove(position); }); const randomIndex = Math.floor(Math.random() * positions.length); popup.classList.add(positions[randomIndex]); } /* ================================================= SHOW POPUP ================================================= */ function showPopup() { if (!isMobile()) { return; } setRandomPosition(); popup.classList.add("show"); popup.setAttribute("aria-hidden", "false"); clearTimeout(hideTimer); hideTimer = setTimeout(function () { hidePopup(); }, VISIBLE_TIME); } /* ================================================= HIDE POPUP ================================================= */ function hidePopup() { popup.classList.remove("show"); popup.setAttribute("aria-hidden", "true"); clearTimeout(nextTimer); nextTimer = setTimeout(function () { schedulePopup(); }, WAIT_TIME); } /* ================================================= SCHEDULE POPUP ================================================= */ function schedulePopup() { if (!isMobile()) { return; } clearTimeout(showTimer); showTimer = setTimeout(function () { showPopup(); }, randomDelay()); } /* ================================================= CLOSE BUTTON ================================================= */ closeButton.addEventListener("click", function () { clearTimeout(hideTimer); clearTimeout(nextTimer); popup.classList.remove("show"); popup.setAttribute("aria-hidden", "true"); nextTimer = setTimeout(function () { schedulePopup(); }, WAIT_TIME); }); /* ================================================= WHATSAPP REDIRECT ================================================= */ jobButton.addEventListener("click", function (event) { event.preventDefault(); const message = encodeURIComponent(whatsappMessage); const whatsappURL = "https://wa.me/" + whatsappNumber + "?text=" + message; window.location.href = whatsappURL; }); /* ================================================= DESKTOP CHECK ================================================= */ window.addEventListener("resize", function () { if (!isMobile()) { clearTimeout(showTimer); clearTimeout(hideTimer); clearTimeout(nextTimer); popup.classList.remove("show"); popup.setAttribute("aria-hidden", "true"); } }); /* ================================================= START ================================================= */ schedulePopup(); });

/* =========================================================
   PORTFOLIO STAR RATINGS (merged from Portfolio.js)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".stars").forEach((el) => {
    const count = el.dataset.stars;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = "\u2605";
      star.style.animationDelay = `${i * 0.12}s`;
      el.appendChild(star);
    }
  });
});