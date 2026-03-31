/* ═══════════════════════════════════════════
   BUECON — Main Entry Point
   Loads Supabase data FIRST, then boots UI
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  async function boot() {
    /* 1. Loader starts immediately */
    Loader.init();

    /* 2. Fetch live data from Supabase (with fallback) */
    await loadBueconData();

    /* 3. Render all section HTML (now with live data) */
    renderAbout();
    renderProducts();
    renderWhy();
    renderMission();
    renderContact();
    renderFooter();

    /* 4. Init 3D product viewers */
    if (window.ProductViewer) ProductViewer.init();

    /* 5. Init WebGL hero scene */
    WebGLScene.init('webgl-canvas');

    /* 6. Init focus mode */
    FocusMode.init();

    /* 7. Init animations */
    Animations.init();

    /* 8. Init AI assistant */
    Assistant.init();

    /* 9. Contact form */
    initContactForm();

    /* 10. Smooth scroll */
    initSmoothScroll();
  }

  function initContactForm() {
    /* Handled by sections/contact.js — just wire submit */
  }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
