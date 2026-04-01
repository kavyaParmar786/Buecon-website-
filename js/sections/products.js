/* ═══════════════════════════════════════════
   BUECON — Products Section
   Uses real images from assets/images/
   Image shown by default, 3D on toggle
   ═══════════════════════════════════════════ */

function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  const cardsHTML = BUECON.products.map(p => {
    const imgSrc = p.image_url || `assets/images/${p.id}.jpg`;

    return `
    <div class="product-card" data-product-id="${p.id}" data-style="${(p.style||[]).join(' ')}">

      <!-- AI Rec Badge -->
      <div class="card-ai-rec-badge">✨ ${p.insight || 'Premium Collection'}</div>

      <!-- Media Area -->
      <div class="card-media">

        <!-- IMAGE VIEW (default) -->
        <div class="card-img-view active" id="img-${p.id}">
          <img
            src="${imgSrc}"
            alt="${p.series || p.name}"
            loading="lazy"
            onerror="this.style.display='none';this.parentElement.querySelector('.card-img-placeholder').style.display='flex'"
          />
          <div class="card-img-placeholder" style="display:none">
            <span class="card-product-icon">${p.icon || '◈'}</span>
            <span class="card-img-label">${p.series || p.name}</span>
          </div>
        </div>

        <!-- 3D VIEW -->
        <div class="card-3d-view" id="3d-${p.id}">
          <canvas class="mini-canvas" id="canvas-${p.id}"></canvas>
          <div class="viewer-3d-badge">◈ 3D Live</div>
          <div class="viewer-controls-hint">Drag to rotate · Scroll to zoom</div>
        </div>

      </div>

      <!-- VIEW TOGGLE -->
      <div class="card-view-toggle">
        <button class="toggle-btn active" data-product="${p.id}"
          onclick="ProductViewer.setView('${p.id}','image',this)">
          ◫ Image
        </button>
        <button class="toggle-btn" data-product="${p.id}"
          onclick="ProductViewer.setView('${p.id}','3d',this)">
          ◈ View in 3D
        </button>
      </div>

      <!-- CARD INFO -->
      <div class="card-info">
        <span class="card-series-tag">${p.series || p.name + ' Series'}</span>
        <h3 class="card-title">${p.name} Series</h3>
        <p class="card-subtitle">${p.tagline || ''}</p>
        <div class="card-features">
          ${(p.features||[]).slice(0,3).map(f=>`<span class="feature-pill">${f}</span>`).join('')}
        </div>
        <div class="card-footer">
          <span class="card-explore">
            Explore <span class="card-explore-arrow">→</span>
          </span>
        </div>
      </div>

    </div>`;
  }).join('');

  el.innerHTML = `
    <section style="padding: var(--sp-xl) 0; background: var(--navy-deep);">
      <div class="container">
        <div class="products-header" style="text-align:center;margin-bottom:72px;">
          <span class="section-label">Collections</span>
          <h2 class="section-title">Four <span class="italic">Series</span>,<br>One Standard of Excellence</h2>
          <div class="gold-divider" style="margin:16px auto;"></div>
          <p class="section-sub" style="margin:0 auto;">Each BUECON collection is built around a distinct design philosophy — united by an unwavering commitment to quality and detail.</p>
        </div>
        <div class="products-grid">${cardsHTML}</div>
      </div>
    </section>`;
}
