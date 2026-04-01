/* ═══════════════════════════════════════════
   BUECON — Product 3D Viewer
   Loads real .glb from public/models/
   Falls back to procedural mesh if no GLB
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   KEY FIX: Load GLTFLoader from CDN if not
   already present. This runs once on page load.
   ══════════════════════════════════════════ */
(function loadGLTFLoader() {
  if (window.THREE && window.THREE.GLTFLoader) return; /* already loaded */
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js';
  script.onload  = () => console.log('BUECON: GLTFLoader ready ✓');
  script.onerror = () => console.warn('BUECON: GLTFLoader CDN failed — 3D will use fallback mesh');
  document.head.appendChild(script);
})();

const ProductViewer = (() => {
  const viewers = {};

  function init() {
    BUECON.products.forEach(p => {
      if (!viewers[p.id]) {
        const mediaEl = document.querySelector(`[data-product-id="${p.id}"] .card-media`);
        viewers[p.id] = {
          active: false, built: false,
          drag: { down:false, x:0, y:0, rotX:0, rotY:0 },
          /* Use model_url from product data if set, otherwise default path */
          glbPath: (p.model_url && p.model_url.trim())
            ? p.model_url.trim()
            : (mediaEl?.dataset.glb || `public/models/${p.id}.glb`),
        };
      }
    });
  }

  function setView(productId, view, btn) {
    const card = btn.closest('.product-card');
    card.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

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

  function startViewer(id) {
    const v = viewers[id];
    if (!v) return;
    if (!v.built) buildViewer(id);
    else { v.active = true; renderLoop(id); }
  }

  function buildViewer(id) {
    const v = viewers[id];
    const canvas = document.getElementById('canvas-' + id);
    if (!canvas || !window.THREE) {
      console.warn('BUECON: THREE.js not loaded yet for', id);
      return;
    }

    const w = canvas.offsetWidth  || 340;
    const h = canvas.offsetHeight || 260;

    v.renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
    v.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    v.renderer.setSize(w, h);
    v.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    v.renderer.toneMappingExposure = 1.5;

    v.scene  = new THREE.Scene();
    v.camera = new THREE.PerspectiveCamera(42, w/h, 0.1, 50);
    v.camera.position.set(0, 0.3, 3.5);

    /* Lighting */
    v.scene.add(new THREE.AmbientLight(0x0A1828, 1.5));
    const key = new THREE.DirectionalLight(0xFFE8B0, 5);
    key.position.set(4, 6, 5); v.scene.add(key);
    const fill = new THREE.DirectionalLight(0x8AACCC, 2);
    fill.position.set(-4, -1, 3); v.scene.add(fill);
    const pt = new THREE.PointLight(0xC5A46D, 4, 10);
    pt.position.set(1, 2, 3); v.scene.add(pt);

    bindDrag(id, canvas);

    /* ══════════════════════════════════════
       KEY FIX: Attempt to load GLB.
       GLTFLoader may still be loading from CDN —
       we poll briefly then fall back if needed.
       ══════════════════════════════════════ */
    tryLoadGLB(id, v, 0);
  }

  /* Poll up to ~2 seconds for GLTFLoader to become available */
  function tryLoadGLB(id, v, attempt) {
    const glbUrl = v.glbPath;

    if (window.THREE && window.THREE.GLTFLoader) {
      const loader = new THREE.GLTFLoader();
      loader.load(
        glbUrl,
        (gltf) => {
          /* ── GLB loaded successfully ── */
          v.obj = gltf.scene;
          const box    = new THREE.Box3().setFromObject(v.obj);
          const center = box.getCenter(new THREE.Vector3());
          const size   = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          v.obj.position.sub(center);
          v.obj.scale.setScalar(2.0 / maxDim);
          v.scene.add(v.obj);
          v.built  = true;
          v.active = true;
          renderLoop(id);
          console.log(`BUECON: GLB loaded for ${id} ✓`);
        },
        undefined,
        (err) => {
          /* ── GLB not found or failed — use procedural fallback ── */
          console.warn(`BUECON: GLB not found for ${id} (${glbUrl}), using fallback mesh.`);
          v.obj = buildFallbackMesh(id);
          v.scene.add(v.obj);
          v.built  = true;
          v.active = true;
          renderLoop(id);
        }
      );
    } else if (attempt < 20) {
      /* GLTFLoader not yet available — wait 100ms and retry */
      setTimeout(() => tryLoadGLB(id, v, attempt + 1), 100);
    } else {
      /* Gave up waiting — use fallback */
      console.warn(`BUECON: GLTFLoader never loaded for ${id}, using fallback mesh.`);
      v.obj = buildFallbackMesh(id);
      v.scene.add(v.obj);
      v.built  = true;
      v.active = true;
      renderLoop(id);
    }
  }

  /* ── Procedural fallback meshes (unchanged from original) ── */
  function buildFallbackMesh(id) {
    const g = new THREE.Group();
    const chrome = new THREE.MeshStandardMaterial({ color:0xD8E0EA, roughness:0.05, metalness:1.0 });
    const gold   = new THREE.MeshStandardMaterial({ color:0xC8A45A, roughness:0.18, metalness:0.95 });
    const mat    = (id==='spirit'||id==='super') ? gold : chrome;

    const am = (geo, m, fn) => { const mesh=new THREE.Mesh(geo,m); if(fn) fn(mesh); g.add(mesh); };

    switch(id) {
      case 'salt':
        [-0.3,0,0.3].forEach(y => {
          am(new THREE.CylinderGeometry(0.04,0.04,2.2,20), mat, m=>{m.rotation.z=Math.PI/2;m.position.y=y;});
        });
        am(new THREE.BoxGeometry(0.12,0.12,0.12), mat, m=>m.position.set(-0.5,0,0.5));
        am(new THREE.BoxGeometry(0.12,0.12,0.12), mat, m=>m.position.set(-0.5,0,-0.5));
        break;
      case 'super':
        am(new THREE.CylinderGeometry(0.06,0.06,2.0,24), mat, m=>m.rotation.z=Math.PI/2);
        am(new THREE.CylinderGeometry(0.14,0.14,0.06,24), mat, m=>{m.rotation.z=Math.PI/2;m.position.x=1.0;});
        am(new THREE.CylinderGeometry(0.14,0.14,0.06,24), mat, m=>{m.rotation.z=Math.PI/2;m.position.x=-1.0;});
        break;
      case 'spirit':
        am(new THREE.TorusGeometry(0.65,0.07,20,80), mat);
        am(new THREE.CylinderGeometry(0.07,0.07,0.25,18), mat, m=>{m.rotation.x=Math.PI/2;m.position.set(0,0,-0.65);});
        am(new THREE.CylinderGeometry(0.16,0.16,0.04,24), mat, m=>{m.rotation.x=Math.PI/2;m.position.set(0,0,-0.82);});
        break;
      case 'soft':
        [-0.55,0.55].forEach(x=>{
          am(new THREE.CylinderGeometry(0.28,0.3,0.07,32), mat, m=>m.position.set(x,0,0));
          am(new THREE.TorusGeometry(0.27,0.025,12,36), mat, m=>{m.rotation.x=Math.PI/2;m.position.set(x,0.04,0);});
        });
        am(new THREE.CylinderGeometry(0.06,0.06,1.1,16), mat, m=>m.rotation.z=Math.PI/2);
        am(new THREE.SphereGeometry(0.09,16,16), mat, m=>{m.position.y=0.12;});
        break;
      case 'smart':
        am(new THREE.BoxGeometry(0.9,0.7,0.5), mat);
        am(new THREE.BoxGeometry(0.92,0.06,0.52), mat, m=>m.position.y=0.38);
        am(new THREE.CylinderGeometry(0.18,0.18,0.08,24), mat, m=>{m.rotation.x=Math.PI/2;m.position.set(0,0.2,0.3);});
        am(new THREE.CylinderGeometry(0.12,0.12,0.22,18), mat, m=>{m.rotation.z=Math.PI/2;m.position.set(0,0.0,0.26);});
        break;
      default:
        am(new THREE.BoxGeometry(0.16,1.2,0.16), mat);
        am(new THREE.CylinderGeometry(0.22,0.22,0.065,24), mat, m=>m.position.y=-0.65);
        am(new THREE.CylinderGeometry(0.12,0.12,0.15,22), mat, m=>{m.rotation.x=Math.PI/2;m.position.y=0.7;});
    }
    return g;
  }

  function renderLoop(id) {
    const v = viewers[id];
    if (!v || !v.active) return;
    v.animId = requestAnimationFrame(() => renderLoop(id));
    const t = performance.now() * 0.001;
    if (!v.drag.down) v.drag.rotY += 0.006;
    if (v.obj) {
      v.obj.rotation.y = v.drag.rotY;
      v.obj.rotation.x = v.drag.rotX;
      v.obj.position.y = Math.sin(t * 0.6) * 0.06;
    }
    v.renderer.render(v.scene, v.camera);
  }

  function pauseViewer(id) {
    const v = viewers[id]; if (!v) return;
    v.active = false;
    if (v.animId) cancelAnimationFrame(v.animId);
  }

  function bindDrag(id, canvas) {
    const d = viewers[id].drag;
    canvas.addEventListener('mousedown',  e=>{d.down=true;d.x=e.clientX;d.y=e.clientY;});
    window.addEventListener('mousemove',  e=>{
      if(!d.down) return;
      d.rotY+=(e.clientX-d.x)*0.012; d.rotX+=(e.clientY-d.y)*0.008;
      d.rotX=Math.max(-0.8,Math.min(0.8,d.rotX));
      d.x=e.clientX; d.y=e.clientY;
    });
    window.addEventListener('mouseup', ()=>{d.down=false;});
    canvas.addEventListener('touchstart', e=>{d.down=true;d.x=e.touches[0].clientX;d.y=e.touches[0].clientY;},{passive:true});
    canvas.addEventListener('touchmove',  e=>{
      if(!d.down) return;
      d.rotY+=(e.touches[0].clientX-d.x)*0.012; d.rotX+=(e.touches[0].clientY-d.y)*0.008;
      d.rotX=Math.max(-0.8,Math.min(0.8,d.rotX));
      d.x=e.touches[0].clientX; d.y=e.touches[0].clientY;
    },{passive:true});
    canvas.addEventListener('touchend', ()=>{d.down=false;});
    canvas.addEventListener('wheel', e=>{
      e.preventDefault();
      viewers[id].camera.position.z=Math.max(1.5,Math.min(6,viewers[id].camera.position.z+e.deltaY*0.005));
    },{passive:false});
  }

  return { init, setView };
})();
