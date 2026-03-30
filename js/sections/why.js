/* ═══════════════════════════════════════════
   BUECON — Why BUECON Section Renderer
   ═══════════════════════════════════════════ */

function renderWhy() {
  const el = document.getElementById('why-content');
  if (!el) return;

  const cardsHTML = BUECON.why.map((item, i) => `
    <div class="why-card">
      <span class="why-number">0${i + 1}</span>
      <span class="why-icon">${item.icon}</span>
      <h3 class="why-title">${item.title}</h3>
      <p class="why-text">${item.text}</p>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">

      <div class="why-header">
        <span class="section-label">Why Choose Us</span>
        <h2 class="section-title">
          Built on <span class="italic">Principles</span>
        </h2>
        <div class="gold-divider" style="margin: 16px auto;"></div>
        <p class="section-sub">
          Every decision at BUECON — from material selection to packaging —
          flows from the same four principles.
        </p>
      </div>

      <div class="why-grid">
        ${cardsHTML}
      </div>

    </div>
  `;
}
