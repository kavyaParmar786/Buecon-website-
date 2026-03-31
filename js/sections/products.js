/* ═══════════════════════════════════════════
   BUECON — Products Section — UPGRADED
   Image / 3D viewer toggle per card
   ═══════════════════════════════════════════ */

function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  const cardsHTML = BUECON.products.map(p => `
    <div class="product-card" data-product-id="${p.id}" data-style="${p.style.join(' ')}">

      <!-- AI Badge -->
      <div class="card-ai-rec-badge">✨ ${p.insight}</div>

      <!-- Media Area: Image OR 3D Viewer -->
      <div class="card-media">
        <!-- Image view (default) -->
        <div class="card-img-view active" id="img-${p.id}">
          <div class="card-img-placeholder">
            <span class="card-product-icon">${p.icon}</span>
            <span class="card-img-label">${p.series}</span>
            <p class="card-img-hint">Replace with your product image in assets/images/${p.id}.jpg</p>
          </div>
          <!-- If real image exists, uncomment:
          <img src="assets/images/${p.id}.jpg" alt="${p.name} Series" loading="lazy" />
          -->
        </div>

        <!-- 3D viewer (toggle) -->
        <div class="card-3d-view" id="3d-${p.id}">
          <canvas class="mini-canvas" id="canvas-${p.id}"></canvas>
          <div class="viewer-3d-badge">3D Live</div>
          <div class="viewer-controls-hint">Drag to rotate · Scroll to zoom</div>
        </div>
      </div>

      <!-- Toggle Buttons -->
      <div class="card-view-toggle">
        <button class="toggle-btn active" data-view="image" data-product="${p.id}" onclick="ProductViewer.setView('${p.id}','image',this)">
          <span>◫</span> Image
        </button>
        <button class="toggle-btn" data-view="3d" data-product="${p.id}" onclick="ProductViewer.setView('${p.id}','3d',this)">
          <span>◈</span> View in 3D
        </button>
      </div>

      <!-- Card Info -->
      <div class="card-info">
        <span class="card-series-tag">${p.series}</span>
        <h3 class="card-title">${p.name} Series</h3>
        <p class="card-subtitle">${p.tagline}</p>

        <div class="card-features">
          ${p.features.slice(0, 3).map(f => `<span class="feature-pill">${f}</span>`).join('')}
        </div>

        <div class="card-footer">
          <span class="card-explore">
            Explore <span class="card-explore-arrow">→</span>
          </span>
        </div>
      </div>

    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <div class="products-header">
        <span class="section-label">Collections</span>
        <h2 class="section-title">Four <span class="italic">Series</span>,<br>One Standard of Excellence</h2>
        <div class="gold-divider" style="margin:16px auto;"></div>
        <p class="section-sub">Each BUECON collection is built around a distinct design philosophy — united by an unwavering commitment to quality and detail.</p>
      </div>
      <div class="products-grid">${cardsHTML}</div>
    </div>
  `;

  /* Init 3D viewer module after DOM is ready */
  if (window.ProductViewer) ProductViewer.init();
}
