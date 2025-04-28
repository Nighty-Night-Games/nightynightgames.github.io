// utils.js

/* === DOM Helper Functions === */

/**
 * Debounce a function to limit its execution rate.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - Delay in milliseconds.
 * @returns {Function} Debounced function.
 */
export const debounce = (func, wait = 100) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

/**
 * Toggle multiple classes on an element.
 * @param {Element} element - The target DOM element.
 * @param {Object} classMap - A map of class names and boolean flags.
 */
export const toggleClasses = (element, classMap) => {
    if (!element) return;
    for (const [className, shouldHave] of Object.entries(classMap)) {
        element.classList.toggle(className, shouldHave);
    }
};

/**
 * Set multiple attributes on an element.
 * @param {Element} element - The target DOM element.
 * @param {Object} attributes - A map of attributes and their values.
 */
export const setAttributes = (element, attributes) => {
    if (!element) return;
    for (const [attr, value] of Object.entries(attributes)) {
        element.setAttribute(attr, value);
    }
};

/**
 * Check if an element is visible in the viewport.
 * @param {Element} element - The target DOM element.
 * @param {number} offset - Additional offset for visibility buffer.
 * @returns {boolean} True if the element is visible.
 */
export const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + offset && rect.bottom > -offset;
};

/* === Title and Page Utilities === */

/**
 * Get the element containing the page title.
 * @returns {Element|null} The title element.
 */
export const getTitleElement = () => document.querySelector('.title-visible');

/**
 * Update the bounding rectangle of the title element.
 * @returns {boolean} True if the element and rectangle were updated successfully.
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
 * Get the current page based on the page title.
 * @returns {string} The current page ('about' or 'home').
 */
export const getCurrentPageFromTitle = () => {
    const title = getTitleElement()?.textContent.trim().toLowerCase();
    return title?.includes('about') ? 'about' : 'home';
};

/**
 * Check if the title element is visible.
 * @returns {boolean} True if the title is visible in the viewport.
 */
export const isTitleVisible = () => {
    const rect = getTitleElement()?.getBoundingClientRect();
    return rect && rect.top < window.innerHeight && rect.bottom > 0;
};

/* === Ember and Progress Utilities === */

/**
 * Count active ember elements for a specific page.
 * @param {string} page - The page name.
 * @returns {number} Count of ember elements.
 */
export const countEmbersByPage = (page) =>
    window.activeEmbers?.filter((ember) => ember.getAttribute('data-page') === page).length || 0;

/**
 * Update the progress bar and corresponding text.
 * @param {number} progress - Progress percentage to display.
 */
export const updateLoadingBar = (progress) => {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingText = document.querySelector('.loading-text');
    if (!loadingBar || !loadingText) return;

    loadingBar.style.width = `${progress}%`;
    loadingText.textContent = `${progress}%`;
    loadingBar.parentElement?.setAttribute('aria-valuenow', progress);
};

/* === Form Utilities === */

/**
 * Display a message on the form (success/error).
 * @param {HTMLFormElement} form - The form element.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success', 'error').
 */
export const showFormMessage = (form, message, type) => {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement('p');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    form.appendChild(messageEl);

    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => messageEl.remove(), 300);
    }, 4000);
};

/**
 * Validate email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid.
 */
export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

/**
 * Handle newsletter form submission.
 * @param {Event} e - Form submit event.
 */
const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const emailInput = form.querySelector('.newsletter-input');
    const submitButton = form.querySelector('.newsletter-button');
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
        showFormMessage(form, 'Please enter a valid email address.', 'error');
        return;
    }

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch('https://formspree.io/f/xpwdwjgq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error('Failed to send email');
        emailInput.value = '';
        showFormMessage(form, 'Thanks for subscribing!', 'success');
    } catch {
        showFormMessage(form, 'An error occurred. Please try again.', 'error');
    } finally {
        submitButton.textContent = 'Subscribe';
        submitButton.disabled = false;
    }
};

/**
 * Initialize the newsletter form.
 */
const initializeNewsletterForm = () => {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
};

/* === Contact Form === */

/**
 * Initialize the contact form modal logic.
 */
const initializeContactForm = () => {
    const contactLink = document.getElementById('open-contact-form');
    const contactModal = document.getElementById('contact-form');
    const modalContent = contactModal?.querySelector('.modal-content');
    const overlay = contactModal?.querySelector('.modal-overlay');
    const contactForm = document.getElementById('contactForm');

    if (!contactLink || !contactModal) return;

    const toggleModal = () => {
        contactModal.hidden = !contactModal.hidden;
        contactModal.classList.toggle('show', !contactModal.hidden);
    };

    const closeModal = () => {
        if (!contactModal.hidden) {
            contactModal.hidden = true;
            contactModal.classList.remove('show');
        }
    };

    const showThankYouMessage = () => {
        modalContent.innerHTML = `
            <div class="thank-you-wrapper">
                <p class="thank-you-message">Thanks for contacting us! We'll be in touch soon.</p>
            </div>`;
        setTimeout(closeModal, 4000);
    };

    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal();
    });

    overlay?.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

    contactForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
            });

            if (response.ok) {
                contactForm.reset();
                showThankYouMessage();
            } else {
                alert('Submission failed. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        }
    });
};

/* === Initialization === */
document.addEventListener('DOMContentLoaded', () => {
    initializeNewsletterForm();
    initializeContactForm();
});