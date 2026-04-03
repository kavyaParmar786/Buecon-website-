/* ═══════════════════════════════════════════
   BUECON — Visitor Tracker
   Drop this script tag into every page:
   <script src="js/visitor-tracker.js"></script>
   ═══════════════════════════════════════════ */

(function () {
  const STORAGE_KEY = 'buecon_visitors';
  const PAGE_KEY    = 'buecon_page_hits';

  function getVisitors() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
  }

  function getPageHits() {
    try { return JSON.parse(localStorage.getItem(PAGE_KEY)) || {}; } catch { return {}; }
  }

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

  /* Generate or retrieve visitor ID */
  function getVisitorId() {
    let id = sessionStorage.getItem('buecon_vid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10).toUpperCase();
      sessionStorage.setItem('buecon_vid', id);
    }
    return id;
  }

  /* Try to get a display name from browser hints */
  function getVisitorName() {
    // Use stored name if available
    const stored = localStorage.getItem('buecon_visitor_name');
    if (stored) return stored;
    // Generate a code-style name from visitor ID
    const id = getVisitorId();
    const name = 'Visitor #' + id;
    localStorage.setItem('buecon_visitor_name', name);
    return name;
  }

  /* Approximate location from timezone */
  function getLocation() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cityMap = {
        'Asia/Kolkata': { city: 'India', country: 'IN' },
        'Asia/Mumbai': { city: 'Mumbai', country: 'IN' },
        'Asia/Delhi': { city: 'Delhi', country: 'IN' },
        'America/New_York': { city: 'New York', country: 'US' },
        'America/Los_Angeles': { city: 'Los Angeles', country: 'US' },
        'America/Chicago': { city: 'Chicago', country: 'US' },
        'Europe/London': { city: 'London', country: 'GB' },
        'Europe/Paris': { city: 'Paris', country: 'FR' },
        'Europe/Berlin': { city: 'Berlin', country: 'DE' },
        'Asia/Dubai': { city: 'Dubai', country: 'AE' },
        'Asia/Singapore': { city: 'Singapore', country: 'SG' },
        'Asia/Tokyo': { city: 'Tokyo', country: 'JP' },
        'Australia/Sydney': { city: 'Sydney', country: 'AU' },
      };
      return cityMap[tz] || { city: tz.split('/')[1]?.replace('_', ' ') || 'Unknown', country: '—' };
    } catch {
      return { city: 'Unknown', country: '—' };
    }
  }

  /* Record this visit */
  function recordVisit() {
    const page     = getPageName();
    const loc      = getLocation();
    const visitors = getVisitors();

    // Add visitor entry
    visitors.push({
      id:        getVisitorId(),
      name:      getVisitorName(),
      page:      page,
      city:      loc.city,
      country:   loc.country,
      device:    getDevice(),
      timestamp: Date.now(),
      ua:        navigator.userAgent.slice(0, 80),
    });

    // Keep last 200 entries
    if (visitors.length > 200) visitors.splice(0, visitors.length - 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));

    // Increment page hit counter
    const hits = getPageHits();
    hits[page] = (hits[page] || 0) + 1;
    localStorage.setItem(PAGE_KEY, JSON.stringify(hits));
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', recordVisit);
  } else {
    recordVisit();
  }
})();
