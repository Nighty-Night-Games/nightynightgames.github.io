window.addEventListener('load', () => {
    // === LOADING BAR ===
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    let progress = 0;
    const target = 5;
    const duration = 1000;
    const stepTime = Math.floor(duration / target);

    const interval = setInterval(() => {
        progress++;
        loadingText.textContent = `${progress}%`;
        loadingBar.style.width = `${progress}%`;

        if (progress >= target) clearInterval(interval);
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

    function spawnEmber() {
        if (emberCount >= maxEmbers) return;

        const ember = document.createElement('div');
        ember.classList.add('ember');

        const titleRect = title.getBoundingClientRect();
        const left = Math.random() * titleRect.width;
        const size = (Math.random() * 15 + 3).toFixed(1);
        const duration = 12000 + Math.random() * 6000;
        const amplitude = 15 + Math.random() * 10;
        const direction = Math.random() < 0.5 ? -1 : 1;
        const flickerSpeed = (0.6 + Math.random()).toFixed(2);
        const flickerDelay = (Math.random() * 3).toFixed(2);

        Object.assign(ember.style, {
            position: 'absolute',
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`
        });

        emberContainer.appendChild(ember);
        emberCount++;

        let startTime = null;
        const riseHeight = riseHeightBase + Math.random() * riseHeightRange;

        function animateEmber(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const t = elapsed / duration;

            if (t > 1) {
                ember.remove();
                emberCount--;
                return;
            }

            const y = -(t ** 1.5) * riseHeight + Math.sin(t * 4 * Math.PI) * amplitude;
            const x = direction * Math.sin(t * Math.PI) * 120;
            ember.style.transform = `translate(${x}px, ${y}px) scale(${1 - t * 0.5})`;
            ember.style.opacity = `${Math.min(1, t * 2) * (1 - t)}`;

            requestAnimationFrame(animateEmber);
        }

        requestAnimationFrame(animateEmber);
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
    const nav = document.querySelector('.header-right');

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active'); // Changed from 'show' to 'active'
        toggle.setAttribute('aria-expanded', nav.classList.contains('active')); // Add accessibility
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

