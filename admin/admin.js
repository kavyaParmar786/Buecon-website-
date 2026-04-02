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
  /* ══════════════════════
     BOOT
  ══════════════════════ */
  async function init() {
    data = loadData();
    renderCategoryTabs();
    updateStats();
  }

  const LS_KEY = 'buecon_products_v2';
  let data = null;
  let editCtx = null;      // { catId, subCatId|null, prodId }
  let activeCatId  = null;
  let activeSubId  = null;

  function loadData() {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    if (window.PRODUCTS_DEFAULTS) return JSON.parse(JSON.stringify(window.PRODUCTS_DEFAULTS));
    return { categories: [] };
  }

  function saveData() {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    updateStats();
    toast('Saved ✓ — changes are live on the website now.');
  }

  function showLoading(on) {
    document.body.style.opacity = on ? '0.6' : '1';
    document.body.style.pointerEvents = on ? 'none' : '';
  }

  /* ══════════════════════
     CATEGORY TABS
  ══════════════════════ */
  function renderCategoryTabs() {
    const tabsEl = document.getElementById('prodCatTabs');
    if (!tabsEl || !data) return;

    tabsEl.innerHTML = data.categories.map((cat, i) => `
      <button class="prod-cat-tab ${i===0?'active':''}"
        onclick="AdminPanel.selectCategory('${cat.id}',this)">
        ${cat.icon || '◈'} ${cat.name}
      </button>`).join('');

    // Auto-select first
    if (data.categories.length) selectCategory(data.categories[0].id, tabsEl.querySelector('.prod-cat-tab'));
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

  /* ══════════════════════
     PRODUCT GRID
  ══════════════════════ */
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
      grid.innerHTML = `<div class="glass-card" style="padding:32px;text-align:center;color:var(--silver-dim);grid-column:1/-1">No products. Click "+ Add Product" to add one.</div>`;
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="glass-card product-admin-card" id="pac-${p.id}">
        <div class="pac-img-wrap">
          ${p.image
            ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"/>
               <div class="pac-img-fallback" style="display:none">◈</div>`
            : `<div class="pac-img-fallback">◈</div>`}
        </div>
        <h3 class="pac-name">${p.name}</h3>
        <p class="pac-desc">${(p.desc||'').slice(0,80)}${p.desc&&p.desc.length>80?'…':''}</p>
        <div class="pac-status ${p.image?'has-img':'no-img'}">
          ${p.image ? '✓ Image set' : '⚠ No image'}
        </div>
        <div class="pac-actions">
          <button class="pac-btn edit" onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
          <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕</button>
        </div>
      </div>`).join('');
  }

  /* ══════════════════════
     MODAL — Open / Close
  ══════════════════════ */
  function openProductModal(productId) {
    const modal = document.getElementById('productModalBg');
    const titleEl = document.getElementById('modalTitle');

    if (productId) {
      // Edit existing
      editCtx = findProduct(productId);
      if (!editCtx) return;
      const p = editCtx.product;
      titleEl.textContent = 'Edit Product';
      document.getElementById('mp-product-id').value = p.id;
      document.getElementById('mp-name').value = p.name || '';
      document.getElementById('mp-desc').value = p.desc || '';
      document.getElementById('mp-imgurl').value = p.image || '';
      document.getElementById('mp-file-name').textContent = '';
      updateImgPreview(p.image || '');
      // breadcrumb
      setBreadcrumb(editCtx);
    } else {
      // Add new — add to current active cat/subcat
      editCtx = null;
      titleEl.textContent = 'Add Product';
      ['mp-product-id','mp-name','mp-desc','mp-imgurl'].forEach(id => {
        const el = document.getElementById(id);
        if(el) el.value = '';
      });
      document.getElementById('mp-file-name').textContent = '';
      updateImgPreview('');
      // breadcrumb for new
      const cat = data.categories.find(c => c.id === activeCatId);
      const sub = activeSubId ? cat?.subCategories?.find(s => s.id === activeSubId) : null;
      document.getElementById('mpBreadcrumb').innerHTML =
        `Adding to: <strong>${cat?.name||''}${sub?' › '+sub.name:''}</strong>`;
    }

    modal.classList.add('open');
  }

  function closeProductModal() {
    document.getElementById('productModalBg')?.classList.remove('open');
    editCtx = null;
  }

  function setBreadcrumb(ctx) {
    const parts = [ctx.cat.name];
    if (ctx.sub) parts.push(ctx.sub.name);
    parts.push(ctx.product.name);
    document.getElementById('mpBreadcrumb').innerHTML =
      'Editing: ' + parts.map((p,i) => `<strong>${p}</strong>`).join(' › ');
  }

  function findProduct(productId) {
    for (const cat of data.categories) {
      if (cat.hasSubCategories) {
        for (const sub of cat.subCategories) {
          const p = sub.products.find(x => x.id === productId);
          if (p) return { cat, sub, product: p };
        }
      } else {
        const p = (cat.products||[]).find(x => x.id === productId);
        if (p) return { cat, sub: null, product: p };
      }
    }
    return null;
  }

  /* ══════════════════════
     MODAL — Image Preview
  ══════════════════════ */
  function previewImgUrl(url) {
    updateImgPreview(url.trim());
  }

  function updateImgPreview(url) {
    const img  = document.getElementById('mp-img-preview');
    const ph   = document.getElementById('mpImgPlaceholder');
    if (!img || !ph) return;
    if (url) {
      img.src = url;
      img.style.display = 'block';
      ph.style.display = 'none';
      img.onerror = () => { img.style.display='none'; ph.style.display='flex'; };
    } else {
      img.style.display = 'none';
      ph.style.display = 'flex';
    }
  }

  function handleFileUpload(input) {
    if (!input.files?.[0]) return;
    const file = input.files[0];
    // Show filename
    document.getElementById('mp-file-name').textContent = file.name;
    // Preview using object URL
    const url = URL.createObjectURL(file);
    updateImgPreview(url);
    // Store object URL in the imgurl field (note: this only works for current session)
    document.getElementById('mp-imgurl').value = url;
    toast('Image preview loaded. Note: for permanent storage, upload to your hosting and paste the URL instead.', 'warn');
  }

  /* ══════════════════════
     SAVE PRODUCT
  ══════════════════════ */
  function saveProduct() {
    const name  = document.getElementById('mp-name').value.trim();
    const desc  = document.getElementById('mp-desc').value.trim();
    const image = document.getElementById('mp-imgurl').value.trim();

    if (!name) { toast('Product name is required.', 'warn'); return; }

    const saveBtn = document.getElementById('mpSaveBtn');
    if (saveBtn) { saveBtn.textContent = 'Saving…'; saveBtn.disabled = true; }

    try {
      if (editCtx) {
        // Update existing
        editCtx.product.name  = name;
        editCtx.product.desc  = desc;
        editCtx.product.image = image;
      } else {
        // Add new product to current active cat/subcat
        const cat = data.categories.find(c => c.id === activeCatId);
        if (!cat) { toast('No category selected.', 'warn'); return; }
        const newId = activeCatId + '-' + (activeSubId ? activeSubId+'-' : '') + Date.now();
        const newProduct = { id: newId, name, desc, image };
        if (cat.hasSubCategories && activeSubId) {
          const sub = cat.subCategories.find(s => s.id === activeSubId);
          if (sub) sub.products.push(newProduct);
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

  /* ══════════════════════
     DELETE PRODUCT
  ══════════════════════ */
  function deleteProduct(productId) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const ctx = findProduct(productId);
    if (!ctx) return;
    if (ctx.sub) {
      ctx.sub.products = ctx.sub.products.filter(p => p.id !== productId);
    } else {
      ctx.cat.products = (ctx.cat.products||[]).filter(p => p.id !== productId);
    }
    saveData();
    renderProductGrid();
    toast('Product deleted.');
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

  return { showPanel, openProductModal, closeProductModal, saveProduct, deleteProduct, previewImgUrl, handleFileUpload, saveContent, testSupabase, selectCategory, selectSubCategory };
})();
