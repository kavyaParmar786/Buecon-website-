/* ═══════════════════════════════════════════
   BUECON — Products Section
   Images from /public/images/ (repo)
   GLB models from /public/models/ (repo)
   Card format matches design spec
   ═══════════════════════════════════════════ */

function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  /* Map product id → public folder paths */
  const assetMap = {
    salt:   { img: 'public/images/salt.jpg',   glb: 'public/models/salt.glb'   },
    super:  { img: 'public/images/super.jpg',  glb: 'public/models/super.glb'  },
    spirit: { img: 'public/images/spirit.jpg', glb: 'public/models/spirit.glb' },
    soft:   { img: 'public/images/soft.jpg',   glb: 'public/models/soft.glb'   },
    smart:  { img: 'public/images/smart.jpg',  glb: 'public/models/smart.glb'  },
    '400':  { img: 'public/images/400.jpg',    glb: 'public/models/400.glb'    },
  };

  const cardsHTML = BUECON.products.map(p => {
    const assets  = assetMap[p.id] || {};
    const imgSrc  = p.image_url || assets.img || `public/images/${p.id}.jpg`;
    const glbSrc  = p.model_url || assets.glb || `public/models/${p.id}.glb`;

    return `
    <div class="product-card" data-product-id="${p.id}" data-style="${(p.style||[]).join(' ')}">

      <!-- Top badge -->
      <div class="card-top-badge">✦ ${p.insight || 'Premium Collection'}</div>

      <!-- Media: image default, 3D on toggle -->
      <div class="card-media" data-glb="${glbSrc}">

        <div class="card-img-view active" id="img-${p.id}">
          <img
            src="${imgSrc}"
            alt="${p.series}"
            loading="lazy"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
          />
          <!-- Fallback placeholder if image missing -->
          <div class="card-img-placeholder" style="display:none">
            <span style="font-size:3rem;color:var(--gold);opacity:0.4">${p.icon||'◈'}</span>
            <span style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold-dim)">${p.series}</span>
          </div>
        </div>

        <div class="card-3d-view" id="3d-${p.id}">
          <canvas class="mini-canvas" id="canvas-${p.id}"></canvas>
          <div class="viewer-3d-badge">◈ 3D Live</div>
          <div class="viewer-controls-hint">Drag to rotate · Scroll to zoom</div>
        </div>

      </div>

      <!-- Toggle buttons -->
      <div class="card-view-toggle">
        <button
          class="toggle-btn active"
          onclick="ProductViewer.setView('${p.id}','image',this)">
          ◫ Image
        </button>
        <button
          class="toggle-btn"
          onclick="ProductViewer.setView('${p.id}','3d',this)">
          ◈ View in 3D
        </button>
      </div>

      <!-- Info block -->
      <div class="card-info">
        <span class="card-series-tag">${p.series}</span>
        <h3 class="card-title">${p.name} <em>Series</em></h3>
        <p class="card-subtitle">${p.tagline||''}</p>
        <div class="card-features">
          ${(p.features||[]).slice(0,3).map(f=>`<span class="feature-pill">${f}</span>`).join('')}
        </div>
        <div class="card-footer-row">
          <span class="card-explore">Explore →</span>
        </div>
      </div>

    </div>`;
  }).join('');

  el.innerHTML = `
    <section style="padding:var(--sp-xl) 0;background:var(--navy-deep);">
      <div class="container">
        <div class="products-header">
          <span class="section-label">Collections</span>
          <h2 class="section-title">Our <span class="italic">Products</span></h2>
          <div class="gold-divider" style="margin:16px auto;"></div>
          <p class="section-sub" style="margin:0 auto;">
            Each BUECON series is built around a distinct philosophy — united by an
            unwavering commitment to craftsmanship and detail.
          </p>
        </div>
        <div class="products-grid">${cardsHTML}</div>
      </div>
    </section>`;

  /* Init 3D viewers after DOM is ready */
  if (window.ProductViewer) ProductViewer.init();
}
