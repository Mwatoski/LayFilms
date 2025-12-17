/* ===========================
   LAY FILMS UI ENHANCEMENTS
   Advanced JavaScript Interactions
   =========================== */

// ===== 3D CARD TILT EFFECT =====
function init3DCardTilt() {
    const cards = document.querySelectorAll('.portfolio-category');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after revealing to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Also observe portfolio categories and service items
    document.querySelectorAll('.portfolio-category, .service-item, .story-section > *').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ===== MAGNETIC CURSOR EFFECT FOR BUTTONS =====
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.message-btn, .view-button, .cta-link');

    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ===== SMOOTH SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    // Create progress bar element
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(255, 255, 255, 0.1);
            z-index: 9999;
            pointer-events: none;
        }
        
        .scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary-500), var(--primary-300));
            width: 0%;
            transition: width 0.1s ease;
            box-shadow: 0 0 10px var(--primary-500);
        }
    `;
    document.head.appendChild(style);

    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = scrollPercent + '%';
        }
    });
}

// ===== PARALLAX EFFECT FOR HERO IMAGES =====
function initParallax() {
    const heroImages = document.querySelectorAll('.hero-images .img');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        heroImages.forEach((img, index) => {
            const speed = 0.1 + (index * 0.05);
            img.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// ===== RIPPLE EFFECT ON CLICK =====
function initRippleEffect() {
    const buttons = document.querySelectorAll('.message-btn, .view-button, .cta-link, .social-icons a');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple styles
    const style = document.createElement('style');
    style.textContent = `
        .message-btn, .view-button, .cta-link, .social-icons a {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== ENHANCED STATISTICS COUNTER =====
function initEnhancedStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    let started = false;

    const animateValue = (element, start, end, duration) => {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !started) {
                started = true;
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateValue(stat, 0, target, 2000);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.story-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// ===== LAZY LOAD IMAGES =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.padding = '0.5rem 2rem';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.padding = '1rem 2rem';
            navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        }

        // Hide navbar on scroll down, show on scroll up
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// ===== SMOOTH SCROLL TO SECTION =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== CURSOR TRAIL EFFECT (OPTIONAL - LIGHTWEIGHT) =====
function initCursorTrail() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    const trail = [];
    const trailLength = 10;

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        trail.push(dot);
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        let x = mouseX;
        let y = mouseY;

        trail.forEach((dot, index) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.style.transform = `scale(${(trailLength - index) / trailLength})`;

            const nextDot = trail[index + 1] || trail[0];
            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Add cursor trail styles
    const style = document.createElement('style');
    style.textContent = `
        .cursor-trail {
            position: fixed;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, var(--primary-400), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0.6;
            transition: transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

// ===== MOBILE SWIPE GESTURES FOR GALLERIES =====
function initSwipeGestures() {
    // Only enable on mobile/tablet
    if (window.innerWidth > 1024) return;

    const galleries = document.querySelectorAll('.portfolio-grid-large, .reels-grid, .hero-images');

    galleries.forEach(gallery => {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isSwiping = false;
        let currentIndex = 0;

        const items = gallery.querySelectorAll('.portfolio-category, .reel-item, .img');
        if (items.length === 0) return;

        // Add swipe indicator
        const indicator = document.createElement('div');
        indicator.className = 'swipe-indicator';
        indicator.innerHTML = '← Swipe →';
        gallery.appendChild(indicator);

        // Hide indicator after 3 seconds
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }, 3000);

        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;

            // Add visual feedback
            gallery.style.transform = 'scale(0.98)';
        }, { passive: true });

        gallery.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;

            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Only swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                e.preventDefault();

                // Visual feedback during swipe
                const swipeAmount = deltaX / window.innerWidth;
                gallery.style.transform = `translateX(${deltaX * 0.3}px) scale(0.98)`;
            }
        }, { passive: false });

        gallery.addEventListener('touchend', (e) => {
            if (!isSwiping) return;

            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            // Reset visual feedback
            gallery.style.transform = 'translateX(0) scale(1)';
            gallery.style.transition = 'transform 0.3s ease';

            setTimeout(() => {
                gallery.style.transition = '';
            }, 300);

            // Detect swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - previous
                    handleSwipe('right', gallery, items, currentIndex);
                    currentIndex = Math.max(0, currentIndex - 1);
                } else {
                    // Swipe left - next
                    handleSwipe('left', gallery, items, currentIndex);
                    currentIndex = Math.min(items.length - 1, currentIndex + 1);
                }

                // Haptic feedback (if supported)
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }

            isSwiping = false;
        }, { passive: true });
    });

    // Add swipe indicator styles
    const style = document.createElement('style');
    style.textContent = `
        .swipe-indicator {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(25, 210, 124, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 100;
            pointer-events: none;
            opacity: 1;
            transition: opacity 0.3s ease;
            box-shadow: 0 4px 12px rgba(25, 210, 124, 0.3);
        }
        
        @media (min-width: 1025px) {
            .swipe-indicator {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
}

function handleSwipe(direction, gallery, items, currentIndex) {
    // Scroll to the next/previous item
    const targetIndex = direction === 'left' ?
        Math.min(items.length - 1, currentIndex + 1) :
        Math.max(0, currentIndex - 1);

    const targetItem = items[targetIndex];
    if (targetItem) {
        // Smooth scroll to item
        targetItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });

        // Add highlight effect
        targetItem.style.transform = 'scale(1.05)';
        targetItem.style.transition = 'transform 0.3s ease';

        setTimeout(() => {
            targetItem.style.transform = '';
        }, 300);
    }
}

// ===== INITIALIZE ALL ENHANCEMENTS =====
function initAllEnhancements() {
    console.log('🎨 Initializing UI Enhancements...');

    // Core enhancements
    init3DCardTilt();
    initScrollReveal();
    initScrollProgress();
    initRippleEffect();
    initEnhancedStatsCounter();
    initNavbarScroll();
    initSmoothScroll();

    // Optional enhancements (can be disabled for performance)
    if (window.innerWidth > 768) {
        initMagneticButtons();
        // initParallax(); // Disabled by default - can cause performance issues
        // initCursorTrail(); // Disabled by default - optional effect
    }

    // Mobile-specific enhancements
    if (window.innerWidth <= 1024) {
        initSwipeGestures();
    }

    initLazyLoading();

    console.log('✨ UI Enhancements Loaded Successfully!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllEnhancements);
} else {
    initAllEnhancements();
}

// Re-initialize on page show (for back/forward cache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        initAllEnhancements();
    }
});

// Export functions for external use
window.LayFilmsEnhancements = {
    init3DCardTilt,
    initScrollReveal,
    initMagneticButtons,
    initScrollProgress,
    initParallax,
    initRippleEffect,
    initEnhancedStatsCounter,
    initLazyLoading,
    initNavbarScroll,
    initSmoothScroll,
    initCursorTrail,
    initSwipeGestures
};
