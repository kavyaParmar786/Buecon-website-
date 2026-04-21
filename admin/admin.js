/* ═══════════════════════════════════════════
   BUECON — Admin Panel
   Fixed: shows loading state, handles empty DB,
   full Supabase CRUD
   ═══════════════════════════════════════════ */

const AdminPanel = (() => {
  let products  = [];
  let editingId = null;

  /* ══════════════ BOOT ══════════════ */
  async function init() {
    showPageLoader(true);
    await loadProducts();
    await loadContentFields();
    renderProductGrid();
    updateStats();
    showPageLoader(false);
  }

  function showPageLoader(on) {
    let el = document.getElementById('page-loader');
    if (!el) {
      el = document.createElement('div');
      el.id = 'page-loader';
      el.style.cssText = `
        position:fixed;inset:0;background:rgba(6,15,24,0.7);
        display:flex;align-items:center;justify-content:center;
        z-index:9999;font-family:var(--font-sans);
        flex-direction:column;gap:16px;color:var(--silver-dim);font-size:0.9rem;
      `;
      el.innerHTML = `
        <div style="width:32px;height:32px;border:2px solid rgba(197,164,109,0.2);
          border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;"></div>
        <span>Loading from Supabase…</span>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
      `;
      document.body.appendChild(el);
    }
    el.style.display = on ? 'flex' : 'none';
  }

  /* ══════════════ PANEL NAV ══════════════ */
  function showPanel(name, btn) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + name)?.classList.add('active');
    if (btn) btn.classList.add('active');
    const titles = { dashboard:'Dashboard', products:'Products', content:'Content', settings:'Settings' };
    const el = document.getElementById('adminPageTitle');
    if (el) el.textContent = titles[name] || name;
  }

  /* ══════════════ LOAD PRODUCTS ══════════════ */
  async function loadProducts() {
    try {
      const data = await SB.get('products', '?order=created_at.asc');
      products = data || [];
      if (products.length > 0) {
        toast(`${products.length} products loaded ✓`);
      } else {
        toast('No products in DB yet — click "+ Add Product" or run seed.sql', 'warn');
      }
    } catch (e) {
      console.error('Supabase load error:', e);
      toast('Could not reach Supabase: ' + e.message, 'warn');
      products = [];
    }
  }

  /* ══════════════ RENDER GRID ══════════════ */
  function renderProductGrid() {
    const grid = document.getElementById('productsAdminGrid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;padding:48px;text-align:center;
          background:var(--glass-bg);border:1px solid var(--glass-border);
          border-radius:16px;color:var(--silver-dim);">
          <div style="font-size:2rem;margin-bottom:12px;opacity:0.3">◈</div>
          <p style="margin-bottom:8px;color:var(--white)">No products found in database</p>
          <p style="font-size:0.82rem;margin-bottom:20px">
            Run <code style="background:rgba(197,164,109,0.1);padding:2px 8px;border-radius:4px;color:var(--gold)">seed.sql</code>
            in Supabase SQL Editor, or add products manually.
          </p>
          <button class="btn-admin-primary" onclick="AdminPanel.openProductModal()">+ Add First Product</button>
        </div>`;
      return;
    }

    grid.innerHTML = products.map(p => {
      const styles = Array.isArray(p.style) ? p.style : [];
      return `
        <div class="glass-card product-admin-card">
          ${p.image_url
            ? `<img src="${p.image_url}" alt="${p.name}"
                style="width:100%;height:130px;object-fit:cover;border-radius:10px;margin-bottom:12px"
                onerror="this.style.display='none'">`
            : `<div style="height:80px;display:flex;align-items:center;justify-content:center;
                font-size:2.5rem;color:var(--gold);opacity:0.3;margin-bottom:12px">${p.icon||'◈'}</div>`
          }
          <p class="pac-series">${p.series||''}</p>
          <h3 class="pac-name">${p.icon||''} ${p.name}</h3>
          <div class="pac-style">
            ${styles.map(s=>`<span class="pac-style-tag">${s}</span>`).join('')}
          </div>
          <p style="font-size:0.8rem;color:var(--silver-dim);line-height:1.5;margin-bottom:16px">
            ${(p.description||'').slice(0,80)}…
          </p>
          <div class="pac-actions">
            <button class="pac-btn edit"   onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
            <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕ Delete</button>
          </div>
        </div>`;
    }).join('');
  }

  /* ══════════════ MODAL ══════════════ */
  function openProductModal(id) {
    editingId = id || null;
    const title = document.getElementById('modalTitle');
    if (title) title.textContent = id ? 'Edit Product' : 'Add Product';

    if (id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      setValue('mp-series',   p.series   || '');
      setValue('mp-name',     p.name     || '');
      setValue('mp-icon',     p.icon     || '');
      setValue('mp-tagline',  p.tagline  || '');
      setValue('mp-desc',     p.description || '');
      setValue('mp-style',    (Array.isArray(p.style)    ? p.style    : []).join(', '));
      setValue('mp-features', (Array.isArray(p.features) ? p.features : []).join('\n'));
      setValue('mp-insight',  p.insight  || '');
      setValue('mp-imgurl',   p.image_url || '');
      const prev = document.getElementById('mp-img-preview');
      if (prev) { prev.src = p.image_url||''; prev.style.display = p.image_url ? 'block':'none'; }
    } else {
      ['mp-series','mp-name','mp-icon','mp-tagline','mp-desc','mp-style','mp-features','mp-insight','mp-imgurl']
        .forEach(id => setValue(id, ''));
      const prev = document.getElementById('mp-img-preview');
      if (prev) prev.style.display = 'none';
    }
    document.getElementById('productModalBg')?.classList.add('open');
  }

  function setValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function closeProductModal() {
    document.getElementById('productModalBg')?.classList.remove('open');
    editingId = null;
  }

  /* ══════════════ SAVE PRODUCT ══════════════ */
  async function saveProduct() {
    const series = document.getElementById('mp-series')?.value.trim();
    const name   = document.getElementById('mp-name')?.value.trim();
    if (!series || !name) { toast('Series and Name are required.', 'warn'); return; }

    const payload = {
      id:          editingId || name.toLowerCase().replace(/\s+/g, '-'),
      series, name,
      icon:        document.getElementById('mp-icon')?.value.trim() || '◈',
      tagline:     document.getElementById('mp-tagline')?.value.trim() || '',
      description: document.getElementById('mp-desc')?.value.trim() || '',
      style:       (document.getElementById('mp-style')?.value||'').split(',').map(s=>s.trim()).filter(Boolean),
      features:    (document.getElementById('mp-features')?.value||'').split('\n').map(f=>f.trim()).filter(Boolean),
      insight:     document.getElementById('mp-insight')?.value.trim() || 'Perfect for modern interiors',
      badge:       `✨ ${name}`,
      image_url:   document.getElementById('mp-imgurl')?.value.trim() || '',
    };

    const btn = document.querySelector('.modal-footer .btn-admin-primary');
    if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }

    try {
      await SB.upsert('products', payload);
      const idx = products.findIndex(p => p.id === payload.id);
      if (idx > -1) products[idx] = payload;
      else products.push(payload);
      toast(editingId ? 'Product updated ✓ — live on site' : 'Product added ✓ — live on site');
      renderProductGrid();
      updateStats();
      closeProductModal();
    } catch (e) {
      toast('Save failed: ' + e.message, 'warn');
      console.error(e);
    } finally {
      if (btn) { btn.textContent = 'Save Product'; btn.disabled = false; }
    }
  }

  /* ══════════════ DELETE ══════════════ */
  async function deleteProduct(id) {
    if (!confirm('Delete this product permanently?')) return;
    try {
      await SB.delete('products', 'id', id);
      products = products.filter(p => p.id !== id);
      renderProductGrid();
      updateStats();
      toast('Deleted.');
    } catch (e) { toast('Delete failed: ' + e.message, 'warn'); }
  }

  /* ══════════════ CONTENT ══════════════ */
  async function loadContentFields() {
    try {
      const rows = await SB.get('content');
      if (!rows?.length) return;
      const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
      const fieldMap = {
        'content-headline': map.hero_headline,
        'content-subline':  map.hero_subline,
        'content-about':    map.about_text,
        'content-phone':    map.contact_phone,
        'content-email':    map.contact_email,
      };
      Object.entries(fieldMap).forEach(([fid, val]) => {
        if (val !== undefined) setValue(fid, val);
      });
    } catch (e) { console.warn('Content load:', e.message); }
  }

  async function saveContent() {
    const fieldMap = {
      'hero_headline': document.getElementById('content-headline')?.value,
      'hero_subline':  document.getElementById('content-subline')?.value,
      'about_text':    document.getElementById('content-about')?.value,
      'contact_phone': document.getElementById('content-phone')?.value,
      'contact_email': document.getElementById('content-email')?.value,
    };
    const btn = document.querySelector('#panel-content .btn-admin-primary');
    if (btn) { btn.textContent = 'Saving…'; btn.disabled = true; }
    try {
      const rows = Object.entries(fieldMap).map(([key, value]) => ({
        key, value: value || '', updated_at: new Date().toISOString(),
      }));
      await SB.upsert('content', rows);
      toast('Content saved ✓ — live on site immediately');
    } catch (e) { toast('Save failed: ' + e.message, 'warn'); }
    finally { if (btn) { btn.textContent = 'Save Changes'; btn.disabled = false; } }
  }

  /* ══════════════ STATS ══════════════ */
  function updateStats() {
    const el = document.getElementById('stat-products');
    if (el) el.textContent = products.length;
  }

  /* ══════════════ IMAGE PREVIEW ══════════════ */
  function previewImg(input) {
    const prev = document.getElementById('mp-img-preview');
    if (!input.files?.[0] || !prev) return;
    prev.src = URL.createObjectURL(input.files[0]);
    prev.style.display = 'block';
    toast('Image selected. To use it on the website, upload to Supabase Storage and paste the public URL in the Image URL field.');
  }

  function handleModel(input) {
    if (!input.files?.[0]) return;
    const box = document.getElementById('modelUploadBox');
    if (box) box.querySelector('p').textContent = input.files[0].name;
    toast('Upload this file to Supabase Storage → paste the public URL in your product data.');
  }

  /* ══════════════ TEST SUPABASE ══════════════ */
  async function testFirebase() {
    const status = document.getElementById('sb-status');
    if (status) { status.textContent = 'Testing…'; status.style.color = 'var(--silver-dim)'; }
    try {
      await FS.getAll('products').then(d => d.slice(0,1));
      if (status) { status.textContent = '✓ Connected'; status.style.color = '#4CAF50'; }
      toast('Supabase connected ✓');
    } catch (e) {
      if (status) { status.textContent = '✕ Failed — ' + e.message; status.style.color = '#E05B5B'; }
      toast('Connection failed: ' + e.message, 'warn');
    }
  }

  /* ══════════════ TOAST ══════════════ */
  let toastTimer;
  function toast(msg, type = 'ok') {
    const t = document.getElementById('adminToast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = type === 'warn' ? 'rgba(255,193,7,0.5)' : 'rgba(197,164,109,0.3)';
    t.style.color = type === 'warn' ? '#FFC107' : 'var(--white)';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 4500);
  }

  document.addEventListener('DOMContentLoaded', init);
  return { showPanel, openProductModal, closeProductModal, saveProduct, deleteProduct, previewImg, handleModel, saveContent, testFirebase };
})();

/* ═══════════════════════════════════════════
   BUECON Admin — Catalog Leads Module
   ═══════════════════════════════════════════ */

let allCatalogLeads = [];

async function fetchCatalogLeads() {
  try {
    const data = await FS.getAll('catalog_leads');
    allCatalogLeads = data || [];
    document.getElementById('catalog-lead-count').textContent = allCatalogLeads.length;
  } catch (e) {
    console.warn('Catalog leads fetch failed:', e.message);
    allCatalogLeads = [];
    document.getElementById('catalog-lead-count').textContent = 'error';
  }
}

function renderCatalogLeads() {
  const body    = document.getElementById('catalogLeadsBody');
  if (!body) return;

  const query   = (document.getElementById('catalog-search')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('catalog-filter-type')?.value || '';

  let leads = allCatalogLeads.filter(l => {
    const matchText = !query ||
      (l.name  || '').toLowerCase().includes(query) ||
      (l.email || '').toLowerCase().includes(query) ||
      (l.city  || '').toLowerCase().includes(query) ||
      (l.company || '').toLowerCase().includes(query);
    const matchType = !typeFilter || l.user_type === typeFilter;
    return matchText && matchType;
  });

  if (!leads.length) {
    body.innerHTML = `
      <div class="empty-state" style="padding:48px;text-align:center;color:rgba(240,236,228,0.3);">
        <div style="font-size:2rem;margin-bottom:12px;">◈</div>
        <p>${allCatalogLeads.length === 0 ? 'No catalog requests yet. Run the SQL migration to create the table.' : 'No leads match your filter.'}</p>
      </div>`;
    return;
  }

  const typeBadgeColor = {
    Architect:'#c5a46d', Contractor:'#7aadcc', Dealer:'#4caf7d',
    Retailer:'#a07cd4', Homeowner:'#e0914f', Other:'#7a8a9c'
  };

  body.innerHTML = leads.map((l, i) => {
    const date   = l.downloaded_at ? new Date(l.downloaded_at) : null;
    const dateStr = date
      ? date.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'2-digit' })
      : '—';
    const badgeColor = typeBadgeColor[l.user_type] || '#7a8a9c';
    const isNew = date && (Date.now() - date.getTime()) < 86400000;

    return `
      <div class="feed-row" style="
        grid-template-columns:1.8fr 1.8fr 1.2fr 1.2fr 1fr 1fr 1fr;
        animation: fadeUp 0.4s ease both;
        animation-delay: ${i * 0.03}s;
      ">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="
            width:32px;height:32px;min-width:32px;
            border-radius:50%;
            background:rgba(197,164,109,0.1);
            border:1px solid rgba(197,164,109,0.2);
            display:flex;align-items:center;justify-content:center;
            font-family:var(--mono);font-size:11px;color:var(--gold);font-weight:700;
          ">${(l.name||'?')[0].toUpperCase()}</div>
          <div>
            <div style="color:#f0ece4;font-size:13px;font-weight:500;">${l.name || '—'}</div>
            ${isNew ? '<div style="font-size:9px;color:#4caf7d;letter-spacing:0.1em;">NEW</div>' : ''}
          </div>
        </div>
        <div style="color:rgba(240,236,228,0.7);font-size:12px;font-family:var(--mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${l.email||''}">${l.email || '—'}</div>
        <div style="color:rgba(240,236,228,0.7);font-size:12px;font-family:var(--mono);">${l.phone || '—'}</div>
        <div style="color:rgba(240,236,228,0.55);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${l.company || <span style="opacity:0.3">—</span>}</div>
        <div style="color:rgba(240,236,228,0.55);font-size:12px;">${l.city || '—'}</div>
        <div>
          <span style="
            display:inline-block;padding:3px 9px;border-radius:20px;
            font-size:10px;font-family:var(--mono);letter-spacing:0.05em;
            background:${badgeColor}18;border:1px solid ${badgeColor}44;color:${badgeColor};
          ">${l.user_type || '—'}</span>
        </div>
        <div style="color:rgba(240,236,228,0.4);font-size:11px;font-family:var(--mono);">${dateStr}</div>
      </div>`;
  }).join('');
}

function exportCatalogLeads() {
  if (!allCatalogLeads.length) {
    alert('No catalog leads to export.');
    return;
  }
  const headers = ['Name','Email','Phone','Company','City','Type','Consent','Downloaded At'];
  const rows = allCatalogLeads.map(l => [
    l.name || '', l.email || '', l.phone || '', l.company || '',
    l.city || '', l.user_type || '', l.consent ? 'Yes' : 'No',
    l.downloaded_at ? new Date(l.downloaded_at).toLocaleString('en-IN') : ''
  ]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `buecon-catalog-leads-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// Hook into admin boot — load leads alongside visitors
(function patchAdminBoot() {
  const origInit = document.addEventListener;
  const origFetch = window.startPolling;

  // Attach after DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchCatalogLeads();
    renderCatalogLeads();
  });
})();
