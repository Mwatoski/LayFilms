/* ===========================
   ENHANCED REELS PAGE
   In-Browser Video Playback
   =========================== */

// Video player functionality
class ReelsVideoPlayer {
    constructor() {
        this.currentVideo = null;
        this.modal = null;
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        // Remove any existing modal first to ensure a clean state
        const existingModal = document.getElementById('videoModal');
        if (existingModal) {
            existingModal.remove();
            console.log('Removed existing modal');
        }

        console.log('Creating new modal...');

        // Create enhanced video modal
        const modal = document.createElement('div');
        modal.id = 'videoModal';
        modal.className = 'video-modal-enhanced';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content-enhanced">
                <button class="modal-close-enhanced" aria-label="Close video">
                    <i class="fas fa-times"></i>
                </button>
                <div class="video-player-container">
                    <div class="video-wrapper" id="videoWrapper"></div>
                    <div class="video-info">
                        <h3 class="video-title" id="videoTitle"></h3>
                        <p class="video-category" id="videoCategory"></p>
                    </div>
                </div>
            </div>
        `;

        // Add to DOM first
        document.body.appendChild(modal);
        this.modal = modal;

        // Cache references to child elements
        this.videoWrapper = modal.querySelector('#videoWrapper');
        this.videoTitle = modal.querySelector('#videoTitle');
        this.videoCategory = modal.querySelector('#videoCategory');

        console.log('Modal created and added to DOM', {
            modal: this.modal,
            wrapper: this.videoWrapper,
            title: this.videoTitle,
            category: this.videoCategory
        });

        // Add styles
        this.addStyles();
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .video-modal-enhanced {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .video-modal-enhanced.active {
                display: flex;
                opacity: 1;
            }
            
            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
            }
            
            .modal-content-enhanced {
                position: relative;
                width: 90%;
                max-width: 1200px;
                max-height: 90vh;
                background: #000;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
                z-index: 1;
                animation: modalSlideIn 0.4s ease-out;
            }
            
            @keyframes modalSlideIn {
                from {
                    transform: translateY(50px) scale(0.9);
                    opacity: 0;
                }
                to {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
            }
            
            .modal-close-enhanced {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 2;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-close-enhanced:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: rotate(90deg) scale(1.1);
            }
            
            .video-player-container {
                display: flex;
                flex-direction: column;
            }
            
            .video-wrapper {
                position: relative;
                width: 100%;
                padding-bottom: 56.25%; /* 16:9 aspect ratio */
                background: #000;
            }
            
            .video-wrapper iframe {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            
            .video-info {
                padding: 20px 30px;
                background: linear-gradient(to bottom, #0a0a0a, #000);
            }
            
            .video-title {
                font-size: 24px;
                font-weight: 600;
                color: white;
                margin: 0 0 8px 0;
            }
            
            .video-category {
                font-size: 14px;
                color: var(--primary-400);
                margin: 0;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            @media (max-width: 768px) {
                .modal-content-enhanced {
                    width: 95%;
                    max-height: 95vh;
                }
                
                .video-info {
                    padding: 15px 20px;
                }
                
                .video-title {
                    font-size: 18px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEventListeners() {
        // Click on reel items (but not on YouTube links)
        document.querySelectorAll('.reel-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Don't trigger modal if clicking on YouTube link
                if (e.target.closest('.youtube-link')) {
                    return;
                }

                e.preventDefault();
                const videoId = item.dataset.videoId;
                const title = item.querySelector('.reel-name')?.textContent || 'Video';
                const category = item.querySelector('.reel-category')?.textContent || '';

                this.playVideo(videoId, title, category);
            });
        });

        // Close modal
        const closeBtn = this.modal.querySelector('.modal-close-enhanced');
        const backdrop = this.modal.querySelector('.modal-backdrop');

        closeBtn?.addEventListener('click', () => this.closeVideo());
        backdrop?.addEventListener('click', () => this.closeVideo());

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeVideo();
            }
        });
    }

    playVideo(videoId, title, category) {
        console.log('Playing video:', videoId, title, category);

        if (!this.videoWrapper) {
            console.error('Video wrapper not found! Modal might not be initialized.');
            return;
        }

        // Create YouTube iframe
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        console.log('Created iframe with src:', iframe.src);

        // Clear and add new iframe
        this.videoWrapper.innerHTML = '';
        this.videoWrapper.appendChild(iframe);

        // Set video info
        if (this.videoTitle) this.videoTitle.textContent = title;
        if (this.videoCategory) this.videoCategory.textContent = category;

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        this.currentVideo = videoId;

        console.log('Modal should be visible now');
    }

    closeVideo() {
        // Remove iframe to stop video
        if (this.videoWrapper) {
            this.videoWrapper.innerHTML = '';
        }

        // Hide modal
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        this.currentVideo = null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing ReelsVideoPlayer...');
        const player = new ReelsVideoPlayer();
        console.log('ReelsVideoPlayer initialized:', player);
    });
} else {
    console.log('DOM already loaded, initializing ReelsVideoPlayer immediately...');
    const player = new ReelsVideoPlayer();
    console.log('ReelsVideoPlayer initialized:', player);
}

// Export for external use
window.ReelsVideoPlayer = ReelsVideoPlayer;
