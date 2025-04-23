// js/main.js

import { debounce } from './modules/utils.js';
import { initEmberSystem } from './modules/embers.js';
import { setupPageNavigation } from './modules/navigation.js';

import { 
    setupMobileMenu, 
    initLoadingBar, 
    handleResize, 
    handleVisibilityChange 
} from './modules/ui.js';
import { DEVICE } from './modules/config.js';

// Global state that needs to be shared between modules
window.hasLoaded = false;
window.isMenuOpen = false;
window.finalProgress = 5;  // For loading bar
window.DEVICE = DEVICE;    // Make DEVICE available globally
window.activeEmbers = [];  // Initialize empty array for activeEmbers

// Initialize when DOM is ready
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

if (window.location.hash === '#about') {
    history.replaceState({ page: 'about' }, '', '#about');
    setTimeout(() => {
        const aboutLink = document.querySelector('.nav-toggle-link');
        if (aboutLink) aboutLink.click();
    }, 100);
}

// Show ember count in console for debug
setInterval(() => {
    console.log('Active Embers:', window.activeEmbers.length);
}, 5000);

