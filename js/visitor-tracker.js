/* ═══════════════════════════════════════════
   BUECON — Visitor Tracker (Supabase Global)
   Drop this script tag into every page AFTER
   supabase-client.js:
   <script src="js/supabase-client.js"></script>
   <script src="js/visitor-tracker.js"></script>
   ═══════════════════════════════════════════ */

(function () {

  /* Detect device */
  function getDevice() {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
  }

  /* Get current page name */
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

  /* Generate or retrieve session visitor ID */
  function getVisitorId() {
    let id = sessionStorage.getItem('buecon_vid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10).toUpperCase();
      sessionStorage.setItem('buecon_vid', id);
    }
    return id;
  }

  /* Generate or retrieve visitor display name */
  function getVisitorName() {
    const stored = localStorage.getItem('buecon_visitor_name');
    if (stored) return stored;
    const name = 'Visitor #' + getVisitorId();
    localStorage.setItem('buecon_visitor_name', name);
    return name;
  }

  /* Approximate location from timezone */
  function getLocation() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityMap = {
        'Asia/Kolkata':       { city: 'India',       country: 'IN' },
        'Asia/Mumbai':        { city: 'Mumbai',       country: 'IN' },
        'Asia/Delhi':         { city: 'Delhi',        country: 'IN' },
        'America/New_York':   { city: 'New York',     country: 'US' },
        'America/Los_Angeles':{ city: 'Los Angeles',  country: 'US' },
        'America/Chicago':    { city: 'Chicago',      country: 'US' },
        'Europe/London':      { city: 'London',       country: 'GB' },
        'Europe/Paris':       { city: 'Paris',        country: 'FR' },
        'Europe/Berlin':      { city: 'Berlin',       country: 'DE' },
        'Asia/Dubai':         { city: 'Dubai',        country: 'AE' },
        'Asia/Singapore':     { city: 'Singapore',    country: 'SG' },
        'Asia/Tokyo':         { city: 'Tokyo',        country: 'JP' },
        'Australia/Sydney':   { city: 'Sydney',       country: 'AU' },
      };
      return cityMap[tz] || { city: tz.split('/')[1]?.replace('_', ' ') || 'Unknown', country: '—' };
    } catch {
      return { city: 'Unknown', country: '—' };
    }
  }

  /* Upsert page hit counter in Supabase */
  async function incrementPageHit(page) {
    try {
      // Try insert first
      const insertRes = await fetch(
        `${SUPABASE_URL}/rest/v1/page_hits`,
        {
          method: 'POST',
          headers: {
            ...SB.headers,
            'Prefer': 'resolution=ignore-duplicates,return=minimal',
          },
          body: JSON.stringify({ page, count: 1 }),
        }
      );

      if (insertRes.status === 409 || insertRes.status === 200 || insertRes.status === 201) {
        // Row might already exist — increment via RPC or re-fetch + patch
        const getRes = await fetch(
          `${SUPABASE_URL}/rest/v1/page_hits?page=eq.${encodeURIComponent(page)}`,
          { headers: SB.headers }
        );
        const rows = await getRes.json();
        if (rows && rows.length > 0) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/page_hits?page=eq.${encodeURIComponent(page)}`,
            {
              method: 'PATCH',
              headers: { ...SB.headers, 'Prefer': 'return=minimal' },
              body: JSON.stringify({ count: rows[0].count + 1 }),
            }
          );
        }
      }
    } catch (e) {
      console.warn('BUECON tracker: page hit failed', e.message);
    }
  }

  /* Save visitor row to Supabase */
  async function recordVisit() {
    const page = getPageName();
    const loc  = getLocation();
    const id   = getVisitorId();

    const visitor = {
      id:        id + '_' + Date.now(), // unique per page visit
      name:      getVisitorName(),
      page:      page,
      city:      loc.city,
      country:   loc.country,
      device:    getDevice(),
      timestamp: Date.now(),
      ua:        navigator.userAgent.slice(0, 80),
    };

    try {
      await SB.insert('visitors', visitor);
      await incrementPageHit(page);
    } catch (e) {
      console.warn('BUECON tracker: Supabase save failed, falling back to localStorage', e.message);

      // Fallback: localStorage so data isn't lost if Supabase is down
      try {
        const STORAGE_KEY = 'buecon_visitors';
        const PAGE_KEY    = 'buecon_page_hits';
        const visitors = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        visitors.push(visitor);
        if (visitors.length > 50) visitors.splice(0, visitors.length - 50);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
        const hits = JSON.parse(localStorage.getItem(PAGE_KEY) || '{}');
        hits[page] = (hits[page] || 0) + 1;
        localStorage.setItem(PAGE_KEY, JSON.stringify(hits));
      } catch (_) {}
    }
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordVisit);
  } else {
    recordVisit();
  }

})();
