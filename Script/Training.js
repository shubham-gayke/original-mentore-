// NAVBAR SCROLL EFFECT
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// MOBILE MENU TOGGLE
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// FILTER FUNCTIONALITY
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const courseCards = document.querySelectorAll(".course-card");

  // Filter function
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      courseCards.forEach((card) => {
        if (filterValue === "all") {
          card.classList.remove("hidden");
          setTimeout(() => {
            card.style.display = "flex";
          }, 10);
        } else {
          const category = card.getAttribute("data-category");
          if (category === filterValue) {
            card.classList.remove("hidden");
            setTimeout(() => {
              card.style.display = "flex";
            }, 10);
          } else {
            card.classList.add("hidden");
            setTimeout(() => {
              card.style.display = "none";
            }, 300);
          }
        }
      });
    });
  });

  // Enroll button functionality
  const enrollButtons = document.querySelectorAll(".enroll-btn");
  enrollButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const courseTitle =
        this.closest(".course-card").querySelector(
          ".course-header h2"
        ).textContent;
      const phoneNumber = "+919876543210";
      const whatsappMessage = `Hi, I'm interested in enrolling in the ${courseTitle} course. Can you provide more details?`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      window.open(whatsappUrl, "_blank");
    });
  });

  // COUNTER ANIMATION
  function startCounterAnimation() {
    const counters = document.querySelectorAll(".counter");
    const speed = 200; // The lower the slower

    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText.replace(/,/g, "");
        const inc = target / speed;

        // Check if target is reached
        if (count < target) {
          // Add inc to count and output in counter
          let newCount;
          if (target > 1000) {
            // For larger numbers like 5000
            newCount = Math.ceil(count + inc);
          } else {
            // For smaller numbers like 95
            newCount = count + inc;
          }

          // Format number with commas
          const formattedCount = newCount.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          });

          counter.innerText = formattedCount;
          // Call function every ms
          setTimeout(updateCount, 1);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };

      updateCount();
    });
  }

  // Start counter animation when stats section is in viewport
  const statsSection = document.querySelector(".stats-section");
  let animationStarted = false;

  function checkIfInView() {
    const rect = statsSection.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Check if stats section is in viewport
    if (rect.top <= windowHeight * 0.8 && !animationStarted) {
      startCounterAnimation();
      animationStarted = true;
      // Remove event listener after animation starts
      window.removeEventListener("scroll", checkIfInView);
    }
  }

  // Start checking when page loads
  window.addEventListener("scroll", checkIfInView);

  // Also check on page load in case stats section is already visible
  setTimeout(checkIfInView, 100);
});
