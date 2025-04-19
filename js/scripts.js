window.addEventListener('load', function () {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    let progress = 0;
    const target = 5;
    const duration = 1000; // Total time to fill
    const stepTime = Math.floor(duration / target); // Time per 1% step

    const interval = setInterval(() => {
        progress++;
        loadingText.textContent = progress + '%';
        loadingBar.style.width = progress + '%';

        if (progress >= target) {
            clearInterval(interval);
        }
    }, stepTime);
});

window.addEventListener('load', () => {
    const emberContainer = document.getElementById('ember-container');
    const title = document.querySelector('.title-wrap h1');

    const maxEmbers = 600;
    let emberCount = 0;

    const riseHeight = 100 + Math.random() * 200; // 100–200px

    const spawnEmber = () => {
        if (emberCount >= maxEmbers) return;

        const ember = document.createElement('div');
        ember.classList.add('ember');

        const titleRect = title.getBoundingClientRect();
        
        const left = Math.random() * titleRect.width;
        const size = (Math.random() * 20 + 4).toFixed(1); // 2.0–6.0 (as string)
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;

        const duration = 12000 + Math.random() * 6000;
        const amplitude = 15 + Math.random() * 12;
        const direction = Math.random() < 0.5 ? -1 : 1;

        ember.style.position = 'absolute';
        ember.style.left = `${left}px`;
        ember.style.width = `${size}px`;
        ember.style.height = `${size}px`;

        const flickerSpeed = 0.6 + Math.random() * 1.0; // seconds
        const flickerDelay = Math.random() * 3;         // delay start

        ember.style.animation = `ember-flicker ${flickerSpeed}s ${flickerDelay}s infinite ease-in-out`;


        emberContainer.appendChild(ember);
        emberCount++;

        let startTime = null;

        const animateEmber = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const t = progress / duration;

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
        };

        requestAnimationFrame(animateEmber);
    };

    // Spawn embers at random intervals
    setInterval(() => {
        spawnEmber();
    }, 150 + Math.random() * 200);
});



