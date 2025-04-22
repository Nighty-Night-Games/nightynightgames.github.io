// js/modules/content.js

// Store content for different pages
export const pageContent = {
    // Original content is loaded from DOM during initialization
    home: '',
    
    // About page content with proper title structure
    about: `
<div class="title-wrap about-title">
    <div class="ember-container" id="ember-container" aria-hidden="true"></div>
    <h1>
      <span class="title-ember-target">Nighty Night Games</span>
      <span class="title-visible">About NNG</span>
    </h1>
</div>
<div class="underline"></div>

<section class="about-section">
    <p><strong>Nighty Night Games</strong> is a (currently) one-person indie studio from Berlin, Germany on a mission to craft unforgettable worlds, rich in story, emotion, and grit.</p>

    <p>Founded from a deep love of games that stay with you long after the credits roll, Nighty Night Games focuses on immersive storytelling, cinematic atmosphere, and meaningful choices that shape your journey.</p>

    <hr class="divider" />

    <h2>Currently in Development</h2>
    <h3>Legacy of Atum: Dead Dynasty</h3>

    <p><strong>Legacy of Atum</strong> is an atmospheric RPG set in a myth-infused version of ancient Egypt. It blends narrative depth, moral complexity, and strategic survival.</p>

    <p>You'll step into the shoes of <strong>Nui</strong>, a former slave turned reluctant hero, as he navigates a fractured world of forgotten gods, political intrigue, and personal vengeance. With real-time combat, deep strategic systems, and dynamic social interactions, the world of Atum responds to your choices—and remembers your actions.</p>

    <p>Nighty Night Games is currently deep in development, working toward a playable prototype and a cinematic trailer to bring the vision to life.</p>

    <hr class="divider" />

    <h2>Follow the Journey</h2>
    <p>Development updates, behind-the-scenes peeks, and dev logs are shared regularly on social media. Whether you're a player, fellow dev, or just curious, you're welcome to follow along.</p>

    <blockquote class="studio-tagline">Nighty Night Games — Sleep well, dream deep, play meaningfully.</blockquote>
</section>
    `
};