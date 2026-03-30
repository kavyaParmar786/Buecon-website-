/* ═══════════════════════════════════════════
   BUECON — Contact Section Renderer
   ═══════════════════════════════════════════ */

function renderContact() {
  const el = document.getElementById('contact-content');
  if (!el) return;

  const { contact } = BUECON;

  const infoItems = [
    { icon: '◎', label: 'Address',       value: contact.address },
    { icon: '◉', label: 'Phone',         value: contact.phone   },
    { icon: '✉', label: 'Email',         value: contact.email   },
    { icon: '◷', label: 'Working Hours', value: contact.hours   },
  ];

  const infoHTML = infoItems.map(item => `
    <div class="contact-item">
      <div class="contact-item-icon">${item.icon}</div>
      <div class="contact-item-body">
        <p class="contact-item-label">${item.label}</p>
        <p class="contact-item-value">${item.value}</p>
      </div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="container">

      <div class="contact-header">
        <span class="section-label">Get in Touch</span>
        <h2 class="section-title">
          Let's <span class="italic">Talk</span>
        </h2>
        <div class="gold-divider" style="margin: 16px auto;"></div>
        <p class="section-sub">
          Whether you're an architect, designer, or homeowner —
          we'd love to discuss how BUECON can elevate your space.
        </p>
      </div>

      <div class="contact-grid">

        <!-- Info -->
        <div class="contact-info">
          ${infoHTML}

          <a
            href="${contact.map}"
            target="_blank"
            rel="noopener"
            class="btn-ghost"
            style="margin-top: 8px; width: fit-content;"
          >
            View on Map →
          </a>
        </div>

        <!-- Form -->
        <div class="contact-form-wrap glass-panel">
          <form id="contactForm" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="fname">First Name</label>
                <input class="form-input" id="fname" type="text" placeholder="Arjun" required />
              </div>
              <div class="form-group">
                <label class="form-label" for="lname">Last Name</label>
                <input class="form-input" id="lname" type="text" placeholder="Mehta" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input class="form-input" id="email" type="email" placeholder="arjun@studio.in" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="interest">Interested In</label>
              <select class="form-input" id="interest">
                <option value="">Select a collection…</option>
                <option value="salt">Salt Series</option>
                <option value="super">Super Series</option>
                <option value="spirit">Spirit Series</option>
                <option value="400">400 Series</option>
                <option value="general">General Enquiry</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Message</label>
              <textarea
                class="form-textarea"
                id="message"
                placeholder="Tell us about your project…"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn-primary form-submit">
              Send Message →
            </button>
          </form>
        </div>

      </div>
    </div>
  `;
}
