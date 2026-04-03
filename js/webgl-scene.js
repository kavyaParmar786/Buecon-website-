/* ═══════════════════════════════════════════
   BUECON — WebGL Scene
   Loads real GLB models from public/modals/
   Keeps all floating / parallax / hover FX
   ═══════════════════════════════════════════ */

const WebGLScene = (() => {
  let scene, camera, renderer, animFrameId;
  let objects = [];
  let mouse    = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY  = 0;
  let isActive = false;
  let raycaster, pointer;
  let hoveredObj = null;

  /* ── Model configs
     pos   : [x, y, z]       — world position
     scale : number          — uniform scale
     rot   : [x, y, z]       — initial euler rotation
     speed : float speed
     amp   : float amplitude
     offset: float phase offset
     rotS  : auto-rotation speed per frame
  ── */
  const MODEL_CONFIGS = [
    {
      file:   'public/modals/liquid-dispenser.glb',
      pos:    [ 2.4, -0.2,  0.2],
      scale:  1.45,
      rot:    [0.05, -0.8, -0.05],
      speed:  0.17, amp: 0.22, offset: 1.8, rotS: 0.0022,
    },
    {
      file:   'public/modals/napkin-holder.glb',
      pos:    [ 1.6,  1.8, -0.4],
      scale:  1.25,
      rot:    [1.1,  0.4,  0.2],
      speed:  0.24, amp: 0.15, offset: 3.2, rotS: 0.0016,
    },
    {
      file:   'public/modals/robe-hook.glb',
      pos:    [-0.9,  0.1,  0.5],
      scale:  1.65,
      rot:    [0.1, -0.3,  0.05],
      speed:  0.20, amp: 0.18, offset: 0.0, rotS: 0.0018,
    },
    {
      file:   'public/modals/shelf.glb',
      pos:    [-2.8, -1.4, -0.8],
      scale:  0.95,
      rot:    [0.3,  0.6,  0.1],
      speed:  0.29, amp: 0.25, offset: 5.1, rotS: 0.0028,
    },
    {
      file:   'public/modals/towel-rack.glb',
      pos:    [ 3.2, -2.0, -1.5],
      scale:  0.90,
      rot:    [0.2, -0.4,  0.15],
      speed:  0.23, amp: 0.18, offset: 4.4, rotS: 0.0020,
    },
  ];

  /* ── Apply a chrome/gold metallic override to all meshes in a model ── */
  const MATERIALS = [
    new THREE.MeshStandardMaterial({ color: 0xD8E0EA, roughness: 0.05, metalness: 1.0 }), // chrome
    new THREE.MeshStandardMaterial({ color: 0xC8A45A, roughness: 0.18, metalness: 0.95 }), // gold
    new THREE.MeshStandardMaterial({ color: 0xA0AABB, roughness: 0.38, metalness: 0.88 }), // brushed
    new THREE.MeshStandardMaterial({ color: 0xB8923C, roughness: 0.52, metalness: 0.78 }), // matte gold
    new THREE.MeshStandardMaterial({ color: 0xD8E0EA, roughness: 0.05, metalness: 1.0 }), // chrome
  ];

  function applyMaterial(model, matIndex) {
    const mat = MATERIALS[matIndex % MATERIALS.length];
    model.traverse(child => {
      if (child.isMesh) {
        child.material = mat;
        child.castShadow    = false;
        child.receiveShadow = false;
      }
    });
  }

  /* ── Init ── */
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) return fallback();

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping        = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
    } catch(e) { return fallback(); }

    scene  = new THREE.Scene();
    scene.fog        = new THREE.FogExp2(0x060F18, 0.022);
    scene.background = new THREE.Color(0x060F18);

    camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    raycaster = new THREE.Raycaster();
    pointer   = new THREE.Vector2();

    buildLights();
    loadModels();   // async — objects appear as they load
    bindEvents();
    isActive = true;
    animate();
  }

  /* ── Lights ── */
  function buildLights() {
    scene.add(new THREE.AmbientLight(0x0A1828, 2.0));

    const key = new THREE.DirectionalLight(0xFFE8B0, 4.5);
    key.position.set(6, 8, 5);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x8BA8C8, 1.8);
    fill.position.set(-7, -1, 4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x1A3A6A, 2.2);
    rim.position.set(1, -8, -5);
    scene.add(rim);

    const ptGold = new THREE.PointLight(0xC5A46D, 3.5, 12);
    ptGold.position.set(1.5, 1, 4);
    scene.add(ptGold);

    const ptSilver = new THREE.PointLight(0x8AACCC, 2.0, 10);
    ptSilver.position.set(-3, -1, 3);
    scene.add(ptSilver);
  }

  /* ── Load all GLB models ── */
  function loadModels() {
    // GLTFLoader is available from the CDN added to index.html
    if (!window.THREE || !THREE.GLTFLoader) {
      console.warn('BUECON: GLTFLoader not found — falling back to geometry');
      buildFallbackObjects();
      return;
    }

    const loader = new THREE.GLTFLoader();

    MODEL_CONFIGS.forEach((cfg, i) => {
      loader.load(
        cfg.file,
        (gltf) => {
          const model = gltf.scene;

          // Auto-scale: fit model into a ~1-unit bounding box, then apply cfg.scale
          const box    = new THREE.Box3().setFromObject(model);
          const size   = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          const norm   = maxDim > 0 ? 1 / maxDim : 1;
          model.scale.setScalar(norm * cfg.scale);

          // Center the model on its own origin
          box.setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);

          // Wrap in a group for clean transforms
          const group = new THREE.Group();
          group.add(model);
          group.position.set(...cfg.pos);
          group.rotation.set(...cfg.rot);

          // Apply metallic material override
          applyMaterial(model, i);

          // Attach animation data
          group.userData = {
            floatSpeed:  cfg.speed,
            floatAmp:    cfg.amp,
            floatOffset: cfg.offset,
            rotSpeed:    cfg.rotS,
            basePos:     { x: cfg.pos[0], y: cfg.pos[1], z: cfg.pos[2] },
            baseScale:   norm * cfg.scale,
          };

          scene.add(group);
          objects.push(group);
          console.log(`BUECON: loaded ${cfg.file} ✓`);
        },
        undefined,  // progress
        (err) => {
          console.warn(`BUECON: failed to load ${cfg.file}`, err.message || err);
          // Add a placeholder geometry so the scene doesn't look empty
          buildPlaceholder(cfg, i);
        }
      );
    });
  }

  /* ── Fallback geometry (if GLTFLoader missing or model fails) ── */
  function buildFallbackObjects() {
    const mats = [
      new THREE.MeshStandardMaterial({ color: 0xD8E0EA, roughness: 0.05, metalness: 1.0 }),
      new THREE.MeshStandardMaterial({ color: 0xC8A45A, roughness: 0.18, metalness: 0.95 }),
      new THREE.MeshStandardMaterial({ color: 0xA0AABB, roughness: 0.38, metalness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: 0xB8923C, roughness: 0.52, metalness: 0.78 }),
      new THREE.MeshStandardMaterial({ color: 0xD8E0EA, roughness: 0.05, metalness: 1.0 }),
    ];
    MODEL_CONFIGS.forEach((cfg, i) => buildPlaceholder(cfg, i, mats[i]));
  }

  function buildPlaceholder(cfg, i, mat) {
    mat = mat || MATERIALS[i % MATERIALS.length];
    const geo   = i % 2 === 0
      ? new THREE.CylinderGeometry(0.2, 0.25, 1.2, 32)
      : new THREE.TorusGeometry(0.5, 0.12, 16, 64);
    const mesh  = new THREE.Mesh(geo, mat);
    const group = new THREE.Group();
    group.add(mesh);
    group.position.set(...cfg.pos);
    group.rotation.set(...cfg.rot);
    group.scale.setScalar(cfg.scale);
    group.userData = {
      floatSpeed: cfg.speed, floatAmp: cfg.amp, floatOffset: cfg.offset,
      rotSpeed: cfg.rotS,
      basePos:  { x: cfg.pos[0], y: cfg.pos[1], z: cfg.pos[2] },
      baseScale: cfg.scale,
    };
    scene.add(group);
    objects.push(group);
  }

  /* ── Animation loop (unchanged) ── */
  function animate() {
    if (!isActive) return;
    animFrameId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    mouse.tx += (mouse.x - mouse.tx) * 0.032;
    mouse.ty += (mouse.y - mouse.ty) * 0.032;

    camera.position.x += (mouse.tx  *  0.6  - camera.position.x) * 0.04;
    camera.position.y += (-mouse.ty *  0.38 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    const targetZ = 5.5 + scrollY * 0.0016;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    objects.forEach(obj => {
      const d  = obj.userData;
      const ft = t * d.floatSpeed + d.floatOffset;
      obj.position.y = d.basePos.y + Math.sin(ft)        * d.floatAmp;
      obj.position.x = d.basePos.x + Math.cos(ft * 0.55) * (d.floatAmp * 0.22);
      obj.rotation.y += d.rotSpeed;
      obj.rotation.x += d.rotSpeed * 0.3;

      const isHov = obj === hoveredObj;
      const ts    = isHov ? d.baseScale * 1.055 : d.baseScale;
      obj.scale.x += (ts - obj.scale.x) * 0.07;
      obj.scale.y = obj.scale.z = obj.scale.x;
    });

    renderer.render(scene, camera);
  }

  /* ── Events (unchanged) ── */
  function bindEvents() {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raycaster) return;
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const meshes = [];
      objects.forEach(o => o.traverse(c => { if (c.isMesh) meshes.push(c); }));
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) {
        let par = hits[0].object;
        while (par.parent && !objects.includes(par)) par = par.parent;
        hoveredObj = objects.includes(par) ? par : null;
      } else { hoveredObj = null; }
    });

    window.addEventListener('scroll',  () => { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('resize',  () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function fallback() {
    const c  = document.getElementById('webgl-canvas');
    if (c)  c.style.display = 'none';
    const fb = document.querySelector('.hero-fallback');
    if (fb) fb.style.opacity = '1';
  }

  function destroy() {
    isActive = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    objects.forEach(o => o.traverse(c => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }));
    if (renderer) renderer.dispose();
  }

  return { init, destroy };
})();
