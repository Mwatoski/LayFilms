// ===========================
// REELS PAGE - Hover-to-Play JavaScript (Large Screens) + Auto-play (Mobile)
// ===========================

(function() {
    'use strict';
    
    // State management
    const videoPlayers = new Map();
    let observer = null;
    let isLargeScreen = window.innerWidth > 1024;
    
    // DOM elements
    const reelItems = document.querySelectorAll('.reel-item');
    
    // ===========================
    // Detect Screen Size
    // ===========================
    
    function checkScreenSize() {
        isLargeScreen = window.innerWidth > 1024;
    }
    
    // ===========================
    // Initialize Video Players
    // ===========================
    
    function initializeReels() {
        reelItems.forEach((item, index) => {
            const videoId = item.dataset.videoId;
            const thumb = item.querySelector('.reel-thumb');
            
            // Create video container
            const videoWrapper = document.createElement('div');
            videoWrapper.className = 'video-player-wrapper';
            videoWrapper.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            `;
            
            const videoFrame = document.createElement('iframe');
            videoFrame.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=1&autoplay=0&controls=1&modestbranding=1&rel=0&playsinline=1`;
            videoFrame.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
            `;
            videoFrame.allow = 'autoplay; encrypted-media';
            videoFrame.allowFullscreen = true;
            
            videoWrapper.appendChild(videoFrame);
            thumb.appendChild(videoWrapper);
            
            // Store player reference
            videoPlayers.set(item, {
                wrapper: videoWrapper,
                iframe: videoFrame,
                isPlaying: false,
                videoId: videoId
            });
        });
    }
    
    // ===========================
    // Play/Pause Video
    // ===========================
    
    function playVideo(item) {
        const player = videoPlayers.get(item);
        if (!player || player.isPlaying) return;
        
        const playOverlay = item.querySelector('.play-overlay');
        const thumb = item.querySelector('.reel-thumb img');
        
        // Show video player
        player.wrapper.style.opacity = '1';
        player.wrapper.style.pointerEvents = 'all';
        
        // Hide thumbnail and play button
        if (playOverlay) playOverlay.style.opacity = '0';
        if (thumb) thumb.style.opacity = '0';
        
        // Send play command to iframe
        player.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: []
        }), '*');
        
        player.isPlaying = true;
    }
    
    function pauseVideo(item) {
        const player = videoPlayers.get(item);
        if (!player || !player.isPlaying) return;
        
        const playOverlay = item.querySelector('.play-overlay');
        const thumb = item.querySelector('.reel-thumb img');
        
        // Hide video player
        player.wrapper.style.opacity = '0';
        player.wrapper.style.pointerEvents = 'none';
        
        // Show thumbnail and play button
        if (playOverlay) playOverlay.style.opacity = '';
        if (thumb) thumb.style.opacity = '1';
        
        // Send pause command to iframe
        player.iframe.contentWindow.postMessage(JSON.stringify({
            event: 'command',
            func: 'pauseVideo',
            args: []
        }), '*');
        
        player.isPlaying = false;
    }
    
    // ===========================
    // Hover Handlers for Large Screens
    // ===========================
    
    function setupHoverHandlers() {
        reelItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                if (isLargeScreen) {
                    // Only play on hover for large screens
                    playVideo(item);
                }
            });
            
            item.addEventListener('mouseleave', function() {
                if (isLargeScreen) {
                    // Pause when mouse leaves on large screens
                    pauseVideo(item);
                }
            });
        });
    }
    
    // ===========================
    // Intersection Observer for Mobile Auto-play
    // ===========================
    
    function setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6 // 60% of video must be visible
        };
        
        observer = new IntersectionObserver((entries) => {
            // Only use intersection observer for mobile/tablet
            if (isLargeScreen) return;
            
            entries.forEach(entry => {
                const item = entry.target;
                
                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    // Video is in focus - play it (mobile only)
                    playVideo(item);
                } else {
                    // Video is out of focus - pause it
                    pauseVideo(item);
                }
            });
        }, options);
        
        // Observe all reel items
        reelItems.forEach(item => {
            observer.observe(item);
        });
    }
    
    // ===========================
    // Manual Click to Play (Mobile)
    // ===========================
    
    function setupClickHandlers() {
        reelItems.forEach(item => {
            item.addEventListener('click', function(e) {
                // Don't trigger if clicking on iframe controls
                if (e.target.tagName === 'IFRAME') return;
                
                // Only allow manual click on mobile/tablet
                if (isLargeScreen) return;
                
                const player = videoPlayers.get(item);
                if (!player) return;
                
                if (player.isPlaying) {
                    pauseVideo(item);
                } else {
                    // Pause all other videos
                    reelItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            pauseVideo(otherItem);
                        }
                    });
                    
                    playVideo(item);
                    
                    // Scroll video into view smoothly
                    item.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            });
        });
    }
    
    // ===========================
    // Pause on Page Visibility Change
    // ===========================
    
    function setupVisibilityHandler() {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                // Page is hidden - pause all videos
                reelItems.forEach(item => {
                    pauseVideo(item);
                });
            }
        });
    }
    
    // ===========================
    // Handle Window Resize
    // ===========================
    
    function setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            
            resizeTimeout = setTimeout(function() {
                const wasLargeScreen = isLargeScreen;
                checkScreenSize();
                
                // If screen size category changed, pause all videos
                if (wasLargeScreen !== isLargeScreen) {
                    reelItems.forEach(item => {
                        pauseVideo(item);
                    });
                }
            }, 250);
        });
    }
    
    // ===========================
    // Navigation Functions
    // ===========================
    
    function initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Hamburger menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
            });
            
            // Close menu when clicking nav links
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Theme toggle
        const themeToggle = document.getElementById('dark-mode-toggle');
        if (themeToggle) {
            // Check for saved theme preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                themeToggle.checked = true;
            }
            
            themeToggle.addEventListener('change', function() {
                document.body.classList.toggle('light-mode');
                localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
            });
        }
    }
    
    // ===========================
    // Smooth Scroll
    // ===========================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ===========================
    // Initialize Everything
    // ===========================
    
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('Initializing Reels Page...');
        
        // Check initial screen size
        checkScreenSize();
        
        // Initialize components
        initializeReels();
        setupHoverHandlers(); // Hover for large screens
        setupIntersectionObserver(); // Auto-play for mobile
        setupClickHandlers(); // Manual click for mobile
        setupVisibilityHandler();
        setupResizeHandler();
        initNavigation();
        initSmoothScroll();
        
        console.log(`Reels Page Initialized Successfully! (${isLargeScreen ? 'Large Screen - Hover Mode' : 'Mobile - Auto-play Mode'})`);
    }
    
    // ===========================
    // Cleanup on Page Unload
    // ===========================
    
    window.addEventListener('beforeunload', function() {
        // Pause all videos
        reelItems.forEach(item => {
            pauseVideo(item);
        });
        
        // Disconnect observer
        if (observer) {
            observer.disconnect();
        }
    });
    
    // Start initialization
    init();
    
})();
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