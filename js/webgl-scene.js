/* ═══════════════════════════════════════════
   BUECON — WebGL Scene (Three.js)
   Floating hardware objects with metallic
   materials, mouse parallax, scroll camera
   ═══════════════════════════════════════════ */

const WebGLScene = (() => {
  let scene, camera, renderer, animFrameId;
  let objects = [];
  let mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let scrollY = 0;
  let isActive = false;

  /* ── Init ── */
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) return fallback();

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
    } catch (e) {
      return fallback();
    }

    /* Scene */
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0B1C2C, 0.045);

    /* Camera */
    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    buildLights();
    buildObjects();
    bindEvents();

    isActive = true;
    animate();
  }

  /* ── Lights ── */
  function buildLights() {
    /* Ambient */
    const ambient = new THREE.AmbientLight(0x1a2a3a, 1.5);
    scene.add(ambient);

    /* Key light - warm gold */
    const key = new THREE.DirectionalLight(0xC5A46D, 2.5);
    key.position.set(5, 6, 4);
    scene.add(key);

    /* Fill light - cool silver */
    const fill = new THREE.DirectionalLight(0xBFC7D5, 1.2);
    fill.position.set(-5, -2, 3);
    scene.add(fill);

    /* Rim light */
    const rim = new THREE.DirectionalLight(0x2A4A6A, 0.8);
    rim.position.set(0, -6, -3);
    scene.add(rim);

    /* Point light - subtle gold glow */
    const pt = new THREE.PointLight(0xC5A46D, 0.6, 20);
    pt.position.set(2, 2, 5);
    scene.add(pt);
  }

  /* ── Create metallic material ── */
  function metalMat(color = 0xBFC7D5, roughness = 0.15, metalness = 0.95) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      envMapIntensity: 1.2,
    });
  }

  function goldMat() {
    return metalMat(0xC5A46D, 0.2, 0.9);
  }

  function chromeMat() {
    return metalMat(0xD0D8E4, 0.08, 1.0);
  }

  function matteMat() {
    return metalMat(0x8C8C9A, 0.55, 0.7);
  }

  /* ── Build Hardware Objects ── */
  function buildObjects() {
    const configs = [
      /* Faucet head - cylinder + torus */
      { type: 'faucet',   pos: [-3.5,  1.2, -1.5], scale: 0.75, mat: chromeMat(), speed: 0.45, floatAmp: 0.35 },
      /* Handle - elongated box */
      { type: 'handle',   pos: [ 3.2,  0.8, -2.0], scale: 0.8,  mat: goldMat(),   speed: 0.38, floatAmp: 0.28 },
      /* Towel ring - torus */
      { type: 'ring',     pos: [-2.2, -1.5, -1.0], scale: 0.65, mat: chromeMat(), speed: 0.52, floatAmp: 0.4  },
      /* Soap dispenser - capsule */
      { type: 'dispenser',pos: [ 2.5, -1.0, -2.5], scale: 0.7,  mat: matteMat(),  speed: 0.41, floatAmp: 0.3  },
      /* Knob - sphere + cylinder */
      { type: 'knob',     pos: [ 0.4,  2.2, -3.0], scale: 0.55, mat: goldMat(),   speed: 0.35, floatAmp: 0.22 },
      /* Bracket - box */
      { type: 'bracket',  pos: [-0.8, -2.4, -2.0], scale: 0.6,  mat: chromeMat(), speed: 0.48, floatAmp: 0.32 },
    ];

    configs.forEach((cfg, i) => {
      const group = new THREE.Group();
      group.position.set(...cfg.pos);
      group.scale.setScalar(cfg.scale);

      buildHardwareMesh(group, cfg.type, cfg.mat);

      group.userData = {
        floatSpeed:  cfg.speed,
        floatAmp:    cfg.floatAmp,
        floatOffset: i * 1.1,
        rotSpeed:    (Math.random() - 0.5) * 0.004,
        basePos:     { x: cfg.pos[0], y: cfg.pos[1], z: cfg.pos[2] },
        baseRot:     { x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2, z: 0 },
      };

      group.rotation.set(
        group.userData.baseRot.x,
        group.userData.baseRot.y,
        group.userData.baseRot.z
      );

      scene.add(group);
      objects.push(group);
    });
  }

  function buildHardwareMesh(group, type, mat) {
    let geo, mesh, extra;

    switch (type) {
      case 'faucet':
        /* Spout arm */
        geo = new THREE.CylinderGeometry(0.08, 0.10, 1.4, 24);
        mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.z = Math.PI / 2.2;
        mesh.position.set(0.3, 0.2, 0);
        group.add(mesh);
        /* Head */
        geo = new THREE.CylinderGeometry(0.18, 0.14, 0.3, 24);
        extra = new THREE.Mesh(geo, mat);
        extra.position.set(0.85, -0.1, 0);
        group.add(extra);
        /* Base */
        geo = new THREE.CylinderGeometry(0.12, 0.16, 0.6, 20);
        extra = new THREE.Mesh(geo, mat);
        extra.position.set(-0.2, -0.1, 0);
        group.add(extra);
        break;

      case 'handle':
        /* Body */
        geo = new THREE.BoxGeometry(0.18, 1.2, 0.18);
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        /* Top grip */
        geo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 20);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = 0.67;
        extra.rotation.x = Math.PI / 2;
        group.add(extra);
        /* Base plate */
        geo = new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = -0.64;
        group.add(extra);
        break;

      case 'ring':
        geo = new THREE.TorusGeometry(0.6, 0.07, 16, 64);
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        /* Mounting bracket */
        geo = new THREE.BoxGeometry(0.14, 0.4, 0.14);
        extra = new THREE.Mesh(geo, mat);
        extra.position.set(0, 0, -0.6);
        group.add(extra);
        break;

      case 'dispenser':
        /* Body */
        geo = new THREE.CylinderGeometry(0.22, 0.26, 1.1, 28);
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        /* Pump neck */
        geo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = 0.8;
        group.add(extra);
        /* Pump head */
        geo = new THREE.SphereGeometry(0.12, 16, 16);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = 1.1;
        group.add(extra);
        break;

      case 'knob':
        /* Main sphere */
        geo = new THREE.SphereGeometry(0.4, 32, 32);
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        /* Stem */
        geo = new THREE.CylinderGeometry(0.08, 0.1, 0.5, 16);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = -0.45;
        group.add(extra);
        /* Base rose */
        geo = new THREE.CylinderGeometry(0.22, 0.22, 0.06, 24);
        extra = new THREE.Mesh(geo, mat);
        extra.position.y = -0.72;
        group.add(extra);
        break;

      case 'bracket':
        /* Horizontal arm */
        geo = new THREE.BoxGeometry(1.0, 0.1, 0.1);
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
        /* Vertical mount */
        geo = new THREE.BoxGeometry(0.1, 0.6, 0.1);
        extra = new THREE.Mesh(geo, mat);
        extra.position.set(-0.45, -0.35, 0);
        group.add(extra);
        /* End cap */
        geo = new THREE.CylinderGeometry(0.09, 0.09, 0.1, 16);
        extra = new THREE.Mesh(geo, mat);
        extra.rotation.z = Math.PI / 2;
        extra.position.set(0.5, 0, 0);
        group.add(extra);
        break;
    }
  }

  /* ── Animation Loop ── */
  function animate() {
    if (!isActive) return;
    animFrameId = requestAnimationFrame(animate);

    const t = performance.now() * 0.001;

    /* Smooth mouse follow */
    mouse.tx += (mouse.x - mouse.tx) * 0.04;
    mouse.ty += (mouse.y - mouse.ty) * 0.04;

    /* Camera parallax from mouse */
    camera.position.x += (mouse.tx * 0.8 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.ty * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    /* Camera scroll movement */
    const targetZ = 8 + scrollY * 0.003;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    /* Float & rotate each object */
    objects.forEach((obj) => {
      const d = obj.userData;
      const ft = t * d.floatSpeed + d.floatOffset;
      obj.position.y = d.basePos.y + Math.sin(ft) * d.floatAmp;
      obj.position.x = d.basePos.x + Math.cos(ft * 0.7) * (d.floatAmp * 0.3);
      obj.rotation.y += d.rotSpeed;
      obj.rotation.x += d.rotSpeed * 0.4;
    });

    renderer.render(scene, camera);
  }

  /* ── Events ── */
  function bindEvents() {
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('scroll', () => {
      scrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ── Fallback if WebGL fails ── */
  function fallback() {
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) canvas.style.display = 'none';
    const fb = document.querySelector('.hero-fallback');
    if (fb) fb.style.opacity = '1';
    console.warn('BUECON: WebGL unavailable, using static fallback.');
  }

  /* ── Public API ── */
  function destroy() {
    isActive = false;
    if (animFrameId) cancelAnimationFrame(animFrameId);
    objects.forEach(o => {
      o.children.forEach(c => {
        if (c.geometry) c.geometry.dispose();
        if (c.material) c.material.dispose();
      });
    });
    if (renderer) renderer.dispose();
  }

  return { init, destroy };
})();
