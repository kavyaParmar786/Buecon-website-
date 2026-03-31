/* ═══════════════════════════════════════════
   BUECON — Product 3D Mini Viewer
   Per-card Three.js canvas with drag-rotate
   ═══════════════════════════════════════════ */

const ProductViewer = (() => {
  const viewers = {};  /* map: productId → { scene, camera, renderer, obj, animId, drag } */

  function init() {
    /* Called after products section renders */
    BUECON.products.forEach(p => {
      viewers[p.id] = { active: false, built: false, drag: { down:false, x:0, y:0, rotX:0, rotY:0 } };
    });
  }

  function setView(productId, view, btn) {
    /* Update toggle button states */
    const card = btn.closest('.product-card');
    card.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    /* Show/hide panels */
    const imgView = document.getElementById('img-' + productId);
    const view3d  = document.getElementById('3d-'  + productId);
    if (!imgView || !view3d) return;

    if (view === 'image') {
      imgView.classList.add('active');
      view3d.classList.remove('active');
      pauseViewer(productId);
    } else {
      imgView.classList.remove('active');
      view3d.classList.add('active');
      startViewer(productId);
    }
  }

  function startViewer(productId) {
    const v = viewers[productId];
    if (!v) return;

    if (!v.built) {
      buildViewer(productId);
    } else {
      v.active = true;
      renderLoop(productId);
    }
  }

  function buildViewer(productId) {
    const v = viewers[productId];
    const canvas = document.getElementById('canvas-' + productId);
    if (!canvas || !window.THREE) return;

    const w = canvas.offsetWidth  || 340;
    const h = canvas.offsetHeight || 280;

    v.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    v.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    v.renderer.setSize(w, h);
    v.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    v.renderer.toneMappingExposure = 1.5;

    v.scene = new THREE.Scene();
    v.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 50);
    v.camera.position.set(0, 0.3, 3.8);

    /* Dramatic lighting */
    v.scene.add(new THREE.AmbientLight(0x0A1828, 1.5));
    const key = new THREE.DirectionalLight(0xFFE8B0, 5);
    key.position.set(4, 6, 5); v.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8AACCC, 2);
    fill.position.set(-4, -1, 3); v.scene.add(fill);
    const pt = new THREE.PointLight(0xC5A46D, 4, 10);
    pt.position.set(1, 2, 3); v.scene.add(pt);

    /* Build product mesh based on id */
    v.obj = buildProductMesh(productId);
    v.scene.add(v.obj);

    /* Drag controls */
    bindDrag(productId, canvas);

    v.built  = true;
    v.active = true;
    renderLoop(productId);
  }

  function buildProductMesh(productId) {
    const g = new THREE.Group();
    const chrome = new THREE.MeshStandardMaterial({ color:0xD8E0EA, roughness:0.05, metalness:1.0 });
    const gold   = new THREE.MeshStandardMaterial({ color:0xC8A45A, roughness:0.18, metalness:0.95 });
    const brushed= new THREE.MeshStandardMaterial({ color:0xA0AABB, roughness:0.4,  metalness:0.88 });

    const am = (geo, mat, fn) => {
      const m = new THREE.Mesh(geo, mat);
      if (fn) fn(m);
      g.add(m);
    };

    switch (productId) {
      case 'salt':  /* Faucet */
        am(new THREE.CylinderGeometry(0.08, 0.10, 1.6, 32), chrome, m => { m.rotation.z = Math.PI/2.1; m.position.set(0.35,0.25,0); });
        am(new THREE.TorusGeometry(0.22, 0.075, 16, 32, Math.PI/2), chrome, m => { m.position.set(-0.18,0,0); m.rotation.z = Math.PI; });
        am(new THREE.CylinderGeometry(0.08, 0.10, 0.6, 24), chrome, m => m.position.set(-0.18,-0.5,0));
        am(new THREE.CylinderGeometry(0.14, 0.11, 0.22, 28), chrome, m => m.position.set(1.0,0.25,0));
        am(new THREE.CylinderGeometry(0.22, 0.24, 0.055, 28), chrome, m => m.position.set(-0.18,-0.84,0));
        break;
      case 'super':  /* Dispenser */
        am(new THREE.CylinderGeometry(0.24, 0.28, 1.2, 32), gold, () => {});
        am(new THREE.TorusGeometry(0.24, 0.025, 12, 36), gold, m => { m.rotation.x = Math.PI/2; m.position.y = 0.61; });
        am(new THREE.CylinderGeometry(0.05, 0.06, 0.55, 18), gold, m => m.position.y = 1.0);
        am(new THREE.SphereGeometry(0.14, 24, 24, 0, Math.PI*2, 0, Math.PI/2), gold, m => m.position.y = 1.32);
        break;
      case 'spirit':  /* Towel Ring */
        am(new THREE.TorusGeometry(0.65, 0.07, 20, 80), gold, () => {});
        am(new THREE.CylinderGeometry(0.06, 0.07, 0.3, 18), gold, m => { m.rotation.x = Math.PI/2; m.position.set(0,0,-0.65); });
        am(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 24), gold, m => { m.rotation.x = Math.PI/2; m.position.set(0,0,-0.8); });
        break;
      case '400':  /* Handle */
        am(new THREE.BoxGeometry(0.18, 1.3, 0.18), brushed, () => {});
        am(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 22), brushed, m => { m.rotation.x = Math.PI/2; m.position.y = 0.73; });
        am(new THREE.CylinderGeometry(0.23, 0.23, 0.07, 24), brushed, m => m.position.y = -0.69);
        am(new THREE.TorusGeometry(0.185, 0.02, 10, 30), brushed, m => { m.rotation.x = Math.PI/2; m.position.y = -0.66; });
        break;
      default:
        am(new THREE.SphereGeometry(0.5, 32, 32), chrome, () => {});
    }

    return g;
  }

  function renderLoop(productId) {
    const v = viewers[productId];
    if (!v || !v.active) return;

    v.animId = requestAnimationFrame(() => renderLoop(productId));
    const t = performance.now() * 0.001;

    if (!v.drag.down) {
      v.drag.rotY += 0.006;  /* slow auto-rotate when not dragging */
    }

    v.obj.rotation.y = v.drag.rotY;
    v.obj.rotation.x = v.drag.rotX;
    /* Gentle float */
    v.obj.position.y = Math.sin(t * 0.6) * 0.06;

    v.renderer.render(v.scene, v.camera);
  }

  function pauseViewer(productId) {
    const v = viewers[productId];
    if (!v) return;
    v.active = false;
    if (v.animId) cancelAnimationFrame(v.animId);
  }

  function bindDrag(productId, canvas) {
    const v = viewers[productId];
    const d = v.drag;

    canvas.addEventListener('mousedown', e => {
      d.down = true; d.x = e.clientX; d.y = e.clientY;
    });
    window.addEventListener('mousemove', e => {
      if (!d.down) return;
      d.rotY += (e.clientX - d.x) * 0.012;
      d.rotX += (e.clientY - d.y) * 0.008;
      d.rotX = Math.max(-0.8, Math.min(0.8, d.rotX));
      d.x = e.clientX; d.y = e.clientY;
    });
    window.addEventListener('mouseup', () => { d.down = false; });

    /* Touch */
    canvas.addEventListener('touchstart', e => { d.down = true; d.x = e.touches[0].clientX; d.y = e.touches[0].clientY; }, { passive:true });
    canvas.addEventListener('touchmove', e => {
      if (!d.down) return;
      d.rotY += (e.touches[0].clientX - d.x) * 0.012;
      d.rotX += (e.touches[0].clientY - d.y) * 0.008;
      d.rotX = Math.max(-0.8, Math.min(0.8, d.rotX));
      d.x = e.touches[0].clientX; d.y = e.touches[0].clientY;
    }, { passive:true });
    canvas.addEventListener('touchend', () => { d.down = false; });

    /* Scroll zoom */
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      v.camera.position.z = Math.max(2.0, Math.min(6.0, v.camera.position.z + e.deltaY * 0.005));
    }, { passive: false });
  }

  return { init, setView };
})();
