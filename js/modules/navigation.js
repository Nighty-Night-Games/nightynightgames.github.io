// navigation.js
import { handlePageTransition } from './embers.js';
import { pageContent } from './content.js';
import { updateLoadingBar, getTitleElement } from './utils.js';
import { state, update } from './state.js';
import { get, getAll } from './dom.js';

// Module state
let currentPageContent = '';

/**
 * Set up games link click handlers
 */
function setupGamesLinks() {
    // Get all games links by ID prefix
    const gamesLinks = getAll('a[id^="games-link"]') || 
                      document.querySelectorAll('a[id^="games-link"]');
    
    console.log('Games links found:', gamesLinks.length);
    
    // Add click handler to each link
    gamesLinks.forEach(link => {
        // Save default text for later reference
        if (!link.getAttribute('data-default-text')) {
            link.setAttribute('data-default-text', link.textContent);
        }
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Games link clicked');
            
            // Get current page from content or title
            const currentPage = currentPageContent || getCurrentPageFromTitle();
            
            if (currentPage === 'games') {
                // If already on games page, go back to home
                history.pushState({ page: 'home' }, '', './');
                switchToHome();
            } else {
                // If on home or about, go to games
                history.pushState({ page: 'games' }, '', '#games');
                switchToGames();
            }
        });
    });
}

/**
 * Switch to games page
 */
function switchToGames() {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (!pageContentEl) return;

    // Create fade effect
    const fadeOut = pageContentEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );

    fadeOut.onfinish = () => {
        // Update page content
        pageContentEl.innerHTML = pageContent.games;
        currentPageContent = 'games';

        // Handle ember transition
        handlePageTransition('games');

        // Update navigation links - first, update Games links to Home
        const gamesLinks = getAll('a[id^="games-link"]') || 
                          document.querySelectorAll('a[id^="games-link"]');
        
        gamesLinks.forEach(l => {
            if (l) {
                l.textContent = 'Home';
                l.classList.add('active');
            }
        });
        
        // Make sure About links show About (not Home)
        const aboutLinks = getAll('.nav-toggle-link:not([id^="games-link"])') || 
                          document.querySelectorAll('.nav-toggle-link:not([id^="games-link"])');
        
        aboutLinks.forEach(l => {
            if (l) {
                l.textContent = 'About';
                l.classList.remove('active');
            }
        });

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Accessibility: focus new title
        setTimeout(() => {
            const heading = getTitleElement();
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
                setTimeout(() => heading.removeAttribute('tabindex'), 1000);
            }
        }, 100);

        // Fade in effect
        pageContentEl.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: 'ease-in', fill: 'forwards' }
        );
    };
}

/**
 * Switch from games back to home page
 */
function switchToHome() {
    const pageContentEl = get('pageContent') || document.getElementById('page-content');
    if (!pageContentEl) return;
    
    // Create fade effect
    const fadeOut = pageContentEl.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 300, easing: 'ease-out', fill: 'forwards' }
    );

    fadeOut.onfinish = () => {
        // Update page content
        pageContentEl.innerHTML = pageContent.home;
        currentPageContent = 'home';

        // Handle ember transition
        handlePageTransition('home');

        // Reset all navigation links to their default state
        resetNavigationLinks();

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Accessibility focus management
        setTimeout(() => {
            const heading = getTitleElement();
            if (heading) {
                heading.setAttribute('tabindex', '-1');
                heading.focus();
                setTimeout(() => heading.removeAttribute('tabindex'), 1000);
            }
        }, 100);

        // Restore loading bar if applicable
        if (state && state.hasLoaded) {
            updateLoadingBar(state.finalProgress);
        }

        // Fade in effect
        pageContentEl.animate(
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: 300, easing: 'ease-in', fill: 'forwards' }
        );
    };
}

/**
 * Reset all navigation links to their default state
 */
function resetNavigationLinks() {
    // Reset games links
    const gamesLinks = getAll('a[id^="games-link"]') || 
                      document.querySelectorAll('a[id^="games-link"]');
    
    gamesLinks.forEach(l => {
        if (l) {
            l.textContent = l.getAttribute('data-default-text') || 'Games';
            l.classList.remove('active');
        }
    });
    
    // Reset about links
    const aboutLinks = getAll('.nav-toggle-link:not([id^="games-link"])') || 
                      document.querySelectorAll('.nav-toggle-link:not([id^="games-link"])');
    
    aboutLinks.forEach(l => {
        if (l) {
            l.textContent = 'About';
            l.classList.remove('active');
        }
    });
}

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
    
    // Set up games link click handlers
    setupGamesLinks();
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', (e) => {
        const currentPage = currentPageContent || getCurrentPageFromTitle();
        
        if (e.state && e.state.page) {
            if (e.state.page === 'about') {
                switchPage(true);
            } else if (e.state.page === 'games') {
                switchToGames();
            } else if (e.state.page === 'home') {
                if (currentPage === 'about') {
                    switchPage(false);
                } else if (currentPage === 'games') {
                    switchToHome();
                }
            }
        } else if (window.location.hash === '#about') {
            switchPage(true);
        } else if (window.location.hash === '#games') {
            switchToGames();
        } else {
            // Assume home page when no hash or state
            if (currentPage === 'about') {
                switchPage(false);
            } else if (currentPage === 'games') {
                switchToHome();
            }
        }
    });

    // Check for hash on page load
    if (window.location.hash === '#about') {
        history.replaceState({ page: 'about' }, '', '#about');
        setTimeout(() => {
            switchPage(true);
        }, 100);
    } else if (window.location.hash === '#games') {
        history.replaceState({ page: 'games' }, '', '#games');
        setTimeout(() => {
            switchToGames();
        }, 100);
    }
}

/**
 * Set up click handlers for about/home links
 */
function setupAboutLinks() {
    const aboutLinks = document.querySelectorAll('a[href="#about"]');
    aboutLinks.forEach(link => {
        if (!link) return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get current page from content or title
            const currentPage = currentPageContent || getCurrentPageFromTitle();
            
            if (currentPage === 'about') {
                // If already on about page, go back to home
                history.pushState({ page: 'home' }, '', './');
                switchPage(false);
            } else {
                // If on home or games, go to about
                history.pushState({ page: 'about' }, '', '#about');
                switchPage(true);
                
                // If coming from games page, reset game links
                if (currentPage === 'games') {
                    const gamesLinks = getAll('a[id^="games-link"]') || 
                                    document.querySelectorAll('a[id^="games-link"]');
                    
                    gamesLinks.forEach(l => {
                        if (l) {
                            l.textContent = l.getAttribute('data-default-text') || 'Games';
                            l.classList.remove('active');
                        }
                    });
                }
            }
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
            if (l && !l.id.startsWith('games-link')) {
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