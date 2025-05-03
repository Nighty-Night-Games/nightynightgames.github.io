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
    <hr class="divider-pages" />`,
};


// Helper function to sanitize CSS class names
function sanitizeClassName(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// === GAME CARD TEMPLATE ===
const createGameCard = ({ title, status, image, imageAlt, description, features, progress = 0 }) => {
  const renderDescription = description
      .map((text) => `<p>${text.replace(/<strong>(.*?)<\/strong>/g, (_, boldText) => `<strong>${boldText}</strong>`)}</p>`)
      .join('');

  const renderFeatures = features
      .map((feature) => `<span class="game-feature">${feature}</span>`)
      .join('');

  const loadingBar = `
    <div class="game-loading-wrap">
      <div class="loading-bar-container" role="progressbar" aria-valuemin="0" aria-valuemax="100">
        <div class="loading-bar" style="width: ${progress}%;"></div>
      </div>
      <div class="loading-text">${progress}% Complete</div>
    </div>
  `;

  return `
    <div class="game-card">
      <div class="game-card-content">
        <div class="game-card-header">
          <h2 class="game-title">${title}</h2>
          <span class="game-status ${sanitizeClassName(status)}">${status}</span>
        </div>
        <div class="game-description">
          ${renderDescription}
        </div>
        ${loadingBar}
        <div class="game-features">
          ${renderFeatures}
        </div>
        <a href="https://www.legacyofatum.com/" class="cta-button" target="_blank" rel="noopener noreferrer">Learn More</a>
      </div>
      <div class="game-media">
        <img src="${image}" alt="${imageAlt}" />
      </div>
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
      '<strong>Legacy of Atum</strong> is a gripping atmospheric action RPG that immerses players in a mythical reimagining of Ancient Egypt. Seamlessly weaving together narrative depth, moral choices, and strategic survival, the game offers a hauntingly reactive world shaped by your decisions and actions.',
'Step into the sandals of <strong>Nui</strong>, a once-imprisoned Egyptian boy transformed into an unexpected hero. Traverse a land fractured by the enigmatic wills of forgotten gods, the turmoil of a collapsing society, and the shards of buried vengeance. With visceral, real-time combat, complex social dynamics, and decisions that ripple across the world, every choice you make leaves an indelible mark—because in Legacy of Atum, the world remembers.',
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
    href: 'https://discord.gg/FD9mDm9vNP',
    iconPath: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5218 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z',
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
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com/r/LegacyOfAtum/',
    iconPath: 'M22.54 11.12c-.78 0-1.46.33-1.96.83-1.7-.98-3.85-1.6-6.26-1.7l1.26-5.92 4.07.96c0 .9.74 1.64 1.65 1.64.93 0 1.68-.75 1.68-1.68 0-.93-.75-1.68-1.68-1.68-.68 0-1.27.41-1.53.99l-4.42-1.05c-.18-.05-.37 0-.52.08-.15.1-.26.24-.3.42l-1.45 6.83c-2.4.06-4.63.7-6.31 1.7a2.74 2.74 0 0 0-1.95-.83C1.49 11.12 0 12.61 0 14.47c0 1.1.6 2.07 1.5 2.59-.08.26-.13.53-.13.8 0 3.15 4.27 5.72 9.52 5.72s9.52-2.57 9.52-5.72c0-.27-.05-.54-.13-.8.9-.52 1.5-1.49 1.5-2.59 0-1.86-1.49-3.35-3.35-3.35zM6.15 16.97c-.93 0-1.68-.75-1.68-1.68 0-.93.75-1.68 1.68-1.68s1.68.75 1.68 1.68-.75 1.68-1.68 1.68zm10.28 1.36c-1.19 1.19-3.4 1.25-4.41 1.25s-3.22-.06-4.42-1.25c-.14-.14-.2-.36-.11-.55.08-.2.28-.31.48-.28 1 .2 2.23.31 3.42.31 1.18 0 2.41-.1 3.4-.31.21-.03.39.08.48.28.11.18.04.41-.08.55zm-.47-1.36c-.93 0-1.68-.75-1.68-1.68 0-.93.75-1.68 1.68-1.68s1.68.75 1.68 1.68-.75 1.68-1.68 1.68z',
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@legacyofatum',
    iconPath: 'M9 3v12.5a4.5 4.5 0 1 1-3.5-4.4V8.9a6.5 6.5 0 1 0 6.5 6.6V5.4c1.2.8 2.7 1.3 4.3 1.3V4.2c-1.6 0-3.1-.5-4.3-1.4V3H9z'
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

  <h2>Nighty Night Games</h2>
  <div class="about-card">
    <p>
      <strong><a href="https://x.com/nightynightgg" target="_blank" rel="noopener noreferrer" title="Discover Nighty Night Games, an indie game development studio.">Nighty Night Games</a></strong> is an independent game studio based in Berlin, Germany, focused on crafting <strong>cinematic, narrative-driven experiences</strong> that leave a lasting emotional impact.
    </p>
    <p>
      Founded by <strong><a href="https://x.com/0xMemLeakx0" target="_blank" rel="noopener noreferrer" title="Learn about David Gunther, founder of Nighty Night Games.">David Gunther</a></strong>, the studio blends gripping storytelling, fluid gameplay, and immersive worldbuilding to deliver unforgettable adventures.
    </p>
  </div>

  <h2>Founder & Developer</h2>
  <div class="about-card">
    <p>
      I'm <a href="https://x.com/0xMemLeakx0" target="_blank" rel="noopener noreferrer" title="David Gunther developer profile">David Gunther</a>, the solo developer behind Nighty Night Games. My journey began at age 9 on a Game Boy and Sega Mega Drive. By 14, I was deep into PC gaming—logging over <strong>3,000 hours in Battlefield 2</strong> and getting lost in RPGs like <strong>Lord of the Rings Online</strong>.
    </p>
    <p>
      I've always been drawn to <strong>narrative depth, great storytelling, and atmospheric worlds</strong>. Games like <strong>Star Wars: KOTOR</strong>, <strong>Cyberpunk 2077</strong>, <strong>Kingdom Come: Deliverance</strong>, and <strong>Bethesda RPGs</strong> have left a deep mark on me. With over 20 years of music composition experience, I craft soundtracks that don’t just accompany the game—they resonate with it.
    </p>
  </div>

  <h2>Current Project</h2>
  <div class="about-card">
    <h3 class="gold-title">Legacy of Atum: Dead Dynasty</h3>
    <p>
      An atmospheric, narrative- and combat-driven action RPG set in ancient Egypt’s crumbling Old Kingdom—where gods fall silent, and chaos reigns.
    </p>
    <p>
      Learn more on the <a href="#games" class="text-link" title="Explore the Legacy of Atum: Dead Dynasty game page">Games page →</a>
    </p>
  </div>

  <h2>Philosophy</h2>
  <div class="about-card">
    <p>
      I prioritize <strong>art, storytelling, and gameplay quality</strong>. Every detail—combat, dialogue, environment—is hand-crafted to create a deeply immersive experience.
    </p>
    <p>
      As a solo dev, I rely on community feedback and thoughtful iteration to build a game that not only play well, but stays with you long after.
    </p>
  </div>

  <h2>Join the Community</h2>
  <div class="about-card">
    <p>
      Follow for updates on <strong>Legacy of Atum: Dead Dynasty</strong> and future projects. Expect <strong>devlogs</strong>, <strong>behind-the-scenes previews</strong>, and more.
    </p>
      <div class="about-social">${renderSocialButtons()}</div>
  </div>

</section>

`,

  games: `
  ${PAGE_COMMON.title('Games')}
      ${PAGE_COMMON.divider}
  <section class="games-section">
    <div class="games-intro">
    ${GAME_CARDS.legacyOfAtum}
  </section>`,
};