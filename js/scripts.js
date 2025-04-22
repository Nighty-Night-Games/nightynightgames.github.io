let hasLoaded = false;
const finalProgress = 5;
let emberSpawnLoopActive = false;
let activeEmbers = [];
let emberTransitionActive = false;

// Add or modify the DOMContentLoaded event listener at the beginning 
// of your script to include initialization of embers
document.addEventListener('DOMContentLoaded', () => {
    // Create a persistent ember container that stays across page changes
    const persistentEmberContainer = document.createElement('div');
    persistentEmberContainer.id = 'persistent-ember-container';
    persistentEmberContainer.setAttribute('aria-hidden', 'true');
    persistentEmberContainer.style.position = 'absolute';
    persistentEmberContainer.style.top = '0';
    persistentEmberContainer.style.left = '0';
    persistentEmberContainer.style.width = '100%';
    persistentEmberContainer.style.height = '100%';
    persistentEmberContainer.style.pointerEvents = 'none';
    persistentEmberContainer.style.zIndex = '10'; // Make sure it's above other content
    persistentEmberContainer.style.overflow = 'visible';
    document.body.appendChild(persistentEmberContainer);
    
    // Initialize embers on first load - wait a short delay to ensure DOM is ready
    setTimeout(() => {
        reinitEmbersAfterSwap();
    }, 50);
});

// Update the reinitEmbersAfterSwap function
function reinitEmbersAfterSwap() {
    const persistentEmberContainer = document.getElementById('persistent-ember-container');
    const title = document.querySelector('.title-ember-target');

    if (!persistentEmberContainer || !title) {
        console.log('Missing essential elements for ember effects:', 
                   { container: !!persistentEmberContainer, title: !!title });
        return;
    }

    // Get current active page info
    const titleVisible = document.querySelector('.title-visible');
    const currentPage = titleVisible && titleVisible.textContent.trim().toLowerCase().includes('about') 
                      ? 'about' : 'home';
    
    // Mark existing embers with their page source if they don't have one yet
    document.querySelectorAll('.ember:not([data-source])').forEach(ember => {
        ember.setAttribute('data-source', currentPage === 'about' ? 'home' : 'about');
    });

    // Get title position for positioning new embers
    const range = document.createRange();
    range.selectNodeContents(titleVisible);
    const titleRect = range.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    
    const isMobile = window.innerWidth < 768;
    const maxEmbers = isMobile ? 150 : 300;
    let emberCount = document.querySelectorAll('.ember').length;
    const riseHeightBase = 100;
    const riseHeightRange = 200;

    function animateEmber(ember, config) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = elapsed / config.duration;
            
            if (t > 1) {
                ember.remove();
                emberCount--;
                return;
            }
            
            const y = -(t ** 1.5) * config.riseHeight + Math.sin(t * 4 * Math.PI) * config.amplitude;
            const x = config.direction * Math.sin(t * Math.PI) * 120;
            
            // For embers from previous page, accelerate their fade-out
            if (ember.getAttribute('data-source') !== currentPage) {
                const fadeMultiplier = Math.max(0, 1 - t * 2); // Fade twice as fast
                ember.style.opacity = `${Math.min(1, t * 2) * (1 - t) * fadeMultiplier}`;
            } else {
                ember.style.opacity = `${Math.min(1, t * 2) * (1 - t)}`;
            }
            
            ember.style.transform = `translate(${x}px, ${y}px) scale(${1 - t * 0.5})`;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function spawnEmber() {
        if (emberCount >= maxEmbers) return;
        
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.setAttribute('role', 'presentation');
        ember.setAttribute('data-source', currentPage);

        // Position the ember at the current title position
        const left = titleRect.left + Math.random() * titleRect.width;
        const top = titleRect.top + Math.random() * 10;
        const size = (Math.random() * 15 + 3).toFixed(1);
        const emberDuration = 12000 + Math.random() * 6000;
        const amplitude = 15 + Math.random() * 10;
        const direction = Math.random() < 0.5 ? -1 : 1;
        const flickerSpeed = (0.6 + Math.random()).toFixed(2);
        const flickerDelay = (Math.random() * 3).toFixed(2);
        const riseHeight = riseHeightBase + Math.random() * riseHeightRange;

        Object.assign(ember.style, {
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`
        });

        persistentEmberContainer.appendChild(ember);
        emberCount++;
        
        animateEmber(ember, {
            duration: emberDuration,
            amplitude,
            direction,
            riseHeight
        });
    }

    function spawnLoop() {
        const spawn = () => {
            spawnEmber();
            setTimeout(spawnLoop, 150 + Math.random() * 200);
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(spawn);
        } else {
            setTimeout(spawn, 100);
        }
    }

    // Start spawning new embers
    spawnLoop();
}

function reinitEmbersAfterSwapOld() {
    const emberContainer = document.getElementById('ember-container');
    const title = document.querySelector('.title-ember-target');

    if (!emberContainer || !title) return;

    // Don't remove existing embers - they will naturally fade out
    // Instead, capture them for tracking
    if (!emberTransitionActive) {
        emberTransitionActive = true;
        // Mark existing embers as transitioning
        document.querySelectorAll('.ember').forEach(ember => {
            ember.classList.add('transitioning');
            // Speed up their fade-out (optional)
            const currentTransform = ember.style.transform;
            const currentOpacity = parseFloat(ember.style.opacity || '1');

            // Start a gradual fade-out animation
            let startTime = null;
            const fadeOutDuration = 3000; // 3 seconds to fade out

            function fadeStep(timestamp) {
                if (!startTime) startTime = timestamp;
                const elapsed = timestamp - startTime;
                const t = Math.min(1, elapsed / fadeOutDuration);

                ember.style.opacity = `${currentOpacity * (1 - t)}`;

                if (t < 1) {
                    requestAnimationFrame(fadeStep);
                } else {
                    ember.remove();
                }
            }

            requestAnimationFrame(fadeStep);
        });

        // Reset transition flag after fade-out period
        setTimeout(() => {
            emberTransitionActive = false;
        }, 3000);
    }

    const isMobile = window.innerWidth < 768;
    const maxEmbers = isMobile ? 200 : 400;
    let emberCount = 0;
    const riseHeightBase = 100;
    const riseHeightRange = 200;
    const titleRect = title.getBoundingClientRect();

    function animateEmber(ember, config) {
        let startTime = null;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = elapsed / config.duration;
            if (t > 1) {
                ember.remove();
                emberCount--;
                return;
            }
            const y = -(t ** 1.5) * config.riseHeight + Math.sin(t * 4 * Math.PI) * config.amplitude;
            const x = config.direction * Math.sin(t * Math.PI) * 120;
            ember.style.transform = `translate(${x}px, ${y}px) scale(${1 - t * 0.5})`;
            ember.style.opacity = `${Math.min(1, t * 2) * (1 - t)}`;
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function spawnEmber() {
        if (emberCount >= maxEmbers) return;
        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.setAttribute('role', 'presentation');

        const left = Math.random() * titleRect.width;
        const size = (Math.random() * 15 + 3).toFixed(1);
        const emberDuration = 12000 + Math.random() * 6000;
        const amplitude = 15 + Math.random() * 10;
        const direction = Math.random() < 0.5 ? -1 : 1;
        const flickerSpeed = (0.6 + Math.random()).toFixed(2);
        const flickerDelay = (Math.random() * 3).toFixed(2);
        const riseHeight = riseHeightBase + Math.random() * riseHeightRange;

        Object.assign(ember.style, {
            position: 'absolute',
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`
        });

        emberContainer.appendChild(ember);
        emberCount++;
        activeEmbers.push(ember);

        animateEmber(ember, {
            duration: emberDuration,
            amplitude,
            direction,
            riseHeight
        });
    }

    function spawnLoop() {
        const spawn = () => {
            spawnEmber();
            setTimeout(spawnLoop, 150 + Math.random() * 200);
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(spawn);
        } else {
            setTimeout(spawn, 100);
        }
    }

    spawnLoop();
}



window.addEventListener('load', () => {
    // === LOADING BAR ===
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    if (!hasLoaded) {
        let progress = 0;
        const loadingDuration = 1000;
        const stepTime = Math.floor(loadingDuration / finalProgress);

        const interval = setInterval(() => {
            progress++;
            loadingText.textContent = `${progress}%`;
            loadingBar.style.width = `${progress}%`;
            loadingBar.parentElement.setAttribute('aria-valuenow', progress);

            if (progress >= finalProgress) {
                clearInterval(interval);
                hasLoaded = true;
            }
        }, stepTime);
    } else {
        // If already loaded, restore visual state
        loadingText.textContent = `${finalProgress}%`;
        loadingBar.style.width = `${finalProgress}%`;
        loadingBar.parentElement.setAttribute('aria-valuenow', finalProgress);
    }
    
    function spawnEmber() {
        if (emberCount >= maxEmbers) return;

        const ember = document.createElement('div');
        ember.classList.add('ember');
        ember.setAttribute('role', 'presentation');

        const left = Math.random() * titleRect.width;
        const size = (Math.random() * 15 + 3).toFixed(1);
        const emberDuration = 12000 + Math.random() * 6000;
        const amplitude = 15 + Math.random() * 10;
        const direction = Math.random() < 0.5 ? -1 : 1;
        const flickerSpeed = (0.6 + Math.random()).toFixed(2);
        const flickerDelay = (Math.random() * 3).toFixed(2);
        const riseHeight = riseHeightBase + Math.random() * riseHeightRange;

        Object.assign(ember.style, {
            position: 'absolute',
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`
        });

        emberContainer.appendChild(ember);
        emberCount++;

        animateEmber(ember, {
            duration: emberDuration,
            amplitude,
            direction,
            riseHeight
        });
    }

    // === EMBER LOOP ===
    function spawnLoop() {
        const spawn = () => {
            spawnEmber();
            setTimeout(spawnLoop, 150 + Math.random() * 200);
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(spawn);
        } else {
            setTimeout(spawn, 100); // Fallback
        }
    }

    spawnLoop();
});

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    let isMenuOpen = false;

    function toggleMenu(force = null) {
        isMenuOpen = force !== null ? force : !isMenuOpen;

        // Toggle menu classes
        mobileMenu.classList.toggle('active', isMenuOpen);
        mobileMenu.setAttribute('aria-hidden', !isMenuOpen);

        // Update ARIA attributes
        toggle.setAttribute('aria-expanded', isMenuOpen);

        // Toggle hamburger active state
        toggle.classList.toggle('active', isMenuOpen);

        // Toggle body scroll
        document.body.classList.toggle('menu-open', isMenuOpen);
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    document.addEventListener('click', (e) => {
        if (
            isMenuOpen &&
            !mobileMenu.contains(e.target) &&
            !toggle.contains(e.target)
        ) {
            toggleMenu(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMenu(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && isMenuOpen) {
            toggleMenu(false);
        }
    });

    const menuLinks = document.querySelectorAll('.header-left a, .header-right a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                toggleMenu(false);
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const aboutLinks = document.querySelectorAll('a[href="#about"]');
    const pageContent = document.getElementById('page-content');
    const originalContent = pageContent.innerHTML;
    const aboutNavLinks = [document.getElementById('about-link'), document.getElementById('about-link-mobile')];

    const aboutContent = `
<div class="title-wrap about-title">
    <div class="ember-container" id="ember-container" aria-hidden="true"></div>
    <h1>
      <span class="title-ember-target">Nighty Night Games</span>
      <span class="title-visible">About NNG</span>
    </h1>
  </div>
  <div class="underline"></div>

  <section class="about-section">
    <p><strong>Nighty Night Games</strong> is a (currently) one-person indie studio from Berlin, Germany on a mission to craft unforgettable worlds, rich in story, emotion, and grit.</p>

    <p>Founded from a deep love of games that stay with you long after the credits roll, Nighty Night Games focuses on immersive storytelling, cinematic atmosphere, and meaningful choices that shape your journey.</p>

    <hr class="divider" />

    <h2>Currently in Development</h2>
    <h3>Legacy of Atum: Dead Dynasty</h3>

    <p><strong>Legacy of Atum</strong> is an atmospheric RPG set in a myth-infused version of ancient Egypt. It blends narrative depth, moral complexity, and strategic survival.</p>

    <p>You'll step into the shoes of <strong>Nui</strong>, a former slave turned reluctant hero, as he navigates a fractured world of forgotten gods, political intrigue, and personal vengeance. With real-time combat, deep strategic systems, and dynamic social interactions, the world of Atum responds to your choices—and remembers your actions.</p>

    <p>Nighty Night Games is currently deep in development, working toward a playable prototype and a cinematic trailer to bring the vision to life.</p>

    <hr class="divider" />

    <h2>Follow the Journey</h2>
    <p>Development updates, behind-the-scenes peeks, and dev logs are shared regularly on social media. Whether you're a player, fellow dev, or just curious, you're welcome to follow along.</p>

    <blockquote class="studio-tagline">Nighty Night Games — Sleep well, dream deep, play meaningfully.</blockquote>
  </section>
`;

    // Switch page function to handle content swapping
    function switchPage(toAbout) {
        // Update page content
        pageContent.innerHTML = toAbout ? aboutContent : originalContent;

        // Update navigation links
        aboutNavLinks.forEach(l => {
            l.textContent = toAbout ? 'Home' : 'About';
            l.classList.toggle('active', toAbout);
        });

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Restore loading bar if applicable
        if (hasLoaded && !toAbout) {
            const loadingBar = document.querySelector('.loading-bar');
            const loadingText = document.querySelector('.loading-text');
            if (loadingBar && loadingText) {
                loadingText.textContent = `${finalProgress}%`;
                loadingBar.style.width = `${finalProgress}%`;
                loadingBar.parentElement.setAttribute('aria-valuenow', finalProgress);
            }
        }

        // Reinitialize ember spawning with a slight delay
        // to ensure the DOM is ready
        setTimeout(() => {
            reinitEmbersAfterSwap();
        }, 50);
    }

    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const currentTitle = document.querySelector('.title-visible');
            const isCurrentlyAbout = currentTitle &&
                currentTitle.textContent.trim().toLowerCase().includes('about');

            switchPage(!isCurrentlyAbout);

            if (currentTitle && currentTitle.textContent.trim().toLowerCase().includes('about')) {
                // Go back to homepage
                // Don't remove embers - they will fade out naturally
                const existingEmberContainer = document.getElementById('ember-container');
                if (existingEmberContainer) {
                    // Preserve this container temporarily
                    existingEmberContainer.id = 'ember-container-old';
                }

                pageContent.innerHTML = originalContent;

                // If we had a preserved container, append it to the new content
                // before it gets its own ember container
                const oldContainer = document.getElementById('ember-container-old');
                if (oldContainer) {
                    const newContainer = document.getElementById('ember-container');
                    if (newContainer) {
                        // Move all embers to the new container
                        while (oldContainer.firstChild) {
                            newContainer.appendChild(oldContainer.firstChild);
                        }
                    }
                    oldContainer.remove();
                }

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        reinitEmbersAfterSwap();
                    });
                });

                // Restore loading bar if already loaded
                if (hasLoaded) {
                    const loadingBar = document.querySelector('.loading-bar');
                    const loadingText = document.querySelector('.loading-text');
                    if (loadingBar && loadingText) {
                        loadingText.textContent = `${finalProgress}%`;
                        loadingBar.style.width = `${finalProgress}%`;
                        loadingBar.parentElement.setAttribute('aria-valuenow', finalProgress);
                    }
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Set nav link text back to "About"
                aboutNavLinks.forEach(l => {
                    l.textContent = 'About';
                    l.classList.remove('active');
                });
                return;
            }

            // Show About section
            // Save current ember container
            const existingEmberContainer = document.getElementById('ember-container');
            if (existingEmberContainer) {
                // Preserve this container temporarily
                existingEmberContainer.id = 'ember-container-old';
            }

            pageContent.innerHTML = aboutContent;

            // Move existing embers to the new container
            const oldContainer = document.getElementById('ember-container-old');
            if (oldContainer) {
                const newContainer = document.getElementById('ember-container');
                if (newContainer) {
                    // Move all embers to the new container
                    while (oldContainer.firstChild) {
                        newContainer.appendChild(oldContainer.firstChild);
                    }
                }
                oldContainer.remove();
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Wait one animation frame so DOM is ready
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    reinitEmbersAfterSwap();
                });
            });

            // Set nav link text to "Home"
            aboutNavLinks.forEach(l => {
                l.textContent = 'Home';
                l.classList.add('active');
            });
        });
    });

    // Add debouncing for resize events
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    window.addEventListener('resize', debounce(function() {
        // Your resize handler code
    }, 250));
    
    // Clean up unused embers
    function cleanupEmbers() {
        document.querySelectorAll('.ember').forEach(ember => {
            // Remove embers that are out of viewport or too transparent
            if (ember.getBoundingClientRect().top < -100 ||
                parseFloat(getComputedStyle(ember).opacity) < 0.1) {
                ember.remove();
                emberCount--;
            }
        });
    }
});