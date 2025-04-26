// navigation.js
import { handlePageTransition } from './embers.js';
import { pageContent } from './content.js';
import { updateLoadingBar, getTitleElement } from './utils.js';
import { state, update } from './state.js';
import { get, getAll } from './dom.js';
import { init as initLoadingBar, removeLoadingBar } from './loadingbar.js';

// Module state
let currentPageContent = '';

// Centralized page configuration
const PAGES = {
    home: { url: './', hash: '', title: 'Home' },
    about: { url: '#about', hash: '#about', title: 'About' },
    games: { url: '#games', hash: '#games', title: 'Games' },
};

// Animation configuration
const ANIMATION = {
    duration: 300,
    fadeOutEasing: 'ease-out',
    fadeInEasing: 'ease-in',
};

/**
 * Initialize navigation functionality.
 */
export function init() {
    initPageContent();
    setupNavigationLinks();
    window.addEventListener('popstate', handlePopState);
    processInitialHash();
}

/**
 * Initialize and store the initial page content.
 */
function initPageContent() {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (pageContentEl) {
        pageContent.home = pageContentEl.innerHTML;
        currentPageContent = 'home';
    }
}

/**
 * Set up navigation links for all pages.
 */
function setupNavigationLinks() {
    setupNavLinks('a[id^="games-link"]', 'games');
    setupNavLinks('a[href="#about"]', 'about');

    document.querySelectorAll('.nav-toggle-link, .nav-games-link').forEach(link => {
        if (!link.hasAttribute('data-default-text')) {
            link.setAttribute('data-default-text', link.textContent);
        }
    });
}

/**
 * Handle the initial URL hash when the page loads.
 */
function processInitialHash() {
    const hash = window.location.hash;
    const targetPage = Object.keys(PAGES).find(page => PAGES[page].hash === hash) || 'home';
    if (targetPage !== 'home') {
        history.replaceState({ page: targetPage }, '', PAGES[targetPage].hash);
        setTimeout(() => switchToPage(targetPage), 100);
    } else {
        updateLinkStates('home');
    }
}

/**
 * Handle browser back/forward navigation events.
 */
function handlePopState(event) {
    const page = event.state?.page || getPageFromHash();
    switchToPage(page);
}

/**
 * Retrieve the target page from the current URL hash.
 * @returns {string} Page name.
 */
function getPageFromHash() {
    const hash = window.location.hash;
    return Object.keys(PAGES).find(page => PAGES[page].hash === hash) || 'home';
}

/**
 * Set up navigation links for a specific page.
 * @param {string} selector - CSS selector for links.
 * @param {string} targetPage - Target page name.
 */
function setupNavLinks(selector, targetPage) {
    document.querySelectorAll(selector).forEach(link => {
        link.setAttribute('data-default-text', link.getAttribute('data-default-text') || link.textContent);
        link.addEventListener('click', event => {
            event.preventDefault();
            navigateTo(targetPage === currentPageContent ? 'home' : targetPage);
        });
    });
}

/**
 * Navigate to a specific page.
 * @param {string} page - Page name.
 */
function navigateTo(page) {
    history.pushState({ page }, '', PAGES[page].url);
    switchToPage(page);
}

/**
 * Switch to the specified page.
 * @param {string} targetPage - Page name.
 */
function switchToPage(targetPage) {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (!pageContentEl || currentPageContent === targetPage) return;

    update('currentPage', targetPage);

    const fadeOut = pageContentEl.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: ANIMATION.duration,
        easing: ANIMATION.fadeOutEasing,
        fill: 'forwards',
    });

    fadeOut.onfinish = () => {
        loadNewPageContent(pageContentEl, targetPage);
        pageContentEl.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: ANIMATION.duration,
            easing: ANIMATION.fadeInEasing,
            fill: 'forwards',
        });
    };
}

/**
 * Load new content into the page.
 * @param {HTMLElement} container - The container for page content.
 * @param {string} targetPage - The target page name.
 */
function loadNewPageContent(container, targetPage) {
    container.innerHTML = pageContent[targetPage];
    currentPageContent = targetPage;

    targetPage === 'games' ? initLoadingBar() : removeLoadingBar();
    handlePageTransition(targetPage);
    updateLinkStates(targetPage);
    scrollToTop();
    focusOnPageTitle();
}

/**
 * Scroll to the top of the page.
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Focus on the page title for accessibility purposes.
 */
function focusOnPageTitle() {
    setTimeout(() => {
        const title = getTitleElement();
        if (title) {
            title.setAttribute('tabindex', '-1');
            title.focus();
            setTimeout(() => title.removeAttribute('tabindex'), 1000);
        }
    }, 100);
}

/**
 * Update the states and text of navigation links.
 * @param {string} currentPage - The current page name.
 */
function updateLinkStates(currentPage) {
    const config = {
        home: { games: { text: null, active: false }, about: { text: 'About', active: false } },
        games: { games: { text: 'Home', active: true }, about: { text: 'About', active: false } },
        about: { games: { text: null, active: false }, about: { text: 'Home', active: true } },
    };

    applyLinkUpdates('a[id^="games-link"]', config[currentPage].games);
    applyLinkUpdates('.nav-toggle-link:not([id^="games-link"])', config[currentPage].about);
}

/**
 * Apply updates to a collection of links.
 * @param {string} selector - CSS selector for the links.
 * @param {Object} config - Configuration for text and active state.
 */
function applyLinkUpdates(selector, config) {
    document.querySelectorAll(selector).forEach(link => {
        if (config.text !== null) {
            link.textContent = config.text;
        } else {
            link.textContent = link.getAttribute('data-default-text') || 'Link';
        }
        link.classList.toggle('active', config.active);
    });
}