// js/modules/navigation.js

import { handlePageTransition } from './embers.js';
import { pageContent } from './content.js';

// Global variables for page state
let currentPageContent = '';

/**
 * Set up page navigation and history handling
 */
export function setupPageNavigation() {
    // Store original page content
    const pageContentEl = document.getElementById('page-content');
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
}

/**
 * Set up about link click handlers
 */
function setupAboutLinks() {
    // Get all navigation toggle links
    const aboutLinks = document.querySelectorAll('.nav-toggle-link');
    
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
function switchPage(toAbout) {
    const pageContentEl = document.getElementById('page-content');
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
        const aboutNavLinks = document.querySelectorAll('.nav-toggle-link');
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
            const heading = document.querySelector('.title-visible');
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
                // Remove tabindex after focus
                setTimeout(() => heading.removeAttribute('tabindex'), 1000);
            }
        }, 100);

        // Restore loading bar if applicable - FIX: Use window. prefix for global variables
        if (window.hasLoaded && !toAbout) {
            const loadingBar = document.querySelector('.loading-bar');
            const loadingText = document.querySelector('.loading-text');
            if (loadingBar && loadingText) {
                loadingText.textContent = `${window.finalProgress}%`;
                loadingBar.style.width = `${window.finalProgress}%`;
                
                const container = loadingBar.parentElement;
                if (container) {
                    container.setAttribute('aria-valuenow', window.finalProgress);
                }
            }
        }

        // Fade in effect
        pageContentEl.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: 'ease-in', fill: 'forwards' }
        );
    };
}

// Expose switchPage for use in other modules if needed
export { switchPage };