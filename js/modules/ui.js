import { debounce } from './utils.js';
import { updateConfig } from './config.js';
import { initEmberSystem, startEmberSpawning } from './embers.js';
import { updateTitleRect, getCurrentPageFromTitle, updateLoadingBar } from './utils.js';

/**
 * Toggle mobile menu state
 */
export function toggleMobileMenu(force = null) {
    // Get/set state
    const isMenuOpen = force !== null ? force : !window.isMenuOpen;
    window.isMenuOpen = isMenuOpen;
    
    // Get elements
    const mobileMenu = document.getElementById('mobile-menu');
    const toggle = document.querySelector('.menu-toggle');
    if (!mobileMenu || !toggle) return;
    
    // Update UI (all in one pass)
    mobileMenu.classList.toggle('active', isMenuOpen);
    mobileMenu.setAttribute('aria-hidden', !isMenuOpen);
    toggle.setAttribute('aria-expanded', isMenuOpen);
    toggle.classList.toggle('active', isMenuOpen);
    document.body.classList.toggle('menu-open', isMenuOpen);
}

/**
 * Initialize loading bar animation
 */
export function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    
    if (!window.hasLoaded && loadingBar && loadingText) {
        // Animate progress
        let progress = 0;
        const stepTime = Math.floor((window.DEVICE?.lowPower ? 600 : 1000) / window.finalProgress);
        
        const interval = setInterval(() => {
            updateLoadingBar(++progress);
            
            if (progress >= window.finalProgress) {
                clearInterval(interval);
                window.hasLoaded = true;
                loadingBar.classList.add('loaded');
            }
        }, stepTime);
    } else {
        // Just set final value
        updateLoadingBar(window.finalProgress);
    }
}

/**
 * Set up mobile menu interactions
 */
export function setupMobileMenu() {
    // Get elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!menuToggle || !mobileMenu) return;
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', e => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Set up all closing methods at once
    const closeMenu = () => window.isMenuOpen && toggleMobileMenu(false);
    
    // Close when clicking outside
    document.addEventListener('click', e => {
        window.isMenuOpen && 
        !menuToggle.contains(e.target) && 
        !mobileMenu.contains(e.target) && 
        toggleMobileMenu(false);
    });
    
    // Close on escape key
    document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
    
    // Close when links clicked (mobile only)
    document.querySelectorAll('.header-left a, .header-right a').forEach(link => {
        link.addEventListener('click', () => window.innerWidth < 1024 && closeMenu());
    });
    
    // Touch handling
    if (window.DEVICE?.supportsTouch) {
        mobileMenu.addEventListener('touchstart', e => {
            (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') && e.stopPropagation();
        }, { passive: false });
    }
}

/**
 * Handle window resize
 */
export function handleResize() {
    // Update config and check title visibility
    updateConfig();
    
    // Restart embers if needed
    updateTitleRect() && !window.emberSpawnInterval && 
        startEmberSpawning(getCurrentPageFromTitle());
    
    // Close mobile menu on desktop
    window.innerWidth >= 1024 && window.isMenuOpen && toggleMobileMenu(false);
}

/**
 * Handle visibility changes
 */
export function handleVisibilityChange() {
    if (!document.hidden) {
        // Restart embers when tab becomes visible
        updateTitleRect() && !window.emberSpawnInterval && 
            startEmberSpawning(getCurrentPageFromTitle());
    }
}