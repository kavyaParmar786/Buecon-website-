/* ═══════════════════════════════════════════
   BUECON — Contact Section
   Fixed email + WhatsApp added
   ═══════════════════════════════════════════ */

function renderContact() {
  const el = document.getElementById('contact-content');
  if (!el) return;

  const { contact } = BUECON;
  const phone    = contact.phone || '9825591898';
  const email    = contact.email || 'kavyaparmar7866@gmail.com';
  const waLink   = `https://wa.me/91${phone.replace(/\s+/g,'')}?text=Hi%20BUECON%2C%20I%27m%20interested%20in%20your%20bathroom%20hardware.`;

  el.innerHTML = `
    <section style="padding:var(--sp-xl) 0;background:linear-gradient(180deg,var(--steel) 0%,var(--navy-deep) 100%);">
      <div class="container">
        <div class="contact-header" style="text-align:center;margin-bottom:64px;">
          <span class="section-label">Get in Touch</span>
          <h2 class="section-title">Let's <span class="italic">Talk</span></h2>
          <div class="gold-divider" style="margin:16px auto;"></div>
          <p class="section-sub" style="margin:0 auto;">
            Whether you're an architect, designer, or homeowner — we'd love to discuss how BUECON can elevate your space.
          </p>
        </div>

        <div class="contact-grid">

          <!-- Left: Info -->
          <div class="contact-info">

            <div class="contact-item">
              <div class="contact-item-icon">◎</div>
              <div>
                <p class="contact-item-label">Address</p>
                <p class="contact-item-value">${contact.address || 'Rajkot, Gujarat, India — 360001'}</p>
              </div>
            </div>

            <a class="contact-item" href="tel:+91${phone.replace(/\s+/g,'')}">
              <div class="contact-item-icon">✆</div>
              <div>
                <p class="contact-item-label">Phone</p>
                <p class="contact-item-value">${phone}</p>
              </div>
            </a>

            <a class="contact-item" href="${waLink}" target="_blank" rel="noopener">
              <div class="contact-item-icon" style="background:rgba(37,211,102,0.12);border-color:rgba(37,211,102,0.25)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.823L0 24l6.335-1.502A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.5-5.19-1.376L2.5 21.5l.912-4.189A9.942 9.942 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              </div>
              <div>
                <p class="contact-item-label">WhatsApp</p>
                <p class="contact-item-value" style="color:#25D366">Chat with us on WhatsApp →</p>
              </div>
            </a>

            <a class="contact-item" href="mailto:${email}">
              <div class="contact-item-icon">✉</div>
              <div>
                <p class="contact-item-label">Email</p>
                <p class="contact-item-value">${email}</p>
              </div>
            </a>

            <div class="contact-item">
              <div class="contact-item-icon">◷</div>
              <div>
                <p class="contact-item-label">Working Hours</p>
                <p class="contact-item-value">${contact.hours || 'Mon – Sat, 9:00 AM – 6:00 PM IST'}</p>
              </div>
            </div>

            <a href="https://maps.google.com/?q=Rajkot,Gujarat,India" target="_blank" rel="noopener"
              class="btn-ghost" style="margin-top:8px;width:fit-content;">View on Map →</a>

          </div>

          <!-- Right: Form -->
          <div class="contact-form-wrap glass-panel">
            <form id="contactForm" novalidate>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="fname">First Name <span style="color:var(--gold)">*</span></label>
                  <input class="form-input" id="fname" name="fname" type="text" placeholder="Arjun" required autocomplete="given-name"/>
                  <span class="form-error" id="err-fname"></span>
                </div>
                <div class="form-group">
                  <label class="form-label" for="lname">Last Name</label>
                  <input class="form-input" id="lname" name="lname" type="text" placeholder="Mehta" autocomplete="family-name"/>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="cemail">Email <span style="color:var(--gold)">*</span></label>
                <input class="form-input" id="cemail" name="email" type="email" placeholder="arjun@studio.in" required autocomplete="email"/>
                <span class="form-error" id="err-email"></span>
              </div>

              <div class="form-group">
                <label class="form-label" for="cphone">Phone / WhatsApp</label>
                <input class="form-input" id="cphone" name="phone" type="tel" placeholder="+91 98765 43210"/>
              </div>

              <div class="form-group">
                <label class="form-label" for="interest">Interested In</label>
                <select class="form-input" id="interest" name="interest">
                  <option value="">Select a collection…</option>
                  <option>Salt Series</option>
                  <option>Super Series</option>
                  <option>Spirit Series</option>
                  <option>Soft Series</option>
                  <option>Smart Series</option>
                  <option>General Enquiry</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="message">Message <span style="color:var(--gold)">*</span></label>
                <textarea class="form-textarea" id="message" name="message"
                  placeholder="Tell us about your project…" required></textarea>
                <span class="form-error" id="err-message"></span>
              </div>

              <div style="display:flex;gap:12px;flex-wrap:wrap;">
                <button type="submit" class="btn-primary form-submit" id="contactSubmit" style="flex:1">
                  <span class="btn-label">Send Message →</span>
                  <span class="btn-loading" style="display:none">
                    <span class="spinner"></span> Sending…
                  </span>
                </button>
                <a href="${waLink}" target="_blank" rel="noopener"
                  class="btn-ghost" style="display:flex;align-items:center;gap:8px;text-decoration:none;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.105 1.523 5.823L0 24l6.335-1.502A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.5-5.19-1.376L2.5 21.5l.912-4.189A9.942 9.942 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                  WhatsApp
                </a>
              </div>

            </form>

            <div id="formSuccess" style="display:none;text-align:center;padding:40px 20px;">
              <div style="font-size:2.5rem;color:var(--gold);margin-bottom:16px">✦</div>
              <h3 style="font-family:var(--font-serif);font-size:1.5rem;color:var(--white);margin-bottom:8px">Thank you!</h3>
              <p style="color:var(--silver-dim)">We'll be in touch within 24 hours.</p>
              <a href="${waLink}" target="_blank" rel="noopener"
                class="btn-ghost" style="margin-top:20px;display:inline-flex;gap:8px;text-decoration:none;">
                Or chat on WhatsApp →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>`;

  /* Inject styles */
  if (!document.getElementById('contact-extra-css')) {
    const s = document.createElement('style');
    s.id = 'contact-extra-css';
    s.textContent = `
      .contact-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:48px;align-items:start}
      .contact-info{display:flex;flex-direction:column;gap:16px}
      .contact-item{display:flex;gap:18px;align-items:flex-start;padding:20px 24px;border-radius:14px;background:var(--glass-bg);border:1px solid var(--glass-border);transition:border-color 0.3s,transform 0.3s;text-decoration:none;color:inherit}
      .contact-item:hover{border-color:var(--glass-border-h);transform:translateX(5px)}
      .contact-item-icon{width:40px;height:40px;background:var(--gold-pale);border:1px solid rgba(197,164,109,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
      .contact-item-label{font-size:0.68rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:4px}
      .contact-item-value{font-size:0.875rem;color:var(--silver);line-height:1.5}
      .contact-form-wrap{padding:40px 36px}
      .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      .form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:16px}
      .form-label{font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--silver-dim)}
      .form-input,.form-textarea{background:rgba(255,255,255,0.04);border:1px solid rgba(197,164,109,0.15);border-radius:10px;padding:12px 16px;color:var(--white);font-family:var(--font-sans);font-size:0.875rem;transition:border-color 0.2s,box-shadow 0.2s;width:100%}
      .form-input::placeholder,.form-textarea::placeholder{color:rgba(122,138,156,0.4)}
      .form-input:focus,.form-textarea:focus{border-color:rgba(197,164,109,0.45);box-shadow:0 0 0 3px rgba(197,164,109,0.07);outline:none}
      .form-textarea{resize:vertical;min-height:120px}
      .form-error{font-size:0.72rem;color:#E05B5B;min-height:16px}
      .form-input.error,.form-textarea.error{border-color:rgba(224,91,91,0.5)}
      .spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,0.2);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px}
      @keyframes spin{to{transform:rotate(360deg)}}
      @media(max-width:900px){.contact-grid{grid-template-columns:1fr}.form-row{grid-template-columns:1fr}.contact-form-wrap{padding:28px 20px}}
    `;
    document.head.appendChild(s);
  }

  initContactForm();
}

function initContactForm() {
  const form    = document.getElementById('contactForm');
  const submit  = document.getElementById('contactSubmit');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  ['fname','cemail','message'].forEach(id => {
    const inp = document.getElementById(id);
    if (!inp) return;
    inp.addEventListener('blur',  () => validateField(id));
    inp.addEventListener('input', () => {
      inp.classList.remove('error');
      const e = document.getElementById('err-'+id);
      if (e) e.textContent = '';
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ok = ['fname','cemail','message'].map(validateField).every(Boolean);
    if (!ok) return;
    setLoading(true);

    const body = {
      name:     (document.getElementById('fname')?.value||'') + ' ' + (document.getElementById('lname')?.value||''),
      email:    document.getElementById('cemail')?.value,
      phone:    document.getElementById('cphone')?.value,
      interest: document.getElementById('interest')?.value,
      message:  document.getElementById('message')?.value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showSuccess();
      } else {
        /* Fallback mailto */
        openMailto(body);
        showSuccess();
      }
    } catch {
      openMailto(body);
      showSuccess();
    }
  });

  function validateField(id) {
    const inp = document.getElementById(id);
    const err = document.getElementById('err-'+id);
    if (!inp) return true;
    inp.classList.remove('error');
    if (err) err.textContent = '';
    if (!inp.value.trim()) {
      inp.classList.add('error');
      if (err) err.textContent = 'This field is required.';
      return false;
    }
    if (id === 'cemail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value)) {
      inp.classList.add('error');
      if (err) err.textContent = 'Enter a valid email.';
      return false;
    }
    return true;
  }

  function setLoading(on) {
    if (!submit) return;
    submit.disabled = on;
    submit.querySelector('.btn-label').style.display  = on ? 'none' : '';
    submit.querySelector('.btn-loading').style.display = on ? 'inline-flex' : 'none';
  }

  function showSuccess() {
    if (form)    form.style.display    = 'none';
    if (success) success.style.display = 'block';
  }

  function openMailto(d) {
    const body = encodeURIComponent(`Name: ${d.name}\nPhone: ${d.phone}\nInterest: ${d.interest}\n\n${d.message}`);
    window.open(`mailto:kavyaparmar7866@gmail.com?subject=BUECON Enquiry&body=${body}`);
  }
}
