// embers.js
import { DEVICE, EMBER_CONFIG } from './config.js';
import { countEmbersByPage, isTitleVisible, updateTitleRect, getCurrentPageFromTitle, debounce } from './utils.js';
import { state, update } from './state.js';

// Module state (minimal)
let activeEmbers = [], emberSpawnInterval = null, currentPage = 'home';

/**
 * Initialize ember system
 */
export function init() {
    // Set up global refs and create container
    state.activeEmbers = activeEmbers;
    window.activeEmbers = activeEmbers;
    createEmberContainer();
    updateTitleRect();
    
    // Set current page and start spawning
    currentPage = getCurrentPageFromTitle();
    update('currentPage', currentPage);
    startEmberSpawning(currentPage);
    
    // Set up maintenance
    setInterval(cleanupInvisibleEmbers, EMBER_CONFIG.CLEANUP_INTERVAL);
    
    // Handle scroll visibility
    window.addEventListener('scroll', debounce(() => {
        updateTitleRect();
        const visible = isTitleVisible();
        
        if (!visible && emberSpawnInterval) {
            clearInterval(emberSpawnInterval);
            emberSpawnInterval = state.emberSpawnInterval = null;
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
 * Create ember container element
 */
function createEmberContainer() {
    let container = document.getElementById('persistent-ember-container');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'persistent-ember-container';
        container.setAttribute('aria-hidden', 'true');
        
        Object.assign(container.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', 
            pointerEvents: 'none', zIndex: '10', overflow: 'visible'
        });
        
        document.body.appendChild(container);
    }
    
    window.emberContainer = container;
}

/**
 * Start ember spawning for a page
 */
export function startEmberSpawning(page) {
    // Clear existing interval
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = null;
    }
    
    // Set max embers based on page
    const maxEmbers = page === 'about' ? EMBER_CONFIG.ABOUT_MAX_EMBERS : 
                      page === 'games' ? (EMBER_CONFIG.GAMES_MAX_EMBERS || EMBER_CONFIG.ABOUT_MAX_EMBERS) : 
                      EMBER_CONFIG.HOME_MAX_EMBERS;
    
    // Create spawn interval
    emberSpawnInterval = setInterval(() => {
        // Skip under certain conditions
        if (document.hidden || (state.isMenuOpen && DEVICE.lowPower)) return;
        
        // Only spawn if under limits and title visible
        if (countEmbersByPage(page) < maxEmbers && 
            activeEmbers.length < EMBER_CONFIG.MAX_EMBERS && 
            isTitleVisible()) {
            spawnEmber(page);
        }
    }, EMBER_CONFIG.SPAWN_RATE);
    
    // Store references
    state.emberSpawnInterval = window.emberSpawnInterval = emberSpawnInterval;
}

/**
 * Create a new ember element
 */
function spawnEmber(page) {
    const container = window.emberContainer;
    const titleRect = window.currentTitleRect || state.currentTitleRect;
    if (!container || !titleRect) return;
    
    // Create element with minimal properties
    const ember = document.createElement('div');
    ember.classList.add('ember');
    ember.setAttribute('data-page', page);
    ember.setAttribute('data-created', Date.now());
    
    // Generate random values
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
        duration, amplitude, direction, riseHeight
    };
    
    // Apply minimal styles
    Object.assign(ember.style, {
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: '0',
        transform: EMBER_CONFIG.USE_GPU ? 'translate3d(0,0,0)' : 'translate(0,0)',
        filter: 'drop-shadow(0 0 8px #ffd170) brightness(1.6)'
    });
    
    // Add animation if not low power
    if (!DEVICE.lowPower) {
        ember.style.animation = `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`;
    }
    
    // Add to container and tracking
    container.appendChild(ember);
    activeEmbers.push(ember);
    
    // Animation loop
    const animate = function(timestamp) {
        if (!ember.isConnected) return;
        
        const data = ember.emberData;
        const elapsed = timestamp - data.startTime;
        const t = elapsed / data.duration;
        
        if (t > 1) {
            // Remove when complete
            const index = activeEmbers.indexOf(ember);
            if (index !== -1) activeEmbers.splice(index, 1);
            if (ember.isConnected) ember.remove();
            return;
        }
        
        // Calculate animation values - use combined calculations
        const progress = t ** 1.5;
        const yOffset = -progress * data.riseHeight + Math.sin(t * 4 * Math.PI) * data.amplitude;
        const xOffset = data.direction * Math.sin(t * Math.PI) * 120;
        const opacity = (t < 0.33 ? t * 3 : 1) * (1 - t ** 0.7);
        const scale = 1 - t * 0.5;
        
        // Apply values in one step
        ember.style.opacity = opacity.toFixed(2);
        ember.style.transform = EMBER_CONFIG.USE_GPU
            ? `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`
            : `translate(${xOffset}px, ${yOffset}px) scale(${scale})`;
        
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
    return ember;
}

/**
 * Handle page transition
 */
export function handlePageTransition(newPage) {
    if (newPage === currentPage) return;
    
    // Stop spawning
    if (emberSpawnInterval) {
        clearInterval(emberSpawnInterval);
        emberSpawnInterval = state.emberSpawnInterval = null;
    }
    
    // Transition existing embers
    activeEmbers.forEach(ember => {
        if (ember.getAttribute('data-page') === currentPage) {
            ember.setAttribute('data-transitioning', 'true');
            
            // Calculate remaining time
            const creationTime = parseInt(ember.getAttribute('data-created')) || Date.now() - 5000;
            const duration = Math.max(3000, 8000 - (Date.now() - creationTime));
            
            // Apply transition in one step
            ember.style.transition = `opacity ${duration}ms ease-out, transform ${Math.min(50, duration / 600)}ms ease-out`;
            ember.style.opacity = '0';
            
            // Modify transform to add float-up effect
            const currentTransform = ember.style.transform || '';
            ember.style.transform = currentTransform ? 
                currentTransform + ' translateY(-40px) scale(0.6)' : 
                'translateY(-40px) scale(0.6)';
        }
    });
    
    // Update page and start new spawning
    currentPage = newPage;
    update('currentPage', newPage);
    
    setTimeout(() => {
        updateTitleRect();
        startEmberSpawning(newPage);
    }, 100);
}

/**
 * Clean up invisible embers
 */
function cleanupInvisibleEmbers() {
    // Use single reverse loop for efficiency
    for (let i = activeEmbers.length - 1; i >= 0; i--) {
        const ember = activeEmbers[i];
        if (!ember.isConnected || parseFloat(ember.style.opacity || '0') < 0.1) {
            if (ember.isConnected) ember.remove();
            activeEmbers.splice(i, 1);
        }
    }
}

/**
 * Get active embers count
 */
export function getActiveEmbersCount() {
    return activeEmbers.length;
}