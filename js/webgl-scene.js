/* ═══════════════════════════════════════════
   BUECON — WebGL Scene — UPGRADED
   Big cinematic floating hardware objects
   Dramatic metallic PBR + glow + depth fog
   Mouse parallax + hover reaction + scroll drift
   ═══════════════════════════════════════════ */

const WebGLScene = (() => {
  let scene, camera, renderer, animFrameId;
  let objects = [];
  let glowMeshes = [];
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0;
  let isActive = false;
  let raycaster, pointer;
  let hoveredObj = null;

  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) return fallback();

    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
    } catch (e) { return fallback(); }

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060F18, 0.022);
    scene.background = new THREE.Color(0x060F18);

    camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    raycaster = new THREE.Raycaster();
    pointer = new THREE.Vector2();

    buildLights();
    buildObjects();
    bindEvents();
    isActive = true;
    animate();
  }

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

  function chromeMat() { return new THREE.MeshStandardMaterial({ color: 0xD8E0EA, roughness: 0.05, metalness: 1.0, envMapIntensity: 1.8 }); }
  function goldMat()   { return new THREE.MeshStandardMaterial({ color: 0xC8A45A, roughness: 0.18, metalness: 0.95, envMapIntensity: 1.5 }); }
  function brushedMat(){ return new THREE.MeshStandardMaterial({ color: 0xA0AABB, roughness: 0.38, metalness: 0.88, envMapIntensity: 1.2 }); }
  function matteGold() { return new THREE.MeshStandardMaterial({ color: 0xB8923C, roughness: 0.52, metalness: 0.78, envMapIntensity: 0.9 }); }

  function am(g, geo, mat, fn) {
    const m = new THREE.Mesh(geo, mat);
    if (fn) fn(m);
    g.add(m);
    return m;
  }

  function buildFaucet(g, mat) {
    am(g, new THREE.CylinderGeometry(0.075, 0.095, 1.6, 32), mat, m => { m.rotation.z = Math.PI/2.1; m.position.set(0.35,0.25,0); });
    am(g, new THREE.TorusGeometry(0.22, 0.075, 16, 32, Math.PI/2), mat, m => { m.position.set(-0.18,0,0); m.rotation.z = Math.PI; });
    am(g, new THREE.CylinderGeometry(0.075, 0.095, 0.65, 24), mat, m => m.position.set(-0.18,-0.5,0));
    am(g, new THREE.CylinderGeometry(0.14, 0.11, 0.22, 28), mat, m => m.position.set(1.0,0.25,0));
    am(g, new THREE.CylinderGeometry(0.22, 0.24, 0.055, 28), mat, m => m.position.set(-0.18,-0.84,0));
    am(g, new THREE.TorusGeometry(0.19, 0.022, 12, 36), mat, m => { m.rotation.x = Math.PI/2; m.position.set(-0.18,-0.78,0); });
  }

  function buildDispenser(g, mat) {
    am(g, new THREE.CylinderGeometry(0.21, 0.25, 1.15, 32), mat, () => {});
    am(g, new THREE.TorusGeometry(0.22, 0.025, 12, 36), mat, m => { m.rotation.x = Math.PI/2; m.position.y = 0.58; });
    am(g, new THREE.CylinderGeometry(0.045, 0.055, 0.55, 18), mat, m => m.position.y = 0.96);
    am(g, new THREE.CylinderGeometry(0.085, 0.085, 0.055, 18), mat, m => m.position.y = 1.25);
    am(g, new THREE.SphereGeometry(0.13, 24, 24, 0, Math.PI*2, 0, Math.PI/2), mat, m => m.position.y = 1.29);
    am(g, new THREE.CylinderGeometry(0.26, 0.26, 0.04, 28), mat, m => m.position.y = -0.595);
  }

  function buildRing(g, mat) {
    am(g, new THREE.TorusGeometry(0.58, 0.065, 20, 80), mat, () => {});
    am(g, new THREE.CylinderGeometry(0.055, 0.065, 0.28, 18), mat, m => { m.rotation.x = Math.PI/2; m.position.set(0,0,-0.58); });
    am(g, new THREE.CylinderGeometry(0.14, 0.14, 0.035, 24), mat, m => { m.rotation.x = Math.PI/2; m.position.set(0,0,-0.72); });
  }

  function buildHandle(g, mat) {
    am(g, new THREE.BoxGeometry(0.16, 1.25, 0.16), mat, () => {});
    am(g, new THREE.CylinderGeometry(0.11, 0.11, 0.14, 22), mat, m => { m.rotation.x = Math.PI/2; m.position.y = 0.7; });
    am(g, new THREE.CylinderGeometry(0.21, 0.21, 0.065, 24), mat, m => m.position.y = -0.66);
  }

  function buildKnob(g, mat) {
    am(g, new THREE.SphereGeometry(0.42, 36, 36), mat, () => {});
    am(g, new THREE.CylinderGeometry(0.075, 0.095, 0.48, 18), mat, m => m.position.y = -0.46);
    am(g, new THREE.CylinderGeometry(0.21, 0.21, 0.055, 24), mat, m => m.position.y = -0.73);
  }

  function buildBracket(g, mat) {
    am(g, new THREE.BoxGeometry(1.1, 0.09, 0.09), mat, () => {});
    am(g, new THREE.BoxGeometry(0.09, 0.65, 0.09), mat, m => m.position.set(-0.5,-0.37,0));
    am(g, new THREE.CylinderGeometry(0.08, 0.08, 0.09, 18), mat, m => { m.rotation.z = Math.PI/2; m.position.set(0.55,0,0); });
  }

  function makeObj(buildFn, mat, pos, scale, rot, speed, amp, offset, rotS) {
    const g = new THREE.Group();
    buildFn(g, mat);
    g.position.set(...pos);
    g.scale.setScalar(scale);
    g.rotation.set(...rot);
    g.userData = { floatSpeed:speed, floatAmp:amp, floatOffset:offset, rotSpeed:rotS, basePos:{x:pos[0],y:pos[1],z:pos[2]}, baseScale:scale };
    scene.add(g); objects.push(g);
    return g;
  }

  function buildObjects() {
    /* HERO — big, close, dominant */
    makeObj(buildFaucet,   chromeMat(), [-0.9,  0.1,  0.5], 1.65, [0.1,-0.3,0.05],  0.20, 0.18, 0.0, 0.0018);
    makeObj(buildDispenser, goldMat(),  [ 2.4, -0.2,  0.2], 1.45, [0.05,-0.8,-0.05],0.17, 0.22, 1.8, 0.0022);
    makeObj(buildRing,    brushedMat(), [ 1.6,  1.8, -0.4], 1.25, [1.1, 0.4, 0.2],  0.24, 0.15, 3.2, 0.0016);
    /* Supporting — mid-depth */
    makeObj(buildHandle,  matteGold(),  [-2.8, -1.4, -0.8], 0.95, [0.3, 0.6, 0.1],  0.29, 0.25, 5.1, 0.0028);
    makeObj(buildKnob,    chromeMat(),  [-2.0,  2.0, -1.2], 0.85, [0.5, 0.3, 0.0],  0.19, 0.20, 2.6, 0.0032);
    makeObj(buildBracket, brushedMat(), [ 3.2, -2.0, -1.5], 0.90, [0.2,-0.4, 0.15], 0.23, 0.18, 4.4, 0.0020);
  }

  function animate() {
    if (!isActive) return;
    animFrameId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    mouse.tx += (mouse.x - mouse.tx) * 0.032;
    mouse.ty += (mouse.y - mouse.ty) * 0.032;

    camera.position.x += (mouse.tx * 0.6  - camera.position.x) * 0.04;
    camera.position.y += (-mouse.ty * 0.38 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    const targetZ = 5.5 + scrollY * 0.0016;
    camera.position.z += (targetZ - camera.position.z) * 0.04;

    objects.forEach(obj => {
      const d = obj.userData;
      const ft = t * d.floatSpeed + d.floatOffset;
      obj.position.y = d.basePos.y + Math.sin(ft) * d.floatAmp;
      obj.position.x = d.basePos.x + Math.cos(ft * 0.55) * (d.floatAmp * 0.22);
      obj.rotation.y += d.rotSpeed;
      obj.rotation.x += d.rotSpeed * 0.3;

      const isHov = obj === hoveredObj;
      const ts = isHov ? d.baseScale * 1.055 : d.baseScale;
      obj.scale.x += (ts - obj.scale.x) * 0.07;
      obj.scale.y = obj.scale.z = obj.scale.x;
    });

    renderer.render(scene, camera);
  }

  function bindEvents() {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raycaster) return;
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight)  * 2 + 1;
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

    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  function fallback() {
    const c = document.getElementById('webgl-canvas');
    if (c) c.style.display = 'none';
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
