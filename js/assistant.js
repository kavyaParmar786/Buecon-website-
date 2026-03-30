/* ═══════════════════════════════════════════
   BUECON — AI Style Advisor / Assistant
   ═══════════════════════════════════════════ */

const Assistant = (() => {

  const bubble     = document.getElementById('assistantBubble');
  const icon       = bubble?.querySelector('.assistant-icon');
  const panel      = document.getElementById('assistantPanel');
  const closeBtn   = document.getElementById('assistantClose');
  const styleBtns  = document.querySelectorAll('.style-btn');
  const resultEl   = document.getElementById('styleResult');

  let isOpen = false;
  let activeStyle = 'all';

  const styleMessages = {
    all:     'Showing: All collections',
    modern:  '✦ Matched: Salt Series & 400 Series',
    minimal: '✦ Matched: Salt Series & Spirit Series',
    luxury:  '✦ Matched: Spirit Series & Super Series',
  };

  /* ── Toggle Panel ── */
  function toggle() {
    isOpen = !isOpen;
    if (panel) panel.classList.toggle('open', isOpen);
  }

  function close() {
    isOpen = false;
    if (panel) panel.classList.remove('open');
  }

  /* ── Style Filter ── */
  function applyFilter(style) {
    activeStyle = style;

    /* Update result text */
    if (resultEl) resultEl.textContent = styleMessages[style] || styleMessages.all;

    /* Highlight matching product cards */
    document.querySelectorAll('.product-card').forEach(card => {
      const product = BUECON.products.find(p => p.id === card.dataset.productId);
      if (!product) return;

      if (style === 'all' || product.style.includes(style)) {
        card.style.opacity    = '1';
        card.style.transform  = '';
        card.style.filter     = '';
      } else {
        card.style.opacity   = '0.3';
        card.style.filter    = 'grayscale(60%)';
        card.style.transform = 'scale(0.97)';
      }
      card.style.transition = 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease';
    });

    /* Scroll to products section */
    const productsEl = document.getElementById('products');
    if (productsEl && style !== 'all') {
      setTimeout(() => {
        productsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  /* ── Events ── */
  function bindEvents() {
    icon?.addEventListener('click', toggle);
    closeBtn?.addEventListener('click', close);

    /* Close on outside click */
    document.addEventListener('click', (e) => {
      if (isOpen && bubble && !bubble.contains(e.target)) {
        close();
      }
    });

    /* Style buttons */
    styleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        styleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.style);
      });
    });
  }

  /* ── Show assistant after a delay ── */
  function scheduleAppearance() {
    if (!bubble) return;

    /* Slide in from right after 4s */
    bubble.style.transform     = 'translateX(80px)';
    bubble.style.opacity       = '0';
    bubble.style.transition    = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s';

    setTimeout(() => {
      bubble.style.transform = 'translateX(0)';
      bubble.style.opacity   = '1';
    }, 4000);
  }

  /* ── Init ── */
  function init() {
    bindEvents();
    scheduleAppearance();
  }

  return { init, applyFilter };
})();
