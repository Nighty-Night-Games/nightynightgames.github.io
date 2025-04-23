// config.js

// Device capability detection patterns
const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
const SMALL_SCREEN_QUERY = '(max-width: 768px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const HIGH_DPI_QUERY = '(min-resolution: 2dppx)';

// Detect device capabilities
export const DEVICE = {
    isMobile: MOBILE_REGEX.test(navigator.userAgent),
    isSmallScreen: window.matchMedia(SMALL_SCREEN_QUERY).matches,
    lowPower: MOBILE_REGEX.test(navigator.userAgent) || 
              window.matchMedia(REDUCED_MOTION_QUERY).matches,
    hasGPU: !(MOBILE_REGEX.test(navigator.userAgent) && 
             !window.matchMedia(HIGH_DPI_QUERY).matches),
    supportsTouch: 'ontouchstart' in window
};

// Config builder function to avoid repetition
const getEmberConfig = () => ({
    MAX_EMBERS: DEVICE.lowPower ? 60 : (DEVICE.isSmallScreen ? 100 : 200),
    HOME_MAX_EMBERS: DEVICE.lowPower ? 40 : (DEVICE.isSmallScreen ? 80 : 150),
    ABOUT_MAX_EMBERS: DEVICE.lowPower ? 25 : (DEVICE.isSmallScreen ? 60 : 100),
    SPAWN_RATE: DEVICE.lowPower ? 500 : (DEVICE.isSmallScreen ? 300 : 200),
    CLEANUP_INTERVAL: 8000,
    USE_GPU: DEVICE.hasGPU,
    SIZE_BASE: DEVICE.isSmallScreen ? 2 : 3,
    SIZE_VARIANCE: DEVICE.isSmallScreen ? 8 : 15
});

// Configure ember system based on device capability
export const EMBER_CONFIG = getEmberConfig();

// Function to update configuration on resize
export function updateConfig() {
    // Update device detection
    DEVICE.isSmallScreen = window.matchMedia(SMALL_SCREEN_QUERY).matches;
    
    // Update ember config based on new device state
    const newConfig = getEmberConfig();
    Object.assign(EMBER_CONFIG, newConfig);
}