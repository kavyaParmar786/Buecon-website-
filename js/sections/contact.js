/* ═══════════════════════════════════════════
   BUECON — Contact Section — UPGRADED
   Real contact info + working form with
   validation + loading state + success msg
   ═══════════════════════════════════════════ */

function renderContact() {
  const el = document.getElementById('contact-content');
  if (!el) return;

  const { contact } = BUECON;

  const infoItems = [
    { icon: '◎', label: 'Address',       value: contact.address },
    { icon: '✆', label: 'Phone',         value: `<a href="tel:${contact.phone.replace(/\s/g,'')}" style="color:inherit">${contact.phone}</a>` },
    { icon: '✉', label: 'Email',         value: `<a href="mailto:${contact.email}" style="color:inherit">${contact.email}</a>` },
    { icon: '◷', label: 'Working Hours', value: contact.hours },
  ];

  el.innerHTML = `
    <div class="container">
      <div class="contact-header">
        <span class="section-label">Get in Touch</span>
        <h2 class="section-title">Let's <span class="italic">Talk</span></h2>
        <div class="gold-divider" style="margin:16px auto;"></div>
        <p class="section-sub">Whether you're an architect, designer, or homeowner — we'd love to discuss how BUECON can elevate your space.</p>
      </div>

      <div class="contact-grid">
        <div class="contact-info">
          ${infoItems.map(item => `
            <div class="contact-item">
              <div class="contact-item-icon">${item.icon}</div>
              <div class="contact-item-body">
                <p class="contact-item-label">${item.label}</p>
                <p class="contact-item-value">${item.value}</p>
              </div>
            </div>
          `).join('')}
          <a href="${contact.map}" target="_blank" rel="noopener" class="btn-ghost" style="margin-top:8px;width:fit-content;">View on Map →</a>
        </div>

        <div class="contact-form-wrap glass-panel">
          <form id="contactForm" novalidate>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="fname">First Name <span class="required-star">*</span></label>
                <input class="form-input" id="fname" name="fname" type="text" placeholder="Arjun" required autocomplete="given-name"/>
                <span class="form-error" id="err-fname"></span>
              </div>
              <div class="form-group">
                <label class="form-label" for="lname">Last Name</label>
                <input class="form-input" id="lname" name="lname" type="text" placeholder="Mehta" autocomplete="family-name"/>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="cemail">Email <span class="required-star">*</span></label>
              <input class="form-input" id="cemail" name="email" type="email" placeholder="arjun@studio.in" required autocomplete="email"/>
              <span class="form-error" id="err-email"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="phone">Phone</label>
              <input class="form-input" id="phone" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel"/>
            </div>

            <div class="form-group">
              <label class="form-label" for="interest">Interested In</label>
              <select class="form-input" id="interest" name="interest">
                <option value="">Select a collection…</option>
                <option value="Salt Series">Salt Series</option>
                <option value="Super Series">Super Series</option>
                <option value="Spirit Series">Spirit Series</option>
                <option value="400 Series">400 Series</option>
                <option value="General Enquiry">General Enquiry</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Message <span class="required-star">*</span></label>
              <textarea class="form-textarea" id="message" name="message" placeholder="Tell us about your project…" required></textarea>
              <span class="form-error" id="err-message"></span>
            </div>

            <button type="submit" class="btn-primary form-submit" id="contactSubmit">
              <span class="btn-text">Send Message →</span>
              <span class="btn-loader" style="display:none">
                <span class="spinner"></span> Sending…
              </span>
            </button>

          </form>

          <div class="form-success-msg" id="formSuccess" style="display:none">
            <div class="success-icon">✦</div>
            <h3>Thank you!</h3>
            <p>We've received your message and will be in touch within 24 hours.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  /* Inject spinner style */
  if (!document.getElementById('spinner-style')) {
    const s = document.createElement('style');
    s.id = 'spinner-style';
    s.textContent = `
      .spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(11,28,44,0.3);border-top-color:var(--navy-deep);border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:6px}
      @keyframes spin{to{transform:rotate(360deg)}}
      .required-star{color:var(--gold);font-size:0.8em}
      .form-error{font-size:0.75rem;color:#E05B5B;margin-top:4px;display:block;min-height:16px}
      .form-input.error,.form-textarea.error{border-color:rgba(224,91,91,0.5)!important}
      .form-success-msg{text-align:center;padding:40px 20px}
      .form-success-msg .success-icon{font-size:2.5rem;color:var(--gold);margin-bottom:16px}
      .form-success-msg h3{font-family:var(--font-serif);font-size:1.5rem;color:var(--white);margin-bottom:8px}
      .form-success-msg p{color:var(--silver-dim);font-size:0.9rem}
    `;
    document.head.appendChild(s);
  }

  initContactForm();
}

function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('contactSubmit');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  /* Real-time validation */
  ['fname','cemail','message'].forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener('blur', () => validateField(id));
    inp.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    /* Validate all required */
    const valid = ['fname','cemail','message'].map(validateField).every(Boolean);
    if (!valid) return;

    /* Loading state */
    setLoading(true);

    const data = {
      name:     (document.getElementById('fname')?.value || '') + ' ' + (document.getElementById('lname')?.value || ''),
      email:    document.getElementById('cemail')?.value || '',
      phone:    document.getElementById('phone')?.value   || '',
      interest: document.getElementById('interest')?.value || '',
      message:  document.getElementById('message')?.value  || '',
    };

    try {
      /* Send to API endpoint */
      const res = await fetch('api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showSuccess();
      } else {
        /* Fallback: open mailto if API not configured */
        fallbackMailto(data);
        showSuccess();
      }
    } catch (err) {
      /* API not available — open mailto as graceful fallback */
      fallbackMailto(data);
      showSuccess();
    }
  });

  function validateField(id) {
    const inp = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (!inp) return true;

    inp.classList.remove('error');
    if (errEl) errEl.textContent = '';

    if (!inp.value.trim()) {
      inp.classList.add('error');
      if (errEl) errEl.textContent = 'This field is required.';
      return false;
    }
    if (id === 'cemail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
      inp.classList.add('error');
      if (errEl) errEl.textContent = 'Please enter a valid email.';
      return false;
    }
    return true;
  }

  function clearError(id) {
    const inp = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (inp) inp.classList.remove('error');
    if (errEl) errEl.textContent = '';
  }

  function setLoading(on) {
    if (!btn) return;
    btn.disabled = on;
    const t = btn.querySelector('.btn-text');
    const l = btn.querySelector('.btn-loader');
    if (t) t.style.display = on ? 'none' : '';
    if (l) l.style.display = on ? 'inline-flex' : 'none';
  }

  function showSuccess() {
    if (form)    form.style.display    = 'none';
    if (success) success.style.display = 'block';
  }

  function fallbackMailto(data) {
    const body = encodeURIComponent(
      `Name: ${data.name}\nPhone: ${data.phone}\nInterest: ${data.interest}\n\n${data.message}`
    );
    window.open(`mailto:kavyaparmar7866@gmail.com?subject=BUECON Enquiry from ${data.name}&body=${body}`);
  }
}
