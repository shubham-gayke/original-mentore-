// NAVBAR SCROLL
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// MOBILE MENU
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// COUNTER ANIMATION
const counters = document.querySelectorAll(".count");
let started = false;

function startCounter() {
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;
    const speed = target / 100;

    const updateCount = () => {
      if (count < target) {
        count += speed;
        counter.innerText = Math.ceil(count);
        setTimeout(updateCount, 15);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
}

// Start counter when in viewport
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        startCounter();
        started = true;
      }
    });
  },
  { threshold: 0.5 }
);

const counterSection = document.querySelector(".counter-section");
if (counterSection) {
  counterObserver.observe(counterSection);
}

// STAR RATING ANIMATION
document.querySelectorAll(".stars").forEach((el) => {
  const count = el.dataset.stars;
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    star.style.animationDelay = `${i * 0.12}s`;
    el.appendChild(star);
  }
});

// FLOATING BUTTON TOGGLE
const floatingBtn = document.querySelector(".floating-btn");
const mainBtn = floatingBtn?.querySelector(".main-btn");

if (mainBtn) {
  mainBtn.addEventListener("click", () => {
    floatingBtn.classList.toggle("active");
  });
}

// REQUEST CALLBACK BUTTON
const requestCallbackBtn = document.getElementById("requestCallback");
if (requestCallbackBtn) {
  requestCallbackBtn.addEventListener("click", () => {
    const phoneNumber = "+919876543210";
    const whatsappMessage =
      "Hi, I'm interested in getting a free consultation for my project. Can you please call me back?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  });
}

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    hamburger &&
    mobileMenu &&
    !hamburger.contains(e.target) &&
    !mobileMenu.contains(e.target)
  ) {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Close mobile menu when clicking a link
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Smooth scroll for hero button
document.querySelectorAll('.hero-btn[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Add hover effect to project cards
document.querySelectorAll(".fp-card-column").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});
