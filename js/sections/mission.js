/* ═══════════════════════════════════════════
   BUECON — Mission & Vision Section Renderer
   ═══════════════════════════════════════════ */

function renderMission() {
  const el = document.getElementById('mission-content');
  if (!el) return;

  const { mission, vision } = BUECON.mission;

  function panelHTML(data, cls) {
    const valuesHTML = data.values.map(v => `
      <li class="panel-value-item">${v}</li>
    `).join('');

    return `
      <div class="mission-panel ${cls} glass-panel">
        <p class="panel-type">${data.label}</p>
        <h3 class="panel-title">${data.title}</h3>
        <div class="gold-divider"></div>
        <p class="panel-body">${data.body}</p>
        <ul class="panel-values">
          ${valuesHTML}
        </ul>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="container">

      <div style="text-align:center; margin-bottom: 72px;">
        <span class="section-label">Our Purpose</span>
        <h2 class="section-title">
          What <span class="italic">Drives</span> Us
        </h2>
        <div class="gold-divider" style="margin: 16px auto;"></div>
      </div>

      <div class="mission-grid">
        ${panelHTML(mission, 'mission')}
        ${panelHTML(vision,  'vision')}
      </div>

    </div>
  `;
}
