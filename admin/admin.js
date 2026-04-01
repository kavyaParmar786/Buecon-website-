/* ═══════════════════════════════════════════
   BUECON — Admin Panel
   Saves to Supabase when connected,
   ALWAYS mirrors to localStorage so the
   frontend shows products immediately.
   ═══════════════════════════════════════════ */

const AdminPanel = (() => {
  let products = [];
  let editingId = null;

  async function init() {
    setLoading(true);
    try {
      await loadProducts();
      await loadContentFields();
      renderProductGrid();
      updateStats();
    } catch(e) {
      toast('Init error: ' + e.message, 'warn');
    }
    setLoading(false);
  }

  function setLoading(on) {
    document.body.style.opacity = on ? '0.7' : '1';
    document.body.style.pointerEvents = on ? 'none' : '';
  }

  /* ── PANEL NAV ── */
  function showPanel(name, btn) {
    document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('panel-' + name)?.classList.add('active');
    if(btn) btn.classList.add('active');
    const titles = {dashboard:'Dashboard',products:'Products',content:'Content',settings:'Settings'};
    const el = document.getElementById('adminPageTitle');
    if(el) el.textContent = titles[name] || name;
  }

  /* ══════════════════════════════════════════
     PRODUCTS LOAD
     Try Supabase first → fall back to localStorage
     ══════════════════════════════════════════ */
  async function loadProducts() {
    try {
      const data = await SB.get('products', '?order=created_at.asc');
      if (data && data.length > 0) {
        products = data;
        /* Mirror Supabase data into localStorage for the frontend */
        syncProductsToLocalStorage();
        toast(`${products.length} products loaded from Supabase ✓`);
        return;
      }
    } catch(e) {
      console.warn('Supabase load failed:', e.message);
    }

    /* Try localStorage (previously saved by Admin) */
    try {
      const raw = localStorage.getItem('buecon_products');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          products = parsed;
          toast(`${products.length} products loaded from local storage ✓`);
          return;
        }
      }
    } catch(e) { /* ignore */ }

    /* Final fallback: hardcoded defaults */
    products = JSON.parse(JSON.stringify(window.BUECON_DEFAULTS?.products || []));
    syncProductsToLocalStorage();
    toast('Using default products — connect Supabase to go live', 'warn');
  }

  /* ══════════════════════════════════════════
     KEY FIX: Always mirror products to localStorage
     This is what the frontend reads when Supabase
     is not connected.
     ══════════════════════════════════════════ */
  function syncProductsToLocalStorage() {
    try {
      localStorage.setItem('buecon_products', JSON.stringify(products));
    } catch(e) {
      console.warn('localStorage sync failed:', e.message);
    }
  }

  /* ── RENDER GRID ── */
  function renderProductGrid() {
    const grid = document.getElementById('productsAdminGrid');
    if (!grid) return;
    if (products.length === 0) {
      grid.innerHTML = `<div class="glass-card" style="padding:32px;text-align:center;color:var(--silver-dim);grid-column:1/-1;">No products yet. Click "+ Add Product".</div>`;
      return;
    }
    grid.innerHTML = products.map(p => `
      <div class="glass-card product-admin-card">
        ${p.image_url
          ? `<img src="${p.image_url}" alt="${p.name}" style="width:100%;height:120px;object-fit:cover;border-radius:10px;margin-bottom:12px"/>`
          : `<div style="font-size:2.5rem;color:var(--gold);opacity:0.4;text-align:center;padding:16px 0;">${p.icon||'◈'}</div>`
        }
        <p class="pac-series">${p.series||''}</p>
        <h3 class="pac-name">${p.icon||''} ${p.name}</h3>
        <div class="pac-style">
          ${(Array.isArray(p.style)?p.style:[]).map(s=>`<span class="pac-style-tag">${s}</span>`).join('')}
        </div>
        <p style="font-size:0.8rem;color:var(--silver-dim);line-height:1.5;margin-bottom:16px">
          ${(p.description||'').slice(0,90)}…
        </p>
        <div class="pac-actions">
          <button class="pac-btn edit" onclick="AdminPanel.openProductModal('${p.id}')">✎ Edit</button>
          <button class="pac-btn delete" onclick="AdminPanel.deleteProduct('${p.id}')">✕ Delete</button>
        </div>
      </div>
    `).join('');
  }

  /* ── MODAL ── */
  function openProductModal(id) {
    editingId = id || null;
    document.getElementById('modalTitle').textContent = id ? 'Edit Product' : 'Add Product';
    const fields = ['mp-series','mp-name','mp-icon','mp-tagline','mp-desc','mp-style','mp-features','mp-insight','mp-imgurl'];
    if (id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      document.getElementById('mp-series').value   = p.series||'';
      document.getElementById('mp-name').value     = p.name||'';
      document.getElementById('mp-icon').value     = p.icon||'';
      document.getElementById('mp-tagline').value  = p.tagline||'';
      document.getElementById('mp-desc').value     = p.description||'';
      document.getElementById('mp-style').value    = (Array.isArray(p.style)?p.style:[]).join(', ');
      document.getElementById('mp-features').value = (Array.isArray(p.features)?p.features:[]).join('\n');
      document.getElementById('mp-insight').value  = p.insight||'';
      document.getElementById('mp-imgurl').value   = p.image_url||'';
      const prev = document.getElementById('mp-img-preview');
      if(prev && p.image_url){prev.src=p.image_url;prev.style.display='block';}
      else if(prev) prev.style.display='none';
    } else {
      fields.forEach(fid => { const el=document.getElementById(fid); if(el) el.value=''; });
      const prev=document.getElementById('mp-img-preview'); if(prev) prev.style.display='none';
    }
    document.getElementById('productModalBg').classList.add('open');
  }

  function closeProductModal() {
    document.getElementById('productModalBg')?.classList.remove('open');
    editingId = null;
  }

  /* ══════════════════════════════════════════
     SAVE PRODUCT
     Tries Supabase, ALWAYS saves to localStorage
     ══════════════════════════════════════════ */
  async function saveProduct() {
    const series   = document.getElementById('mp-series').value.trim();
    const name     = document.getElementById('mp-name').value.trim();
    if (!series||!name) { toast('Series and Name are required.','warn'); return; }

    const payload = {
      id:          editingId || name.toLowerCase().replace(/\s+/g,'-'),
      series, name,
      icon:        document.getElementById('mp-icon').value.trim()||'◈',
      tagline:     document.getElementById('mp-tagline').value.trim(),
      description: document.getElementById('mp-desc').value.trim(),
      style:       document.getElementById('mp-style').value.trim().split(',').map(s=>s.trim()).filter(Boolean),
      features:    document.getElementById('mp-features').value.trim().split('\n').map(f=>f.trim()).filter(Boolean),
      insight:     document.getElementById('mp-insight').value.trim()||'Perfect for modern interiors',
      badge:       `✨ ${name}`,
      image_url:   document.getElementById('mp-imgurl').value.trim(),
      model_url:   '',
    };

    const btn = document.querySelector('.modal-footer .btn-admin-primary');
    if(btn){btn.textContent='Saving…';btn.disabled=true;}

    /* Always update local array first */
    const idx = products.findIndex(p=>p.id===payload.id);
    if(idx>-1) products[idx]=payload; else products.push(payload);

    /* KEY FIX: Always save to localStorage — frontend reads this */
    syncProductsToLocalStorage();

    /* Try Supabase too (non-blocking) */
    let savedToSupabase = false;
    try {
      await SB.upsert('products', payload);
      savedToSupabase = true;
    } catch(e) {
      console.warn('Supabase save failed (saved to localStorage instead):', e.message);
    }

    toast(savedToSupabase
      ? (editingId ? 'Product updated ✓' : 'Product added ✓ — live on site now')
      : 'Saved locally ✓ — visible on site. Connect Supabase to persist permanently.'
    );

    renderProductGrid();
    updateStats();
    closeProductModal();

    if(btn){btn.textContent='Save Product';btn.disabled=false;}
  }

  /* ══════════════════════════════════════════
     DELETE PRODUCT
     ══════════════════════════════════════════ */
  async function deleteProduct(id) {
    if(!confirm('Delete this product permanently?')) return;

    products = products.filter(p=>p.id!==id);
    syncProductsToLocalStorage(); /* KEY FIX */

    try {
      await SB.delete('products','id',id);
      toast('Product deleted from Supabase.');
    } catch(e) {
      toast('Deleted locally. Supabase unreachable — reconnect to sync.', 'warn');
    }

    renderProductGrid();
    updateStats();
  }

  /* ══════════════════════════════════════════
     CONTENT
     Also mirrors to localStorage as 'buecon_content'
     ══════════════════════════════════════════ */
  async function loadContentFields() {
    /* Try localStorage first for instant load */
    try {
      const raw = localStorage.getItem('buecon_content');
      if (raw) {
        const map = JSON.parse(raw);
        applyContentMap(map);
      }
    } catch(e) { /* ignore */ }

    /* Then try Supabase to get latest */
    try {
      const rows = await SB.get('content');
      if(!rows||!rows.length) return;
      const map = {};
      rows.forEach(r=>{ map[r.key]=r.value; });
      applyContentMap(map);
      localStorage.setItem('buecon_content', JSON.stringify(map));
    } catch(e) { console.warn('Content load from Supabase failed:', e.message); }
  }

  function applyContentMap(map) {
    const fieldMap = {
      'content-headline': map.hero_headline,
      'content-subline':  map.hero_subline,
      'content-about':    map.about_text,
      'content-phone':    map.contact_phone,
      'content-email':    map.contact_email,
    };
    Object.entries(fieldMap).forEach(([fid,val])=>{
      const el=document.getElementById(fid); if(el&&val!==undefined) el.value=val;
    });
  }

  async function saveContent() {
    const fieldMap = {
      'hero_headline': document.getElementById('content-headline')?.value,
      'hero_subline':  document.getElementById('content-subline')?.value,
      'about_text':    document.getElementById('content-about')?.value,
      'contact_phone': document.getElementById('content-phone')?.value,
      'contact_email': document.getElementById('content-email')?.value,
    };

    /* KEY FIX: Always save to localStorage */
    try {
      localStorage.setItem('buecon_content', JSON.stringify(fieldMap));
    } catch(e) { console.warn('localStorage content save failed:', e.message); }

    const btn = document.querySelector('#panel-content .btn-admin-primary');
    if(btn){btn.textContent='Saving…';btn.disabled=true;}

    let savedToSupabase = false;
    try {
      const rows = Object.entries(fieldMap).map(([key,value])=>({key,value:value||'',updated_at:new Date().toISOString()}));
      await SB.upsert('content', rows);
      savedToSupabase = true;
    } catch(e) {
      console.warn('Supabase content save failed:', e.message);
    }

    toast(savedToSupabase
      ? 'Content saved ✓ — live on site immediately'
      : 'Saved locally ✓ — visible on site. Connect Supabase to persist permanently.'
    );

    if(btn){btn.textContent='Save Changes';btn.disabled=false;}
  }

  function updateStats() {
    const el=document.getElementById('stat-products'); if(el) el.textContent=products.length;
  }

  function previewImg(input) {
    const prev=document.getElementById('mp-img-preview');
    if(!input.files?.[0]||!prev) return;
    prev.src=URL.createObjectURL(input.files[0]); prev.style.display='block';
    toast('Image selected. Upload to Supabase Storage and paste the URL below.');
  }

  function handleModel(input) {
    if(!input.files?.[0]) return;
    const box=document.getElementById('modelUploadBox');
    if(box) box.querySelector('p').textContent=input.files[0].name;
    toast('Model selected. Upload to Supabase Storage and paste URL in product data.');
  }

  async function testSupabase() {
    const status=document.getElementById('sb-status');
    if(status){status.textContent='Testing…';status.style.color='var(--silver-dim)';}
    try {
      await SB.get('products','?limit=1');
      if(status){status.textContent='✓ Connected';status.style.color='#4CAF50';}
      toast('Supabase connected ✓');
    } catch {
      if(status){status.textContent='✕ Failed';status.style.color='#E05B5B';}
      toast('Connection failed — products still save locally','warn');
    }
  }

  let toastTimer;
  function toast(msg, type='ok') {
    const t=document.getElementById('adminToast'); if(!t) return;
    t.textContent=msg;
    t.style.borderColor=type==='warn'?'rgba(255,193,7,0.4)':'rgba(197,164,109,0.3)';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>t.classList.remove('show'),4000);
  }

  document.addEventListener('DOMContentLoaded', init);
  return {showPanel,openProductModal,closeProductModal,saveProduct,deleteProduct,previewImg,handleModel,saveContent,testSupabase};
})();
