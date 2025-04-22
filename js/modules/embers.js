import { DEVICE, EMBER_CONFIG } from './config.js';
import { countEmbersByPage, isTitleVisible, debounce } from './utils.js';

// Global state
let activeEmbers = [];
let emberSpawnInterval = null;
let currentPage = 'home';

/**
 * Initialize the ember system
 */
export function initEmberSystem() {
    // Make activeEmbers accessible globally
    window.activeEmbers = activeEmbers;
    
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
    
    // Set up scroll event handler
    window.addEventListener('scroll', debounce(() => {
        const visible = isTitleVisible();

        if (!visible && emberSpawnInterval) {
            clearInterval(emberSpawnInterval);
            emberSpawnInterval = null;

            // Fade out active embers
            activeEmbers.forEach(ember => {
                ember.style.transition = 'opacity 0.6s ease-out';
                ember.style.opacity = '0';
            });
        } else if (visible && !emberSpawnInterval) {
            startEmberSpawning(currentPage);
        }
    }, 100));
}

/**
 * Create container for embers
 */
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

/**
 * Start spawning embers for a specific page
 * @param {string} page - Page identifier
 */
export function startEmberSpawning(page) {
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
        if (document.hidden || (window.isMenuOpen && DEVICE.lowPower)) return;

        const pageEmbers = countEmbersByPage(page);

        // Only spawn if under limits
        if (
            pageEmbers < maxEmbers &&
            activeEmbers.length < EMBER_CONFIG.MAX_EMBERS &&
            isTitleVisible()
        ) {
            spawnEmber(page);
        }
    }, EMBER_CONFIG.SPAWN_RATE);
}

/**
 * Create and animate a new ember
 * @param {string} page - Page this ember belongs to
 * @return {HTMLElement} - The ember element
 */
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

/**
 * Handle page transition effects on embers
 * @param {string} newPage - Page being navigated to
 */
export function handlePageTransition(newPage) {
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

/**
 * Remove embers that are no longer visible
 */
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

/**
 * Get current active embers count
 * @return {number} - Number of active embers
 */
export function getActiveEmbersCount() {
    return activeEmbers.length;
}