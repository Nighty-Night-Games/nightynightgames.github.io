// ===== EMBER SYSTEM - OPTIMIZED IMPLEMENTATION =====
let hasLoaded = false;
const finalProgress = 5;

// Device and browser capability detection
const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isLowPowerDevice = isMobileBrowser || !window.matchMedia('(min-resolution: 2dppx)').matches;
const useReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Organize constants by category
const EMBER_CONFIG = {
    GLOBAL: {
        MAX_EMBERS: isLowPowerDevice ? 80 : 200,
        CLEANUP_INTERVAL: 10000
    },
    HOME: {
        MAX_EMBERS: isLowPowerDevice ? 50 : 150,
        SPAWN_RATE: isLowPowerDevice ? 400 : 200
    },
    ABOUT: {
        MAX_EMBERS: isLowPowerDevice ? 30 : 100,
        SPAWN_RATE: isLowPowerDevice ? 600 : 350
    },
    ANIMATION: {
        TRANSITION_DURATION: 8000,
        BASE_DURATION: 12000,
        RANDOM_DURATION: 6000,
        BASE_AMPLITUDE: 15,
        RANDOM_AMPLITUDE: 10
    }
};

// Global state variables for ember system
let currentActivePage = 'home';
let emberSpawnInterval = null;
let activeEmbers = [];

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Initialize the ember system on page load
document.addEventListener('DOMContentLoaded', () => {
    // Create a persistent ember container that stays across page changes
    if (!document.getElementById('persistent-ember-container')) {
        const persistentEmberContainer = document.createElement('div');
        persistentEmberContainer.id = 'persistent-ember-container';
        persistentEmberContainer.setAttribute('aria-hidden', 'true');
        persistentEmberContainer.style.position = 'fixed';
        persistentEmberContainer.style.top = '0';
        persistentEmberContainer.style.left = '0';
        persistentEmberContainer.style.width = '100%';
        persistentEmberContainer.style.height = '100%';
        persistentEmberContainer.style.pointerEvents = 'none';
        persistentEmberContainer.style.zIndex = '10';
        persistentEmberContainer.style.overflow = 'visible';
        document.body.appendChild(persistentEmberContainer);

        // But delay the actual ember system initialization until after page load
        if (document.readyState === 'complete') {
            initEmberSystem();
        } else {
            window.addEventListener('load', () => {
                // Wait for first paint to complete
                requestAnimationFrame(() => {
                    // Then start ember system
                    initEmberSystem();
                });
            });
        }
    }

    // Set up periodic cleanup with requestIdleCallback if available
    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
            setInterval(cleanupInvisibleEmbers, EMBER_CONFIG.GLOBAL.CLEANUP_INTERVAL);
        });
    } else {
        setTimeout(() => {
            setInterval(cleanupInvisibleEmbers, EMBER_CONFIG.GLOBAL.CLEANUP_INTERVAL);
        }, 5000); // Delay cleanup start
    }
});

// Main function to initialize the ember system
function initEmberSystem() {
    // Cache DOM elements at the start
    const titleElement = document.querySelector('.title-visible');

    if (!titleElement) {
        console.warn('Title element not found for ember initialization');
        return;
    }

    // Store reference to persistent container
    window.emberContainer = document.getElementById('persistent-ember-container');

    // Detect current page
    currentActivePage = titleElement.textContent.trim().toLowerCase().includes('about') ? 'about' : 'home';

    // Start ember spawning for current page
    startEmberSpawning(currentActivePage);
}

// Function to start spawning embers for the current page
function startEmberSpawning(page) {
    // Clear any existing spawn interval
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = null;
    }

    // Configure based on page
    const config = {
        maxEmbers: page === 'about' ? EMBER_CONFIG.ABOUT.MAX_EMBERS : EMBER_CONFIG.HOME.MAX_EMBERS,
        spawnRate: page === 'about' ? EMBER_CONFIG.ABOUT.SPAWN_RATE : EMBER_CONFIG.HOME.SPAWN_RATE
    };

    // Start new spawn interval
    emberSpawnInterval = setInterval(() => {
        const pageEmberCount = countEmbersByPage(page);
        const totalEmberCount = activeEmbers.length;

        // Only spawn if under both page and global limits
        if (pageEmberCount < config.maxEmbers && totalEmberCount < EMBER_CONFIG.GLOBAL.MAX_EMBERS) {
            spawnEmber(page);
        }
    }, config.spawnRate);
}

// Function to handle page transitions
function handlePageTransition(newPage) {
    // Don't do anything if it's the same page
    if (newPage === currentActivePage) return;

    // Stop current ember spawning
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = null;
    }

    // Mark existing embers as transitioning
    activeEmbers.forEach(ember => {
        if (ember.getAttribute('data-page') === currentActivePage) {
            ember.setAttribute('data-transitioning', 'true');

            // Calculate remaining lifetime
            const remainingLifetime = calculateRemainingLifetime(ember);

            // Animate transitioning ember
            animateTransitioningEmber(ember, {
                duration: remainingLifetime
            });
        }
    });

    // Update current page
    currentActivePage = newPage;

    // Start new ember spawning
    startEmberSpawning(newPage);
}

// Function to calculate remaining lifetime of an ember
function calculateRemainingLifetime(ember) {
    const creationTime = parseInt(ember.getAttribute('data-created')) || Date.now() - 5000;
    const elapsedTime = Date.now() - creationTime;
    const originalDuration = parseInt(ember.getAttribute('data-duration')) || 15000;

    // At least 3 seconds for a nice transition
    return Math.max(3000, Math.min(EMBER_CONFIG.ANIMATION.TRANSITION_DURATION, originalDuration - elapsedTime));
}

// Function to animate a transitioning ember
function animateTransitioningEmber(ember, config) {
    try {
        // Apply transition-specific styles
        ember.style.filter = 'drop-shadow(0 0 8px #ffd170) brightness(1.4)';

        // Get current opacity
        const currentOpacity = parseFloat(getComputedStyle(ember).opacity) || 0.7;

        // Apply a gentle fade out
        const fadeOut = ember.animate(
            [
                { opacity: currentOpacity },
                { opacity: 0 }
            ],
            {
                duration: config.duration,
                easing: 'ease-out',
                fill: 'forwards'
            }
        );

        // Remove the ember when animation completes
        fadeOut.onfinish = () => {
            try {
                const index = activeEmbers.indexOf(ember);
                if (index !== -1) {
                    activeEmbers.splice(index, 1);
                }
                if (ember.isConnected) ember.remove();
            } catch (e) {
                console.warn('Error cleaning up transitioning ember:', e);
            }
        };
    } catch (e) {
        console.warn('Error animating transitioning ember:', e);
        // Fallback removal
        const index = activeEmbers.indexOf(ember);
        if (index !== -1) {
            activeEmbers.splice(index, 1);
        }
        if (ember.isConnected) ember.remove();
    }
}

// Function to spawn a new ember
function spawnEmber(page) {
    try {
        // Use cached container reference when possible
        const persistentEmberContainer = window.emberContainer || document.getElementById('persistent-ember-container');
        const titleElement = document.querySelector('.title-visible');

        if (!persistentEmberContainer || !titleElement) {
            console.warn('Missing elements for ember spawning');
            return;
        }

        // Get title position
        const titleRect = window.currentTitleRect || titleElement.getBoundingClientRect();

        // Create new ember
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.setAttribute('role', 'presentation');
        ember.setAttribute('data-page', page);
        ember.setAttribute('data-created', Date.now().toString());

        // Configure appearance with optimized random values
        const left = titleRect.left + Math.random() * titleRect.width;
        const top = titleRect.top + Math.random() * titleRect.height * 0.2;
        const size = (Math.random() * 15 + 3).toFixed(1);
        const duration = EMBER_CONFIG.ANIMATION.BASE_DURATION + Math.random() * EMBER_CONFIG.ANIMATION.RANDOM_DURATION;
        const amplitude = EMBER_CONFIG.ANIMATION.BASE_AMPLITUDE + Math.random() * EMBER_CONFIG.ANIMATION.RANDOM_AMPLITUDE;
        const direction = Math.random() < 0.5 ? -1 : 1;
        const flickerSpeed = (0.6 + Math.random()).toFixed(2);
        const flickerDelay = (Math.random() * 3).toFixed(2);
        const riseHeight = 100 + Math.random() * 200;

        // Store duration for later use
        ember.setAttribute('data-duration', duration.toString());

        // Apply initial styles
        Object.assign(ember.style, {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${size}px`,
            height: `${size}px`,
            background: 'radial-gradient(circle, #ffda96 0%, transparent 30%)',
            borderRadius: '50%',
            opacity: '0',
            filter: 'drop-shadow(0 0 8px #ffd170) brightness(1.6)',
            animation: `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`
        });

        // Add to container and tracking array
        persistentEmberContainer.appendChild(ember);
        activeEmbers.push(ember);

        // Animate the ember
        animateEmber(ember, {
            duration,
            amplitude,
            direction,
            riseHeight
        });
    } catch (e) {
        console.warn('Error spawning ember:', e);
    }
}

// Function to animate an ember with optimized handling
function animateEmber(ember, config) {
    const startTime = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - startTime;
        const t = elapsed / config.duration;

        if (t > 1 || !ember.isConnected) {
            const index = activeEmbers.indexOf(ember);
            if (index !== -1) {
                activeEmbers.splice(index, 1);
            }
            if (ember.isConnected) ember.remove();
            return;
        }

        // More efficient calculation
        const progress = t ** 1.5;
        const yOffset = -progress * config.riseHeight + Math.sin(t * 4 * Math.PI) * config.amplitude;
        const xOffset = config.direction * Math.sin(t * Math.PI) * 120;

        // Set opacity with fewer calculations
        ember.style.opacity = (t < 0.33 ? t * 3 : 1) * (1 - t ** 0.7);

        // Use translate3d for GPU acceleration
        ember.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${1 - t * 0.5})`;

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

// Function to count embers by page - streamlined
function countEmbersByPage(page) {
    let count = 0;
    for (let i = 0; i < activeEmbers.length; i++) {
        if (activeEmbers[i].getAttribute('data-page') === page) {
            count++;
        }
    }
    return count;
}

// Function to clean up invisible or offscreen embers - optimized
function cleanupInvisibleEmbers() {
    let i = activeEmbers.length;
    while (i--) {
        const ember = activeEmbers[i];
        if (!ember.isConnected || parseFloat(ember.style.opacity || '0') < 0.1) {
            ember.remove();
            activeEmbers.splice(i, 1);
        }
    }
    // No need to create a new array - just splice from the existing one
}

// ===== INTEGRATE WITH PAGE NAVIGATION =====
document.addEventListener('DOMContentLoaded', () => {
    const aboutLinks = document.querySelectorAll('a[href="#about"]');
    const pageContent = document.getElementById('page-content');
    const originalContent = pageContent ? pageContent.innerHTML : '';
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
        if (!pageContent) return;

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

        // Focus management - focus the page heading for screen readers
        setTimeout(() => {
            const heading = document.querySelector('.title-visible');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
                // Remove tabindex after focus to avoid persistent tab stop
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

        // Cache the new title position for ember spawning
        setTimeout(() => {
            const titleElement = document.querySelector('.title-visible');
            if (titleElement) {
                window.currentTitleRect = titleElement.getBoundingClientRect();
            }
        }, 50);
    }

    // Set up click handlers for about/home links
    aboutLinks.forEach(link => {
        if (!link) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTitle = document.querySelector('.title-visible');
            const isCurrentlyAbout = currentTitle &&
                currentTitle.textContent.trim().toLowerCase().includes('about');

            // Switch to the other page
            switchPage(!isCurrentlyAbout);
        });
    });

    // Better handling for touch devices in mobile menu
    if ('ontouchstart' in window) {
        const menuArea = document.querySelector('.mobile-menu');
        if (menuArea) {
            menuArea.addEventListener('touchstart', (e) => {
                // Prevent default only if we're operating on a menu link
                if (e.target.tagName === 'A') {
                    e.stopPropagation();
                }
            }, { passive: false });
        }
    }
});

// Handle window resize with debounce
window.addEventListener('resize', debounce(() => {
    // Recalculate ember position on resize if needed
    const titleElement = document.querySelector('.title-visible');
    if (titleElement) {
        // Cache the new title position
        window.currentTitleRect = titleElement.getBoundingClientRect();
    }

    // Handle mobile menu if needed
    const mobileMenu = document.getElementById('mobile-menu');
    const isMenuOpen = mobileMenu && mobileMenu.classList.contains('active');

    if (window.innerWidth >= 1024 && isMenuOpen && mobileMenu) {
        // Close mobile menu if we resize to desktop
        const toggle = document.querySelector('.menu-toggle');

        mobileMenu.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.classList.remove('active');
        }

        document.body.classList.remove('menu-open');
    }
}, 150)); // 150ms debounce

// ===== LOADING BAR FUNCTIONALITY =====
window.addEventListener('load', () => {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    if (!hasLoaded && loadingBar && loadingText) {
        let progress = 0;
        const loadingDuration = 1000;
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
});

// ===== MOBILE MENU FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!toggle || !mobileMenu) return;

    let isMenuOpen = false;

    function toggleMenu(force = null) {
        isMenuOpen = force !== null ? force : !isMenuOpen;

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

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        if (
            isMenuOpen &&
            !mobileMenu.contains(e.target) &&
            !toggle.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });

    const menuLinks = document.querySelectorAll('.header-left a, .header-right a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                toggleMenu(false);
            }
        });
    });
});