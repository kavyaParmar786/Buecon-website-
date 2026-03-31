/* ═══════════════════════════════════════════
   BUECON — Main Entry Point
   Boots all modules in correct order
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Boot sequence ── */
  function boot() {
    /* 1. Start loader first */
    Loader.init();

    /* 2. Render all section HTML */
    renderAbout();
    renderProducts();
    renderWhy();
    renderMission();
    renderContact();
    renderFooter();

    /* 3. Init WebGL hero scene */
    /* 3. Init per-product 3D viewers */
    if (window.ProductViewer) ProductViewer.init();

    /* 4. Init WebGL hero scene */
    WebGLScene.init('webgl-canvas');

    /* 4. Init focus mode (product click overlay) */
    FocusMode.init();

    /* 5. Init animations (after sections rendered) */
    Animations.init();

    /* 6. Init AI assistant */
    Assistant.init();

    /* 7. Contact form handler */
    initContactForm();

    /* 8. Smooth scroll for anchor links */
    initSmoothScroll();
  }

  /* ── Contact form ── */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.form-submit');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled    = true;
      }

      /* Simulate async send */
      setTimeout(() => {
        form.innerHTML = `
          <div class="form-success" style="display:block;text-align:center;padding:40px 20px">
            <div style="font-size:2rem;margin-bottom:16px">✦</div>
            <p style="font-family:var(--font-serif);font-size:1.4rem;color:var(--white);margin-bottom:8px">
              Thank you
            </p>
            <p style="color:var(--silver-dim);font-size:0.9rem">
              We'll be in touch within 24 hours.
            </p>
          </div>`;
      }, 1500);
    });
  }

  /* ── Smooth scroll anchors ── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Start on DOM ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
