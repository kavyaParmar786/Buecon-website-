/* ═══════════════════════════════════════════
   BUECON — Loader Controller
   ═══════════════════════════════════════════ */

const Loader = (() => {

  function hide(delay = 2200) {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add('hidden');

      /* Trigger hero headline animation after loader exits */
      setTimeout(() => {
        document.querySelectorAll('.hero-headline .line').forEach(line => {
          line.classList.add('animate');
        });
      }, 300);

      /* Remove from DOM after transition */
      setTimeout(() => loader.remove(), 1000);

    }, delay);
  }

  function init() {
    /* Start hide after minimum display time */
    if (document.readyState === 'complete') {
      hide(1800);
    } else {
      window.addEventListener('load', () => hide(1800));

      /* Fallback — never block more than 4s */
      setTimeout(() => hide(0), 4000);
    }
  }

  return { init };
})();
