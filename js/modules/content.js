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
    <p>You’ll play as <strong>Nui</strong>, a former Nubian prisoner turned reluctant hero, navigating a fractured realm of forgotten gods, collapsing empires, and buried vengeance. With real-time combat, dynamic social systems, and world-altering decisions, every action leaves a mark—the world of Atum remembers.</p>
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
  <p><strong>Nighty Night Games</strong> is a one-person indie studio based in Berlin, Germany, devoted to crafting unforgettable worlds—rich in story, emotion, and grit.</p>

  <p>Founded by solo developer <strong>David Gunther</strong>, NNG is driven by a deep love for games that linger long after the credits roll. The studio’s focus lies in immersive storytelling, cinematic atmosphere, and meaningful choices that shape not just the player’s journey—but the world itself.</p>

  ${PAGE_COMMON.divider}

  <h2>Currently in Development</h2>
  <h3><a href="#games">Legacy of Atum: Dead Dynasty</a></h3>
  <p>Our debut title is an atmospheric action RPG set in a myth-infused version of ancient Egypt. It explores moral complexity, strategic survival, and personal legacy. Want to dive deeper?</p>
  <p><a href="#games" class="text-link">Explore Legacy of Atum →</a></p>

  ${PAGE_COMMON.divider}

  <h2>Follow the Journey</h2>
  <p>Dev logs, behind-the-scenes looks, and cinematic updates are shared regularly. Whether you’re a player, fellow developer, or just curious, you’re warmly invited to follow along.</p>

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

  ${PAGE_COMMON.tagline}
</section>`
};
