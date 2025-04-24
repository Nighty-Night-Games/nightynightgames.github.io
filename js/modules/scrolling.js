// js/modules/scrolling.js

let backToTopBtn = null;
const scrollThreshold = 300; // Pixels from top to show the button

/**
 * Initialize scrolling-related features, such as the back-to-top button.
 */
export function init() {
    backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    // Add event listeners
    setupEventListeners();

    // Perform an initial check to set the button's visibility
    toggleBackToTopVisibility();
}

/**
 * Set up event listeners for scrolling and button interaction.
 */
function setupEventListeners() {
    window.addEventListener('scroll', toggleBackToTopVisibility);
    backToTopBtn.addEventListener('click', scrollToTopSmooth);
}

/**
 * Show or hide the back-to-top button based on the scroll position.
 */
function toggleBackToTopVisibility() {
    if (!backToTopBtn) return;

    // Toggle the button visibility based on scroll position
    backToTopBtn.classList.toggle('visible', window.scrollY > scrollThreshold);
}

/**
 * Smoothly scroll to the top of the page.
 */
export function scrollToTopSmooth() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

/**
 * Smoothly scroll to a specific element by its ID.
 * @param {string} elementId - The ID of the target element.
 */
export function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}