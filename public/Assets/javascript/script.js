// Select hamburger and nav links
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');  // Toggle navigation links visibility
    hamburger.classList.toggle('active'); // Animate the hamburger
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


particlesJS("particles-js", {
    particles: {
        number: { value: 80 },
        size: { value: 3 },
        move: { speed: 2 },
        opacity: { value: 0.7 },
        line_linked: { enable: false }
    }
});

