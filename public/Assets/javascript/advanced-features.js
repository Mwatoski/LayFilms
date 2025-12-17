/* ===========================
   ADVANCED UI FEATURES - JAVASCRIPT
   Interactive Premium Features
   =========================== */

// ===== PAGE TRANSITION ANIMATIONS =====
function initPageTransitions() {
    // Create transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    // Fade in on page load
    document.body.classList.add('fade-transition');

    // Handle all internal links
    document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if it's just a hash link
            if (href.startsWith('#')) return;

            e.preventDefault();

            // Trigger transition
            overlay.classList.add('active');

            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 500);
        });
    });
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    // Only on desktop
    if (window.innerWidth < 768) return;

    // Create cursor elements
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    document.body.classList.add('custom-cursor-enabled');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate dot follow
        dotX = mouseX;
        dotY = mouseY;

        cursor.classList.add('active');
        cursorDot.classList.add('active');
    });

    // Smooth cursor follow
    function animateCursor() {
        // Smooth follow with easing
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .portfolio-category, .view-button, .message-btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        cursor.classList.add('click');
        cursorDot.style.transform = 'scale(1.5)';
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('click');
        cursorDot.style.transform = 'scale(1)';
    });
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.insertBefore(container, document.body.firstChild);

    const particleCount = window.innerWidth < 768 ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }

    // Continuously create new particles
    setInterval(() => {
        if (container.children.length < particleCount) {
            createParticle(container);
        }
    }, 3000);
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const drift = (Math.random() - 0.5) * 100; // Random horizontal drift
    const duration = 10 + Math.random() * 20; // 10-30 seconds
    const size = 2 + Math.random() * 4; // 2-6px
    const delay = Math.random() * 5; // 0-5s delay

    particle.style.left = startX + 'px';
    particle.style.bottom = '0px';
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.setProperty('--particle-drift', drift + 'px');
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';

    container.appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        particle.remove();
    }, (duration + delay) * 1000);
}

// ===== SOUND EFFECTS =====
class SoundManager {
    constructor() {
        this.enabled = true;
        this.sounds = {};
        this.visualizer = null;
        this.initSounds();
        this.createVisualizer();
    }

    initSounds() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Define sound frequencies
        this.soundFrequencies = {
            click: 800,
            hover: 600,
            success: 1000,
            transition: 400
        };
    }

    createVisualizer() {
        const visualizer = document.createElement('div');
        visualizer.className = 'sound-wave';

        for (let i = 0; i < 6; i++) {
            const bar = document.createElement('div');
            bar.className = 'sound-wave-bar';
            visualizer.appendChild(bar);
        }

        document.body.appendChild(visualizer);
        this.visualizer = visualizer;
    }

    playSound(type, duration = 100) {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = this.soundFrequencies[type] || 600;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);

        // Show visualizer
        this.visualizer.classList.add('active');
        setTimeout(() => {
            this.visualizer.classList.remove('active');
        }, duration);
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

let soundManager;

function initSoundEffects() {
    soundManager = new SoundManager();

    // Add sound to buttons
    document.querySelectorAll('button, .view-button, .message-btn').forEach(el => {
        el.addEventListener('click', () => soundManager.playSound('click', 80));
        el.addEventListener('mouseenter', () => soundManager.playSound('hover', 50));
    });

    // Add sound to links
    document.querySelectorAll('a').forEach(el => {
        el.addEventListener('mouseenter', () => soundManager.playSound('hover', 40));
    });

    // Success sound for form submissions
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => soundManager.playSound('success', 200));
    });
}

// ===== ENHANCED PARALLAX =====
function initEnhancedParallax() {
    const parallaxElements = document.querySelectorAll('.hero-images .img, .portfolio-category, ');

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;

                parallaxElements.forEach((el, index) => {
                    const speed = 0.05 + (index * 0.02);
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Mouse parallax for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;

            const heroImages = document.querySelectorAll('.hero-images .img');
            heroImages.forEach((img, index) => {
                const depth = (index + 1) * 10;
                const xMove = xPercent * depth;
                const yMove = yPercent * depth;

                img.style.transform = `translate(${xMove}px, ${yMove}px)`;
            });
        });
    }
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-logo">
            <img src="./Assets/images/LayF.png" alt="Loading" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="loading-bar">
            <div class="loading-bar-fill"></div>
        </div>
        <div class="loading-text">Loading Experience...</div>
    `;

    document.body.insertBefore(loadingScreen, document.body.firstChild);

    // Hide after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1000);
    });
}

// ===== ENHANCED THEME TOGGLE =====
function initEnhancedThemeToggle() {
    const toggles = document.querySelectorAll('.toggle-checkbox');

    toggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            // Play sound
            if (soundManager) {
                soundManager.playSound('transition', 150);
            }

            // Trigger page-wide animation
            document.body.style.transition = 'background-color 0.6s ease, color 0.6s ease';

            // Create ripple effect from toggle
            const label = this.nextElementSibling;
            const rect = label.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                top: ${rect.top + rect.height / 2}px;
                left: ${rect.left + rect.width / 2}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: ${this.checked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
                pointer-events: none;
                z-index: 9998;
                transition: width 0.8s ease, height 0.8s ease, opacity 0.8s ease;
                opacity: 1;
            `;

            document.body.appendChild(ripple);

            setTimeout(() => {
                ripple.style.width = '200vmax';
                ripple.style.height = '200vmax';
                ripple.style.transform = 'translate(-50%, -50%)';
                ripple.style.opacity = '0';
            }, 10);

            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
}

// ===== INITIALIZE ALL ADVANCED FEATURES =====
function initAdvancedFeatures() {
    console.log('🚀 Initializing Advanced Features...');

    // Loading screen (runs first)
    initLoadingScreen();

    // Core advanced features
    initPageTransitions();
    initParticles();
    initEnhancedThemeToggle();

    // Desktop-only features
    if (window.innerWidth > 768) {
        initCustomCursor();
        initEnhancedParallax();
    }

    // Sound effects (optional - can be toggled)
    try {
        initSoundEffects();
    } catch (e) {
        console.log('Sound effects not supported');
    }

    console.log('✨ Advanced Features Loaded!');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedFeatures);
} else {
    initAdvancedFeatures();
}

// Export for external use
window.LayFilmsAdvanced = {
    initPageTransitions,
    initCustomCursor,
    initParticles,
    initSoundEffects,
    initEnhancedParallax,
    initLoadingScreen,
    initEnhancedThemeToggle,
    soundManager
};
