window.addEventListener('load', () => {
    // === LOADING BAR ===
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    let progress = 0;
    const maxProgress = 5;
    const loadingDuration = 1000;
    const stepTime = Math.floor(loadingDuration / maxProgress);

    const interval = setInterval(() => {
        progress++;
        loadingText.textContent = `${progress}%`;
        loadingBar.style.width = `${progress}%`;

        // Update ARIA for screen readers
        loadingBar.parentElement.setAttribute('aria-valuenow', progress);

        if (progress >= maxProgress) clearInterval(interval);
    }, stepTime);

    // === EMBERS ===
    const emberContainer = document.getElementById('ember-container');
    const title = document.querySelector('.title-wrap h1');
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
