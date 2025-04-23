// js/main.js
import { init as initDom } from './modules/dom.js';
import { init as initMenu } from './modules/menu.js';
import { init as initLoadingBar } from './modules/loadingbar.js';
import { init as initNavigation } from './modules/navigation.js';
import { init as initEmbers } from './modules/embers.js';
import { updateConfig } from './modules/config.js';
import { state } from './modules/state.js';
import { init as initScrolling } from './modules/scrolling.js';

// Set initial progress value
state.finalProgress = 5;

/**
 * Initialize application modules
 */
function initApp() {
    // Initialize DOM cache first (required by other modules)
    initDom();
    
    // Then initialize all other modules
    initMenu();
    initNavigation();
    initScrolling();
    
    // Set up global handlers
    window.addEventListener('resize', debounce(handleResize, 150));
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Initialize embers system
 */
function initEmberSystem() {
    requestAnimationFrame(initEmbers);
}

// Handle window resize
const handleResize = () => updateConfig();

// Handle visibility change
const handleVisibilityChange = () => {};

/**
 * Debounce utility
 */
function debounce(func, wait = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Initialize embers after first paint
    if (document.readyState === 'complete') {
        initEmberSystem();
    } else {
        window.addEventListener('load', initEmberSystem);
    }
    
    // Initialize loading bar after full load
    window.addEventListener('load', initLoadingBar);
});