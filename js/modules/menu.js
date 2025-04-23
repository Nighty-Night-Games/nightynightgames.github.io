// menu.js
import { get, getAll } from './dom.js';
import { state, update } from './state.js';
import { toggleClasses, setAttributes } from './utils.js';
import { DEVICE } from './config.js';

export function init() {
    const menuToggle = get('menuToggle') || document.querySelector('.menu-toggle');
    const mobileMenu = get('mobileMenu') || document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggle();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (state.isMenuOpen && menuToggle && mobileMenu && 
            !menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            toggle(false);
        }
    });

    // Set up escape key handling
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.isMenuOpen) {
            toggle(false);
        }
    });

    // Close menu when links are clicked
    const menuLinks = getAll('.header-left a, .header-right a') || 
                     document.querySelectorAll('.header-left a, .header-right a');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                toggle(false);
            }
        });
    });

    // Touch device handling
    if (DEVICE?.supportsTouch) {
        mobileMenu.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                e.stopPropagation();
            }
        }, { passive: false });
    }
}

export function toggle(force) {
    const menuToggle = get('menuToggle') || document.querySelector('.menu-toggle');
    const mobileMenu = get('mobileMenu') || document.getElementById('mobile-menu');
    
    if (!menuToggle || !mobileMenu) return;
    
    const isOpen = force !== undefined ? force : !state.isMenuOpen;
    update('isMenuOpen', isOpen);
    window.isMenuOpen = isOpen; // For backward compatibility
    
    toggleClasses(mobileMenu, { 'active': isOpen });
    toggleClasses(menuToggle, { 'active': isOpen });
    toggleClasses(document.body, { 'menu-open': isOpen });
    
    setAttributes(menuToggle, { 'aria-expanded': isOpen });
    setAttributes(mobileMenu, { 'aria-hidden': !isOpen });
}