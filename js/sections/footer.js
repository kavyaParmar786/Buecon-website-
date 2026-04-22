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
            <li><a href="get-a-quote.html">Get a Quote</a></li>
            <li><a href="installation-guide.html">Installation Guide</a></li>
            <li><a href="warranty.html">Warranty</a></li>
            <li><a href="trade-program.html">Trade Program</a></li>
          </ul>
        </div>

      </div>

      <!-- Bottom bar -->
      <div class="footer-bottom">
        <p class="footer-copy">
          © ${year} BUECON. All rights reserved. Made with care in Rajkot, Gujarat.
        </p>
        <nav class="footer-legal">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms-of-use.html">Terms of Use</a>
        </nav>
      </div>

    </div>
  `;
}


