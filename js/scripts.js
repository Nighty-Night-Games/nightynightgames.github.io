// Detect device capabilities
const DEVICE = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isSmallScreen: window.matchMedia('(max-width: 768px)').matches,
    lowPower: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasGPU: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
        !window.matchMedia('(min-resolution: 2dppx)').matches),
    supportsTouch: 'ontouchstart' in window
};

// Configure ember system based on device capability
const EMBER_CONFIG = {
    MAX_EMBERS: DEVICE.lowPower ? 60 : (DEVICE.isSmallScreen ? 100 : 200),
    HOME_MAX_EMBERS: DEVICE.lowPower ? 40 : (DEVICE.isSmallScreen ? 80 : 150),
    ABOUT_MAX_EMBERS: DEVICE.lowPower ? 25 : (DEVICE.isSmallScreen ? 60 : 100),
    SPAWN_RATE: DEVICE.lowPower ? 500 : (DEVICE.isSmallScreen ? 300 : 200),
    CLEANUP_INTERVAL: 8000,
    USE_GPU: DEVICE.hasGPU,
    SIZE_BASE: DEVICE.isSmallScreen ? 2 : 3,
    SIZE_VARIANCE: DEVICE.isSmallScreen ? 8 : 15
};

// Global state
let hasLoaded = false;
const finalProgress = 5;
let currentPage = 'home';
let emberSpawnInterval = null;
let activeEmbers = [];
let isMenuOpen = false;

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page components
    setupMobileMenu();
    setupPageNavigation();

    // Set up loading bar
    window.addEventListener('load', initLoadingBar);

    // Initialize embers after first paint
    if (document.readyState === 'complete') {
        requestAnimationFrame(() => initEmberSystem());
    } else {
        window.addEventListener('load', () => {
            requestAnimationFrame(() => initEmberSystem());
        });
    }

    // Set up responsive handlers
    window.addEventListener('resize', debounce(handleResize, 150));
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Initialize ember system
function initEmberSystem() {
    // Create persistent ember container
    createEmberContainer();

    // Find title element
    const titleElement = document.querySelector('.title-visible');
    if (!titleElement) return;

    // Cache title position
    window.currentTitleRect = titleElement.getBoundingClientRect();

    // Detect current page
    currentPage = titleElement.textContent.trim().toLowerCase().includes('about') ? 'about' : 'home';

    // Start ember spawning
    startEmberSpawning(currentPage);

    // Set up periodic cleanup
    setInterval(cleanupInvisibleEmbers, EMBER_CONFIG.CLEANUP_INTERVAL);
}

// Create the ember container
function createEmberContainer() {
    if (!document.getElementById('persistent-ember-container')) {
        const container = document.createElement('div');
        container.id = 'persistent-ember-container';
        container.setAttribute('aria-hidden', 'true');

        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: '10',
            overflow: 'visible'
        });

        document.body.appendChild(container);
        window.emberContainer = container;
    } else {
        window.emberContainer = document.getElementById('persistent-ember-container');
    }
}

// Start spawning embers for the current page
function startEmberSpawning(page) {
    // Clear any existing spawn interval
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = null;
    }

    // Configure based on page
    const maxEmbers = page === 'about' ? EMBER_CONFIG.ABOUT_MAX_EMBERS : EMBER_CONFIG.HOME_MAX_EMBERS;

    // Start new spawn interval
    emberSpawnInterval = setInterval(() => {
        // Don't spawn if document is hidden or menu is open on low power devices
        if (document.hidden || (isMenuOpen && DEVICE.lowPower)) return;

        const pageEmbers = countEmbersByPage(page);

        // Only spawn if under limits
        if (pageEmbers < maxEmbers && activeEmbers.length < EMBER_CONFIG.MAX_EMBERS) {
            spawnEmber(page);
        }
    }, EMBER_CONFIG.SPAWN_RATE);
}

// Spawn a new ember
function spawnEmber(page) {
    const container = window.emberContainer;
    const titleRect = window.currentTitleRect;

    if (!container || !titleRect) return;

    // Create ember element
    const ember = document.createElement('div');
    ember.classList.add('ember');
    ember.setAttribute('role', 'presentation');
    ember.setAttribute('data-page', page);
    ember.setAttribute('data-created', Date.now().toString());

    // Generate random properties
    const left = titleRect.left + Math.random() * titleRect.width;
    const top = titleRect.top + Math.random() * titleRect.height * 0.2;
    const size = EMBER_CONFIG.SIZE_BASE + Math.random() * EMBER_CONFIG.SIZE_VARIANCE;
    const duration = 10000 + Math.random() * 8000;
    const amplitude = 15 + Math.random() * 10;
    const direction = Math.random() < 0.5 ? -1 : 1;
    const flickerSpeed = (0.6 + Math.random()).toFixed(2);
    const flickerDelay = (Math.random() * 3).toFixed(2);
    const riseHeight = 100 + Math.random() * 200;

    // Store animation data
    ember.emberData = {
        startTime: performance.now(),
        duration: duration,
        amplitude: amplitude,
        direction: direction,
        riseHeight: riseHeight
    };

    // Apply styles
    Object.assign(ember.style, {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle, #ffda96 0%, transparent 30%)',
        borderRadius: '50%',
        opacity: '0',
        transform: EMBER_CONFIG.USE_GPU ? 'translate3d(0,0,0)' : 'translate(0,0)',
        filter: 'drop-shadow(0 0 8px #ffd170) brightness(1.6)'
    });

    // Add animation only if not low power
    if (!DEVICE.lowPower) {
        ember.style.animation = `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`;
    }

    // Add to container and tracking array
    container.appendChild(ember);
    activeEmbers.push(ember);

    // Start animation loop for this ember
    requestAnimationFrame(function animate(timestamp) {
        if (!ember.isConnected) return;

        const data = ember.emberData;
        const elapsed = timestamp - data.startTime;
        const t = elapsed / data.duration;

        if (t > 1) {
            // Remove when animation complete
            const index = activeEmbers.indexOf(ember);
            if (index !== -1) activeEmbers.splice(index, 1);
            if (ember.isConnected) ember.remove();
            return;
        }

        // Calculate animation values
        const progress = t ** 1.5;
        const yOffset = -progress * data.riseHeight + Math.sin(t * 4 * Math.PI) * data.amplitude;
        const xOffset = data.direction * Math.sin(t * Math.PI) * 120;
        const opacity = (t < 0.33 ? t * 3 : 1) * (1 - t ** 0.7);

        // Apply values
        ember.style.opacity = opacity.toFixed(2);
        ember.style.transform = EMBER_CONFIG.USE_GPU
            ? `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${1 - t * 0.5})`
            : `translate(${xOffset}px, ${yOffset}px) scale(${1 - t * 0.5})`;

        // Continue animation
        requestAnimationFrame(animate);
    });

    return ember;
}

// Handle page transition
function handlePageTransition(newPage) {
    if (newPage === currentPage) return;

    // Stop current ember spawning
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = null;
    }

    // Mark existing embers as transitioning
    activeEmbers.forEach(ember => {
        if (ember.getAttribute('data-page') === currentPage) {
            ember.setAttribute('data-transitioning', 'true');

            // Calculate remaining lifetime
            const creationTime = parseInt(ember.getAttribute('data-created')) || Date.now() - 5000;
            const elapsedTime = Date.now() - creationTime;
            const duration = Math.max(3000, 8000 - elapsedTime);

            // Get current position for smooth transition
            const currentTransform = ember.style.transform || '';

            // Apply transition for both opacity and transform
            ember.style.transition = `
            opacity ${duration}ms ease-out,
            transform ${Math.min(50, duration / 600)}ms ease-out
        `;

            // Apply fade out
            ember.style.opacity = '0';

            // Apply float-up effect
            // For embers with existing transforms, we need to layer our float effect on top
            if (currentTransform) {
                // Modify only the Y component and scale
                ember.style.transform = currentTransform + ' translateY(-40px) scale(0.6)';
            } else {
                // Simple transform for embers without existing transforms
                ember.style.transform = 'translateY(-40px) scale(0.6)';
            }
        }
    });

    // Update current page
    currentPage = newPage;

    // Update title position for ember spawning
    setTimeout(() => {
        const titleElement = document.querySelector('.title-visible');
        if (titleElement) {
            window.currentTitleRect = titleElement.getBoundingClientRect();

            // Start new ember spawning
            startEmberSpawning(newPage);
        }
    }, 100);
}

// Count embers by page
function countEmbersByPage(page) {
    let count = 0;
    for (let i = 0; i < activeEmbers.length; i++) {
        if (activeEmbers[i].getAttribute('data-page') === page) {
            count++;
        }
    }
    return count;
}

// Clean up invisible or offscreen embers
function cleanupInvisibleEmbers() {
    let i = activeEmbers.length;
    while (i--) {
        const ember = activeEmbers[i];
        if (!ember.isConnected || parseFloat(ember.style.opacity || '0') < 0.1) {
            if (ember.isConnected) ember.remove();
            activeEmbers.splice(i, 1);
        }
    }
}

// Handle window resize
function handleResize() {
    // Update screen size detection
    DEVICE.isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    // Update title position for ember spawning
    const titleElement = document.querySelector('.title-visible');
    if (titleElement) {
        window.currentTitleRect = titleElement.getBoundingClientRect();
    }

    // Close mobile menu if we're resizing to desktop
    if (window.innerWidth >= 1024 && isMenuOpen) {
        toggleMobileMenu(false);
    }
}

// Handle visibility change
function handleVisibilityChange() {
    if (document.hidden) {
        // Pause extensive operations when tab is inactive
        if (emberSpawnInterval) {
            clearInterval(emberSpawnInterval);
            emberSpawnInterval = null;
        }
    } else {
        // Resume operations when tab becomes active
        if (!emberSpawnInterval && window.currentTitleRect) {
            startEmberSpawning(currentPage);
        }
    }
}

// Initialize loading bar
function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    if (!hasLoaded && loadingBar && loadingText) {
        let progress = 0;
        const loadingDuration = DEVICE.lowPower ? 600 : 1000;
        const stepTime = Math.floor(loadingDuration / finalProgress);

        const interval = setInterval(() => {
            progress++;
            loadingText.textContent = `${progress}%`;
            loadingBar.style.width = `${progress}%`;

            const container = loadingBar.parentElement;
            if (container) {
                container.setAttribute('aria-valuenow', progress);
            }

            if (progress >= finalProgress) {
                clearInterval(interval);
                hasLoaded = true;
                loadingBar.classList.add('loaded');
            }
        }, stepTime);
    } else if (loadingBar && loadingText) {
        // If already loaded, restore visual state
        loadingText.textContent = `${finalProgress}%`;
        loadingBar.style.width = `${finalProgress}%`;

        const container = loadingBar.parentElement;
        if (container) {
            container.setAttribute('aria-valuenow', finalProgress);
        }
    }
}

// Set up the mobile menu functionality
function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!toggle || !mobileMenu) return;

    // Set up toggle button
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Set up close on outside click
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    // Set up escape key handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu(false);
        }
    });

    // Close menu when links are clicked
    const menuLinks = document.querySelectorAll('.header-left a, .header-right a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                toggleMobileMenu(false);
            }
        });
    });

    // Touch device handling
    if (DEVICE.supportsTouch) {
        mobileMenu.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.stopPropagation();
            }
        }, { passive: false });
    }
}

// Toggle mobile menu state
function toggleMobileMenu(force = null) {
    isMenuOpen = force !== null ? force : !isMenuOpen;

    const mobileMenu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.menu-toggle');

    if (!mobileMenu || !toggle) return;

    // Toggle menu classes
    mobileMenu.classList.toggle('active', isMenuOpen);
    mobileMenu.setAttribute('aria-hidden', !isMenuOpen);

    // Update ARIA attributes
    toggle.setAttribute('aria-expanded', isMenuOpen);

    // Toggle hamburger active state
    toggle.classList.toggle('active', isMenuOpen);

    // Toggle body scroll
    document.body.classList.toggle('menu-open', isMenuOpen);
}

// Set up page navigation
function setupPageNavigation() {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    const originalContent = pageContent.innerHTML;

    const aboutNavLinks = [
        document.getElementById('about-link'),
        document.getElementById('about-link-mobile')
    ].filter(Boolean);

    const aboutContent = `
<div class="title-wrap about-title">
    <h1>
      <span class="title-ember-target">Nighty Night Games</span>
      <span class="title-visible">About NNG</span>
    </h1>
  </div>
  <div class="underline"></div>

  <section class="about-section">
    <p><strong>Nighty Night Games</strong> is a (currently) one-person indie studio from Berlin, Germany on a mission to craft unforgettable worlds, rich in story, emotion, and grit.</p>

    <p>Founded from a deep love of games that stay with you long after the credits roll, Nighty Night Games focuses on immersive storytelling, cinematic atmosphere, and meaningful choices that shape your journey.</p>

    <hr class="divider" />

    <h2>Currently in Development</h2>
    <h3>Legacy of Atum: Dead Dynasty</h3>

    <p><strong>Legacy of Atum</strong> is an atmospheric RPG set in a myth-infused version of ancient Egypt. It blends narrative depth, moral complexity, and strategic survival.</p>

    <p>You'll step into the shoes of <strong>Nui</strong>, a former slave turned reluctant hero, as he navigates a fractured world of forgotten gods, political intrigue, and personal vengeance. With real-time combat, deep strategic systems, and dynamic social interactions, the world of Atum responds to your choices—and remembers your actions.</p>

    <p>Nighty Night Games is currently deep in development, working toward a playable prototype and a cinematic trailer to bring the vision to life.</p>

    <hr class="divider" />

    <h2>Follow the Journey</h2>
    <p>Development updates, behind-the-scenes peeks, and dev logs are shared regularly on social media. Whether you're a player, fellow dev, or just curious, you're welcome to follow along.</p>

    <blockquote class="studio-tagline">Nighty Night Games — Sleep well, dream deep, play meaningfully.</blockquote>
  </section>
`;

    // Function to switch between pages
    function switchPage(toAbout) {
        // Create fade effect
        const fadeOut = pageContent.animate(
            [{ opacity: 1 }, { opacity: 0 }],
            { duration: 300, easing: 'ease-out', fill: 'forwards' }
        );

        fadeOut.onfinish = () => {
            // Update page content
            pageContent.innerHTML = toAbout ? aboutContent : originalContent;

            // Handle ember transition
            handlePageTransition(toAbout ? 'about' : 'home');

            // Update navigation links
            aboutNavLinks.forEach(l => {
                if (l) {
                    l.textContent = toAbout ? 'Home' : 'About';
                    l.classList.toggle('active', toAbout);
                }
            });

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Accessibility focus management
            setTimeout(() => {
                const heading = document.querySelector('.title-visible');
                if (heading) {
                    heading.setAttribute('tabindex', '-1');
                    heading.focus();
                    // Remove tabindex after focus
                    setTimeout(() => heading.removeAttribute('tabindex'), 1000);
                }
            }, 100);

            // Restore loading bar if applicable
            if (hasLoaded && !toAbout) {
                const loadingBar = document.querySelector('.loading-bar');
                const loadingText = document.querySelector('.loading-text');
                if (loadingBar && loadingText) {
                    loadingText.textContent = `${finalProgress}%`;
                    loadingBar.style.width = `${finalProgress}%`;
                    loadingBar.parentElement.setAttribute('aria-valuenow', finalProgress);
                }
            }

            // Fade in effect
            pageContent.animate(
                [{ opacity: 0 }, { opacity: 1 }],
                { duration: 300, easing: 'ease-in', fill: 'forwards' }
            );
        };
    }

    // Set up click handlers for about/home links
    const aboutLinks = document.querySelectorAll('a[href="#about"]');
    aboutLinks.forEach(link => {
        if (!link) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();

            const currentTitle = document.querySelector('.title-visible');
            const isCurrentlyAbout = currentTitle &&
                currentTitle.textContent.trim().toLowerCase().includes('about');

            // Switch to the other page
            switchPage(!isCurrentlyAbout);

            // Update URL without scrolling
            const newHash = !isCurrentlyAbout ? '#about' : '';
            if (history.pushState) {
                history.pushState(null, null, newHash || window.location.pathname);
            } else {
                window.location.hash = newHash;
            }
        });
    });

    // Check for hash in URL on page load
    if (window.location.hash === '#about') {
        setTimeout(() => switchPage(true), 100);
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}