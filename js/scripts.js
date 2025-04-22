let hasLoaded = false;
const finalProgress = 5;
let emberSpawnLoopActive = false;


// PREPEND THESE TO EXISTING SCRIPT FILE (you already have the rest below)
function reinitEmbersAfterSwap() {
    const emberContainer = document.getElementById('ember-container');
    const title = document.querySelector('.title-ember-target');

    // Remove old embers to avoid overlap/flicker
    document.querySelectorAll('.ember').forEach(e => e.remove());

    if (!emberContainer || !title) return;

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

    // === EMBERS ===
    const emberContainer = document.getElementById('ember-container');
    const title = document.querySelector('.title-ember-target');
    if (!emberContainer || !title) return;

    const isMobile = window.innerWidth < 768;
    const maxEmbers = isMobile ? 200 : 400;
    let emberCount = 0;

    const riseHeightBase = 100;
    const riseHeightRange = 200;
    const titleRect = title.getBoundingClientRect(); // Cache once

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

    <p>You’ll step into the shoes of <strong>Nui</strong>, a former slave turned reluctant hero, as he navigates a fractured world of forgotten gods, political intrigue, and personal vengeance. With real-time combat, deep strategic systems, and dynamic social interactions, the world of Atum responds to your choices—and remembers your actions.</p>

    <p>Nighty Night Games is currently deep in development, working toward a playable prototype and a cinematic trailer to bring the vision to life.</p>

    <hr class="divider" />

    <h2>Follow the Journey</h2>
    <p>Development updates, behind-the-scenes peeks, and dev logs are shared regularly on social media. Whether you're a player, fellow dev, or just curious, you're welcome to follow along.</p>

    <blockquote class="studio-tagline">Nighty Night Games — Sleep well, dream deep, play meaningfully.</blockquote>
  </section>
`;


    aboutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const currentTitle = document.querySelector('.title-visible');

            if (currentTitle && currentTitle.textContent.trim().toLowerCase().includes('about')) {
                // Go back to homepage
                document.querySelectorAll('.ember').forEach(e => e.remove());
                pageContent.innerHTML = originalContent;
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
            pageContent.innerHTML = aboutContent;
            document.querySelectorAll('.ember').forEach(e => e.remove());
            pageContent.innerHTML = aboutContent;
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
});

