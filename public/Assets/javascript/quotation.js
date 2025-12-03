
// ===== COMPREHENSIVE THEME MANAGER =====
class ThemeManager {
    constructor() {
        this.toggle = document.getElementById('dark-mode-toggle');
        this.toggleMobile = document.getElementById('dark-mode-toggle-mobile');
        this.body = document.body;
        this.init();
    }

    init() {
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            this.enableDarkMode();
        } else {
            this.enableLightMode();
        }

        // Add event listeners for both toggles
        if (this.toggle) {
            this.toggle.addEventListener('change', () => {
                if (this.toggle.checked) {
                    this.enableLightMode();
                } else {
                    this.enableDarkMode();
                }
            });
        }

        if (this.toggleMobile) {
            this.toggleMobile.addEventListener('change', () => {
                if (this.toggleMobile.checked) {
                    this.enableLightMode();
                } else {
                    this.enableDarkMode();
                }

                // Close mobile menu when toggle is pressed
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    this.enableDarkMode();
                } else {
                    this.enableLightMode();
                }
            }
        });

        // Fix light mode text issues
        this.fixLightModeText();
    }

    enableDarkMode() {
        this.body.classList.remove('light-mode');
        this.body.classList.add('dark-mode');
        if (this.toggle) this.toggle.checked = false;
        if (this.toggleMobile) this.toggleMobile.checked = false;
        localStorage.setItem('theme', 'dark');
        this.fixLightModeText();
    }

    enableLightMode() {
        this.body.classList.remove('dark-mode');
        this.body.classList.add('light-mode');
        if (this.toggle) this.toggle.checked = true;
        if (this.toggleMobile) this.toggleMobile.checked = true;
        localStorage.setItem('theme', 'light');
        this.fixLightModeText();
    }

    closeMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }

    fixLightModeText() {
        if (this.body.classList.contains('light-mode')) {
            // Find all strong tags and ensure they're visible
            const strongTags = document.querySelectorAll('strong');
            strongTags.forEach(tag => {
                tag.style.color = '#000';
                tag.style.fontWeight = '700';
            });

            // Fix intro text specifically
            const intro = document.querySelector('.intro');
            if (intro) {
                intro.style.color = '#333';
                const introStrong = intro.querySelector('strong');
                if (introStrong) {
                    introStrong.style.color = '#000';
                    introStrong.style.fontWeight = '800';
                }
            }
        }
    }
}

// ===== MOBILE MENU FUNCTIONALITY =====
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMenu) return;

        // Better touch handling for mobile
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');

            // Prevent body scroll when menu is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
                document.documentElement.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', (e) => {
            // Small delay to show the click feedback
            setTimeout(() => {
                this.closeMenu();
            }, 300);
        }));

        // Close menu when tapping outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.navMenu.classList.contains('active')) {
                if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                    this.closeMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close menu when switching to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== FORM HANDLING =====
function initQuotationForm() {
    const form = document.getElementById('quotation-form');
    if (!form) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default submission

        // Get form values
        let name = document.getElementById('name').value.trim();
        let email = document.getElementById('email').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let service = document.getElementById('service').value;
        let details = document.getElementById('details').value.trim();

        // Validate required fields
        if (!name || !email || !phone || !service) {
            alert('Please fill in all required fields.');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn-quote');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        // Send email via Formspree
        let formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('service', service);
        formData.append('details', details);

        fetch('https://formspree.io/f/meoavpbv', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                alert('Your request has been sent successfully!');
                form.reset();
                // Redirect to home page after successful submission
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);
            } else {
                alert('There was an error submitting your request. Please try again.');
            }
        }).catch(error => {
            alert('Error: ' + error);
        }).finally(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ===== IMPROVED TOUCH EVENT HANDLING =====
function initTouchEvents() {
    // Prevent zoom on double tap (for iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Improved touch handling for interactive elements
    document.querySelectorAll('button, a, .btn-quote').forEach(element => {
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', function () {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('Quotation page - initializing scripts');

    // Initialize all components
    new ThemeManager();
    new MobileMenu();
    initSmoothScrolling();
    initQuotationForm();
    initTouchEvents();

    // Add loaded class to body for CSS hooks
    document.body.classList.add('loaded');

    console.log('Quotation page scripts initialized successfully');
});

// ===== RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // Re-initialize components that need recalculating on resize
        if (window.innerWidth > 768) {
            const mobileMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        }
    }, 250);
});

// Handle orientation changes
window.addEventListener('orientationchange', function () {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});
