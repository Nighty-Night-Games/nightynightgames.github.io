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