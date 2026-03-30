/* ═══════════════════════════════════════════
   BUECON — Focus Mode
   Cinematic product interaction overlay
   ═══════════════════════════════════════════ */

const FocusMode = (() => {
  let scene, camera, renderer, animId;
  let focusObj = null;
  let isOpen = false;
  let currentProduct = null;

  const overlay   = document.getElementById('focus-overlay');
  const closeBtn  = document.getElementById('focus-close');
  const canvas    = document.getElementById('focus-canvas');
  const panelEl   = overlay?.querySelector('.focus-panel');

  /* ── Open ── */
  function open(product) {
    if (!overlay || isOpen) return;
    currentProduct = product;
    isOpen = true;

    /* Populate panel */
    overlay.querySelector('.focus-series').textContent  = product.series;
    overlay.querySelector('.focus-name').textContent    = product.name;
    overlay.querySelector('.focus-desc').textContent    = product.description;

    const featList = overlay.querySelector('.focus-features');
    featList.innerHTML = product.features
      .map(f => `<li>${f}</li>`)
      .join('');

    overlay.querySelector('.focus-badge').textContent = product.badge;

    /* Animate in */
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    /* Build or refresh mini 3D scene */
    initFocusScene(product);
  }

  /* ── Close ── */
  function close() {
    if (!overlay || !isOpen) return;
    isOpen = false;

    overlay.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => destroyFocusScene(), 700);
  }

  /* ── Mini 3D scene for focus ── */
  function initFocusScene(product) {
    if (!canvas || !window.THREE) return;

    destroyFocusScene();

    const w = canvas.offsetWidth || 480;
    const h = canvas.offsetHeight || 480;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    /* Lighting - dramatic spotlight effect */
    const ambient = new THREE.AmbientLight(0x0a1520, 1);
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xFFE5B4, 8, 15, Math.PI / 6, 0.4);
    spot.position.set(0, 5, 5);
    spot.target.position.set(0, 0, 0);
    scene.add(spot);
    scene.add(spot.target);

    const fill = new THREE.DirectionalLight(0xC5A46D, 1.5);
    fill.position.set(-4, 0, 3);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xBFC7D5, 0.8);
    rim.position.set(3, -2, -2);
    scene.add(rim);

    /* Build product mesh */
    focusObj = buildFocusMesh(product.id);
    if (focusObj) {
      focusObj.scale.setScalar(0.01);
      scene.add(focusObj);

      /* Animate scale in */
      animateScaleIn(focusObj, 1.0, 700);
    }

    renderFocus();
  }

  function animateScaleIn(obj, targetScale, duration) {
    const start = performance.now();
    const from = 0.01;

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); /* ease out cubic */
      obj.scale.setScalar(from + (targetScale - from) * ease);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function buildFocusMesh(productId) {
    const group = new THREE.Group();

    /* Gold-tinted material for focus */
    const mat = new THREE.MeshStandardMaterial({
      color: 0xC5A46D,
      roughness: 0.18,
      metalness: 0.92,
    });
    const chrome = new THREE.MeshStandardMaterial({
      color: 0xD0D8E4,
      roughness: 0.08,
      metalness: 1.0,
    });
    const useMat = (productId === 'spirit' || productId === 'salt') ? mat : chrome;

    /* Generic premium faucet assembly for all products */
    /* Spout */
    const spout = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.13, 1.6, 32),
      useMat
    );
    spout.rotation.z = Math.PI / 2.1;
    spout.position.set(0.4, 0.3, 0);
    group.add(spout);

    /* Head */
    const head = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.35, 32),
      useMat
    );
    head.position.set(1.0, -0.1, 0);
    group.add(head);

    /* Base */
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.2, 0.7, 28),
      useMat
    );
    base.position.set(-0.3, -0.1, 0);
    group.add(base);

    /* Rose */
    const rose = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 0.06, 28),
      useMat
    );
    rose.position.set(-0.3, -0.47, 0);
    group.add(rose);

    /* Handle */
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.8, 0.12),
      useMat
    );
    handle.position.set(-0.3, 0.5, 0.22);
    group.add(handle);

    /* Handle top */
    const handleTop = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 16, 16),
      useMat
    );
    handleTop.position.set(-0.3, 0.95, 0.22);
    group.add(handleTop);

    group.rotation.y = Math.PI * 0.15;
    group.position.set(0, -0.2, 0);
    return group;
  }

  function renderFocus() {
    if (!renderer) return;
    animId = requestAnimationFrame(renderFocus);

    const t = performance.now() * 0.001;
    if (focusObj) {
      focusObj.rotation.y = t * 0.4 + Math.sin(t * 0.5) * 0.15;
      focusObj.position.y = Math.sin(t * 0.6) * 0.08 - 0.2;
    }

    renderer.render(scene, camera);
  }

  function destroyFocusScene() {
    if (animId) cancelAnimationFrame(animId);
    if (focusObj) {
      focusObj.children.forEach(c => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    }
    if (renderer) {
      renderer.dispose();
      renderer = null;
    }
    focusObj = null;
    animId = null;
  }

  /* ── Events ── */
  function bindEvents() {
    if (!overlay) return;

    closeBtn?.addEventListener('click', close);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    /* Product card clicks */
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      if (!card) return;
      const productId = card.dataset.productId;
      const product = BUECON.products.find(p => p.id === productId);
      if (product) open(product);
    });
  }

  /* ── Init ── */
  function init() {
    bindEvents();
  }

  return { init, open, close };
})();
