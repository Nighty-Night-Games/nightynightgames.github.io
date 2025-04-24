import { get } from './dom.js';
import { state, update } from './state.js';
import { updateLoadingBar } from './utils.js';

/**
 * Initialize loading bar - Ensure bar exists or animate if already on page
 */
export function init() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    // Prevent initialization if not on the Games page
    if (!loadingBar || !loadingText || state.currentPage !== 'games') {
        return;
    }

    if (!window.hasLoaded) {
        // Animate progress
        let progress = 0;
        const stepTime = Math.floor((window.DEVICE?.lowPower ? 600 : 1000) / state.finalProgress);

        const interval = setInterval(() => {
            updateLoadingBar(++progress);

            if (progress >= state.finalProgress) {
                clearInterval(interval);
                window.hasLoaded = true;
                loadingBar.classList.add('loaded');
            }
        }, stepTime);
    } else {
        // Just set the final value if already loaded
        updateLoadingBar(state.finalProgress);
    }
}


/**
 * Animate the loading bar progress from 0 to target value
 * @param {number} targetProgress - Final progress percentage
 */
export function animateProgress(targetProgress) {
    const loadingBar = get('loadingBar') || document.querySelector('.loading-bar');
    const loadingText = get('loadingText') || document.querySelector('.loading-text');

    if (!loadingBar || !loadingText) return;

    let progress = 0;
    const loadingDuration = 1000;
    const stepTime = Math.floor(loadingDuration / targetProgress);

    const interval = setInterval(() => {
        updateLoadingBar(++progress);

        if (progress >= targetProgress) {
            clearInterval(interval);
            update('hasLoaded', true);
            loadingBar.classList.add('loaded');
        }
    }, stepTime);
}

/**
 * Remove the loading bar if it exists
 */
export function removeLoadingBar() {
    const loadingContainer = document.querySelector('.loading-bar-container');
    if (loadingContainer) {
        loadingContainer.remove(); // Safely remove the loading bar container
    }
}