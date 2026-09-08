/**
 * Mentore Solution — Interactive 3D Effects & Physics Engine
 * 3D perspective card tilt with specular glare, magnetic button physics,
 * click ripple particles, and dynamic showcase accents.
 */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // Check reduced motion preference
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // ========================================================
    // 1. 3D PERSPECTIVE CARD TILT WITH SPECULAR GLARE
    // ========================================================
    var cardSelectors = [
      ".feature-box",
      ".why-box",
      ".service-box",
      ".fp-card-column",
      ".job-card",
      ".program-card",
      ".stat-box",
      ".student-card",
      ".placement-card"
    ];

    var cards = document.querySelectorAll(cardSelectors.join(", "));

    cards.forEach(function (card) {
      // Create glare overlay if not present
      var glare = card.querySelector(".card-specular-glare");
      if (!glare) {
        glare = document.createElement("div");
        glare.className = "card-specular-glare";
        glare.style.cssText =
          "position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;border-radius:inherit;opacity:0;transition:opacity 0.3s ease;z-index:3;mix-blend-mode:overlay;";
        card.style.position = card.style.position || "relative";
        card.appendChild(glare);
      }

      var rect, width, height, centerX, centerY;

      function updateDimensions() {
        rect = card.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        centerX = rect.left + width / 2;
        centerY = rect.top + height / 2;
      }

      card.addEventListener("mouseenter", function () {
        updateDimensions();
        card.style.transition = "transform 0.15s ease-out, box-shadow 0.3s ease";
        glare.style.opacity = "1";
      });

      card.addEventListener("mousemove", function (e) {
        if (!width || !height) updateDimensions();

        var mouseX = e.clientX - centerX;
        var mouseY = e.clientY - centerY;

        // Max tilt angle (degrees)
        var maxTilt = 8;
        var rotateY = (mouseX / (width / 2)) * maxTilt;
        var rotateX = -(mouseY / (height / 2)) * maxTilt;

        card.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX.toFixed(2) +
          "deg) rotateY(" +
          rotateY.toFixed(2) +
          "deg) translateZ(8px)";

        // Calculate specular glare position
        var glareX = ((e.clientX - rect.left) / width) * 100;
        var glareY = ((e.clientY - rect.top) / height) * 100;
        glare.style.background =
          "radial-gradient(circle at " +
          glareX.toFixed(1) +
          "% " +
          glareY.toFixed(1) +
          "%, rgba(255, 235, 180, 0.45) 0%, rgba(255, 215, 0, 0.12) 35%, transparent 70%)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease";
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
        glare.style.opacity = "0";
      });
    });

    // ========================================================
    // 2. MAGNETIC BUTTON PHYSICS
    // ========================================================
    var magneticButtons = document.querySelectorAll(
      ".consult-btn, .btn-primary, .home-bg-mute-btn, .apply-btn, .job-button, .view-btn"
    );

    magneticButtons.forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        btn.style.transition = "transform 0.1s ease-out";
        btn.style.transform =
          "translate(" + (x * 0.22).toFixed(1) + "px, " + (y * 0.22).toFixed(1) + "px)";
      });

      btn.addEventListener("mouseleave", function () {
        btn.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
        btn.style.transform = "translate(0px, 0px)";
      });
    });

    // ========================================================
    // 3. ELEGANT 3D GOLDEN STARDUST BURST ON INTERACTION
    // ========================================================
    document.addEventListener("click", function (e) {
      // Don't trigger on inputs or selects
      if (["INPUT", "TEXTAREA", "SELECT"].indexOf(e.target.tagName) !== -1) return;

      createStardustBurst(e.clientX, e.clientY);
    });

    function createStardustBurst(x, y) {
      var sparkCount = 10;
      var colors = ["#ffd700", "#f6c851", "#fffae0", "#f59e0b"];

      for (var i = 0; i < sparkCount; i++) {
        var spark = document.createElement("span");
        spark.className = "three-stardust-spark";

        var angle = Math.random() * Math.PI * 2;
        var distance = Math.random() * 55 + 25;
        var destX = Math.cos(angle) * distance;
        var destY = Math.sin(angle) * distance;
        var size = Math.random() * 4 + 3;
        var color = colors[Math.floor(Math.random() * colors.length)];

        spark.style.cssText =
          "position:fixed;left:" +
          x +
          "px;top:" +
          y +
          "px;width:" +
          size +
          "px;height:" +
          size +
          "px;border-radius:50%;background:" +
          color +
          ";box-shadow:0 0 8px " +
          color +
          ";pointer-events:none;z-index:9999;transform:translate(-50%, -50%) scale(1);transition:transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease-out;opacity:1;";

        document.body.appendChild(spark);

        (function (s, dx, dy) {
          requestAnimationFrame(function () {
            s.style.transform =
              "translate(calc(-50% + " +
              dx +
              "px), calc(-50% + " +
              dy +
              "px)) scale(0)";
            s.style.opacity = "0";
          });
          setTimeout(function () {
            if (s && s.parentNode) s.parentNode.removeChild(s);
          }, 700);
        })(spark, destX, destY);
      }
    }
  });
})();
