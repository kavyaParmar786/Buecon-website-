/* ═══════════════════════════════════════════
   BUECON — Visitor Tracker (Supabase Global)
   Asks visitor's name on first visit via modal.
   ═══════════════════════════════════════════ */

(function () {

  function getDevice() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  }

  function getPageName() {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    const map = {
      'index.html': 'Home', '': 'Home',
      'products.html': 'Products',
      'about.html': 'About',
      'contact.html': 'Contact',
      'why.html': 'Why Us',
      'mission.html': 'Mission',
      'reviews.html': 'Reviews',
    };
    return map[file] || file;
  }

  function getVisitorId() {
    let id = localStorage.getItem('buecon_vid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10).toUpperCase();
      localStorage.setItem('buecon_vid', id);
    }
    return id;
  }

  function getVisitorName() {
    return localStorage.getItem('buecon_visitor_name') || null;
  }

  function saveVisitorName(name) {
    localStorage.setItem('buecon_visitor_name', name);
  }

  function getLocation() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityMap = {
        'Asia/Kolkata':        { city: 'India',       country: 'IN' },
        'Asia/Calcutta':       { city: 'Kolkata',     country: 'IN' },
        'Asia/Mumbai':         { city: 'Mumbai',      country: 'IN' },
        'Asia/Delhi':          { city: 'Delhi',       country: 'IN' },
        'America/New_York':    { city: 'New York',    country: 'US' },
        'America/Los_Angeles': { city: 'Los Angeles', country: 'US' },
        'America/Chicago':     { city: 'Chicago',     country: 'US' },
        'Europe/London':       { city: 'London',      country: 'GB' },
        'Europe/Paris':        { city: 'Paris',       country: 'FR' },
        'Europe/Berlin':       { city: 'Berlin',      country: 'DE' },
        'Asia/Dubai':          { city: 'Dubai',       country: 'AE' },
        'Asia/Singapore':      { city: 'Singapore',   country: 'SG' },
        'Asia/Tokyo':          { city: 'Tokyo',       country: 'JP' },
        'Australia/Sydney':    { city: 'Sydney',      country: 'AU' },
      };
      return cityMap[tz] || { city: tz.split('/')[1]?.replace('_', ' ') || 'Unknown', country: '—' };
    } catch {
      return { city: 'Unknown', country: '—' };
    }
  }

  async function incrementPageHit(page) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/page_hits`, {
        method: 'POST',
        headers: { ...SB.headers, 'Prefer': 'resolution=ignore-duplicates,return=minimal' },
        body: JSON.stringify({ page, count: 1 }),
      });
      const getRes = await fetch(
        `${SUPABASE_URL}/rest/v1/page_hits?page=eq.${encodeURIComponent(page)}`,
        { headers: SB.headers }
      );
      const rows = await getRes.json();
      if (rows && rows.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/page_hits?page=eq.${encodeURIComponent(page)}`, {
          method: 'PATCH',
          headers: { ...SB.headers, 'Prefer': 'return=minimal' },
          body: JSON.stringify({ count: rows[0].count + 1 }),
        });
      }
    } catch (e) {
      console.warn('BUECON tracker: page hit failed', e.message);
    }
  }

  async function recordVisit(name) {
    const page = getPageName();
    const loc  = getLocation();
    const id   = getVisitorId();

    const visitor = {
      id:        id + '_' + Date.now(),
      name:      name,
      page:      page,
      city:      loc.city,
      country:   loc.country,
      device:    getDevice(),
      timestamp: Date.now(),
    };

    try {
      await SB.insert('visitors', visitor);
      await incrementPageHit(page);
    } catch (e) {
      console.warn('BUECON tracker: save failed', e.message);
    }
  }

  /* ── Show name prompt modal ── */
  function showNamePrompt(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = 'visitor-prompt-overlay';
    overlay.innerHTML = `
      <div class="vp-card">
        <div class="vp-icon">✦</div>
        <div class="vp-label">Welcome to BUECON</div>
        <h2 class="vp-title">Hello, <em>Stranger</em></h2>
        <p class="vp-sub">Before you explore our collections, we'd love to know who you are. Just your name — nothing else.</p>
        <div class="vp-input-wrap">
          <input class="vp-input" id="vp-name-input" type="text" placeholder="Your name..." maxlength="40" autocomplete="name"/>
        </div>
        <button class="vp-btn" id="vp-submit">Enter →</button>
        <button class="vp-skip" id="vp-skip">Continue anonymously</button>
        <div class="vp-privacy">
          <div class="vp-privacy-dot"></div>
          Your name is only used to personalise your visit. We don't collect any other data.
        </div>
      </div>`;
    document.body.appendChild(overlay);

    // Animate in after paint
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));

    function dismiss(name) {
      overlay.classList.remove('visible');
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 400);
      onComplete(name);
    }

    document.getElementById('vp-submit').addEventListener('click', () => {
      const val = document.getElementById('vp-name-input').value.trim();
      dismiss(val || 'Anonymous');
    });

    document.getElementById('vp-name-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = document.getElementById('vp-name-input').value.trim();
        dismiss(val || 'Anonymous');
      }
    });

    document.getElementById('vp-skip').addEventListener('click', () => dismiss('Anonymous'));

    setTimeout(() => document.getElementById('vp-name-input')?.focus(), 450);
  }

  /* ── Main init ── */
  function init() {
    const savedName = getVisitorName();
    if (savedName) {
      recordVisit(savedName);
    } else {
      showNamePrompt((name) => {
        const finalName = name || 'Anonymous';
        saveVisitorName(finalName);
        recordVisit(finalName);
      });
    }
  }

  // FORCE IT TO RUN - MOVED INSIDE THE IIFE
  window.addEventListener('load', function() {
    setTimeout(init, 1500); // Wait for loader to finish
  });
   
})();
