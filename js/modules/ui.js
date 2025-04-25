import { debounce } from './utils.js';
import { updateConfig } from './config.js';
import { init as initEmberSystem, startEmberSpawning } from './embers.js';
import { updateTitleRect, getCurrentPageFromTitle, updateLoadingBar } from './utils.js';

/* === Mobile Menu Utilities === */

/**
 * Toggle the mobile menu state.
 * @param {boolean|null} force - Optional parameter to explicitly set state.
 */
export function toggleMobileMenu(force = null) {
    const isMenuOpen = force !== null ? force : !window.isMenuOpen;
    window.isMenuOpen = isMenuOpen;

    const mobileMenu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (!mobileMenu || !toggle) return;

    // Update UI in a single pass
    mobileMenu.classList.toggle('active', isMenuOpen);
    mobileMenu.setAttribute('aria-hidden', !isMenuOpen);
    toggle.setAttribute('aria-expanded', isMenuOpen);
    toggle.classList.toggle('active', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);
}

/**
 * Set up interactions for the mobile menu.
 */
export function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuToggle || !mobileMenu) return;

    const closeMenu = () => window.isMenuOpen && toggleMobileMenu(false);

    // Toggle menu on button click
    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggleMobileMenu();
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
        if (window.isMenuOpen && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            toggleMobileMenu(false);
        }
    });

    // Close on "Escape" key
    document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

    // Close when mobile links are clicked
    document.querySelectorAll('.header-left a, .header-right a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) closeMenu();
        });
    });

    // Handle touch interactions
    if (window.DEVICE?.supportsTouch) {
        mobileMenu.addEventListener('touchstart', e => {
            if (['A', 'BUTTON'].includes(e.target.tagName)) e.stopPropagation();
        }, { passive: false });
    }
}

/* === Loading Bar Utilities === */

/**
 * Initialize the loading bar animation.
 */
export function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    if (!loadingBar || !loadingText) return;

    let progress = 0;
    const stepTime = Math.floor((window.DEVICE?.lowPower ? 600 : 1000) / window.finalProgress);

    if (!window.hasLoaded) {
        const interval = setInterval(() => {
            updateLoadingBar(++progress);
            if (progress >= window.finalProgress) {
                clearInterval(interval);
                window.hasLoaded = true;
                loadingBar.classList.add('loaded');
            }
        }, stepTime);
    } else {
        updateLoadingBar(window.finalProgress);
    }
}

/* === Event Handlers === */

/**
 * Handle window resize events.
 */
export function handleResize() {
    updateConfig();
    if (updateTitleRect() && !window.emberSpawnInterval) {
        startEmberSpawning(getCurrentPageFromTitle());
    }
    if (window.innerWidth >= 1024 && window.isMenuOpen) {
        toggleMobileMenu(false);
    }
}

/**
 * Handle page visibility changes.
 */
export function handleVisibilityChange() {
    if (!document.hidden) {
        if (updateTitleRect() && !window.emberSpawnInterval) {
            startEmberSpawning(getCurrentPageFromTitle());
        }
    }
}

