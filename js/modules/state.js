// state.js

// Centralized application state
export const state = {
    hasLoaded: false,
    isMenuOpen: false,
    finalProgress: 5,
    currentTitleRect: null,
    activeEmbers: [],
    emberSpawnInterval: null,
    currentPage: 'home',
};

// State change listeners
const listeners = {};

/**
 * Subscribe to changes for a specific state key.
 * @param {string} key - The state key to subscribe to.
 * @param {Function} callback - Callback function to invoke on state change.
 * @returns {Function} Unsubscribe function.
 */
export const subscribe = (key, callback) => {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    return () => unsubscribe(key, callback);
};

/**
 * Unsubscribe a specific listener for a state key.
 * @param {string} key - The state key to unsubscribe from.
 * @param {Function} callback - The callback function to remove.
 */
export const unsubscribe = (key, callback) => {
    if (listeners[key]) {
        listeners[key] = listeners[key].filter(cb => cb !== callback);
        if (!listeners[key].length) delete listeners[key];
    }
};

/**
 * Update the application state and notify subscribed listeners.
 * @param {string} key - The state key to update.
 * @param {*} value - The new value for the state key.
 */
export const update = (key, value) => {
    const oldValue = state[key];
    if (oldValue === value) return; // Prevent redundant updates
    
    state[key] = value;

    if (listeners[key]) {
        listeners[key].forEach(callback => callback(value, oldValue));
    }
};