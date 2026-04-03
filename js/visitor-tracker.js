/* ═══════════════════════════════════════════
   BUECON — Visitor Tracker
   Saves visitor name + page data to Supabase.
   localStorage is ONLY used to remember the
   visitor across pages — Supabase gets every visit.
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Supabase config (same as supabase-client.js) ── */
  const SB_URL  = 'https://qjpomdhpvheudpduywjj.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcG9tZGhwdmhldWRwZHV5d2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MzQ5MDcsImV4cCI6MjA5MDUxMDkwN30.NnPn9Rywzm7kRmh-cwgo80knDq7j6EeD873QGroYa78';
  const HEADERS = {
    'apikey':        SB_ANON,
    'Authorization': 'Bearer ' + SB_ANON,
    'Content-Type':  'application/json',
    'Prefer':        'return=minimal',
  };

  /* ── Helpers ── */
  function getDevice() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  }

  function getPageName() {
    const file = window.location.pathname.split('/').pop() || 'index.html';
    return {
      'index.html': 'Home', '': 'Home',
      'products.html': 'Products',
      'about.html': 'About',
      'contact.html': 'Contact',
      'why.html': 'Why Us',
      'mission.html': 'Mission',
      'reviews.html': 'Reviews',
    }[file] || file;
  }

  function getVisitorId() {
    let id = localStorage.getItem('buecon_vid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10).toUpperCase();
      localStorage.setItem('buecon_vid', id);
    }
    return id;
  }

  function getSavedName() {
    return localStorage.getItem('buecon_visitor_name_v2') || null;
  }

  function saveName(name) {
    localStorage.setItem('buecon_visitor_name_v2', name);
  }

  function getLocation() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const map = {
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
      return map[tz] || { city: tz.split('/').pop()?.replace('_', ' ') || 'Unknown', country: '—' };
    } catch {
      return { city: 'Unknown', country: '—' };
    }
  }

  /* ── Supabase: record this visit ── */
  async function recordVisit(name) {
    const loc = getLocation();
    const row = {
      visitor_id: getVisitorId(),
      name:       name,
      page:       getPageName(),
      city:       loc.city,
      country:    loc.country,
      device:     getDevice(),
      visited_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${SB_URL}/rest/v1/visitors`, {
        method:  'POST',
        headers: HEADERS,
        body:    JSON.stringify(row),
      });
      if (!res.ok) {
        const err = await res.text();
        console.warn('BUECON tracker: insert failed —', res.status, err);
      } else {
        console.log('BUECON tracker: visit recorded ✓', row.name, '@', row.page);
      }
    } catch (e) {
      console.warn('BUECON tracker: network error —', e.message);
    }
  }

  /* ── Modal ── */
  function showModal(onComplete) {
    const overlay = document.createElement('div');
    overlay.id = 'visitor-prompt-overlay';
    overlay.innerHTML = `
      <div class="vp-card">
        <div class="vp-icon">✦</div>
        <div class="vp-label">Welcome to BUECON</div>
        <h2 class="vp-title">Hello, <em>Stranger</em></h2>
        <p class="vp-sub">Before you explore our collections, we'd love to know who you are. Just your name — nothing else.</p>
        <div class="vp-input-wrap">
          <input class="vp-input" id="vp-name-input" type="text" placeholder="Your name…" maxlength="40" autocomplete="name"/>
        </div>
        <button class="vp-btn" id="vp-submit">Enter →</button>
        <button class="vp-skip" id="vp-skip">Continue anonymously</button>
        <div class="vp-privacy">
          <div class="vp-privacy-dot"></div>
          Your name is only used to personalise your visit. We don't collect any other data.
        </div>
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    /* Animate in */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('visible'));
    });

    function dismiss(name) {
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      setTimeout(() => overlay.remove(), 450);
      onComplete(name || 'Anonymous');
    }

    document.getElementById('vp-submit').addEventListener('click', () => {
      dismiss(document.getElementById('vp-name-input').value.trim());
    });

    document.getElementById('vp-name-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') dismiss(e.target.value.trim());
    });

    document.getElementById('vp-skip').addEventListener('click', () => dismiss('Anonymous'));

    setTimeout(() => document.getElementById('vp-name-input')?.focus(), 300);
  }

  /* ── Boot ── */
  function boot() {
    const saved = getSavedName();

    if (saved) {
      /* Returning visitor — just log the page visit silently */
      recordVisit(saved);
    } else {
      /* First visit — show modal */
      showModal(name => {
        saveName(name);
        recordVisit(name);
      });
    }
  }

  /* Wait for DOM + small delay so loader animation has played */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 1800));
  } else {
    setTimeout(boot, 1800);
  }

})();
