/* ═══════════════════════════════════════════
   BUECON — Animations
   GSAP ScrollTrigger, reveal, magnetic buttons,
   custom cursor, navbar scroll behaviour
   ═══════════════════════════════════════════ */

const Animations = (() => {

  /* ── Custom Cursor ── */
  function initCursor() {
    if (window.innerWidth <= 768) return;

    const dot  = document.createElement('div');
    const ring = document.createElement('div');
    dot.className  = 'cursor';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function moveCursor() {
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';

      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';

      requestAnimationFrame(moveCursor);
    }
    moveCursor();

    /* Hover states */
    const hoverTargets = 'a, button, .product-card, .btn-primary, .btn-ghost, .why-card, .style-btn, .assistant-icon';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
      });
    });
  }

  /* ── Navbar Scroll ── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const y = window.scrollY;

      /* Shrink + blur on scroll */
      if (y > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      /* Hide on fast scroll down, show on scroll up */
      if (y > lastScroll + 5 && y > 200) {
        nav.style.transform = 'translateY(-100%)';
      } else if (y < lastScroll - 5) {
        nav.style.transform = 'translateY(0)';
      }

      lastScroll = y;
    }, { passive: true });

    /* Smooth transition for hide/show */
    nav.style.transition = 'padding 0.4s cubic-bezier(0.25,0.46,0.45,0.94), background 0.4s, backdrop-filter 0.4s, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';
  }

  /* ── Mobile Hamburger ── */
  function initHamburger() {
    const btn    = document.getElementById('hamburger');
    const menu   = document.getElementById('mobileMenu');
    const links  = document.querySelectorAll('.mobile-link');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      btn.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('open');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Magnetic Buttons ── */
  function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect   = el.getBoundingClientRect();
        const cx     = rect.left + rect.width / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) * 0.25;
        const dy     = (e.clientY - cy) * 0.25;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
        el.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
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

    /* ── About section ── */
    gsap.fromTo('.about-text', {
      opacity: 0,
      x: -60,
    }, {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    gsap.fromTo('.about-visual', {
      opacity: 0,
      x: 60,
    }, {
      opacity: 1,
      x: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    gsap.fromTo('.about-stats .stat-item', {
      opacity: 0,
      y: 24,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    /* ── Products section ── */
    gsap.fromTo('.products-header', {
      opacity: 0,
      y: 40,
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#products',
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    gsap.fromTo('.product-card', {
      opacity: 0,
      y: 60,
      scale: 0.96,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.85,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.products-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    /* ── Why section ── */
    gsap.fromTo('.why-card', {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.why-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    /* ── Mission section ── */
    gsap.fromTo('.mission-panel', {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.mission-grid',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    /* ── Contact section ── */
    gsap.fromTo('.contact-item', {
      opacity: 0,
      x: -30,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.contact-info',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    gsap.fromTo('.contact-form-wrap', {
      opacity: 0,
      x: 40,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-form-wrap',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    /* ── Scroll-driven section label reveals ── */
    gsap.utils.toArray('.section-label, .section-title, .section-sub').forEach((el) => {
      gsap.fromTo(el, {
        opacity: 0,
        y: 28,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    /* ── Gold dividers draw in ── */
    gsap.utils.toArray('.gold-divider').forEach((el) => {
      gsap.fromTo(el, { scaleX: 0, transformOrigin: 'left' }, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
      });
    });

    /* ── Parallax on hero content ── */
    gsap.to('.hero-content', {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /* ── Button ripple effect ── */
  function initRipple() {
    document.querySelectorAll('.btn-primary').forEach(btn => {
      btn.addEventListener('click', function (e) {
        const r    = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        r.style.cssText = `
          position:absolute;
          width:${size}px;
          height:${size}px;
          top:${e.clientY - rect.top - size/2}px;
          left:${e.clientX - rect.left - size/2}px;
          background:rgba(255,255,255,0.25);
          border-radius:50%;
          transform:scale(0);
          animation:ripple 0.6s ease-out forwards;
          pointer-events:none;
        `;
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(r);
        setTimeout(() => r.remove(), 700);
      });
    });

    /* Inject ripple keyframe if not present */
    if (!document.getElementById('ripple-style')) {
      const s = document.createElement('style');
      s.id = 'ripple-style';
      s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
      document.head.appendChild(s);
    }
  }

  /* ── Active nav link on scroll ── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(s => observer.observe(s));

    /* Inject active style */
    if (!document.getElementById('nav-active-style')) {
      const s = document.createElement('style');
      s.id = 'nav-active-style';
      s.textContent = '.nav-links a.active{color:var(--white)}.nav-links a.active::after{width:100%}';
      document.head.appendChild(s);
    }
  }

  /* ── Init all ── */
  function init() {
    initCursor();
    initNavbar();
    initHamburger();
    initMagnetic();
    initScrollAnimations();
    initRipple();
    initActiveNav();
  }

  return { init };
})();
