/* ═══════════════════════════════════════════
   BUECON — Firebase Client
   Drop-in replacement for supabase-client.js
   Uses Firebase REST API (no SDK needed).

   ⚠️  SETUP: Replace the config values below
       with your own Firebase project's values.
       Go to: Firebase Console → Project Settings
       → Your Apps → Web App → Config
   ═══════════════════════════════════════════ */

const FB_CONFIG = {
  apiKey:            'AIzaSyAJYusLo4pCg8El_38x4soihvdMzWpgbag',
  projectId:         'buecon',
  databaseURL:       'https://buecon-default-rtdb.firebaseio.com',
};

/* ── Firestore REST base ── */
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents`;

/* ── Realtime DB base (for visitors & page_hits — faster writes) ── */
const RTDB = FB_CONFIG.databaseURL;

/* ══════════════════════════════════════════
   FIRESTORE helpers (products, content,
   reviews, catalog_leads)
   ══════════════════════════════════════════ */

/* Convert Firestore document → plain JS object */
function fsDocToObj(doc) {
  if (!doc || !doc.fields) return null;
  const obj = { _id: doc.name?.split('/').pop() };
  for (const [k, v] of Object.entries(doc.fields)) {
    if (v.stringValue  !== undefined) obj[k] = v.stringValue;
    else if (v.integerValue !== undefined) obj[k] = parseInt(v.integerValue);
    else if (v.doubleValue  !== undefined) obj[k] = parseFloat(v.doubleValue);
    else if (v.booleanValue !== undefined) obj[k] = v.booleanValue;
    else if (v.timestampValue !== undefined) obj[k] = v.timestampValue;
    else if (v.arrayValue?.values) {
      obj[k] = v.arrayValue.values.map(i =>
        i.stringValue ?? i.integerValue ?? i.booleanValue ?? ''
      );
    } else if (v.nullValue !== undefined) obj[k] = null;
    else obj[k] = null;
  }
  return obj;
}

/* Convert plain JS object → Firestore fields */
function objToFsFields(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === '_id') continue;
    if (v === null || v === undefined)  fields[k] = { nullValue: null };
    else if (typeof v === 'boolean')    fields[k] = { booleanValue: v };
    else if (typeof v === 'number')     fields[k] = Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    else if (Array.isArray(v))          fields[k] = { arrayValue: { values: v.map(i => ({ stringValue: String(i) })) } };
    else                                fields[k] = { stringValue: String(v) };
  }
  return fields;
}

const FS = {
  /* Get all docs in a collection */
  async getAll(collection) {
    const res = await fetch(`${FS_BASE}/${collection}?key=${FB_CONFIG.apiKey}`);
    if (!res.ok) throw new Error(`FS.getAll ${collection}: ${res.status}`);
    const data = await res.json();
    return (data.documents || []).map(fsDocToObj).filter(Boolean);
  },

  /* Get single doc by ID */
  async get(collection, id) {
    const res = await fetch(`${FS_BASE}/${collection}/${id}?key=${FB_CONFIG.apiKey}`);
    if (!res.ok) return null;
    return fsDocToObj(await res.json());
  },

  /* Add new doc (auto-ID) */
  async add(collection, data) {
    const res = await fetch(`${FS_BASE}/${collection}?key=${FB_CONFIG.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: objToFsFields(data) }),
    });
    if (!res.ok) throw new Error(`FS.add ${collection}: ${res.status} — ${await res.text()}`);
    return fsDocToObj(await res.json());
  },

  /* Set doc with specific ID (create or overwrite) */
  async set(collection, id, data) {
    const fields = objToFsFields(data);
    const fieldPaths = Object.keys(fields).join(',');
    const res = await fetch(
      `${FS_BASE}/${collection}/${id}?key=${FB_CONFIG.apiKey}&updateMask.fieldPaths=${Object.keys(fields).join('&updateMask.fieldPaths=')}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      }
    );
    if (!res.ok) throw new Error(`FS.set ${collection}/${id}: ${res.status}`);
    return fsDocToObj(await res.json());
  },

  /* Delete doc by ID */
  async delete(collection, id) {
    const res = await fetch(`${FS_BASE}/${collection}/${id}?key=${FB_CONFIG.apiKey}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`FS.delete ${collection}/${id}: ${res.status}`);
    return true;
  },

  /* Query with simple filters — basic support for orderBy / limit */
  async query(collection, opts = {}) {
    /* Use structured query via runQuery */
    const body = {
      structuredQuery: {
        from: [{ collectionId: collection }],
      }
    };
    if (opts.orderBy) {
      body.structuredQuery.orderBy = [{
        field: { fieldPath: opts.orderBy },
        direction: opts.orderDir || 'DESCENDING',
      }];
    }
    if (opts.limit) body.structuredQuery.limit = opts.limit;

    const res = await fetch(`${FS_BASE}:runQuery?key=${FB_CONFIG.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`FS.query ${collection}: ${res.status}`);
    const rows = await res.json();
    return rows.map(r => r.document ? fsDocToObj(r.document) : null).filter(Boolean);
  },
};

/* ══════════════════════════════════════════
   REALTIME DATABASE helpers
   (visitors, page_hits — fast, no schema)
   ══════════════════════════════════════════ */

const RDB = {
  async get(path) {
    const res = await fetch(`${RTDB}/${path}.json?orderBy="$key"&limitToLast=200`);
    if (!res.ok) throw new Error(`RDB.get ${path}: ${res.status}`);
    const data = await res.json();
    if (!data) return [];
    return Object.entries(data).map(([k, v]) => ({ _key: k, ...v }));
  },

  async push(path, data) {
    const res = await fetch(`${RTDB}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`RDB.push ${path}: ${res.status}`);
    return res.json(); // { name: "-auto_id" }
  },

  async set(path, data) {
    const res = await fetch(`${RTDB}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`RDB.set ${path}: ${res.status}`);
    return res.json();
  },

  async update(path, data) {
    const res = await fetch(`${RTDB}/${path}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`RDB.update ${path}: ${res.status}`);
    return res.json();
  },

  async deleteAll(path) {
    const res = await fetch(`${RTDB}/${path}.json`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`RDB.deleteAll ${path}: ${res.status}`);
    return true;
  },
};

/* ══════════════════════════════════════════
   SB — backwards-compat shim
   All existing code calls SB.get / SB.insert
   etc. This maps those to Firebase.
   ══════════════════════════════════════════ */

const SB = {
  /* ── products & content ──  (Firestore) */
  async get(table, query = '') {
    if (table === 'visitors')      return RDB.get('visitors');
    if (table === 'page_hits')     return RDB.get('page_hits').then(rows => {
      // Convert RTDB {page, count} records to array for admin
      return rows.map(r => ({ page: r.page || r._key, count: r.count || 1 }));
    });
    if (table === 'catalog_leads') return FS.getAll('catalog_leads');
    if (table === 'reviews')       return FS.query('reviews', { orderBy: 'created_at' });

    /* products, content: ordered */
    return FS.query(table, { orderBy: 'created_at', orderDir: 'ASCENDING' });
  },

  async insert(table, data) {
    if (table === 'visitors')      return RDB.push('visitors', data);
    if (table === 'catalog_leads') return FS.add('catalog_leads', data);
    if (table === 'reviews')       return FS.add('reviews', data);
    return FS.add(table, data);
  },

  async upsert(table, data) {
    /* For products / content — use doc ID from data.id or data.key */
    const id = data.id || data.key || Date.now().toString();
    return FS.set(table, String(id), data);
  },

  async update(table, data, col, val) {
    /* find doc where col=val, then patch */
    const docs = await FS.getAll(table);
    const doc  = docs.find(d => d[col] === val || d._id === String(val));
    if (!doc) throw new Error(`SB.update: no doc where ${col}=${val}`);
    return FS.set(table, doc._id, { ...doc, ...data });
  },

  async delete(table, col, val) {
    if (table === 'visitors') return RDB.deleteAll('visitors');
    const docs = await FS.getAll(table);
    const doc  = docs.find(d => d[col] === val || d._id === String(val));
    if (!doc) throw new Error(`SB.delete: no doc where ${col}=${val}`);
    return FS.delete(table, doc._id);
  },
};
