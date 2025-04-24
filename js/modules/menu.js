// menu.js
import { get, getAll } from './dom.js';
import { state, update } from './state.js';
import { toggleClasses, setAttributes } from './utils.js';
import { DEVICE } from './config.js';

/**
 * Initialize the mobile menu functionality.
 */
export function init() {
    const menuToggle = getOrQuery('.menu-toggle', 'menuToggle');
    const mobileMenu = getOrQuery('#mobile-menu', 'mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    setupEventListeners(menuToggle, mobileMenu);
}

/**
 * Toggle the mobile menu's visibility.
 * @param {boolean} [force] - Optionally force the state (true: open, false: closed).
 */
export function toggle(force) {
    const menuToggle = getOrQuery('.menu-toggle', 'menuToggle');
    const mobileMenu = getOrQuery('#mobile-menu', 'mobileMenu');

    if (!menuToggle || !mobileMenu) return;

    const isOpen = force !== undefined ? force : !state.isMenuOpen;

    // Update state and DOM
    updateMenuState(isOpen, menuToggle, mobileMenu);
}

/**
 * Set up event listeners for menu interactions.
 * @param {HTMLElement} menuToggle - The menu toggle button.
 * @param {HTMLElement} mobileMenu - The mobile menu container.
 */
function setupEventListeners(menuToggle, mobileMenu) {
    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggle();
    });

    document.addEventListener('click', e => {
        if (state.isMenuOpen && !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            toggle(false);
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && state.isMenuOpen) toggle(false);
    });

    setupMenuLinks(mobileMenu);
    handleTouchDevices(mobileMenu);
}

/**
 * Set up event listeners for menu links.
 * @param {HTMLElement} mobileMenu - The mobile menu container.
 */
function setupMenuLinks(mobileMenu) {
    const menuLinks = getAll('.header-left a, .header-right a') || 
                      document.querySelectorAll('.header-left a, .header-right a');

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) toggle(false);
        });
    });
}

/**
 * Add touch event handling for mobile devices.
 * @param {HTMLElement} mobileMenu - The mobile menu container.
 */
function handleTouchDevices(mobileMenu) {
    if (DEVICE?.supportsTouch) {
        mobileMenu.addEventListener('touchstart', e => {
            if (['A', 'BUTTON'].includes(e.target.tagName)) e.stopPropagation();
        }, { passive: false });
    }
}

/**
 * Update the menu state in the application and DOM.
 * @param {boolean} isOpen - Whether the menu should be open.
 * @param {HTMLElement} menuToggle - The menu toggle button.
 * @param {HTMLElement} mobileMenu - The mobile menu container.
 */
function updateMenuState(isOpen, menuToggle, mobileMenu) {
    // Update state
    update('isMenuOpen', isOpen);
    window.isMenuOpen = isOpen; // For backward compatibility

    // Update DOM classes
    toggleClasses(mobileMenu, { active: isOpen });
    toggleClasses(menuToggle, { active: isOpen });
    toggleClasses(document.body, { 'menu-open': isOpen });

    // Update accessibility attributes
    setAttributes(menuToggle, { 'aria-expanded': isOpen });
    setAttributes(mobileMenu, { 'aria-hidden': !isOpen });
}

/**
 * Helper to retrieve an element by its selector or ID.
 * @param {string} selector - The CSS selector.
 * @param {string} id - The ID of the element in the DOM cache.
 * @returns {HTMLElement|null} The found element or null if not found.
 */
function getOrQuery(selector, id) {
    return get(id) || document.querySelector(selector);
}