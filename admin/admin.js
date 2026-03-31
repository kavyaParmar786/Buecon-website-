/* ═══════════════════════════════════════════
   BUECON — Admin Panel JS
   Product CRUD, content editing, localStorage
   ═══════════════════════════════════════════ */

const AdminPanel = (() => {
  let products = [];
  let editingId = null;

  /* ══════════════════════
     BOOT
  ══════════════════════ */
  function init() {
    loadProducts();
    renderProductGrid();
    loadContentFields();
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

    const titles = { dashboard:'Dashboard', products:'Products', content:'Content', settings:'Settings' };
    const titleEl = document.getElementById('adminPageTitle');
    if (titleEl) titleEl.textContent = titles[name] || name;
  }

  /* ══════════════════════
     PRODUCTS — Load / Save
  ══════════════════════ */
  function loadProducts() {
    const saved = localStorage.getItem('buecon_products');
    if (saved) {
      try { products = JSON.parse(saved); } catch { products = [...(window.BUECON?.products || [])]; }
    } else {
      products = JSON.parse(JSON.stringify(window.BUECON?.products || []));
    }

    /* Update stat */
    const statEl = document.getElementById('stat-products');
    if (statEl) statEl.textContent = products.length;
  }

  function saveProducts() {
    localStorage.setItem('buecon_products', JSON.stringify(products));
    const statEl = document.getElementById('stat-products');
    if (statEl) statEl.textContent = products.length;
  }

  /* ══════════════════════
     PRODUCTS — Render Grid
  ══════════════════════ */
  function renderProductGrid() {
    const grid = document.getElementById('productsAdminGrid');
    if (!grid) return;

    grid.innerHTML = products.map(p => `
      <div class="glass-card product-admin-card" id="pac-${p.id}">
        <p class="pac-series">${p.series}</p>
        <h3 class="pac-name">${p.icon || '◈'} ${p.name} Series</h3>
        <div class="pac-style">
          ${(p.style || []).map(s => `<span class="pac-style-tag">${s}</span>`).join('')}
        </div>
        <p style="font-size:0.8rem;color:var(--silver-dim);line-height:1.5;margin-bottom:16px">
          ${(p.description || '').slice(0, 80)}…
        </p>
        <div class="pac-actions">
          <button class="pac-btn edit" onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
          <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕ Delete</button>
        </div>
      </div>
    `).join('');
  }

  /* ══════════════════════
     PRODUCTS — Modal
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
      document.getElementById('mp-style').value    = (p.style || []).join(', ');
      document.getElementById('mp-features').value = (p.features || []).join('\n');
    } else {
      title.textContent = 'Add Product';
      ['mp-series','mp-name','mp-icon','mp-tagline','mp-desc','mp-style','mp-features'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const prev = document.getElementById('mp-img-preview');
      if (prev) prev.style.display = 'none';
    }

    modal.classList.add('open');
  }

  function closeProductModal() {
    const modal = document.getElementById('productModalBg');
    modal.classList.remove('open');
    editingId = null;
  }

  function saveProduct() {
    const series   = document.getElementById('mp-series').value.trim();
    const name     = document.getElementById('mp-name').value.trim();
    const icon     = document.getElementById('mp-icon').value.trim() || '◈';
    const tagline  = document.getElementById('mp-tagline').value.trim();
    const desc     = document.getElementById('mp-desc').value.trim();
    const styleRaw = document.getElementById('mp-style').value.trim();
    const featRaw  = document.getElementById('mp-features').value.trim();

    if (!series || !name) {
      toast('Series and Name are required.', 'warn');
      return;
    }

    const style    = styleRaw ? styleRaw.split(',').map(s => s.trim()).filter(Boolean) : ['modern'];
    const features = featRaw  ? featRaw.split('\n').map(f => f.trim()).filter(Boolean) : [];

    if (editingId) {
      /* Update existing */
      const idx = products.findIndex(p => p.id === editingId);
      if (idx > -1) {
        products[idx] = { ...products[idx], series, name, icon, tagline, description: desc, style, features };
        toast('Product updated ✓');
      }
    } else {
      /* Add new */
      const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
      products.push({
        id, series, name, icon, tagline,
        description: desc, style, features,
        insight: 'Perfect for modern interiors',
        badge: `✨ ${name}`,
      });
      toast('Product added ✓');
    }

    saveProducts();
    renderProductGrid();
    closeProductModal();
  }

  function deleteProduct(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    products = products.filter(p => p.id !== id);
    saveProducts();
    renderProductGrid();
    toast('Product deleted.');
  }

  /* ══════════════════════
     IMAGE / MODEL UPLOAD
  ══════════════════════ */
  function previewImg(input) {
    const prev = document.getElementById('mp-img-preview');
    if (!input.files?.[0] || !prev) return;
    const url = URL.createObjectURL(input.files[0]);
    prev.src = url;
    prev.style.display = 'block';

    const box = document.getElementById('imgUploadBox');
    if (box) box.style.borderColor = 'rgba(197,164,109,0.5)';
    toast('Image selected — save to assets/images/ manually.');
  }

  function handleModel(input) {
    if (!input.files?.[0]) return;
    const box = document.getElementById('modelUploadBox');
    if (box) {
      box.style.borderColor = 'rgba(197,164,109,0.5)';
      box.querySelector('p').textContent = input.files[0].name;
    }
    toast('3D model selected — save to assets/models/ manually.');
  }

  /* ══════════════════════
     CONTENT MANAGEMENT
  ══════════════════════ */
  function loadContentFields() {
    const saved = JSON.parse(localStorage.getItem('buecon_content') || '{}');
    const fields = {
      'content-headline': 'Designed to Speak. Built to Last.',
      'content-subline':  'Hardware that transforms spaces into experiences.',
      'content-about':    'Founded in 2016 in Rajkot, Gujarat...',
      'content-phone':    '9825591898',
      'content-email':    'kavyaparmar7866@gmail.com',
    };
    Object.keys(fields).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = saved[id] !== undefined ? saved[id] : fields[id];
    });
  }

  function saveContent() {
    const fields = ['content-headline','content-subline','content-about','content-phone','content-email'];
    const data = {};
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) data[id] = el.value;
    });
    localStorage.setItem('buecon_content', JSON.stringify(data));
    toast('Content saved ✓ — Changes will reflect on next page load.');
  }

  /* ══════════════════════
     SETTINGS — Test Supabase
  ══════════════════════ */
  async function testSupabase() {
    const url = document.getElementById('sb-url')?.value.trim();
    const key = document.getElementById('sb-key')?.value.trim();
    const status = document.getElementById('sb-status');

    if (!url || !key) { toast('Enter Supabase URL and Key first.', 'warn'); return; }
    if (status) { status.textContent = 'Testing…'; status.style.color = 'var(--silver-dim)'; }

    try {
      const res = await fetch(`${url}/rest/v1/`, {
        headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
      });
      if (res.ok || res.status === 200) {
        if (status) { status.textContent = '✓ Connected'; status.style.color = '#4CAF50'; }
        localStorage.setItem('buecon_sb_url', url);
        localStorage.setItem('buecon_sb_key', key);
        toast('Supabase connected ✓');
      } else {
        if (status) { status.textContent = '✕ Failed (' + res.status + ')'; status.style.color = '#E05B5B'; }
      }
    } catch {
      if (status) { status.textContent = '✕ Network error'; status.style.color = '#E05B5B'; }
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
    toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ── Boot ── */
  document.addEventListener('DOMContentLoaded', init);

  return { showPanel, openProductModal, closeProductModal, saveProduct, deleteProduct, previewImg, handleModel, saveContent, testSupabase };
})();
