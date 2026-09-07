
/* =====================================
   TYPING ANIMATION
===================================== */


const typingText = document.getElementById(
    "typing-text"
);


const text = "Mentore Solution";


let characterIndex = 0;


function typeText() {


    if (characterIndex < text.length) {


        typingText.textContent +=
            text.charAt(characterIndex);


        characterIndex++;


        setTimeout(typeText, 120);


    }

}


typeText();


document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       PAUSE SLIDER ON HOVER
    ===================================== */
    


    const sliders = document.querySelectorAll(".slider");


    sliders.forEach((slider) => {


        const track =
            slider.querySelector(".slider-track");


        slider.addEventListener("mouseenter", () => {

            track.style.animationPlayState = "paused";

        });


        slider.addEventListener("mouseleave", () => {

            track.style.animationPlayState = "running";

        });


    });


    /* =====================================
       TOUCH SUPPORT FOR MOBILE
    ===================================== */


    sliders.forEach((slider) => {


        const track =
            slider.querySelector(".slider-track");


        slider.addEventListener("touchstart", () => {

            track.style.animationPlayState = "paused";

        });


        slider.addEventListener("touchend", () => {

            track.style.animationPlayState = "running";

        });


    });


});