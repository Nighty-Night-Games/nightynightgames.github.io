// navigation.js
import { handlePageTransition } from './embers.js';
import { pageContent } from './content.js';
import { updateLoadingBar, getTitleElement } from './utils.js';
import { state, update } from './state.js';
import { get, getAll } from './dom.js';

// Module state
let currentPageContent = '';

/**
 * Initialize navigation
 */
export function init() {
    // Store original page content
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (pageContentEl) {
        // Save the initial home content
        pageContent.home = pageContentEl.innerHTML;
        currentPageContent = 'home';
    }
    
    // Set up about link click handlers
    setupAboutLinks();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.page) {
            switchPage(e.state.page === 'about');
        }
    });

    // Check for hash on page load
    if (window.location.hash === '#about') {
        history.replaceState({ page: 'about' }, '', '#about');
        setTimeout(() => {
            const aboutLink = document.querySelector('.nav-toggle-link');
            if (aboutLink) {
                switchPage(true);
            }
        }, 100);
    }
}

/**
 * Set up about link click handlers
 */
function setupAboutLinks() {
    // Get all navigation toggle links
    const aboutLinks = getAll('.nav-toggle-link') || document.querySelectorAll('.nav-toggle-link');
    
    // Add click handler to each link
    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Determine if we're navigating to about page
            const isCurrentlyHome = currentPageContent === 'home';
            const goingToAbout = isCurrentlyHome;
            
            // Update page URL
            const newUrl = goingToAbout ? '#about' : './';
            history.pushState({ page: goingToAbout ? 'about' : 'home' }, '', newUrl);
            
            // Switch the page content
            switchPage(goingToAbout);
        });
    });
}

/**
 * Switch between home and about pages
 * @param {boolean} toAbout - Whether switching to about page
 */
export function switchPage(toAbout) {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (!pageContentEl) return;
    
    // Create fade effect
    const fadeOut = pageContentEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );

    fadeOut.onfinish = () => {
        // Update page content
        pageContentEl.innerHTML = toAbout ? pageContent.about : pageContent.home;
        currentPageContent = toAbout ? 'about' : 'home';

        // Handle ember transition
        handlePageTransition(toAbout ? 'about' : 'home');

        // Update navigation links
        const aboutNavLinks = getAll('.nav-toggle-link') || document.querySelectorAll('.nav-toggle-link');
        aboutNavLinks.forEach(l => {
            if (l) {
                l.textContent = toAbout ? 'Home' : 'About';
                l.classList.toggle('active', toAbout);
            }
        });

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Accessibility focus management
        setTimeout(() => {
            const heading = getTitleElement();
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
                // Remove tabindex after focus
                setTimeout(() => heading.removeAttribute('tabindex'), 1000);
            }
        }, 100);

        // Restore loading bar if applicable
        if (state.hasLoaded && !toAbout) {
            updateLoadingBar(state.finalProgress);
        }

        // Fade in effect
        pageContentEl.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: 'ease-in', fill: 'forwards' }
        );
    };
}