// dom.js
const elements = {};

/**
 * Initialize module and cache common elements
 */
export function init() {
    cacheElements({
        title: '.title-visible',
        mobileMenu: '#mobile-menu',
        menuToggle: '.menu-toggle',
        loadingBar: '.loading-bar',
        loadingText: '.loading-text',
        pageContent: '#page-content',
    });
}

/**
 * Cache DOM elements by selector
 */
function cacheElements(selectors) {
    for (const [key, selector] of Object.entries(selectors)) {
        if (typeof selector === 'string') {
            elements[key] = selector.startsWith('#') ? 
                document.getElementById(selector.substring(1)) : 
                document.querySelector(selector);
        }
    }
}

/**
 * Get cached element by key
 */
export const get = key => elements[key];

/**
 * Get all elements matching selector
 */
export const getAll = selector => [...document.querySelectorAll(selector)];

/**
 * Refresh specific cached elements
 */
export function refresh(keys) {
    if (!keys || !keys.length) return;
    
    // Either refresh specific keys or all elements
    const toRefresh = Array.isArray(keys) ? keys : Object.keys(elements);
    
    // Rebuild cache for specified keys
    const refreshSelectors = {};
    for (const key of toRefresh) {
        // Only include keys that have a string selector cached
        const selector = elements[key]?.dataset?.selector || key;
        if (selector) refreshSelectors[key] = selector;
    }
    
    // Recache elements
    cacheElements(refreshSelectors);
}