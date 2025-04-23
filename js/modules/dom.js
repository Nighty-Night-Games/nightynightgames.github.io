// dom.js
const elements = {};

export function init() {
    cacheElements({
        title: '.title-visible',
        mobileMenu: '#mobile-menu',
        menuToggle: '.menu-toggle',
        loadingBar: '.loading-bar',
        loadingText: '.loading-text',
        pageContent: '#page-content',
        // Add other common elements
    });
}

function cacheElements(selectors) {
    Object.entries(selectors).forEach(([key, selector]) => {
        if (typeof selector === 'string') {
            elements[key] = selector.startsWith('#')
                ? document.getElementById(selector.substring(1))
                : document.querySelector(selector);
        }
    });
}

export function get(key) {
    return elements[key];
}

export function getAll(selector) {
    return [...document.querySelectorAll(selector)];
}

// Re-cache specific elements (useful after page transitions)
export function refresh(keys) {
    // Implementation
}