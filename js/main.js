// js/main.js
import { init as initDom } from './modules/dom.js';
import { init as initMenu } from './modules/menu.js';
import { init as initLoadingBar } from './modules/loadingbar.js';
import { init as initNavigation } from './modules/navigation.js';
import { init as initEmbers } from './modules/embers.js';
import { updateConfig } from './modules/config.js';
import { state } from './modules/state.js';

// Set initial progress value
state.finalProgress = 5;

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing application...');
    
    // First initialize DOM cache for element references
    initDom();
    
    // Then initialize all other modules
    initMenu();
    initNavigation();
    
    // Initialize embers after first paint
    if (document.readyState === 'complete') {
        requestAnimationFrame(initEmbers);
    } else {
        window.addEventListener('load', () => {
            requestAnimationFrame(initEmbers);
        });
    }
    
    // Initialize loading bar
    window.addEventListener('load', initLoadingBar);
    
    // Set up responsive handlers
    window.addEventListener('resize', debounce(handleResize, 150));
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Handle window resize
function handleResize() {
    updateConfig();
    // Additional resize logic if needed
}

// Handle visibility change
function handleVisibilityChange() {
    // Logic for visibility changes
}

// Utility function for debouncing
function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}