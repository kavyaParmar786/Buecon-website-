/* ═══════════════════════════════════════════
   BUECON — WebGL Hero Scene
   Loads real .glb models from public/models/
   Cinematic floating, mouse parallax, scroll
   ═══════════════════════════════════════════ */

const WebGLScene = (() => {
  let scene, camera, renderer, animFrameId;
  let objects = [];
  let mouse   = { x:0, y:0, tx:0, ty:0 };
  let scrollY = 0;
  let isActive = false;
  let raycaster, pointer, hoveredObj = null;

  const MODELS = [
    /* 3 hero — big, close */
    { file:'public/models/towel_rack.glb',      pos:[-1.0, 0.2, 0.4], scale:1.8, rot:[0.05,-0.3,0.02], floatSpeed:0.18, floatAmp:0.20, floatOffset:0.0,  rotSpeed:0.0015 },
    { file:'public/models/liquid_dispensor.glb', pos:[ 2.2,-0.1, 0.2], scale:1.6, rot:[0.0, -0.8,0.0],  floatSpeed:0.16, floatAmp:0.22, floatOffset:1.8,  rotSpeed:0.0018 },
    { file:'public/models/soap_dish.glb',        pos:[ 1.4, 1.9,-0.3], scale:1.4, rot:[0.8,  0.3,0.1],  floatSpeed:0.22, floatAmp:0.16, floatOffset:3.2,  rotSpeed:0.0014 },
    /* 3 supporting — deeper */
    { file:'public/models/napkin_holder.glb',    pos:[-2.6,-1.3,-0.8], scale:1.1, rot:[0.2,  0.6,0.05], floatSpeed:0.26, floatAmp:0.24, floatOffset:5.0,  rotSpeed:0.0022 },
    { file:'public/models/robe_hook_.glb',       pos:[-1.8, 2.1,-1.2], scale:1.0, rot:[0.4,  0.2,0.0],  floatSpeed:0.20, floatAmp:0.18, floatOffset:2.5,  rotSpeed:0.0026 },
    { file:'public/models/tumbler_holder.glb',   pos:[ 3.0,-1.8,-1.4], scale:1.05,rot:[0.1, -0.4,0.1],  floatSpeed:0.24, floatAmp:0.20, floatOffset:4.3,  rotSpeed:0.0020 },
  ];

  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !window.THREE) return fallback();
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:false, powerPreference:'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping         = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.4;
    } catch(e) { return fallback(); }

    scene = new THREE.Scene();
    scene.fog        = new THREE.FogExp2(0x060F18, 0.020);
    scene.background = new THREE.Color(0x060F18);

    camera = new THREE.PerspectiveCamera(48, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    raycaster = new THREE.Raycaster();
    pointer   = new THREE.Vector2();

    buildLights();
    loadModels();
    bindEvents();
    isActive = true;
    animate();
  }

  function buildLights() {
    scene.add(new THREE.AmbientLight(0x0A1828, 2.5));
    const key = new THREE.DirectionalLight(0xFFE8B0, 4.0); key.position.set(6,8,5); scene.add(key);
    const fill= new THREE.DirectionalLight(0x8BA8C8, 1.8); fill.position.set(-7,-1,4); scene.add(fill);
    const rim = new THREE.DirectionalLight(0x1A3A6A, 2.0); rim.position.set(1,-8,-5); scene.add(rim);
    const ptG = new THREE.PointLight(0xC5A46D, 3.5, 14); ptG.position.set(1.5,1,4); scene.add(ptG);
    const ptC = new THREE.PointLight(0x8AACCC, 2.0, 10); ptC.position.set(-3,-1,3); scene.add(ptC);
  }

  function loadModels() {
    const Loader = window.THREE.GLTFLoader;
    if (!Loader) {
      console.warn('GLTFLoader missing — add CDN to page'); 
      MODELS.forEach((cfg,i) => addFallback(cfg,i));
      return;
    }
    const loader = new Loader();
    MODELS.forEach((cfg, i) => {
      loader.load(cfg.file,
        gltf => {
          const group = new THREE.Group();
          const model = gltf.scene;
          /* Normalize size */
          const box    = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size   = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          model.position.sub(center);
          model.scale.setScalar(cfg.scale / maxDim);
          /* Metallic boost */
          model.traverse(child => {
            if (!child.isMesh) return;
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(mat => {
              if (!mat.isMeshStandardMaterial) return;
              mat.metalness       = Math.max(mat.metalness, 0.88);
              mat.roughness       = Math.min(mat.roughness, 0.22);
              mat.envMapIntensity = 1.5;
            });
          });
          group.add(model);
          setupObj(group, cfg);
        },
        undefined,
        err => { console.warn('GLB load failed:', cfg.file); addFallback(cfg, i); }
      );
    });
  }

  function setupObj(group, cfg) {
    group.position.set(...cfg.pos);
    group.rotation.set(...cfg.rot);
    group.userData = {
      floatSpeed: cfg.floatSpeed, floatAmp: cfg.floatAmp,
      floatOffset: cfg.floatOffset, rotSpeed: cfg.rotSpeed,
      basePos: {x:cfg.pos[0], y:cfg.pos[1], z:cfg.pos[2]},
      baseScale: cfg.scale,
    };
    scene.add(group);
    objects.push(group);
  }

  const FALLBACKS = [
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xD0D8E4,roughness:0.08,metalness:1.0}); [-0.3,0,0.3].forEach(y=>{const c=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,2.2,20),m);c.rotation.z=Math.PI/2;c.position.y=y;g.add(c);}); return g; },
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xC8A45A,roughness:0.18,metalness:0.95}); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,1.2,32),m)); return g; },
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xD0D8E4,roughness:0.08,metalness:1.0}); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.28,0.3,0.07,32),m)); return g; },
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xA0AABB,roughness:0.38,metalness:0.88}); g.add(new THREE.Mesh(new THREE.BoxGeometry(1.1,0.09,0.09),m)); return g; },
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xD0D8E4,roughness:0.08,metalness:1.0}); const h=new THREE.Mesh(new THREE.SphereGeometry(0.3,24,24),m);h.position.y=0.2;g.add(h); return g; },
    cfg => { const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0xC8A45A,roughness:0.18,metalness:0.95}); g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.26,0.9,28),m)); return g; },
  ];
  function addFallback(cfg, i) {
    const group = (FALLBACKS[i]||FALLBACKS[0])(cfg);
    setupObj(group, cfg);
  }

  function animate() {
    if (!isActive) return;
    animFrameId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    mouse.tx += (mouse.x - mouse.tx) * 0.032;
    mouse.ty += (mouse.y - mouse.ty) * 0.032;
    camera.position.x += (mouse.tx * 0.55  - camera.position.x) * 0.04;
    camera.position.y += (-mouse.ty * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0,0,0);
    camera.position.z += ((5.5 + scrollY*0.0016) - camera.position.z) * 0.04;

    objects.forEach(obj => {
      const d = obj.userData;
      const ft = t*d.floatSpeed + d.floatOffset;
      obj.position.y = d.basePos.y + Math.sin(ft)*d.floatAmp;
      obj.position.x = d.basePos.x + Math.cos(ft*0.55)*(d.floatAmp*0.22);
      obj.rotation.y += d.rotSpeed;
      obj.rotation.x += d.rotSpeed*0.28;
      const ts = (obj===hoveredObj) ? d.baseScale*1.06 : d.baseScale;
      const cs = obj.scale.x;
      if (Math.abs(cs-ts) > 0.001) obj.scale.setScalar(cs + (ts-cs)*0.08);
    });
    renderer.render(scene, camera);
  }

  function bindEvents() {
    window.addEventListener('mousemove', e => {
      mouse.x = (e.clientX/window.innerWidth  - 0.5)*2;
      mouse.y = (e.clientY/window.innerHeight - 0.5)*2;
      if (!raycaster) return;
      pointer.x =  (e.clientX/window.innerWidth )*2-1;
      pointer.y = -(e.clientY/window.innerHeight)*2+1;
      raycaster.setFromCamera(pointer, camera);
      const meshes=[];
      objects.forEach(o=>o.traverse(c=>{if(c.isMesh)meshes.push(c);}));
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length) {
        let par=hits[0].object;
        while(par.parent && !objects.includes(par)) par=par.parent;
        hoveredObj = objects.includes(par)?par:null;
      } else hoveredObj=null;
    });
    window.addEventListener('scroll', ()=>{scrollY=window.scrollY;},{passive:true});
    window.addEventListener('resize', ()=>{
      if(!camera||!renderer) return;
      camera.aspect=window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth,window.innerHeight);
    });
  }

  function fallback() {
    const c=document.getElementById('webgl-canvas'); if(c) c.style.display='none';
    const fb=document.querySelector('.hero-fallback'); if(fb) fb.style.opacity='1';
  }

  function destroy() {
    isActive=false;
    if(animFrameId) cancelAnimationFrame(animFrameId);
    objects.forEach(o=>o.traverse(c=>{
      if(c.geometry) c.geometry.dispose();
      const mats=Array.isArray(c.material)?c.material:[c.material];
      mats.forEach(m=>{if(m&&m.dispose)m.dispose();});
    }));
    if(renderer) renderer.dispose();
  }

  return {init, destroy};
})();
