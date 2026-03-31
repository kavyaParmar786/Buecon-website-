/* ═══════════════════════════════════════════
   BUECON — Supabase Client
   Single source of truth for DB connection
   ═══════════════════════════════════════════ */

const SUPABASE_URL  = 'https://qjpomdhpvheudpduywjj.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcG9tZGhwdmhldWRwZHV5d2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MzQ5MDcsImV4cCI6MjA5MDUxMDkwN30.NnPn9Rywzm7kRmh-cwgo80knDq7j6EeD873QGroYa78';

const SB = {
  headers: {
    'apikey':        SUPABASE_ANON,
    'Authorization': `Bearer ${SUPABASE_ANON}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation',
  },

  url(table, query = '') {
    return `${SUPABASE_URL}/rest/v1/${table}${query}`;
  },

  async get(table, query = '') {
    const res = await fetch(SB.url(table, query), { headers: SB.headers });
    if (!res.ok) throw new Error(`SB.get ${table}: ${res.status}`);
    return res.json();
  },

  async insert(table, data) {
    const res = await fetch(SB.url(table), {
      method: 'POST', headers: SB.headers, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`SB.insert ${table}: ${res.status}`);
    return res.json();
  },

  async update(table, data, col, val) {
    const res = await fetch(SB.url(table, `?${col}=eq.${encodeURIComponent(val)}`), {
      method: 'PATCH', headers: SB.headers, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`SB.update ${table}: ${res.status}`);
    return res.json();
  },

  async upsert(table, data) {
    const res = await fetch(SB.url(table), {
      method: 'POST',
      headers: { ...SB.headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`SB.upsert ${table}: ${res.status}`);
    return res.json();
  },

  async delete(table, col, val) {
    const res = await fetch(SB.url(table, `?${col}=eq.${encodeURIComponent(val)}`), {
      method: 'DELETE', headers: SB.headers,
    });
    if (!res.ok) throw new Error(`SB.delete ${table}: ${res.status}`);
    return true;
  },
};
