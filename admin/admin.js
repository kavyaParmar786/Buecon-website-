/* ═══════════════════════════════════════════
   BUECON — Admin Panel
   Fully persistent via Supabase
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

  /* ── PRODUCTS LOAD ── */
  async function loadProducts() {
    try {
      const data = await SB.get('products', '?order=created_at.asc');
      products = data || [];
      toast(`${products.length} products loaded from Supabase ✓`);
    } catch(e) {
      console.warn('Supabase load failed, using defaults:', e.message);
      products = JSON.parse(JSON.stringify(window.BUECON_DEFAULTS?.products || []));
      toast('Using local defaults — check Supabase connection', 'warn');
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

  /* ── SAVE PRODUCT → SUPABASE ── */
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
    };

    const btn = document.querySelector('.modal-footer .btn-admin-primary');
    if(btn){btn.textContent='Saving…';btn.disabled=true;}

    try {
      await SB.upsert('products', payload);
      const idx = products.findIndex(p=>p.id===payload.id);
      if(idx>-1) products[idx]=payload; else products.push(payload);
      toast(editingId ? 'Product updated ✓' : 'Product added ✓ — live on site now');
      renderProductGrid();
      updateStats();
      closeProductModal();
    } catch(e) {
      toast('Save failed: '+e.message, 'warn');
    } finally {
      if(btn){btn.textContent='Save Product';btn.disabled=false;}
    }
  }

  /* ── DELETE ── */
  async function deleteProduct(id) {
    if(!confirm('Delete this product from the database permanently?')) return;
    try {
      await SB.delete('products','id',id);
      products = products.filter(p=>p.id!==id);
      renderProductGrid();
      updateStats();
      toast('Product deleted.');
    } catch(e) { toast('Delete failed: '+e.message,'warn'); }
  }

  /* ── CONTENT ── */
  async function loadContentFields() {
    try {
      const rows = await SB.get('content');
      if(!rows||!rows.length) return;
      const map = {};
      rows.forEach(r=>{ map[r.key]=r.value; });
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
    } catch(e) { console.warn('Content load failed:',e.message); }
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
    if(btn){btn.textContent='Saving…';btn.disabled=true;}
    try {
      const rows = Object.entries(fieldMap).map(([key,value])=>({key,value:value||'',updated_at:new Date().toISOString()}));
      await SB.upsert('content', rows);
      toast('Content saved ✓ — live on site immediately');
    } catch(e) { toast('Save failed: '+e.message,'warn'); }
    finally { if(btn){btn.textContent='Save Changes';btn.disabled=false;} }
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
      toast('Connection failed','warn');
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
