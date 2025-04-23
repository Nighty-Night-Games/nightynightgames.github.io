// state.js

// Application state object
export const state = {
    hasLoaded: false,
    isMenuOpen: false,
    finalProgress: 5,
    currentTitleRect: null,
    activeEmbers: [],
    emberSpawnInterval: null,
    currentPage: 'home'
};

// State change listeners
const listeners = {};

/**
 * Subscribe to state changes
 * @returns {Function} Unsubscribe function
 */
export const subscribe = (key, callback) => {
    (listeners[key] = listeners[key] || []).push(callback);
    return () => unsubscribe(key, callback);
};

/**
 * Unsubscribe from state changes
 */
export const unsubscribe = (key, callback) => {
    if (listeners[key]) {
        listeners[key] = listeners[key].filter(cb => cb !== callback);
    }
};

/**
 * Update state and notify listeners
 */
export const update = (key, value) => {
    const oldValue = state[key];
    state[key] = value;

    if (listeners[key]?.length) {
        for (const callback of listeners[key]) {
            callback(value, oldValue);
        }
    }
};