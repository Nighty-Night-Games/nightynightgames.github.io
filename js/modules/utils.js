// utils.js

/* === DOM Helper Functions === */

/**
 * Debounce a function to limit its execution rate.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - Delay in milliseconds.
 */
export const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Toggle classes on an element.
 * @param {Element} element - The target DOM element.
 * @param {Object} classMap - A map of class names and boolean flags.
 */
export const toggleClasses = (element, classMap) => {
    if (!element) return;
    Object.entries(classMap).forEach(([className, shouldHave]) => {
        element.classList.toggle(className, shouldHave);
    });
};

/**
 * Set multiple attributes on an element.
 * @param {Element} element - The target DOM element.
 * @param {Object} attrMap - A map of attributes and their values.
 */
export const setAttributes = (element, attrMap) => {
    if (!element) return;
    Object.entries(attrMap).forEach(([attr, value]) => {
        element.setAttribute(attr, value);
    });
};

/**
 * Check if an element is in the viewport.
 * @param {Element} element - The target DOM element.
 * @param {number} offset - Additional offset to account for visibility.
 * @returns {boolean} True if the element is visible in the viewport.
 */
export const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + offset && rect.bottom > -offset;
};

/* === Title and Page Utilities === */

/**
 * Get the title element with a specific class.
 */
export const getTitleElement = () => document.querySelector('.title-visible');

/**
 * Update the bounding rectangle of the title element.
 * @returns {boolean} True if title element exists and rect is updated.
 */
export const updateTitleRect = () => {
    const el = getTitleElement();
    if (el) {
        window.currentTitleRect = el.getBoundingClientRect();
        return true;
    }
    return false;
};

/**
 * Get the current page based on the title element.
 * @returns {string} The current page.
 */
export const getCurrentPageFromTitle = () => {
    const title = getTitleElement()?.textContent.trim().toLowerCase();
    return title?.includes('about') ? 'about' : 'home';
};

/**
 * Check if the title is visible on the screen.
 * @returns {boolean} True if the title is visible.
 */
export const isTitleVisible = () => {
    const rect = getTitleElement()?.getBoundingClientRect();
    return rect && rect.top < window.innerHeight && rect.bottom > 0;
};

/* === Ember Utilities === */

/**
 * Count all active ember elements associated with a specific page.
 * @param {string} page - The page name.
 * @returns {number} Count of embers for the specified page.
 */
export const countEmbersByPage = page => {
    return window.activeEmbers?.filter(ember => ember.getAttribute('data-page') === page).length || 0;
};

/* === Loading Bar Utility === */

/**
 * Update the loading bar and text progress dynamically.
 * @param {number} progress - Progress percentage.
 */
export const updateLoadingBar = progress => {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    if (!loadingBar || !loadingText) return;

    loadingText.textContent = `${progress}%`;
    loadingBar.style.width = `${progress}%`;
    loadingBar.parentElement?.setAttribute('aria-valuenow', progress);
};

/* === Newsletter Form Initialization === */
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
});

/**
 * Handle submission of the newsletter form.
 * @param {Event} e - The submit event.
 */
const handleNewsletterSubmit = async e => {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('.newsletter-input');
    const submitButton = form.querySelector('.newsletter-button');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address', 'error');
        return;
    }

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch('https://formspree.io/f/xpwdwjgq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        emailInput.value = '';
        showFormMessage(form, 'Thanks for subscribing!', 'success');
    } catch (error) {
        console.error('Newsletter error:', error);
        showFormMessage(form, 'An error occurred. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
};


/**
 * Validate the email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
const isValidEmail = email => email.includes('@') && email.includes('.');

/**
 * Simulate an API call (replace with actual implementation).
 * @returns {Promise<void>} A resolved promise.
 */
const simulateApiCall = () => new Promise(resolve => setTimeout(resolve, 800));

/**
 * Show a message on the newsletter form.
 * @param {HTMLFormElement} form - The form element.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success', 'error').
 */
const showFormMessage = (form, message, type) => {
    let messageEl = form.querySelector('.form-message');

    // Remove existing message
    if (messageEl) {
        messageEl.remove();
    }

    // Create and insert new message
    messageEl = document.createElement('p');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    form.appendChild(messageEl);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (messageEl.isConnected) {
            messageEl.style.opacity = '0';
            setTimeout(() => messageEl.remove(), 300);
        }
    }, 4000);
};