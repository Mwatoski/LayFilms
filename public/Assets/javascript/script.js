// ===== MOBILE MENU FUNCTIONALITY =====
// ===== IMPROVED MOBILE MENU FUNCTIONALITY =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    // Better touch handling for mobile
    hamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
            document.documentElement.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', (e) => {
        // Small delay to show the click feedback
        setTimeout(() => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }, 300);
    }));

    // Close menu when tapping outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
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
    document.querySelectorAll('button, a, .reel-card, .portfolio-category').forEach(element => {
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });

        element.addEventListener('touchend', function () {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    });
}

// ===== IMPROVED MOBILE RESIZE HANDLER =====
let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        // Close mobile menu when switching to desktop
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }

        // Re-initialize components that need recalculating
        if (window.initReelShowcase) {
            initReelShowcase();
        }
    }, 250);
});

// ===== IMPROVED INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing all scripts');

    // Initialize touch events first
    initTouchEvents();

    // Then initialize other components
    initHeroAnimations();
    initPortfolioNavigation();
    initReelShowcase();
    initSmoothScrolling();

    // Add loaded class to body for CSS hooks
    document.body.classList.add('loaded');

    console.log('All scripts initialized successfully');
});

// Make functions globally available
window.initReelShowcase = initReelShowcase;
window.initTouchEvents = initTouchEvents;

// ===== DARK/LIGHT MODE TOGGLE =====
// Update your existing dark mode toggle code to handle both toggles
// ===== IMPROVED DARK/LIGHT MODE TOGGLE =====
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
const body = document.body;

function updateThemeColors(isLightMode) {
    // Update all text elements to ensure proper visibility
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, strong, em, a, li');
    const strongTags = document.querySelectorAll('strong');
    const intro = document.querySelector('.intro');
    
    if (isLightMode) {
        // Light mode colors
        textElements.forEach(el => {
            if (!el.closest('.portfolio-showcase') && !el.closest('.story-section') && !el.closest('.footer')) {
                el.style.color = '';
            }
        });
        
        strongTags.forEach(tag => {
            tag.style.color = '#000';
            tag.style.fontWeight = '700';
        });
        
        if (intro) {
            intro.style.color = '#333';
            const introStrong = intro.querySelectorAll('strong');
            introStrong.forEach(strong => {
                strong.style.color = '#000';
                strong.style.fontWeight = '800';
            });
        }
    } else {
        // Dark mode colors - reset to CSS defaults
        textElements.forEach(el => {
            el.style.color = '';
        });
        
        strongTags.forEach(tag => {
            tag.style.color = '';
            tag.style.fontWeight = '';
        });
        
        if (intro) {
            intro.style.color = '';
            const introStrong = intro.querySelectorAll('strong');
            introStrong.forEach(strong => {
                strong.style.color = '';
                strong.style.fontWeight = '';
            });
        }
    }
}

function updateThemeToggles(isLightMode) {
    if (darkModeToggle) darkModeToggle.checked = isLightMode;
    if (darkModeToggleMobile) darkModeToggleMobile.checked = isLightMode;
}

if (darkModeToggle || darkModeToggleMobile) {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
        body.classList.add('light-mode');
        updateThemeToggles(true);
        // Force color update on initial load
        setTimeout(() => updateThemeColors(true), 100);
    } else {
        // Force color update for dark mode
        setTimeout(() => updateThemeColors(false), 100);
    }

    // Desktop toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', function () {
            const isLightMode = this.checked;
            body.classList.toggle('light-mode', isLightMode);
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            updateThemeToggles(isLightMode);
            updateThemeColors(isLightMode);
        });
    }

    // Mobile toggle
    if (darkModeToggleMobile) {
        darkModeToggleMobile.addEventListener('change', function () {
            const isLightMode = this.checked;
            body.classList.toggle('light-mode', isLightMode);
            localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
            updateThemeToggles(isLightMode);
            updateThemeColors(isLightMode);

            // Close mobile menu when toggle is pressed
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
            }
        });
    }
}

// Also update colors when page loads completely
window.addEventListener('load', function() {
    const isLightMode = body.classList.contains('light-mode');
    updateThemeColors(isLightMode);
});

// ===== HERO SECTION ANIMATIONS =====
function initHeroAnimations() {
    const heroImages = document.querySelector('.hero-images');

    if (heroImages) {
        // Add loaded class after a short delay
        setTimeout(() => {
            heroImages.classList.add('loaded');
        }, 500);

        // Handle image loading for better performance
        const images = heroImages.querySelectorAll('img');
        let loadedCount = 0;

        images.forEach(img => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === images.length) {
                        heroImages.classList.add('loaded');
                    }
                });
            }
        });

        // If all images are already loaded
        if (loadedCount === images.length) {
            heroImages.classList.add('loaded');
        }
    }
}

// ===== PORTFOLIO NAVIGATION =====
function initPortfolioNavigation() {
    const categoryLinks = document.querySelectorAll('.category-link');

    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const category = this.closest('.portfolio-category').dataset.category;
                showCategoryWork(category);
            });
        });
    }
}

function showCategoryWork(category) {
    const categoryNames = {
        'corporate': 'Corporate Events',
        'commercial': 'Commercial Adverts',
        'weddings': 'Wedding Events',
        'motion': 'Motion Graphics',
        'ngo': 'NGO Events',
        'reels': 'Social Media Reels'
    };

    console.log(`Showing ${categoryNames[category]} work`);
    // In production, this would load the specific portfolio section
}

// ===== EMBEDDED YOUTUBE PLAYER =====
function initEmbeddedReels() {
    const reelPlayers = document.querySelectorAll('.reel-player');
    if (reelPlayers.length === 0) return;

    let currentPlayer = null;

    // Load YouTube IFrame API
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const players = {};

    window.onYouTubeIframeAPIReady = function () {
        reelPlayers.forEach((playerElement) => {
            const videoId = playerElement.dataset.videoId;
            const embedContainer = playerElement.querySelector('.video-embed');

            if (embedContainer) {
                players[videoId] = new YT.Player(embedContainer, {
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 0,
                        'modestbranding': 1,
                        'rel': 0,
                        'showinfo': 0,
                        'controls': 1,
                        'disablekb': 0,
                        'enablejsapi': 1,
                        'iv_load_policy': 3,
                        'playsinline': 1
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        });
    };

    function onPlayerReady(event) {
        console.log('YouTube player ready');
    }

    function onPlayerStateChange(event) {
        const playerElement = event.target.getIframe().closest('.reel-player');

        if (event.data === YT.PlayerState.PLAYING) {
            // Video started playing - pause scrolling
            document.dispatchEvent(new CustomEvent('videoPlay'));
        } else if (event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED) {
            // Video paused or ended - resume scrolling
            document.dispatchEvent(new CustomEvent('videoStop'));

            if (event.data === YT.PlayerState.ENDED) {
                stopVideo(playerElement);
            }
        }
    }

    function playVideo(playerElement) {
        const videoId = playerElement.dataset.videoId;
        const player = players[videoId];

        if (currentPlayer && currentPlayer !== playerElement) {
            stopVideo(currentPlayer);
        }

        playerElement.classList.add('playing');
        player.playVideo();
        currentPlayer = playerElement;

        // Add close button if not exists
        if (!playerElement.querySelector('.video-close')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'video-close';
            closeBtn.innerHTML = '×';
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                stopVideo(playerElement);
            });
            playerElement.appendChild(closeBtn);
        }
    }

    function stopVideo(playerElement) {
        const videoId = playerElement.dataset.videoId;
        const player = players[videoId];

        if (player && player.stopVideo) {
            playerElement.classList.remove('playing');
            player.stopVideo();
            currentPlayer = null;
            document.dispatchEvent(new CustomEvent('videoStop'));
        }
    }

    reelPlayers.forEach((playerElement) => {
        playerElement.addEventListener('click', (e) => {
            if (e.target.closest('.video-close') || e.target.tagName === 'IFRAME') {
                return;
            }

            if (playerElement.classList.contains('playing')) {
                stopVideo(playerElement);
            } else {
                playVideo(playerElement);
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && entry.target.classList.contains('playing')) {
                stopVideo(entry.target);
            }
        });
    }, { threshold: 0.3 });

    reelPlayers.forEach(player => {
        observer.observe(player);
    });
}

// ===== REEL SHOWCASE WITH MOBILE SUPPORT =====
function initReelShowcase() {
    const track = document.querySelector('.showcase-track');
    if (!track) {
        console.log('No showcase track found');
        return;
    }

    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const reelCards = document.querySelectorAll('.reel-card');

    if (reelCards.length === 0) {
        console.log('No reel cards found');
        return;
    }

    const originalCards = Array.from(reelCards);

    // Remove any existing clones
    document.querySelectorAll('.reel-card.clone').forEach(clone => clone.remove());

    // Create seamless loop by duplicating all cards
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    const allCards = document.querySelectorAll('.reel-card');

    // Mobile-specific adjustments
    const isMobile = window.innerWidth <= 768;
    const cardWidth = isMobile ? 200 + 15 : 280 + 25; // Smaller gap on mobile
    const scrollSpeed = isMobile ? 0.4 : 0.5; // Slightly faster on mobile

    let currentPosition = 0;
    let animationId;
    let isPaused = false;
    let isVideoPlaying = false;

    // Initialize embedded videos
    initEmbeddedReels();

    function startAutoScroll() {
        function animate() {
            if (!isPaused && !isVideoPlaying) {
                currentPosition -= scrollSpeed;

                // Reset position when we've scrolled exactly one set of cards
                if (currentPosition <= -originalCards.length * cardWidth) {
                    currentPosition = 0;
                }

                updateSlider();
            }
            animationId = requestAnimationFrame(animate);
        }
        animate();
    }

    function updateSlider() {
        track.style.transform = `translateX(${currentPosition}px)`;
    }

    // Pause auto-scroll when video is playing
    function pauseForVideo() {
        isVideoPlaying = true;
        console.log('Video playing - pausing scroll');
    }

    function resumeAfterVideo() {
        isVideoPlaying = false;
        console.log('Video stopped - resuming scroll');
    }

    // Listen for video play events
    document.addEventListener('videoPlay', pauseForVideo);
    document.addEventListener('videoStop', resumeAfterVideo);

    // Pause auto-scroll on hover (desktop) and touch (mobile)
    track.addEventListener('mouseenter', () => {
        if (!isVideoPlaying) {
            isPaused = true;
        }
        track.style.cursor = 'grab';
    });

    track.addEventListener('mouseleave', () => {
        if (!isVideoPlaying) {
            isPaused = false;
        }
    });

    // Manual navigation
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!isVideoPlaying) {
                currentPosition -= cardWidth;
                updateSlider();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!isVideoPlaying) {
                currentPosition += cardWidth;
                updateSlider();
            }
        });
    }

    // Enhanced drag functionality for mobile and desktop
    let isDragging = false;
    let startPosition = 0;
    let dragStartTranslate = 0;

    function dragStart(e) {
        if (isVideoPlaying) return;

        isPaused = true;
        isDragging = true;

        if (e.type === 'touchstart') {
            startPosition = e.touches[0].clientX;
            e.preventDefault(); // Prevent scroll when dragging on mobile
        } else {
            startPosition = e.clientX;
        }

        dragStartTranslate = currentPosition;
        track.style.cursor = 'grabbing';
        track.style.transition = 'none';
    }

    function drag(e) {
        if (!isDragging || isVideoPlaying) return;

        let currentPos;
        if (e.type === 'touchmove') {
            currentPos = e.touches[0].clientX;
        } else {
            currentPos = e.clientX;
        }

        const diff = currentPos - startPosition;
        currentPosition = dragStartTranslate + diff;

        updateSlider();
    }

    function dragEnd() {
        if (!isDragging) return;

        isDragging = false;
        if (!isVideoPlaying) {
            isPaused = false;
        }
        track.style.cursor = 'grab';
        track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    // Event listeners for both mouse and touch
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart, { passive: false });

    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);

    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag, { passive: false });

    // Start the infinite animation
    console.log('Starting reel showcase animation');
    startAutoScroll();

    // Clean up
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
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

// ===== MOBILE-SPECIFIC HANDLERS =====

// Handle orientation changes
window.addEventListener('orientationchange', function () {
    // Refresh layout on orientation change
    setTimeout(() => {
        window.scrollTo(0, 0);
        // Re-initialize components that need recalculating
        if (window.initReelShowcase) {
            initReelShowcase();
        }
    }, 100);
});

// Handle resize events with debouncing
let resizeTimeout;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize components that need recalculating on resize
        if (window.initReelShowcase) {
            initReelShowcase();
        }
    }, 250);
});

// Handle page visibility changes (pause videos when tab is not active)
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Pause all playing videos when tab becomes inactive
        const playingVideos = document.querySelectorAll('.reel-player.playing');
        playingVideos.forEach(video => {
            const videoId = video.dataset.videoId;
            if (window.YT && window.YT.get(videoId)) {
                window.YT.get(videoId).pauseVideo();
            }
        });
    }
});

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded - initializing all scripts');

    // Initialize all components
    initHeroAnimations();
    initPortfolioNavigation();
    initReelShowcase();
    initSmoothScrolling();

    console.log('All scripts initialized successfully');
});

// Make functions globally available for resize/orientation events
window.initReelShowcase = initReelShowcase;
// Add this to your script.js file for enhanced mobile portfolio
// ===== FIXED PORTFOLIO MOBILE ENHANCEMENTS =====
function initPortfolioMobileEnhancements() {
    const portfolioCategories = document.querySelectorAll('.portfolio-category');

    portfolioCategories.forEach(category => {
        // Add touch feedback to the card (not the button)
        category.addEventListener('touchstart', function (e) {
            // Don't add feedback if touching the button
            if (!e.target.closest('.view-button')) {
                this.style.transform = 'scale(0.98)';
            }
        });

        category.addEventListener('touchend', function (e) {
            // Reset transform
            if (!e.target.closest('.view-button')) {
                this.style.transform = 'scale(1)';
            }
        });

        // REMOVED the click handler that was blocking button clicks
        // The view-button links now work naturally
    });

    // Optional: Add analytics tracking when buttons are clicked
    const viewButtons = document.querySelectorAll('.view-button');
    viewButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const categoryName = this.closest('.portfolio-category').dataset.category;
            console.log(`Opening ${categoryName} portfolio`);
            // Add your analytics tracking here if needed
            // gtag('event', 'view_category', { category: categoryName });
        });
    });
}

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    initPortfolioMobileEnhancements();
});

// Call this in your DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function () {
    initPortfolioMobileEnhancements();
});
// ===== FIX LIGHT MODE STRONG TAGS =====
function fixLightModeText() {
    if (document.body.classList.contains('light-mode')) {
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

// Call this when theme changes
darkModeToggle.addEventListener('change', function () {
    setTimeout(fixLightModeText, 100);
});

// Call on page load
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(fixLightModeText, 500);
});
// Animated Statistics Counter
class AnimatedStats {
    constructor() {
        this.stats = [
            { element: '.stat-item:nth-child(1) .stat-number', target: 5, duration: 2000, isYears: true },
            { element: '.stat-item:nth-child(2) .stat-number', target: 200, duration: 2500, isYears: false },
            { element: '.stat-item:nth-child(3) .stat-number', target: 399, duration: 3000, isYears: false }
        ];
        
        this.initialized = false;
        this.init();
    }

    init() {
        // Check if stats section exists
        if (!document.querySelector('.story-stats')) return;

        // Initialize Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.initialized) {
                    this.initialized = true;
                    this.startCounters();
                    this.startRandomUpdates();
                }
            });
        });

        observer.observe(document.querySelector('.story-stats'));
    }

    startCounters() {
        this.stats.forEach(stat => {
            const element = document.querySelector(stat.element);
            if (!element) return;

            const start = 0;
            const increment = stat.target / (stat.duration / 16); // 60fps
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                if (current >= stat.target) {
                    current = stat.target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + (stat.isYears ? '+' : '+');
            }, 16);
        });
    }

    startRandomUpdates() {
        setInterval(() => {
            // Update projects count (2nd stat)
            this.updateRandomStat(1, 1, 3); // Add 1-3 projects randomly
            
            // Update clients count (3rd stat)
            this.updateRandomStat(2, 1, 5); // Add 1-5 clients randomly
        }, 30000); // Update every 30 seconds
    }

    updateRandomStat(statIndex, minIncrement, maxIncrement) {
        const stat = this.stats[statIndex];
        const element = document.querySelector(stat.element);
        if (!element || stat.isYears) return;

        const currentValue = parseInt(element.textContent);
        const increment = Math.floor(Math.random() * (maxIncrement - minIncrement + 1)) + minIncrement;
        const newValue = currentValue + increment;

        // Animate the update
        this.animateValueChange(element, currentValue, newValue, 1000);
        
        // Update the target for future animations
        stat.target = newValue;
    }

    animateValueChange(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(start + (end - start) * easeOut);
            
            element.textContent = currentValue + '+';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AnimatedStats();
});