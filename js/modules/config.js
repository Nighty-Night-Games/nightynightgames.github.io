// Detect device capabilities
export const DEVICE = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isSmallScreen: window.matchMedia('(max-width: 768px)').matches,
    lowPower: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    hasGPU: !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) &&
        !window.matchMedia('(min-resolution: 2dppx)').matches),
    supportsTouch: 'ontouchstart' in window
};

// Configure ember system based on device capability
export const EMBER_CONFIG = {
    MAX_EMBERS: DEVICE.lowPower ? 60 : (DEVICE.isSmallScreen ? 100 : 200),
    HOME_MAX_EMBERS: DEVICE.lowPower ? 40 : (DEVICE.isSmallScreen ? 80 : 150),
    ABOUT_MAX_EMBERS: DEVICE.lowPower ? 25 : (DEVICE.isSmallScreen ? 60 : 100),
    SPAWN_RATE: DEVICE.lowPower ? 500 : (DEVICE.isSmallScreen ? 300 : 200),
    CLEANUP_INTERVAL: 8000,
    USE_GPU: DEVICE.hasGPU,
    SIZE_BASE: DEVICE.isSmallScreen ? 2 : 3,
    SIZE_VARIANCE: DEVICE.isSmallScreen ? 8 : 15
};

// Function to update configuration on resize
export function updateConfig() {
    DEVICE.isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

    // Update ember config based on new device state
    EMBER_CONFIG.MAX_EMBERS = DEVICE.lowPower ? 60 : (DEVICE.isSmallScreen ? 100 : 200);
    EMBER_CONFIG.HOME_MAX_EMBERS = DEVICE.lowPower ? 40 : (DEVICE.isSmallScreen ? 80 : 150);
    EMBER_CONFIG.ABOUT_MAX_EMBERS = DEVICE.lowPower ? 25 : (DEVICE.isSmallScreen ? 60 : 100);
    EMBER_CONFIG.SPAWN_RATE = DEVICE.lowPower ? 500 : (DEVICE.isSmallScreen ? 300 : 200);
    EMBER_CONFIG.SIZE_BASE = DEVICE.isSmallScreen ? 2 : 3;
    EMBER_CONFIG.SIZE_VARIANCE = DEVICE.isSmallScreen ? 8 : 15;
}