/**
 * Debounce function to limit function call frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @return {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

export function updateTitleRect() {
    const el = getTitleElement();
    if (el) {
        window.currentTitleRect = el.getBoundingClientRect();
        return true;
    }
    return false;
}

export function getCurrentPageFromTitle() {
    const el = getTitleElement();
    if (!el) return 'home';
    return el.textContent.trim().toLowerCase().includes('about') ? 'about' : 'home';
}


/**
 * Count embers by page attribute
 * @param {string} page - Page identifier
 * @return {number} - Number of embers for given page
 */
export function countEmbersByPage(page) {
    let count = 0;
    if (!window.activeEmbers) return count;
    
    for (let i = 0; i < window.activeEmbers.length; i++) {
        if (window.activeEmbers[i].getAttribute('data-page') === page) {
            count++;
        }
    }
    return count;
}

/**
 * Check if title element is visible in viewport
 * @return {boolean} - Whether title is visible
 */
export function isTitleVisible() {
    const titleElement = document.querySelector('.title-visible');
    if (!titleElement) return false;

    const rect = titleElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top < viewportHeight && rect.bottom > 0;
}

export function getTitleElement() {
    return document.querySelector('.title-visible');
}

export function getPageContentElement() {
    return document.getElementById('page-content');
}

/**
 * Update the loading bar and loading text
 * @param {number} progress - The percentage to display (0–100)
 */
export function updateLoadingBar(progress) {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    if (!loadingBar || !loadingText) return;

    loadingText.textContent = `${progress}%`;
    loadingBar.style.width = `${progress}%`;

    const container = loadingBar.parentElement;
    if (container) {
        container.setAttribute('aria-valuenow', progress);
    }
}

