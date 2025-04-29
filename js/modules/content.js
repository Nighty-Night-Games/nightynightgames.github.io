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
      <p><strong><a href="https://x.com/nightynightgg" target="_blank" rel="noopener noreferrer">Nighty Night Games</a></strong> is a one-person indie studio based in Berlin, Germany, focused on creating a rich, cinematic gaming experience that stays with players long after the credits roll.</p>
      <p>Founded by <strong><a href="https://x.com/0xMemLeakx0" target="_blank" rel="noopener noreferrer">David Gunther</a></strong>, the studio was born out of a lifelong passion for storytelling, music, and immersive worldbuilding. Everything is an effort to blend emotional depth with atmospheric gameplay that invites players to lose themselves in a world of myth and consequence.</p>
    </div>

<h2>Background</h2>
<div class="about-card">
  <p>David Gunther is a lifelong gamer and solo developer behind <strong>Nighty Night Games</strong>. His journey began with a Game Boy and Super Nintendo at age 9, followed by a first self-built PC at 14—fueling a love for immersive, choice-driven games and custom-built rigs.</p>

  <p>With a background in music and film, David spent over a decade composing, which now shapes his approach to soundtracks and mood. He draws inspiration from titles like <em>Final Fantasy VII</em>, <em>Mass Effect</em>, <em>Cyberpunk 2077</em>, <em>Kingdom Come: Deliverance</em>, and <em>Fallout: New Vegas</em>—games where narrative weight and atmosphere matter.</p>

  <p>Though the dream of creating his own game lingered for years, it wasn’t until now that all pieces aligned. <strong>Legacy of Atum: Dead Dynasty</strong> is the result—a passion project built from decades of experience and creative drive.</p>
</div>



    <h2>Currently in Development</h2>
    <div class="about-card">
      <h3 class="gold-title">Legacy of Atum: Dead Dynasty</h3>
      <p>An atmospheric action RPG set in a myth-infused ancient Egypt. Explore a world shaped by forgotten gods, unravel dynastic conspiracies, and define your legacy through dynamic choices and real-time combat.</p>
      <p><a href="#games" class="text-link">Explore Legacy of Atum →</a></p>
    </div>

    <h2>Who Is This For?</h2>
    <div class="about-card">
      <p>If you enjoy the visual storytelling of <a href="https://x.com/SuckerPunchProd" target="_blank"><strong>Ghost of Tsushima</strong></a> or <a href="https://x.com/bethesda" target="_blank"><strong>Skyrim</strong></a>, the refined gameplay of <a href="https://x.com/assassinscreed" target="_blank"><strong>Assassin’s Creed</strong></a> or <a href="https://x.com/Naughty_Dog" target="_blank"><strong>The Last of Us</strong></a>, or the narrative depth and moral complexity of <a href="https://x.com/DiscoElysium" target="_blank"><strong>Disco Elysium</strong></a> and <a href="https://x.com/CyberpunkGame" target="_blank"><strong>Cyberpunk 2077</strong></a>, you’ll feel right at home here. My work is crafted for players who appreciate richly told stories, immersive worlds, and gameplay systems that respect your time and choices.</p>
    </div>

    <h2>Showcase: Tech & Tool Stack</h2>
    <div class="about-card">
      <p><strong>Unreal Engine 5</strong> powers the core gameplay, lighting, and visual fidelity. I use <strong>Blueprints</strong> and <strong>GAS</strong> extensively for system design. AI tools are used responsibly for concepting, prototyping, and rapid iteration. Art is created or refined in <strong>Blender</strong>, <strong>Marvelous Designer</strong>, <strong>CC4</strong>, and <strong>Substance</strong>. Music and ambiance are composed natively in-studio.</p>
    </div>

    <h2>Roadmap</h2>
    <div class="about-card">
      <ul>
        <li><strong>Now –</strong> Finalizing combat, movement, and weather prototypes</li>
        <li><strong>Mid 2025 –</strong> Demo & vertical slice</li>
        <li><strong>Late 2025 –</strong> Steam page, trailer, and Wishlist campaign</li>
        <li><strong>Beyond –</strong> Chapter-based development with devlogs and feedback integration</li>
      </ul>
    </div>

    <h2>Dev Philosophy</h2>
    <div class="about-card">
      <p>I believe the best games are built on <strong>empathy, clarity, and curiosity</strong>. Even as a solo developer, I aim to create an ambitious, polished experience by using the right tools and keeping my players at the heart of every decision.</p>
      <p>Every asset, system, and line of dialogue is crafted or tuned with care. I welcome feedback and community insight throughout the journey.</p>
    </div>

    <h2>Let’s Connect</h2>
    <p>Follow for devlogs, behind-the-scenes updates, and cinematic peeks into the world of Atum. Whether you're a fellow developer, content creator, or curious player—you’re warmly invited to join the journey.</p>

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