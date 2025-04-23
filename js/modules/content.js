// js/modules/content.js

// === COMMON COMPONENTS ===
const PAGE_COMMON = {
  title: (visible) => `
<div class="title-wrap ${visible.toLowerCase().replace(/\s/g, '-')}-title">
  <div class="ember-container" id="ember-container" aria-hidden="true"></div>
  <h1>
    <span class="title-ember-target">Nighty Night Games</span>
    <span class="title-visible">${visible}</span>
  </h1>
</div>
<div class="underline"></div>`,

  tagline: `<blockquote class="studio-tagline">Nighty Night Games — From ashes, myths awaken. From dreams, legends rise.</blockquote>`,

  divider: `<hr class="divider" />`
};

// === COMPONENT: Game Card Template ===
const GAME_CARD = {
  legacyOfAtum: `
<div class="game-card">
  <div class="game-card-header">
    <h2 class="game-title">Legacy of Atum: Dead Dynasty</h2>
    <span class="game-status in-development">In Development</span>
  </div>

  <div class="game-media">
        <img src="/images/game/The Valley of Shadows.png" alt="Legacy of Atum: Dead Dynasty - Game screenshot showing an ancient Egyptian temple" />
  </div>

  <div class="game-card-content">
    <p><strong>Legacy of Atum</strong> is an atmospheric action RPG set in a myth-infused vision of ancient Egypt. It weaves narrative depth, moral complexity, and strategic survival into a haunting, reactive world.</p>
    <p>You'll play as <strong>Nui</strong>, a former Nubian prisoner turned reluctant hero, navigating a fractured realm of forgotten gods, collapsing empires, and buried vengeance. With real-time combat, dynamic social systems, and world-altering decisions, every action leaves a mark—the world of Atum remembers.</p>
  </div>

  <div class="game-features">
    <span class="game-feature">Narrative-Driven</span>
    <span class="game-feature">Strategic Combat</span>
    <span class="game-feature">Moral Choices</span>
    <span class="game-feature">Ancient Egypt</span>
    <span class="game-feature">Action RPG</span>
  </div>

  <a href="#" class="cta-button">Learn More</a>
</div>`
};

// === PAGE CONTENT ===
export const pageContent = {
  home: '',

  about: `
${PAGE_COMMON.title('About NNG')}
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

<div class="about-social">
  <a href="https://x.com/nightynightgg" target="_blank" class="social-button">
    <svg viewBox="0 0 24 24">
      <path d="M23.05 2H17.59L12 9.15 6.48 2H1L10.93 13.9 2.23 22h5.5l6-7.35L19.61 22H23l-8.67-9.5L23.05 2z"></path>
    </svg>
    X
  </a>
  <a href="https://discord.gg/nightynightgames" target="_blank" class="social-button">
    <svg viewBox="0 0 24 24">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5218 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </svg>
    Discord
  </a>
  <a href="https://www.youtube.com/@NightyNightGames" target="_blank" class="social-button">
    <svg viewBox="0 0 24 24">
      <path d="M10 15l5.2-3L10 9v6z"/>
      <path d="M21.8 8s-.2-1.4-.8-2c-.7-.8-1.5-.8-1.8-.8C16.8 5 12 5 12 5s-4.8 0-7.2.2c-.3 0-1.1 0-1.8.8-.6.6-.8 2-.8 2S2 9.6 2 11.3v1.4c0 1.7.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.6.8 2 .8 1.4.1 6 .2 6 .2s4.8 0 7.2-.2c.3 0 1.1 0 1.8-.8.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.4c0-1.7-.2-3.3-.2-3.3z"/>
    </svg>
    YouTube
  </a>
  <a href="https://twitch.tv/nightynightgames" target="_blank" class="social-button">
    <svg viewBox="0 0 24 24">
      <path d="M4.26 3L2 6.01v14.5h5.24V21h3.22l2.59-2.47h4.37L22 13.67V3H4.26zM20 13.09l-2.97 2.83h-4.43l-2.6 2.5v-2.5H6V5.91h14v7.18z"/>
      <path d="M15.23 7.55h1.71v4.53h-1.71zM11.3 7.55h1.71v4.53H11.3z"/>
    </svg>
    Twitch
  </a>
</div>

  ${PAGE_COMMON.tagline}
</section>`,

  games: `
${PAGE_COMMON.title('Our Games')}
<section class="games-section">
  <div class="games-intro">
    <p><strong>Explore Our Worlds:</strong> Every game we craft is a portal into hand-built, emotionally resonant storyworlds.</p>
  </div>

  ${GAME_CARD.legacyOfAtum}

  ${PAGE_COMMON.divider}

  <h2>On the Horizon</h2>
  <p>Nighty Night Games is always dreaming deeper. New worlds, new stories, and new myths are brewing beneath the surface. <strong>Join the journey</strong> and be among the first to hear what's next.</p>

  <div class="upcoming-games">
    <div class="upcoming-placeholder">Coming Soon...</div>
    <div class="upcoming-placeholder">Coming Soon...</div>
  </div>

  ${PAGE_COMMON.tagline}
</section>`
};