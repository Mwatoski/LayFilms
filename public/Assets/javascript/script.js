// Select hamburger and nav links
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');  // Toggle navigation links visibility
    hamburger.classList.toggle('active'); // Animate the hamburger
});
document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.getElementById("hero-text");
    const subtitleElement = document.querySelector(".hero-content h2"); // Target the subtitle
    const text = "Welcome to Lay Films Production";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100); // Adjust typing speed
        } else {
            setTimeout(() => {
                subtitleElement.style.opacity = "1"; // Make subtitle visible
                subtitleElement.style.transform = "translateY(0)"; // Slide it in
            }, 1000); // Delay before subtitle appears
        }
    }

    subtitleElement.style.opacity = "0"; // Hide subtitle initially
    subtitleElement.style.transform = "translateY(20px)"; // Start slightly lower
    subtitleElement.style.transition = "opacity 1s ease, transform 1s ease";

    typeText(); // Start typing animation
});
document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioItems = document.querySelectorAll(".portfolio-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category");

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");

            // Filter items
            portfolioItems.forEach(item => {
                if (category === "all" || item.getAttribute("data-category") === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});


document.querySelector(".scroll-btn").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector("#portfolio-grid").scrollIntoView({ behavior: "smooth" });
});





