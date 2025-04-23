// utils.js

// DOM helper functions
export const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const toggleClasses = (element, classMap) => {
    if (!element) return;
    for (const [className, shouldHave] of Object.entries(classMap)) {
        element.classList.toggle(className, shouldHave);
    }
};

export const setAttributes = (element, attrMap) => {
    if (!element) return;
    for (const [attr, value] of Object.entries(attrMap)) {
        element.setAttribute(attr, value);
    }
};

export const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + offset && rect.bottom > -offset;
};

// Title and page-related utilities
export const getTitleElement = () => document.querySelector('.title-visible');

export const updateTitleRect = () => {
    const el = getTitleElement();
    if (el) {
        window.currentTitleRect = el.getBoundingClientRect();
        return true;
    }
    return false;
};

export const getCurrentPageFromTitle = () => {
    const el = getTitleElement();
    return el?.textContent.trim().toLowerCase().includes('about') ? 'about' : 'home';
};

export const isTitleVisible = () => {
    const titleElement = getTitleElement();
    if (!titleElement) return false;
    
    const rect = titleElement.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
};

// Ember-related utilities
export const countEmbersByPage = page => {
    if (!window.activeEmbers?.length) return 0;
    
    let count = 0;
    for (const ember of window.activeEmbers) {
        if (ember.getAttribute('data-page') === page) count++;
    }
    return count;
};

// Loading bar utility
export const updateLoadingBar = progress => {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    if (!loadingBar || !loadingText) return;

    // Update text and bar width
    loadingText.textContent = `${progress}%`;
    loadingBar.style.width = `${progress}%`;
    
    // Update ARIA attribute
    loadingBar.parentElement?.setAttribute('aria-valuenow', progress);
};