/* ═══════════════════════════════════════════
   BUECON — About Section Renderer
   ═══════════════════════════════════════════ */

function renderAbout() {
  const el = document.getElementById('about-content');
  if (!el) return;

  const { brand } = BUECON;

  const statsHTML = brand.stats.map(s => `
    <div class="stat-item">
      <span class="stat-value">${s.value}</span>
      <span class="stat-label">${s.label}</span>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">
      <div class="about-grid">

        <!-- Left: Text -->
        <div class="about-text">
          <span class="section-label">Our Story</span>

          <div class="about-year">
            <span class="about-year-num">${brand.founded}</span>
            <span class="about-year-label">Year<br>Founded</span>
          </div>

          <h2 class="section-title">
            Crafted in <span class="italic">Rajkot</span>,<br>Built for the World
          </h2>

          <div class="gold-divider"></div>

          <p class="about-body">${brand.about}</p>

          <p class="about-body" style="margin-top: -8px;">
            From the bustling workshops of Gujarat, we bring together local craftsmanship
            and international design sensibility — creating hardware that feels like it
            belongs in a design magazine, yet is built for a lifetime of daily use.
          </p>

          <div class="about-stats">
            ${statsHTML}
          </div>
        </div>

        <!-- Right: Visual -->
        <div class="about-visual">
          <div class="about-float-accent"></div>
          <div class="about-card glass-panel">
            <span class="about-quote-mark">"</span>
            <p class="about-quote">${brand.quote}</p>
            <div class="gold-divider"></div>
            <div class="about-origin">
              <span class="origin-dot"></span>
              <span class="origin-text">
                ${brand.name} — ${brand.city}, ${brand.state} &nbsp;·&nbsp; Est. ${brand.founded}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}
