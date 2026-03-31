/* ═══════════════════════════════════════════
   BUECON — Admin Panel
   Full Supabase CRUD — products & content
   ═══════════════════════════════════════════ */

const AdminPanel = (() => {
  let products  = [];
  let editingId = null;

  /* ══════════════════════
     BOOT
  ══════════════════════ */
  async function init() {
    showLoading(true);
    await loadProducts();
    renderProductGrid();
    await loadContentFields();
    updateStats();
    showLoading(false);
  }

  function showLoading(on) {
    document.body.style.opacity = on ? '0.6' : '1';
    document.body.style.pointerEvents = on ? 'none' : '';
  }

  /* ══════════════════════
     PANEL NAVIGATION
  ══════════════════════ */
  function showPanel(name, btn) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.add('active');
    if (btn)   btn.classList.add('active');
    const titles = { dashboard: 'Dashboard', products: 'Products', content: 'Content', settings: 'Settings' };
    const titleEl = document.getElementById('adminPageTitle');
    if (titleEl) titleEl.textContent = titles[name] || name;
  }

  /* ══════════════════════
     PRODUCTS — Load
  ══════════════════════ */
  async function loadProducts() {
    try {
      const data = await SB.get('products', '?order=created_at.asc');
      products = data || [];
      toast(`${products.length} products loaded ✓`);
    } catch (err) {
      toast('Could not load products from Supabase. Check connection.', 'warn');
      /* Fallback to defaults */
      products = JSON.parse(JSON.stringify(window.BUECON_DEFAULTS?.products || []));
    }
  }

  /* ══════════════════════
     PRODUCTS — Render Grid
  ══════════════════════ */
  function renderProductGrid() {
    const grid = document.getElementById('productsAdminGrid');
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `<div class="glass-card" style="padding:32px;text-align:center;color:var(--silver-dim);grid-column:1/-1">
        No products yet. Click "+ Add Product" to create your first one.
      </div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="glass-card product-admin-card" id="pac-${p.id}">
        ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}" style="width:100%;height:120px;object-fit:cover;border-radius:10px;margin-bottom:12px"/>` : `
        <div style="width:100%;height:80px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:var(--gold);opacity:0.4;margin-bottom:12px">${p.icon || '◈'}</div>`}
        <p class="pac-series">${p.series || ''}</p>
        <h3 class="pac-name">${p.icon || ''} ${p.name} Series</h3>
        <div class="pac-style">
          ${(Array.isArray(p.style) ? p.style : []).map(s => `<span class="pac-style-tag">${s}</span>`).join('')}
        </div>
        <p style="font-size:0.8rem;color:var(--silver-dim);line-height:1.5;margin-bottom:16px">
          ${(p.description || '').slice(0, 90)}…
        </p>
        <div class="pac-actions">
          <button class="pac-btn edit"   onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
          <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕ Delete</button>
        </div>
      </div>
    `).join('');
  }

  /* ══════════════════════
     PRODUCTS — Modal Open
  ══════════════════════ */
  function openProductModal(id) {
    editingId = id || null;
    const modal = document.getElementById('productModalBg');
    const title = document.getElementById('modalTitle');

    if (id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      title.textContent = 'Edit Product';
      document.getElementById('mp-series').value   = p.series   || '';
      document.getElementById('mp-name').value     = p.name     || '';
      document.getElementById('mp-icon').value     = p.icon     || '';
      document.getElementById('mp-tagline').value  = p.tagline  || '';
      document.getElementById('mp-desc').value     = p.description || '';
      document.getElementById('mp-style').value    = (Array.isArray(p.style)    ? p.style    : []).join(', ');
      document.getElementById('mp-features').value = (Array.isArray(p.features) ? p.features : []).join('\n');
      document.getElementById('mp-insight').value  = p.insight  || '';
      document.getElementById('mp-imgurl').value   = p.image_url || '';

      const prev = document.getElementById('mp-img-preview');
      if (prev && p.image_url) { prev.src = p.image_url; prev.style.display = 'block'; }
      else if (prev) prev.style.display = 'none';
    } else {
      title.textContent = 'Add Product';
      ['mp-series','mp-name','mp-icon','mp-tagline','mp-desc','mp-style','mp-features','mp-insight','mp-imgurl'].forEach(fid => {
        const el = document.getElementById(fid);
        if (el) el.value = '';
      });
      const prev = document.getElementById('mp-img-preview');
      if (prev) prev.style.display = 'none';
    }

    modal.classList.add('open');
  }

  function closeProductModal() {
    document.getElementById('productModalBg')?.classList.remove('open');
    editingId = null;
  }

  /* ══════════════════════
     PRODUCTS — Save (Supabase upsert)
  ══════════════════════ */
  async function saveProduct() {
    const series   = document.getElementById('mp-series').value.trim();
    const name     = document.getElementById('mp-name').value.trim();
    const icon     = document.getElementById('mp-icon').value.trim()     || '◈';
    const tagline  = document.getElementById('mp-tagline').value.trim();
    const desc     = document.getElementById('mp-desc').value.trim();
    const styleRaw = document.getElementById('mp-style').value.trim();
    const featRaw  = document.getElementById('mp-features').value.trim();
    const insight  = document.getElementById('mp-insight').value.trim();
    const imgUrl   = document.getElementById('mp-imgurl').value.trim();

    if (!series || !name) { toast('Series and Name are required.', 'warn'); return; }

    const style    = styleRaw ? styleRaw.split(',').map(s => s.trim()).filter(Boolean) : ['modern'];
    const features = featRaw  ? featRaw.split('\n').map(f => f.trim()).filter(Boolean) : [];
    const id       = editingId || name.toLowerCase().replace(/\s+/g, '-');

    const payload = {
      id, series, name, icon, tagline,
      description: desc,
      style,
      features,
      insight: insight || 'Perfect for modern interiors',
      badge:   `✨ ${name}`,
      image_url: imgUrl,
    };

    const saveBtn = document.querySelector('.modal-footer .btn-admin-primary');
    if (saveBtn) { saveBtn.textContent = 'Saving…'; saveBtn.disabled = true; }

    try {
      await SB.upsert('products', payload);

      /* Update local array */
      const idx = products.findIndex(p => p.id === id);
      if (idx > -1) products[idx] = payload;
      else           products.push(payload);

      toast(editingId ? 'Product updated ✓' : 'Product added ✓');
      renderProductGrid();
      updateStats();
      closeProductModal();
    } catch (err) {
      toast('Save failed: ' + err.message, 'warn');
    } finally {
      if (saveBtn) { saveBtn.textContent = 'Save Product'; saveBtn.disabled = false; }
    }
  }

  /* ══════════════════════
     PRODUCTS — Delete
  ══════════════════════ */
  async function deleteProduct(id) {
    if (!confirm('Delete this product permanently from the database?')) return;
    try {
      await SB.delete('products', 'id', id);
      products = products.filter(p => p.id !== id);
      renderProductGrid();
      updateStats();
      toast('Product deleted.');
    } catch (err) {
      toast('Delete failed: ' + err.message, 'warn');
    }
  }

  /* ══════════════════════
     CONTENT — Load & Save
  ══════════════════════ */
  async function loadContentFields() {
    try {
      const rows = await SB.get('content');
      if (!rows || rows.length === 0) return;
      const map = {};
      rows.forEach(r => { map[r.key] = r.value; });

      const fieldMap = {
        'content-headline': map.hero_headline,
        'content-subline':  map.hero_subline,
        'content-about':    map.about_text,
        'content-phone':    map.contact_phone,
        'content-email':    map.contact_email,
      };

      Object.entries(fieldMap).forEach(([fid, val]) => {
        const el = document.getElementById(fid);
        if (el && val !== undefined) el.value = val;
      });
    } catch (err) {
      console.warn('Could not load content:', err.message);
    }
  }

  async function saveContent() {
    const fieldMap = {
      'hero_headline': document.getElementById('content-headline')?.value,
      'hero_subline':  document.getElementById('content-subline')?.value,
      'about_text':    document.getElementById('content-about')?.value,
      'contact_phone': document.getElementById('content-phone')?.value,
      'contact_email': document.getElementById('content-email')?.value,
    };

    const saveBtn = document.querySelector('#panel-content .btn-admin-primary');
    if (saveBtn) { saveBtn.textContent = 'Saving…'; saveBtn.disabled = true; }

    try {
      const rows = Object.entries(fieldMap).map(([key, value]) => ({
        key, value: value || '', updated_at: new Date().toISOString(),
      }));
      await SB.upsert('content', rows);
      toast('Content saved ✓ — Live on site immediately.');
    } catch (err) {
      toast('Save failed: ' + err.message, 'warn');
    } finally {
      if (saveBtn) { saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false; }
    }
  }

  /* ══════════════════════
     STATS
  ══════════════════════ */
  function updateStats() {
    const el = document.getElementById('stat-products');
    if (el) el.textContent = products.length;
  }

  /* ══════════════════════
     IMAGE PREVIEW
  ══════════════════════ */
  function previewImg(input) {
    const prev = document.getElementById('mp-img-preview');
    if (!input.files?.[0] || !prev) return;
    const url = URL.createObjectURL(input.files[0]);
    prev.src = url;
    prev.style.display = 'block';
    toast('Image selected. For Supabase storage, upload via dashboard and paste the URL in the Image URL field.');
  }

  function handleModel(input) {
    if (!input.files?.[0]) return;
    const box = document.getElementById('modelUploadBox');
    if (box) box.querySelector('p').textContent = input.files[0].name;
    toast('3D model selected. Upload to Supabase Storage → paste public URL in code.');
  }

  /* ══════════════════════
     SUPABASE TEST
  ══════════════════════ */
  async function testSupabase() {
    const status = document.getElementById('sb-status');
    if (status) { status.textContent = 'Testing…'; status.style.color = 'var(--silver-dim)'; }
    try {
      await SB.get('products', '?limit=1');
      if (status) { status.textContent = '✓ Connected'; status.style.color = '#4CAF50'; }
      toast('Supabase connection active ✓');
    } catch {
      if (status) { status.textContent = '✕ Failed'; status.style.color = '#E05B5B'; }
      toast('Connection failed. Check URL and key.', 'warn');
    }
  }

  /* ══════════════════════
     TOAST
  ══════════════════════ */
  let toastTimer;
  function toast(msg, type = 'ok') {
    const t = document.getElementById('adminToast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = type === 'warn' ? 'rgba(255,193,7,0.4)' : 'rgba(197,164,109,0.3)';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  document.addEventListener('DOMContentLoaded', init);

  return { showPanel, openProductModal, closeProductModal, saveProduct, deleteProduct, previewImg, handleModel, saveContent, testSupabase };
})();
