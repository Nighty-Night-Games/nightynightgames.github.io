// utils.js
export function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function toggleClasses(element, classMap) {
    if (!element) return;
    Object.entries(classMap).forEach(([className, shouldHave]) => {
        element.classList.toggle(className, shouldHave);
    });
}

export function setAttributes(element, attrMap) {
    if (!element) return;
    Object.entries(attrMap).forEach(([attr, value]) => {
        element.setAttribute(attr, value);
    });
}

export function isInViewport(element, offset = 0) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + offset && rect.bottom > 0 - offset;
}

// Functions needed by other modules
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

export function getTitleElement() {
    return document.querySelector('.title-visible');
}

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

export function isTitleVisible() {
    const titleElement = document.querySelector('.title-visible');
    if (!titleElement) return false;

    const rect = titleElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    return rect.top < viewportHeight && rect.bottom > 0;
}

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