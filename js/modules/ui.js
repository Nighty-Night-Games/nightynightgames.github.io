import { debounce } from './utils.js';
import { updateConfig } from './config.js';
import { initEmberSystem } from './embers.js';
import { startEmberSpawning } from './embers.js';

// Export function to update title rectangle for ember positioning
export function updateTitleRect() {
    const el = document.querySelector('.title-visible');
    if (el) window.currentTitleRect = el.getBoundingClientRect();
}

// Global state referenced elsewhere
export function toggleMobileMenu(force = null) {
    const isMenuOpen = force !== null ? force : !window.isMenuOpen;
    window.isMenuOpen = isMenuOpen;

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

/**
 * Initialize the loading bar
 */
export function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    if (!window.hasLoaded && loadingBar && loadingText) {
        let progress = 0;
        const loadingDuration = window.DEVICE?.lowPower ? 600 : 1000;
        const stepTime = Math.floor(loadingDuration / window.finalProgress);

        const interval = setInterval(() => {
            progress++;
            loadingText.textContent = `${progress}%`;
            loadingBar.style.width = `${progress}%`;

            const container = loadingBar.parentElement;
            if (container) {
                container.setAttribute('aria-valuenow', progress);
            }

            if (progress >= window.finalProgress) {
                clearInterval(interval);
                window.hasLoaded = true;
                loadingBar.classList.add('loaded');
            }
        }, stepTime);
    } else if (loadingBar && loadingText) {
        // If already loaded, restore visual state
        loadingText.textContent = `${window.finalProgress}%`;
        loadingBar.style.width = `${window.finalProgress}%`;

        const container = loadingBar.parentElement;
        if (container) {
            container.setAttribute('aria-valuenow', window.finalProgress);
        }
    }
}

/**
 * Set up the mobile menu toggle
 */
export function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (window.isMenuOpen && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    // Set up escape key handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && window.isMenuOpen) {
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
    if (window.DEVICE?.supportsTouch) {
        mobileMenu.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.stopPropagation();
            }
        }, { passive: false });
    }
}

/**
 * Handle window resize events
 */
export function handleResize() {
    // Update device configuration
    updateConfig();

    // Update title position for ember spawning
    updateTitleRect();

    // Close mobile menu on desktop
    if (window.innerWidth >= 1024 && window.isMenuOpen) {
        toggleMobileMenu(false);
    }

    if (!window.emberSpawnInterval && document.querySelector('.title-visible')) {
        const page = document.querySelector('.title-visible')?.textContent.toLowerCase().includes('about') ? 'about' : 'home';
        startEmberSpawning(page);
    }
}

/**
 * Handle document visibility changes
 */
export function handleVisibilityChange() {
    // Stop animations when tab is not visible
    if (document.hidden) {
        // Pause animations if needed
    } else {
        // Resume animations if needed
        
        // Update title position when tab becomes visible again
        updateTitleRect();
    }
}