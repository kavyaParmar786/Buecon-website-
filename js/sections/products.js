/* ═══════════════════════════════════════════
   BUECON — Products Section Renderer
   ═══════════════════════════════════════════ */

function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  const cardsHTML = BUECON.products.map(p => `
    <div class="product-card" data-product-id="${p.id}" data-style="${p.style.join(' ')}">

      <span class="card-series-tag">${p.series}</span>

      <div class="card-icon">${p.icon}</div>

      <h3 class="card-title">${p.name} Series</h3>
      <p class="card-subtitle">${p.tagline}</p>

      <div class="card-features">
        ${p.features.slice(0, 3).map(f => `<span class="feature-pill">${f}</span>`).join('')}
      </div>

      <div class="card-footer">
        <span class="card-explore">
          Explore
          <span class="card-explore-arrow">→</span>
        </span>
        <span class="card-ai-badge">✦ ${p.insight}</span>
      </div>

    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">

      <div class="products-header">
        <span class="section-label">Collections</span>
        <h2 class="section-title">
          Four <span class="italic">Series</span>,<br>One Standard of Excellence
        </h2>
        <div class="gold-divider" style="margin: 16px auto;"></div>
        <p class="section-sub">
          Each BUECON collection is built around a distinct design philosophy —
          united by an unwavering commitment to quality and detail.
        </p>
      </div>

      <div class="products-grid">
        ${cardsHTML}
      </div>

    </div>
  `;
}
