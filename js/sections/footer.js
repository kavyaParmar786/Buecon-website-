/* ═══════════════════════════════════════════
   BUECON — Footer Renderer
   ═══════════════════════════════════════════ */

function renderFooter() {
  const el = document.getElementById('footer-content');
  if (!el) return;

  const year = new Date().getFullYear();

  el.innerHTML = `
    <div class="container">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo"><span>B</span>UECON</div>
          <p class="footer-tagline">
            Designed to Speak. Built to Last.<br>
            Premium bathroom hardware, crafted in Rajkot since 2016.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="Instagram">✦</a>
            <a href="#" class="social-link" aria-label="LinkedIn">in</a>
            <a href="#" class="social-link" aria-label="Pinterest">P</a>
            <a href="#" class="social-link" aria-label="Houzz">H</a>
          </div>
        </div>

        <!-- Collections -->
        <div class="footer-col">
          <p class="footer-col-title">Collections</p>
          <ul class="footer-links">
            <li><a href="#products">Salt Series</a></li>
            <li><a href="#products">Super Series</a></li>
            <li><a href="#products">Spirit Series</a></li>
            <li><a href="#products">400 Series</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div class="footer-col">
          <p class="footer-col-title">Company</p>
          <ul class="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#mission">Mission</a></li>
            <li><a href="#why">Why BUECON</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div class="footer-col">
          <p class="footer-col-title">Support</p>
          <ul class="footer-links">
            <li><a href="#contact">Get a Quote</a></li>
            <li><a href="#contact">Installation Guide</a></li>
            <li><a href="#contact">Warranty</a></li>
            <li><a href="#contact">Trade Program</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <p class="footer-copy">
          © ${year} BUECON. All rights reserved. Made with care in Rajkot, Gujarat.
        </p>
        <nav class="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Sitemap</a>
        </nav>
      </div>

    </div>
  `;
}

/* Patch: inject admin link into footer after it renders */
(function patchFooterAdmin() {
  const orig = window.renderFooter;
  window.renderFooter = function() {
    orig();
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom && !document.getElementById('admin-footer-link')) {
      const adminLink = document.createElement('a');
      adminLink.id   = 'admin-footer-link';
      adminLink.href = 'admin/index.html';
      adminLink.style.cssText = 'font-size:0.7rem;color:rgba(122,138,156,0.3);transition:color 0.2s;';
      adminLink.textContent = 'Admin';
      adminLink.onmouseenter = () => adminLink.style.color = 'var(--gold)';
      adminLink.onmouseleave = () => adminLink.style.color = 'rgba(122,138,156,0.3)';
      footerBottom.appendChild(adminLink);
    }
  };
})();
