/* =========================================================
   BACKGROUND MEDIA CONTROLLER
   Plays: Video1 → Video2 → Video3 → Img1 → Img2 → Img3 → Img4 → loop
   Audio: single MP3, looping, starts on first user interaction
========================================================= */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENTS
    ================================================= */

    var video1 = document.getElementById("bgVideo1");
    var video2 = document.getElementById("bgVideo2");
    var video3 = document.getElementById("bgVideo3");

    var img1 = document.getElementById("bgImg1");
    var img2 = document.getElementById("bgImg2");
    var img3 = document.getElementById("bgImg3");
    var img4 = document.getElementById("bgImg4");

    var audio = document.getElementById("bgAudio");
    var muteBtn = document.getElementById("bgMuteBtn");

    /* Exit if elements are missing */
    if (!video1 || !video2 || !video3 || !img1 || !img2 || !img3 || !img4 || !audio || !muteBtn) {
      return;
    }

    var videos = [video1, video2, video3];
    var images = [img1, img2, img3, img4];
    var allMedia = videos.concat(images);

    var IMAGE_DISPLAY_TIME = 1500; /* ms per image */
    var imageTimer = null;
    var audioStarted = false;


    /* =================================================
       HELPERS
    ================================================= */

    var activeMedia = null;

    function hideAllMedia() {
      for (var i = 0; i < allMedia.length; i++) {
        allMedia[i].classList.remove("active");
        allMedia[i].style.zIndex = "";
      }
      activeMedia = null;
    }

    function showMedia(el) {
      if (activeMedia === el) return;
      
      el.style.zIndex = "2";
      el.classList.add("active");

      if (activeMedia) {
        var previous = activeMedia;
        previous.style.zIndex = "1";
        setTimeout(function() {
          if (previous !== activeMedia) {
            previous.classList.remove("active");
            previous.style.zIndex = "";
          }
        }, 800); // 0.8s transition
      }

      activeMedia = el;
    }


    /* =================================================
       AUDIO — starts on first user click (autoplay policy)
    ================================================= */

    audio.muted = true;

    function tryStartAudio() {
      if (audioStarted) return;
      audioStarted = true;

      audio.muted = false;
      audio.volume = 1;
      audio.play().catch(function () {
        /* Browser still blocked — keep muted state */
        audio.muted = true;
        audioStarted = false;
        updateMuteIcon();
      });

      updateMuteIcon();
      document.removeEventListener("click", tryStartAudio);
      document.removeEventListener("touchstart", tryStartAudio);
    }

    document.addEventListener("click", tryStartAudio);
    document.addEventListener("touchstart", tryStartAudio, { passive: true });


    /* =================================================
       MUTE / UNMUTE BUTTON
    ================================================= */

    function updateMuteIcon() {
      var icon = muteBtn.querySelector("i");
      if (!icon) return;

      if (audio.muted) {
        icon.className = "fa-solid fa-volume-xmark";
        muteBtn.setAttribute("aria-label", "Unmute background audio");
        muteBtn.setAttribute("title", "Unmute background audio");
      } else {
        icon.className = "fa-solid fa-volume-high";
        muteBtn.setAttribute("aria-label", "Mute background audio");
        muteBtn.setAttribute("title", "Mute background audio");
      }
    }

    muteBtn.addEventListener("click", function (e) {
      e.stopPropagation(); /* prevent triggering tryStartAudio again */

      if (!audioStarted) {
        /* First click on mute button also starts the audio */
        audioStarted = true;
        audio.muted = false;
        audio.volume = 1;
        audio.play().catch(function(){});
      } else {
        audio.muted = !audio.muted;
      }

      updateMuteIcon();
    });


    /* =================================================
       VIDEO PLAYBACK
    ================================================= */

    function playVideo(videoEl, onEnd) {
      videoEl.preload = "auto";
      videoEl.muted = true;
      videoEl.currentTime = 0;

      var playPromise = videoEl.play();

      function onReadyToRender() {
        showMedia(videoEl);
      }

      if (playPromise !== undefined) {
        playPromise.then(function() {
          if (videoEl.readyState >= 3) {
            onReadyToRender();
          } else {
            var handlePlaying = function() {
              videoEl.removeEventListener("playing", handlePlaying);
              onReadyToRender();
            };
            videoEl.addEventListener("playing", handlePlaying);
          }
        }).catch(function () {
          if (onEnd) onEnd();
        });
      } else {
        onReadyToRender();
      }

      function onEnded() {
        videoEl.removeEventListener("ended", onEnded);
        if (onEnd) onEnd();
      }

      videoEl.addEventListener("ended", onEnded);
    }


    /* =================================================
       IMAGE SLIDESHOW
    ================================================= */

    function showImageSequence(index, onComplete) {
      if (index >= images.length) {
        if (onComplete) onComplete();
        return;
      }

      hideAllMedia();
      showMedia(images[index]);

      imageTimer = setTimeout(function () {
        showImageSequence(index + 1, onComplete);
      }, IMAGE_DISPLAY_TIME);
    }


    /* =================================================
       MAIN SEQUENCE
    ================================================= */

    function startSequence() {
      /* Preload video 2 and 3 when sequence starts */
      video2.preload = "auto";

      playVideo(video1, function () {
        video3.preload = "auto";

        playVideo(video2, function () {

          playVideo(video3, function () {

            showImageSequence(0, function () {
              /* Loop — restart from the beginning */
              startSequence();
            });

          });

        });

      });
    }


    /* =================================================
       START
    ================================================= */

    startSequence();

    /* Also start audio silently in the background
       (will be heard on first user interaction) */
    audio.play().catch(function () {
      /* Expected: autoplay blocked until user interacts */
    });

    updateMuteIcon();


    /* =================================================
       CLEANUP ON PAGE HIDE
    ================================================= */

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        /* Pause videos when tab is hidden to save resources */
        for (var i = 0; i < videos.length; i++) {
          if (!videos[i].paused) {
            videos[i].pause();
          }
        }
        if (imageTimer) {
          clearTimeout(imageTimer);
        }
      } else {
        /* Resume the active video when tab is visible again */
        for (var j = 0; j < videos.length; j++) {
          if (videos[j].classList.contains("active")) {
            videos[j].play().catch(function () {});
            break;
          }
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

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  });


  /* Close menu when clicking a link */

  const mobileLinks =
    mobileMenu.querySelectorAll("a");

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburger.classList.remove("active");
    });
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