/**
 * gallery.js — Shared Gallery Script
 * Lay Films Productions
 *
 * Handles:
 *  - Off-canvas navigation drawer
 *  - Media type filtering (ALL / IMAGES / VIDEOS / REELS)
 *  - Image lightbox with keyboard + touch/swipe support
 *  - Video modal with auto-play + cleanup
 *
 * Does NOT handle category switching — categories are navigated
 * via plain HTML links between individual category pages.
 *
 * Usage: include this script at the bottom of each category page.
 * Requires: Font Awesome for icons, elements with IDs defined below.
 */

(function () {
    'use strict';

    /* =====================================================================
       1. NAVBAR SCROLL BEHAVIOUR
       ===================================================================== */
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
        const checkScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll();
    }

    /* =====================================================================
       2. OFF-CANVAS NAVIGATION DRAWER
       ===================================================================== */
    const hamburger = document.getElementById('hamburger-btn');
    const backdrop  = document.getElementById('nav-backdrop');
    const drawer    = document.getElementById('nav-drawer');
    const closeBtn  = document.getElementById('drawer-close-btn');

    function openDrawer() {
        if (!hamburger || !drawer) return;
        drawer.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.addEventListener('click', function (e) { e.stopPropagation(); openDrawer(); });
    if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
    if (backdrop)  backdrop.addEventListener('click', closeDrawer);

    document.querySelectorAll('.drawer-nav-link, .drawer-cta-btn').forEach(function (el) {
        el.addEventListener('click', function () { setTimeout(closeDrawer, 150); });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) closeDrawer();
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) closeDrawer();
    });

    /* =====================================================================
       3. MEDIA TYPE FILTER
       ===================================================================== */
    var activeMedia = 'all';

    var grid       = document.getElementById('ca-grid');
    var emptyState = document.getElementById('ca-empty');
    var countEl    = document.getElementById('ca-results-count');
    var labelEl    = document.getElementById('ca-filter-label');
    var cards      = Array.from(document.querySelectorAll('.ca-grid .ca-card'));

    function applyMediaFilter() {
        var visible = 0;

        cards.forEach(function (card) {
            var type      = card.dataset.type || '';
            var typeMatch = activeMedia === 'all' || type === activeMedia;

            if (typeMatch) {
                card.classList.remove('hidden');
                visible++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Update count
        if (countEl) {
            countEl.textContent = visible + ' item' + (visible !== 1 ? 's' : '');
        }

        // Update label
        if (labelEl) {
            var mediaLabel = activeMedia === 'all'
                ? 'All media'
                : activeMedia.charAt(0).toUpperCase() + activeMedia.slice(1) + 's';
            labelEl.textContent = mediaLabel;
        }

        // Empty state
        if (emptyState) {
            if (visible === 0) {
                emptyState.classList.add('visible');
                if (grid) grid.style.display = 'none';
            } else {
                emptyState.classList.remove('visible');
                if (grid) grid.style.display = '';
            }
        }

        // Rebuild lightbox index after filter
        buildLightboxIndex();
    }

    // Media type buttons
    document.querySelectorAll('.ca-media-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.ca-media-btn').forEach(function (b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            activeMedia = btn.dataset.media;
            applyMediaFilter();
        });
    });

    /* =====================================================================
       4. LIGHTBOX (images only)
       ===================================================================== */
    var lightbox  = document.getElementById('ca-lightbox');
    var lbImg     = document.getElementById('ca-lb-img');
    var lbCaption = document.getElementById('ca-lb-caption');
    var lbClose   = document.getElementById('ca-lb-close');
    var lbPrev    = document.getElementById('ca-lb-prev');
    var lbNext    = document.getElementById('ca-lb-next');

    var lbItems   = [];
    var lbCurrent = 0;

    function buildLightboxIndex() {
        lbItems = cards.filter(function (c) {
            return !c.classList.contains('hidden') &&
                   !c.classList.contains('ca-card-is-video') &&
                   c.dataset.src;
        });
    }

    function openLightbox(card) {
        lbCurrent = lbItems.indexOf(card);
        if (lbCurrent === -1) return;
        showLbSlide(lbCurrent);
        if (lightbox) lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        document.body.style.overflow = '';
        if (lbImg) lbImg.src = '';
    }

    function showLbSlide(idx) {
        var item = lbItems[idx];
        if (!item) return;
        if (lbImg) {
            lbImg.src = item.dataset.src;
            lbImg.alt = item.dataset.caption || '';
        }
        if (lbCaption) lbCaption.textContent = item.dataset.caption || '';
    }

    if (lbClose)  lbClose.addEventListener('click', closeLightbox);
    if (lightbox) lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    if (lbPrev) lbPrev.addEventListener('click', function () {
        lbCurrent = (lbCurrent - 1 + lbItems.length) % lbItems.length;
        showLbSlide(lbCurrent);
    });

    if (lbNext) lbNext.addEventListener('click', function () {
        lbCurrent = (lbCurrent + 1) % lbItems.length;
        showLbSlide(lbCurrent);
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft')  { if (lbPrev) lbPrev.click(); }
        if (e.key === 'ArrowRight') { if (lbNext) lbNext.click(); }
        if (e.key === 'Escape')     { closeLightbox(); }
    });

    // Swipe support for lightbox
    var lbTouchX = null;
    if (lightbox) {
        lightbox.addEventListener('touchstart', function (e) {
            lbTouchX = e.changedTouches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', function (e) {
            if (lbTouchX === null) return;
            var dx = e.changedTouches[0].clientX - lbTouchX;
            if (Math.abs(dx) > 50) {
                if (dx < 0) { if (lbNext) lbNext.click(); }
                else        { if (lbPrev) lbPrev.click(); }
            }
            lbTouchX = null;
        });
    }

    /* =====================================================================
       5. YOUTUBE VIDEO MODAL
       Opens a YouTube embed in an iframe; destroys it on close so
       the video stops playing immediately.
       ===================================================================== */
    var videoModal   = document.getElementById('ca-video-modal');
    var ytContainer  = document.getElementById('ca-yt-container');
    var vmClose      = document.getElementById('ca-vm-close');

    /* =====================================================================
       5. INLINE YOUTUBE PLAYER (plays directly inside the card in browser)
       ===================================================================== */
    function resetInlinePlayer(card) {
        var playerWrap = card.querySelector('.ca-inline-player');
        if (playerWrap) {
            playerWrap.remove();
        }
        card.classList.remove('is-playing');
    }

    function playInlineYouTube(card, youtubeId) {
        if (!youtubeId || youtubeId === 'YOUTUBE_ID_2') return;

        // Optional: pause any other currently playing inline video card
        document.querySelectorAll('.ca-card.is-playing').forEach(function (activeCard) {
            if (activeCard !== card) resetInlinePlayer(activeCard);
        });

        // If already playing on this card, do nothing on card click
        if (card.classList.contains('is-playing')) return;

        var wrap = document.createElement('div');
        wrap.className = 'ca-inline-player';

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'ca-inline-close';
        closeBtn.setAttribute('aria-label', 'Stop and close video');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            resetInlinePlayer(card);
        });

        var iframe = document.createElement('iframe');
        var isReel = card.dataset.type === 'reel';
        iframe.setAttribute('src',
            'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(youtubeId) +
            '?autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1'
        );
        iframe.setAttribute('title', card.dataset.caption || (isReel ? 'YouTube Reel player' : 'YouTube video player'));
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow',
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        );
        iframe.setAttribute('allowfullscreen', '');

        wrap.appendChild(iframe);
        wrap.appendChild(closeBtn);
        card.appendChild(wrap);
        card.classList.add('is-playing');
    }

    // Stop inline videos when switching media filter tabs (ALL / IMAGES / VIDEOS / REELS)
    var mediaFilterBtns = document.querySelectorAll('.ca-media-btn');
    mediaFilterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.ca-card.is-playing').forEach(resetInlinePlayer);
        });
    });

    /* =====================================================================
       6. WIRE UP CARD CLICKS
       ===================================================================== */
    cards.forEach(function (card) {
        card.addEventListener('click', function () {
            if (card.classList.contains('ca-card-is-video')) {
                var youtubeId = card.dataset.youtubeId;
                if (youtubeId) {
                    playInlineYouTube(card, youtubeId);
                }
            } else if (card.dataset.src) {
                openLightbox(card);
            }
        });

        // Keyboard accessibility
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });
    /* =====================================================================
       7. INITIAL RENDER
       ===================================================================== */
    applyMediaFilter();

}());
