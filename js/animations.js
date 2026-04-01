/* ═══════════════════════════════════════════
   BUECON — Animations
   Golden glow under system cursor (no replacement)
   GSAP scroll, navbar, magnetic, ripple
   ═══════════════════════════════════════════ */

const Animations = (() => {

  /* ── Golden Glow under system cursor ── */
  function initGlowCursor() {
    /* Remove any old cursor elements */
    document.querySelectorAll('.cursor,.cursor-ring').forEach(el => el.remove());

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);

    let mx = 0, my = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
    });

    /* Smooth lag for the glow */
    function move() {
      gx += (mx - gx) * 0.18;
      gy += (my - gy) * 0.18;
      glow.style.left = gx + 'px';
      glow.style.top  = gy + 'px';
      requestAnimationFrame(move);
    }
    move();

    /* Expand on hoverable elements */
    const hoverSel = 'a,button,.product-card,.intro-nav-card,.why-card,.toggle-btn,.style-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) glow.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) glow.classList.remove('hover');
    });

    /* Hide when mouse leaves window */
    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '0.85'; });
  }

  /* ── Navbar scroll behaviour ── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 60);
      nav.style.transform = (y > last + 5 && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
      last = y;
    }, { passive: true });
    nav.style.transition = 'padding 0.4s ease, background 0.4s, transform 0.4s ease';
  }

  /* ── Mobile hamburger ── */
  function initHamburger() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-link').forEach(a => {
      a.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Magnetic buttons ── */
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r  = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.22;
        const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform  = '';
      });
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.15s ease';
      });
    });
  }

  /* ── GSAP Scroll Animations ── */
  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const fadeUp = (sel, trigger, stagger = 0) => {
      const els = document.querySelectorAll(sel);
      if (!els.length) return;
      gsap.fromTo(sel,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.9, stagger, ease: 'power3.out',
          scrollTrigger: { trigger: trigger || sel, start: 'top 80%', toggleActions: 'play none none none' }
        });
    };

    fadeUp('.about-text',       '#about');
    fadeUp('.about-visual',     '#about');
    fadeUp('.about-stats .stat-item', '.about-stats', 0.12);
    fadeUp('.products-header',  '#products');
    fadeUp('.product-card',     '.products-grid', 0.12);
    fadeUp('.why-card',         '.why-grid', 0.1);
    fadeUp('.mission-panel',    '.mission-grid', 0.18);
    fadeUp('.contact-item',     '.contact-info', 0.08);
    fadeUp('.contact-form-wrap','.contact-form-wrap');
    fadeUp('.section-label, .section-title, .section-sub', null, 0);

    /* Hero parallax */
    if (document.querySelector('.hero-content')) {
      gsap.to('.hero-content', {
        y: 80, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  /* ── Button ripple ── */
  function initRipple() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const r    = btn.getBoundingClientRect();
        const size = Math.max(r.width, r.height);
        const s    = document.createElement('span');
        s.style.cssText = `position:absolute;width:${size}px;height:${size}px;
          top:${e.clientY-r.top-size/2}px;left:${e.clientX-r.left-size/2}px;
          background:rgba(255,255,255,0.25);border-radius:50%;
          transform:scale(0);animation:ripple 0.6s ease-out forwards;pointer-events:none;`;
        btn.appendChild(s);
        setTimeout(() => s.remove(), 700);
      });
    });
    if (!document.getElementById('ripple-kf')) {
      const st = document.createElement('style');
      st.id = 'ripple-kf';
      st.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(st);
    }
  }

  /* ── Active nav link ── */
  function initActiveNav() {
    const current = location.pathname.split('/').pop().replace('.html','') || 'index';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href').replace('.html','').replace('./','');
      if (href === current || (current === '' && href === 'index')) {
        a.style.color = 'var(--gold)';
      }
    });
  }

  /* ── Init all ── */
  function init() {
    if (window.innerWidth > 768) initGlowCursor();
    initNavbar();
    initHamburger();
    initMagnetic();
    initScrollAnimations();
    initRipple();
    initActiveNav();
  }

  return { init };
})();
