// loadingBar.js
import { get } from './dom.js';
import { state, update } from './state.js';
import { updateLoadingBar } from './utils.js';

export function init() {
    if (!state.hasLoaded) {
        animateProgress(state.finalProgress);
    } else {
        updateLoadingBar(state.finalProgress);
    }
}

export function animateProgress(targetProgress) {
    const loadingBar = get('loadingBar') || document.querySelector('.loading-bar');
    const loadingText = get('loadingText') || document.querySelector('.loading-text');

    if (!loadingBar || !loadingText) return;

    let progress = 0;
    const loadingDuration = 1000; // Default duration
    const stepTime = Math.floor(loadingDuration / targetProgress);

    const interval = setInterval(() => {
        progress++;
        updateLoadingBar(progress);

        if (progress >= targetProgress) {
            clearInterval(interval);
            update('hasLoaded', true);
            loadingBar.classList.add('loaded');
        }
    }, stepTime);
}