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
    initDom(); // Initialize DOM cache first
    initModules(); // Initialize other modules
    setupGlobalHandlers(); // Set up event listeners
}

/**
 * Initialize various app modules
 */
function initModules() {
    initMenu();
    initNavigation();
    initScrolling();
    initLoadingBar(); // Initialize loading bar
}

/**
 * Configure global event handlers
 */
function setupGlobalHandlers() {
    window.addEventListener('resize', debounce(updateConfig, 150));
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Initialize embers for interactive visuals
 */
function initEmberSystem() {
    requestAnimationFrame(initEmbers);
}

/**
 * Handle page visibility changes
 */
function handleVisibilityChange() {
    // Add logic for visibility changes if needed
}

/**
 * Utility: Debounce function to limit event execution frequency
 */
function debounce(func, wait = 100) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Initialize the app when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Initialize embers and effects when the page is ready
    const handlePageLoad = () => initEmberSystem();
    if (document.readyState === 'complete') {
        handlePageLoad();
    } else {
        window.addEventListener('load', handlePageLoad);
    }
});
