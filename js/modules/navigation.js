// navigation.js
import { handlePageTransition } from './embers.js';
import { pageContent } from './content.js';
import { updateLoadingBar, getTitleElement } from './utils.js';
import { state, update } from './state.js';
import { get, getAll } from './dom.js';

// Module state
let currentPageContent = '';

// Page configuration - centralize all page-specific settings
const PAGES = {
    home: {
        url: './',
        hash: '',
        title: 'Home'
    },
    about: {
        url: '#about',
        hash: '#about',
        title: 'About'
    },
    games: {
        url: '#games',
        hash: '#games',
        title: 'Games'
    }
};

// Animation configuration
const ANIMATION = {
    duration: 300,
    fadeOutEasing: 'ease-out',
    fadeInEasing: 'ease-in'
};

/**
 * Initialize navigation
 */
export function init() {
    // Store original page content
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (pageContentEl) {
        pageContent.home = pageContentEl.innerHTML;
        currentPageContent = 'home';
    }
    
    // Set up navigation links for all pages
    setupAllNavLinks();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', handlePopState);
    
    // Check for hash on page load
    handleInitialHash();
}

/**
 * Set up all navigation links
 */
function setupAllNavLinks() {
    // Set up games links
    setupNavLinks('a[id^="games-link"]', 'games');
    
    // Set up about links
    setupNavLinks('a[href="#about"]', 'about');
    
    // Save original link texts for all links
    document.querySelectorAll('.nav-toggle-link, .nav-games-link').forEach(link => {
        if (!link.getAttribute('data-default-text')) {
            link.setAttribute('data-default-text', link.textContent);
        }
    });
}

/**
 * Handle initial URL hash on page load
 */
function handleInitialHash() {
    // Get page from hash
    const hash = window.location.hash;
    const page = Object.keys(PAGES).find(key => PAGES[key].hash === hash);
    
    if (page && page !== 'home') {
        history.replaceState({ page }, '', PAGES[page].hash);
        setTimeout(() => switchToPage(page), 100);
    } else {
        // Even if we're on home page, update the active state
        updateLinks('home');
    }
}

/**
 * Handle popstate events (browser back/forward)
 */
function handlePopState(e) {
    if (e.state && e.state.page) {
        switchToPage(e.state.page);
    } else {
        // Determine page from hash
        const hash = window.location.hash;
        const page = hash ? 
            Object.keys(PAGES).find(key => PAGES[key].hash === hash) || 'home' 
            : 'home';
        
        switchToPage(page);
    }
}

/**
 * Set up navigation links
 * @param {string} selector - CSS selector for links
 * @param {string} targetPage - Target page
 */
function setupNavLinks(selector, targetPage) {
    const links = document.querySelectorAll(selector);
    
    links.forEach(link => {
        if (!link) return;
        
        // Save default text
        if (!link.getAttribute('data-default-text')) {
            link.setAttribute('data-default-text', link.textContent);
        }
        
        link.addEventListener('click', e => {
            e.preventDefault();
            
            const currentPage = currentPageContent || getCurrentPageFromTitle();
            
            if (currentPage === targetPage) {
                // If already on target page, go to home
                navigateTo('home');
            } else {
                // Navigate to target page
                navigateTo(targetPage);
            }
        });
    });
}

/**
 * Navigate to a page
 * @param {string} page - Target page
 */
function navigateTo(page) {
    history.pushState({ page }, '', PAGES[page].url);
    switchToPage(page);
}

/**
 * Switch to any page
 * @param {string} targetPage - Target page
 */
function switchToPage(targetPage) {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (!pageContentEl || currentPageContent === targetPage) return;
    
    // Update application state
    update('currentPage', targetPage);
    
    // Fade out animation
    const fadeOut = pageContentEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: ANIMATION.duration, easing: ANIMATION.fadeOutEasing, fill: 'forwards' }
    );

    fadeOut.onfinish = () => {
        // Update content and state
        pageContentEl.innerHTML = pageContent[targetPage];
        currentPageContent = targetPage;
        
        // Additional page transitions
        handlePageTransition(targetPage);
        updateLinks(targetPage);
        scrollToTop();
        focusPageTitle();
        
        // Restore loading bar for home page
        if (state?.hasLoaded && targetPage === 'home') {
            updateLoadingBar(state.finalProgress);
        }

        // Fade in animation
        pageContentEl.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: ANIMATION.duration, easing: ANIMATION.fadeInEasing, fill: 'forwards' }
        );
    };
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Focus on page title for accessibility
 */
function focusPageTitle() {
    setTimeout(() => {
        const heading = getTitleElement();
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus();
            setTimeout(() => heading.removeAttribute('tabindex'), 1000);
        }
    }, 100);
}

/**
 * Update navigation link text and state
 * @param {string} currentPage - Current page
 */
function updateLinks(currentPage) {
    // Get link collections
    const gamesLinks = getAll('a[id^="games-link"]') || 
                      document.querySelectorAll('a[id^="games-link"]');
    
    const aboutLinks = getAll('.nav-toggle-link:not([id^="games-link"])') || 
                      document.querySelectorAll('.nav-toggle-link:not([id^="games-link"])');
    
    // Link update configuration for each page state
    const linkConfig = {
        home: {
            gamesLinks: { text: 'default', active: false },
            aboutLinks: { text: 'About', active: false }
        },
        about: {
            gamesLinks: { text: 'default', active: false },
            aboutLinks: { text: 'Back', active: true }
        },
        games: {
            gamesLinks: { text: 'Back', active: true },
            aboutLinks: { text: 'About', active: false }
        }
    };
    
    // Get config for current page
    const config = linkConfig[currentPage];
    
    // Update games links
    updateLinkGroup(gamesLinks, 
        config.gamesLinks.text === 'default' ? null : config.gamesLinks.text, 
        config.gamesLinks.active);
    
    // Update about links
    updateLinkGroup(aboutLinks, 
        config.aboutLinks.text, 
        config.aboutLinks.active);
}

/**
 * Update a group of links
 * @param {NodeList} links - Link elements
 * @param {string|null} text - New text (null for default)
 * @param {boolean} active - Whether links should be active
 */
function updateLinkGroup(links, text, active) {
    links.forEach(link => {
        if (!link) return;
        
        // Set text (use default or specified)
        link.textContent = text === null ? 
            (link.getAttribute('data-default-text') || 'Link') : 
            text;
        
        // Set active state
        if (active) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Legacy functions for backward compatibility
export function switchPage(toAbout) {
    switchToPage(toAbout ? 'about' : 'home');
}

// Helper to get current page from document title if needed
function getCurrentPageFromTitle() {
    const title = document.title.toLowerCase();
    if (title.includes('about')) return 'about';
    if (title.includes('games')) return 'games';
    return 'home';
}