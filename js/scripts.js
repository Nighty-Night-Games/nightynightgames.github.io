window.addEventListener('load', function () {
    document.querySelector('.loading-bar').style.width = '5%';
    document.querySelector('.loading-text').textContent = '5%';
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');

    let progress = 0;
    const target = 5;
    const duration = 1000; // 1 second total
    const stepTime = Math.floor(duration / target); // 200ms per step

    loadingBar.style.width = target + '%';
    loadingText.textContent = '0%'; // reset here just in case

    const interval = setInterval(() => {
        progress++;
        loadingText.textContent = progress + '%';

        if (progress >= target) {
            clearInterval(interval);
        }
    }, stepTime);
});