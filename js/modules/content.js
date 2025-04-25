// === COMMON COMPONENTS ===
const PAGE_COMMON = {
  title: (visible) =>
    `
    <div class="title-wrap ${sanitizeClassName(visible)}-title">
      <div class="ember-container" id="ember-container" aria-hidden="true"></div>
      <h1>
        <span class="title-ember-target">Nighty Night Games</span>
        <span class="title-visible">${visible}</span>
      </h1>
    </div>`,

  tagline: `
    <blockquote class="studio-tagline">
      Close your eyes. Create a world.
    </blockquote>`,

  divider: `
    <hr class="divider" />`,
};


// Helper function to sanitize CSS class names
function sanitizeClassName(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// === GAME CARD TEMPLATE ===
const createGameCard = ({ title, status, image, imageAlt, description, features, showLoadingBar = false }) => {
  const renderDescription = description
    .map((text) =>
      `<p>${text.replace(/<strong>(.*?)<\/strong>/g, (_, boldText) => `<strong>${boldText}</strong>`)}</p>`
    )
    .join('');

  const renderFeatures = features
    .map((feature) => `<span class="game-feature">${feature}</span>`)
    .join('');

  // Include the loading bar below the image if `showLoadingBar` is true
  const loadingBar = showLoadingBar
    ? `
    <div class="loading-bar-container" role="progressbar" aria-valuemin="0" aria-valuemax="100">
      <div class="loading-bar"></div>
      <span class="loading-text">0%</span>
    </div>
    `
    : '';

  return `
    <div class="game-card">
      <div class="game-card-header">
        <h2 class="game-title">${title}</h2>
        <span class="game-status ${sanitizeClassName(status)}">${status}</span>
      </div>
      <div class="game-media">
        <img src="${image}" alt="${imageAlt}" />
        ${loadingBar} <!-- Loading bar placed directly below the image -->
      </div>
      <div class="game-card-content">${renderDescription}</div>
      <div class="game-features">${renderFeatures}</div>
      <a href="#" class="cta-button">Learn More</a>
    </div>
  `;
};

// Predefined GAME CARD DETAILS
const GAME_CARDS = {
  legacyOfAtum: createGameCard({
    title: 'Legacy of Atum: Dead Dynasty',
    status: 'In Development',
    image: '/images/game/The Valley of Shadows.png',
    imageAlt: 'Legacy of Atum: Dead Dynasty - Game screenshot showing an ancient Egyptian temple',
    description: [
      '<strong>Legacy of Atum</strong> is an atmospheric action RPG set in a myth-infused vision of ancient Egypt. It weaves narrative depth, moral complexity, and strategic survival into a haunting, reactive world.',
      'You\'ll play as <strong>Nui</strong>, a former Nubian prisoner turned reluctant hero, navigating a fractured realm of forgotten gods, collapsing empires, and buried vengeance. With real-time combat, dynamic social systems, and world-altering decisions, every action leaves a mark—the world of Atum remembers.',
    ],
    features: ['Narrative-Driven', 'Strategic Combat', 'Moral Choices', 'Ancient Egypt', 'Action RPG'],
    showLoadingBar: true,
  }),
};

// === SOCIAL BUTTON TEMPLATE ===
const SOCIAL_BUTTONS = [
  {
    label: 'X',
    href: 'https://x.com/nightynightgg',
    iconPath: 'M23.05 2H17.59L12 9.15 6.48 2H1L10.93 13.9 2.23 22h5.5l6-7.35L19.61 22H23l-8.67-9.5L23.05 2z'
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/nightynightgames',
    iconPath: 'M20.317 4.3698c-4.8851-1.5152-10.2288-1.5152-15.114 0a19.7363 19.7363 0 00-4.8852 1.515.07.07 0 00-.032.0277C.5334 9.0458-.319 13.5799.0992 18.0578c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276l1.226-1.9942c-1.2743-.5495-1.8722-.8923-1.8722-.8923a.077.077 0 01-.0076-.1277c3.9278 1.7933 8.18 1.7933 12.0614 0a.077.077 0 01-.0066.1276c0 0-.871-.3428-1.873-.8914a12.2986 12.2986 0 01-1.873.8914',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@NightyNightGames',
    iconPath: 'M10 15l5.2-3L10 9v6z M21.8 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.8-.8C16.8 5 12 5 12 5s-4.8 0-7.2.2c-.3 0-1.1 0-1.8.8-.6.6-.8 2-.8 2S2 9.6 2 11.3v1.4c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.6.8 2 .8 1.4.1 6 .2 6 .2s4.8 0 7.2-.2c.3 0 1.1 0 1.8-.8.6-.6.8-2 .8-2s.2-1.6.2-3.3V11.3c0-1.7-.2-3.3-.2-3.3z',
  },
  {
    label: 'Twitch',
    href: 'https://twitch.tv/nightynightgames',
    iconPath: 'M4.26 3L2 6.01v14.5h5.24V21h3.22l2.59-2.47h4.37L22 13.67V3H4.26zM20 13.09l-2.97 2.83h-4.43l-2.6 2.5v-2.5H6V5.91h14v7.18z M15.23 7.55h1.71v4.53h-1.71z M11.3 7.55h1.71v4.53H11.3z',
  }
];

const renderSocialButtons = () =>
    SOCIAL_BUTTONS.map(
        ({ label, href, iconPath }) =>
            iconPath
                ? `<a href="${href}" target="_blank" rel="noopener noreferrer" class="social-button" aria-label="${label}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
              <path d="${iconPath}" />
            </svg>
          </a>`
                : `<a href="${href}" target="_blank" rel="noopener noreferrer" class="social-button" aria-label="${label}">
            ${label}
          </a>`
    ).join('');

// Dynamic Page Content
export const pageContent = {
  about: `
    ${PAGE_COMMON.title('About')}
        ${PAGE_COMMON.divider}
    <section class="about-section">
      <div class="about-card">
        <p><strong>Nighty Night Games</strong> is a one-person indie studio based in Berlin, Germany, devoted to crafting unforgettable worlds—rich in story, emotion, and grit.</p>
        <p>Founded by solo developer <strong>David Gunther</strong>, NNG is driven by a deep love for games that linger long after the credits roll. The studio's focus lies in immersive storytelling, cinematic atmosphere, and meaningful choices that shape not just the player's journey—but the world itself.</p>
      </div>
      ${PAGE_COMMON.divider}
      <h2>Currently in Development</h2>
      <div class="about-card">
        <h3><a href="#games">Legacy of Atum: Dead Dynasty</a></h3>
        <p>Our debut title is an atmospheric action RPG set in a myth-infused version of ancient Egypt. It explores moral complexity, strategic survival, and personal legacy.</p>
        <p><a href="#games" class="text-link">Explore Legacy of Atum →</a></p>
      </div>
      ${PAGE_COMMON.divider}
      <h2>Follow the Journey</h2>
      <p>Dev logs, behind-the-scenes looks, and cinematic updates are shared regularly. Whether you're a player, fellow developer, or just curious, you're warmly invited to follow along.</p>
      <div class="about-social">${renderSocialButtons()}</div>
      ${PAGE_COMMON.tagline}
    </section>`,

  games: `
  ${PAGE_COMMON.title('Games')}
      ${PAGE_COMMON.divider}
  <section class="games-section">
    <div class="games-intro">
    ${GAME_CARDS.legacyOfAtum}
  </section>`,
};