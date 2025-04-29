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
    <h1></h1>
    <p>
      <strong><a href="https://x.com/nightynightgg" target="_blank" rel="noopener noreferrer" title="Click to learn about Nighty Night Games.">Nighty Night Games</a></strong> is an independent game development studio in Berlin, Germany. 
      Our mission is to create <strong>cinematic, narrative-driven gaming experiences</strong> that resonate with players long after the game ends.
    </p>
    <p>
      Founded by <strong><a href="https://x.com/0xMemLeakx0" target="_blank" rel="noopener noreferrer" title="David Gunther, founder and developer.">David Gunther</a></strong>, the studio brings together storytelling, music composition, and worldbuilding to deliver immersive gameplay. At Nighty Night Games, we aim to **spark emotions and take players on unforgettable journeys**.
    </p>
  </div>

  <h2>Who’s Behind Nighty Night Games?</h2>
  <div class="about-card">
    <p>
      <a href="https://x.com/0xMemLeakx0" target="_blank" rel="noopener noreferrer" title="David Gunther's developer profile">David Gunther</a> is a solo developer with lifelong passion for gaming and creativity. His journey began at age 9, moving from classic consoles like Game Boy and Sega to mastering PC gaming by 14. Over the years, David logged countless hours on <strong>Battlefield 2, Lord of the Rings Online, and all sorts of RPGs and Shooters</strong>, fueling his dream to create a world players can deeply connect with.
    </p>
    <p>
      A music composer and aspiring storyteller, his work draws inspiration from games that emphasize <strong>narrative depth and atmosphere</strong>, including <strong>Final Fantasy VII, Kingdom Come: Deliverance, Cyberpunk 2077, and Fallout: New Vegas.</strong>
      With over a decade of musical experience, David plans to integrate mood-setting soundtracks into his games, enriching the gameplay and story alike.
    </p>
  </div>

  <h2>Currently in Development</h2>
  <div class="about-card">
    <h3 class="gold-title">Legacy of Atum: Dead Dynasty</h3>
    <p>
      A groundbreaking <strong>action RPG</strong> set in a rich, mythological vision of Ancient Egypt. Experience real-time combat, unravel dynastic conspiracies, and navigate a reactive world where your choices truly matter. Embark on a journey as <strong>Nui</strong>, a former prisoner turned reluctant hero, and explore a world of forgotten gods, collapsing societies, and buried vengeance.
    </p>
    <p>
      Dynamic decisions and a reactive world ensure every player writes their own Legacy. Learn more about the game on our <a href="#games" class="text-link" title="Visit the Legacy of Atum game page">games page →</a>
    </p>


  <h2>Who’s It For?</h2>
  <div class="about-card">
    <p>
      Legacy of Atum is crafted for fans of <strong>immersive storytelling, narrative depth, and impactful player choices.</strong> 
      If you enjoy visually striking worlds like <strong>Ghost of Tsushima</strong> or <strong>Skyrim</strong>, the polished gameplay of <strong>Assassin’s Creed</strong> or <strong>The Last of Us</strong>, or the narrative complexity of <strong>Disco Elysium</strong> and <strong>Cyberpunk 2077</strong>, this game is designed for you.
    </p>
  </div>

  <h2>Tech & Tool Stack</h2>
  <div class="about-card">
    <p>
      We rely on <strong>cutting-edge technologies</strong> to bring our worlds to life. The core gameplay and visuals are powered by <strong><a href="https://www.unrealengine.com/" target="_blank" rel="noopener noreferrer" title="Unreal Engine 5">Unreal Engine 5</a></strong>. 
    </p>
    <p>
      Art and assets are created or refined using tools like <strong><a href="https://www.blender.org/" target="_blank" rel="noopener noreferrer" title="Blender for game art">Blender</a></strong>, <strong><a href="https://www.marvelousdesigner.com/" target="_blank" rel="noopener noreferrer" title="Marvelous Designer for 3D modeling">Marvelous Designer</a></strong>, and <strong><a href="https://www.reallusion.com/character-creator/" target="_blank" rel="noopener noreferrer" title="Character Creator 4">CC4</a></strong>. 
      Music and ambiance are composed natively in-studio.
    </p>
  </div>
    </div>

  <h2>Core Philosophy</h2>
  <div class="about-card">
    <p>
      I believe great games are built on <strong>empathy, storytelling, and a relentless commitment to quality</strong>. As an independent game studio, I strive to create polished experiences while staying in tune with players' needs and feedback.
    </p>
    <p>
      From systems to scripts, every pixel and feature is crafted with extreme care. My ultimate goal is to deliver something memorable that resonates emotionally with players and inspires creative thinking.
    </p>
  </div>

  <h2>Connect & Follow</h2>
  <p>
    Become part of the <strong>Nighty Night Games</strong> journey! Follow us for devlogs, updates, and behind-the-scenes glimpses into the making of <strong>Legacy of Atum.</strong> Whether you are a fellow developer or a curious player, I welcome you to join the growing <strong>Nighty Night Games community</strong>.
  </p>

  <div class="about-social">${renderSocialButtons()}</div>
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