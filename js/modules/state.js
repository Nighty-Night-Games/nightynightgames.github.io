// state.js
export const state = {
    hasLoaded: false,
    isMenuOpen: false,
    finalProgress: 5,
    currentTitleRect: null,
    activeEmbers: [],
    emberSpawnInterval: null,
    currentPage: 'home'
};

// Optional: Add state change subscriptions
const listeners = {};

export function subscribe(key, callback) {
    if (!listeners[key]) {
        listeners[key] = [];
    }
    listeners[key].push(callback);
    return () => unsubscribe(key, callback);
}

export function unsubscribe(key, callback) {
    if (listeners[key]) {
        listeners[key] = listeners[key].filter(cb => cb !== callback);
    }
}

export function update(key, value) {
    const oldValue = state[key];
    state[key] = value;

    if (listeners[key]) {
        listeners[key].forEach(callback => callback(value, oldValue));
    }
}