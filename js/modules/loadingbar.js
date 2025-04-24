import { get } from './dom.js';
import { state, update } from './state.js';
import { updateLoadingBar } from './utils.js';

/**
 * Initialize the loading bar for the Games page.
 */
export function init() {
    const loadingBar = get('loadingBar') || document.querySelector('.loading-bar');
    const loadingText = get('loadingText') || document.querySelector('.loading-text');

    // Ensure the loading bar initialization is only applicable to the Games page
    if (!loadingBar || !loadingText || state.currentPage !== 'games') return;

    if (!window.hasLoaded) {
        animateLoadingBar(state.finalProgress, loadingBar);
    } else {
        updateLoadingBar(state.finalProgress);
    }
}

/**
 * Animate the loading bar progress smoothly to a target value.
 * @param {number} targetProgress - Final progress value (percentage).
 * @param {HTMLElement} loadingBar - The loading bar element.
 */
function animateLoadingBar(targetProgress, loadingBar) {
    let progress = 0;
    const stepTime = calculateStepTime(targetProgress);
    const interval = setInterval(() => {
        // Update progress
        updateLoadingBar(++progress);
        if (progress >= targetProgress) {
            clearInterval(interval);
            markBarAsLoaded(loadingBar);
        }
    }, stepTime);
}

/**
 * Calculate step time for the loading bar animation based on device power mode.
 * @param {number} targetProgress - Final progress value.
 * @returns {number} Duration of each animation step in milliseconds.
 */
function calculateStepTime(targetProgress) {
    const baseDuration = window.DEVICE?.lowPower ? 600 : 1000;
    return Math.floor(baseDuration / targetProgress);
}

/**
 * Mark the loading bar as fully loaded.
 * @param {HTMLElement} loadingBar - The loading bar element.
 */
function markBarAsLoaded(loadingBar) {
    window.hasLoaded = true;
    loadingBar.classList.add('loaded'); // Add a class for finished state
    update('hasLoaded', true);
}

/**
 * Manually animate progress of the loading bar (public API).
 * @param {number} targetProgress - Final progress percentage.
 */
export function animateProgress(targetProgress) {
    const loadingBar = get('loadingBar') || document.querySelector('.loading-bar');
    if (!loadingBar) return;

    animateLoadingBar(targetProgress, loadingBar);
}

/**
 * Safely remove the loading bar from the DOM, if present.
 */
export function removeLoadingBar() {
    const loadingContainer = document.querySelector('.loading-bar-container');
    if (loadingContainer) loadingContainer.remove();
}