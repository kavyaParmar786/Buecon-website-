/* ═══════════════════════════════════════════
   BUECON — Admin Panel JS
   Clean rewrite — products tab fully rebuilt
   All other panels (content, settings) intact
   ═══════════════════════════════════════════ */

const AdminPanel = (() => {

  /* ── State ── */
  const LS_KEY    = 'buecon_products_v2';
  let data        = null;   // full { categories: [...] }
  let editCtx     = null;   // { cat, sub|null, product } for current edit
  let activeCatId = null;
  let activeSubId = null;

  /* ══════════════════════════════
     BOOT
  ══════════════════════════════ */
  function init() {
    data = loadData();
    renderCategoryTabs();
    updateStats();
  }

  /* ══════════════════════════════
     DATA — localStorage
  ══════════════════════════════ */
  function loadData() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    // Seed from PRODUCTS_DEFAULTS defined in products.js
    if (window.PRODUCTS_DEFAULTS)
      return JSON.parse(JSON.stringify(window.PRODUCTS_DEFAULTS));
    return { categories: [] };
  }

  function saveData() {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    updateStats();
    toast('Saved ✓ — changes are live on the website now.');
  }

  /* ══════════════════════════════
     PANEL NAVIGATION (unchanged)
  ══════════════════════════════ */
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

  /* ══════════════════════════════
     STATS
  ══════════════════════════════ */
  function updateStats() {
    const el = document.getElementById('stat-products');
    if (!el || !data) return;
    let total = 0;
    data.categories.forEach(cat => {
      if (cat.hasSubCategories)
        cat.subCategories.forEach(s => total += (s.products||[]).length);
      else
        total += (cat.products||[]).length;
    });
    el.textContent = total;
  }

  /* ══════════════════════════════
     CATEGORY TABS
  ══════════════════════════════ */
  function renderCategoryTabs() {
    const tabsEl = document.getElementById('prodCatTabs');
    if (!tabsEl || !data) return;

    tabsEl.innerHTML = data.categories.map((cat, i) => `
      <button class="prod-cat-tab ${i===0?'active':''}"
        onclick="AdminPanel.selectCategory('${cat.id}',this)">
        ${cat.icon||'◈'} ${cat.name}
      </button>`).join('');

    if (data.categories.length)
      selectCategory(data.categories[0].id, tabsEl.querySelector('.prod-cat-tab'));
  }

  function selectCategory(catId, btn) {
    activeCatId = catId;
    activeSubId = null;

    document.querySelectorAll('.prod-cat-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const cat = data.categories.find(c => c.id === catId);
    if (!cat) return;

    const subEl = document.getElementById('prodSubcatTabs');
    if (cat.hasSubCategories && cat.subCategories?.length) {
      subEl.style.display = 'flex';
      subEl.innerHTML = cat.subCategories.map((sub, i) => `
        <button class="prod-subcat-tab ${i===0?'active':''}"
          onclick="AdminPanel.selectSubCategory('${sub.id}',this)">
          ${sub.name}
        </button>`).join('');
      activeSubId = cat.subCategories[0].id;
    } else {
      subEl.style.display = 'none';
      subEl.innerHTML = '';
    }
    renderProductGrid();
  }

  function selectSubCategory(subId, btn) {
    activeSubId = subId;
    document.querySelectorAll('.prod-subcat-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderProductGrid();
  }

  /* ══════════════════════════════
     PRODUCT GRID
  ══════════════════════════════ */
  function renderProductGrid() {
    const grid = document.getElementById('productsAdminGrid');
    if (!grid || !data) return;

    const cat = data.categories.find(c => c.id === activeCatId);
    if (!cat) { grid.innerHTML = ''; return; }

    let products = [];
    if (cat.hasSubCategories && activeSubId) {
      const sub = cat.subCategories.find(s => s.id === activeSubId);
      products = sub?.products || [];
    } else {
      products = cat.products || [];
    }

    if (!products.length) {
      grid.innerHTML = `<div class="glass-card" style="padding:32px;text-align:center;color:var(--silver-dim);grid-column:1/-1">
        No products here yet. Click "+ Add Product" to add one.
      </div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="glass-card product-admin-card" id="pac-${p.id}">
        <div class="pac-img-wrap">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}"
                onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
               <div class="pac-img-fallback" style="display:none">◈</div>`
            : `<div class="pac-img-fallback">◈</div>`}
        </div>
        <h3 class="pac-name">${p.name}</h3>
        <p class="pac-desc">${(p.desc||'').slice(0,80)}${(p.desc||'').length>80?'…':''}</p>
        <div class="pac-status ${p.image?'has-img':'no-img'}">
          ${p.image ? '✓ Image set' : '⚠ No image'}
        </div>
        <div class="pac-actions">
          <button class="pac-btn edit"   onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
          <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕ Delete</button>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════════════
     MODAL — Open / Close
  ══════════════════════════════ */
  function openProductModal(productId) {
    const modal   = document.getElementById('productModalBg');
    const titleEl = document.getElementById('modalTitle');
    if (!modal) return;

    if (productId) {
      editCtx = findProduct(productId);
      if (!editCtx) return;
      const p = editCtx.product;
      titleEl.textContent = 'Edit Product';
      setField('mp-product-id', p.id);
      setField('mp-name',       p.name  || '');
      setField('mp-desc',       p.desc  || '');
      setField('mp-imgurl',     p.image || '');
      setField('mp-file-name',  '');
      updateImgPreview(p.image || '');
      setBreadcrumb(editCtx);
    } else {
      editCtx = null;
      titleEl.textContent = 'Add Product';
      ['mp-product-id','mp-name','mp-desc','mp-imgurl','mp-file-name'].forEach(id => setField(id,''));
      updateImgPreview('');
      const cat = data.categories.find(c => c.id === activeCatId);
      const sub = activeSubId ? cat?.subCategories?.find(s => s.id === activeSubId) : null;
      const bc  = document.getElementById('mpBreadcrumb');
      if (bc) bc.innerHTML = `Adding to: <strong>${cat?.name||''}${sub?' › '+sub.name:''}</strong>`;
    }

    modal.classList.add('open');
  }

  function closeProductModal() {
    document.getElementById('productModalBg')?.classList.remove('open');
    editCtx = null;
  }

  function setField(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function setBreadcrumb(ctx) {
    const bc = document.getElementById('mpBreadcrumb');
    if (!bc) return;
    const parts = [ctx.cat.name];
    if (ctx.sub) parts.push(ctx.sub.name);
    parts.push(ctx.product.name);
    bc.innerHTML = 'Editing: ' + parts.map(p => `<strong>${p}</strong>`).join(' › ');
  }

  function findProduct(productId) {
    for (const cat of data.categories) {
      if (cat.hasSubCategories) {
        for (const sub of cat.subCategories||[]) {
          const p = (sub.products||[]).find(x => x.id === productId);
          if (p) return { cat, sub, product: p };
        }
      } else {
        const p = (cat.products||[]).find(x => x.id === productId);
        if (p) return { cat, sub: null, product: p };
      }
    }
    return null;
  }

  /* ══════════════════════════════
     IMAGE PREVIEW
  ══════════════════════════════ */
  function previewImgUrl(url) { updateImgPreview(url.trim()); }

  function updateImgPreview(url) {
    const img = document.getElementById('mp-img-preview');
    const ph  = document.getElementById('mpImgPlaceholder');
    if (!img || !ph) return;
    if (url) {
      img.src = url;
      img.style.display = 'block';
      ph.style.display  = 'none';
      img.onerror = () => { img.style.display='none'; ph.style.display='flex'; };
    } else {
      img.style.display = 'none';
      ph.style.display  = 'flex';
    }
  }

  function handleFileUpload(input) {
    if (!input.files?.[0]) return;
    const file = input.files[0];
    setField('mp-file-name', '📎 ' + file.name);
    const url = URL.createObjectURL(file);
    updateImgPreview(url);
    setField('mp-imgurl', url);
    toast('Preview loaded. For permanent images, upload to Imgur or your hosting and paste the URL.', 'warn');
  }

  /* ══════════════════════════════
     SAVE PRODUCT
  ══════════════════════════════ */
  function saveProduct() {
    const name  = (document.getElementById('mp-name')?.value   || '').trim();
    const desc  = (document.getElementById('mp-desc')?.value   || '').trim();
    const image = (document.getElementById('mp-imgurl')?.value || '').trim();

    if (!name) { toast('Product name is required.', 'warn'); return; }

    const saveBtn = document.getElementById('mpSaveBtn');
    if (saveBtn) { saveBtn.textContent = 'Saving…'; saveBtn.disabled = true; }

    try {
      if (editCtx) {
        editCtx.product.name  = name;
        editCtx.product.desc  = desc;
        editCtx.product.image = image;
      } else {
        const cat = data.categories.find(c => c.id === activeCatId);
        if (!cat) { toast('No category selected.', 'warn'); return; }
        const newId = [activeCatId, activeSubId, Date.now()].filter(Boolean).join('-');
        const newProduct = { id: newId, name, desc, image };
        if (cat.hasSubCategories && activeSubId) {
          const sub = cat.subCategories.find(s => s.id === activeSubId);
          if (sub) { if (!sub.products) sub.products=[]; sub.products.push(newProduct); }
        } else {
          if (!cat.products) cat.products = [];
          cat.products.push(newProduct);
        }
      }
      saveData();
      renderProductGrid();
      closeProductModal();
    } finally {
      if (saveBtn) { saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false; }
    }
  }

  /* ══════════════════════════════
     DELETE PRODUCT
  ══════════════════════════════ */
  function deleteProduct(productId) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const ctx = findProduct(productId);
    if (!ctx) return;
    if (ctx.sub) {
      ctx.sub.products = (ctx.sub.products||[]).filter(p => p.id !== productId);
    } else {
      ctx.cat.products = (ctx.cat.products||[]).filter(p => p.id !== productId);
    }
    saveData();
    renderProductGrid();
    toast('Product deleted.');
  }

  /* ══════════════════════════════
     CONTENT — Load & Save
  ══════════════════════════════ */
  async function loadContentFields() {
    try {
      const rows = await SB.get('content');
      if (!rows || !rows.length) return;
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
    } catch(err) {
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
        key, value: value||'', updated_at: new Date().toISOString(),
      }));
      await SB.upsert('content', rows);
      toast('Content saved ✓ — Live on site immediately.');
    } catch(err) {
      toast('Save failed: ' + err.message, 'warn');
    } finally {
      if (saveBtn) { saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false; }
    }
  }

  /* ══════════════════════════════
     SUPABASE TEST
  ══════════════════════════════ */
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

  /* ══════════════════════════════
     TOAST
  ══════════════════════════════ */
  let toastTimer;
  function toast(msg, type='ok') {
    const t = document.getElementById('adminToast');
    if (!t) return;
    t.textContent = msg;
    t.style.borderColor = type==='warn' ? 'rgba(255,193,7,0.4)' : 'rgba(197,164,109,0.3)';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    showPanel,
    openProductModal, closeProductModal, saveProduct, deleteProduct,
    selectCategory, selectSubCategory,
    previewImgUrl, handleFileUpload,
    saveContent, testSupabase,
  };
})();
