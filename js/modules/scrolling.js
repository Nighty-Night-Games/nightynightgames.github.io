// js/modules/scrolling.js

let backToTopBtn = null;
let scrollThreshold = 300; // px from top to show the button

/**
 * Initialize scrolling features
 */
export function init() {
    // Get the back to top button
    backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    // Set up event listeners
    window.addEventListener('scroll', handleScroll);
    backToTopBtn.addEventListener('click', scrollToTopSmooth);

    // Initial check
    handleScroll();
}

/**
 * Handle scroll events
 */
function handleScroll() {
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    if (window.scrollY > scrollThreshold) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

/**
 * Scroll to top with smooth animation
 */
export function scrollToTopSmooth() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Scroll to specific element by ID with smooth animation
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}