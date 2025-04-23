// loadingBar.js
import { get } from './dom.js';
import { state, update } from './state.js';
import { updateLoadingBar } from './utils.js';

/**
 * Initialize loading bar - either animate if first load or set directly if already loaded
 */
export function init() {
    state.hasLoaded 
        ? updateLoadingBar(state.finalProgress) 
        : animateProgress(state.finalProgress);
}

/**
 * Animate the loading bar progress from 0 to target value
 * @param {number} targetProgress - Final progress percentage (1-100)
 */
export function animateProgress(targetProgress) {
    const loadingBar = get('loadingBar') || document.querySelector('.loading-bar');
    const loadingText = get('loadingText') || document.querySelector('.loading-text');
    
    if (!loadingBar || !loadingText) return;
    
    // Animation settings
    let progress = 0;
    const loadingDuration = 1000;
    const stepTime = Math.floor(loadingDuration / targetProgress);
    
    // Progress animation interval
    const interval = setInterval(() => {
        updateLoadingBar(++progress);
        
        if (progress >= targetProgress) {
            clearInterval(interval);
            update('hasLoaded', true);
            loadingBar.classList.add('loaded');
        }
    }, stepTime);
}