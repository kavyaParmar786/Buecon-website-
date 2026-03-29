/**
 * BUECON — 3D Showroom Experience Engine
 * Three.js r128 | First-Person | WASD | Raycasting
 */

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// ─── PointerLockControls (inline, no external import needed) ────────────────

class PointerLockControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.isLocked = false;
    this._euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._vec = new THREE.Vector3();
    this._callbacks = {};

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onPLChange = this._onPLChange.bind(this);

    domElement.ownerDocument.addEventListener('pointerlockchange', this._onPLChange);
    domElement.ownerDocument.addEventListener('pointerlockerror', () => console.warn('Pointer lock error'));
  }

  _onMouseMove(e) {
    if (!this.isLocked) return;
    this._euler.setFromQuaternion(this.camera.quaternion);
    this._euler.y -= (e.movementX || 0) * 0.002;
    this._euler.x -= (e.movementY || 0) * 0.002;
    this._euler.x = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this._euler.x));
    this.camera.quaternion.setFromEuler(this._euler);
    this._emit('change');
  }

  _onPLChange() {
    const doc = this.domElement.ownerDocument;
    if (doc.pointerLockElement === this.domElement) {
      this.isLocked = true;
      this._emit('lock');
      doc.addEventListener('mousemove', this._onMouseMove);
    } else {
      this.isLocked = false;
      this._emit('unlock');
      doc.removeEventListener('mousemove', this._onMouseMove);
    }
  }

  on(evt, cb) {
    (this._callbacks[evt] = this._callbacks[evt] || []).push(cb);
    return this;
  }

  _emit(evt) {
    (this._callbacks[evt] || []).forEach(cb => cb());
  }

  lock() { this.domElement.requestPointerLock(); }
  unlock() { this.domElement.ownerDocument.exitPointerLock(); }
  getObject() { return this.camera; }

  moveRight(d) {
    this._vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this._vec, d);
  }

  moveForward(d) {
    this._vec.setFromMatrixColumn(this.camera.matrix, 0);
    this._vec.crossVectors(this.camera.up, this._vec);
    this.camera.position.addScaledVector(this._vec, d);
  }

  dispose() {
    const doc = this.domElement.ownerDocument;
    doc.removeEventListener('pointerlockchange', this._onPLChange);
    doc.removeEventListener('mousemove', this._onMouseMove);
  }
}

// ─── Renderer & Scene ────────────────────────────────────────────────────────

const canvas = document.getElementById('experience-canvas');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
renderer.outputEncoding = THREE.sRGBEncoding;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010510);
scene.fog = new THREE.FogExp2(0x010510, 0.045);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 80);
camera.position.set(0, 1.7, 8);

// ─── Lighting ────────────────────────────────────────────────────────────────

scene.add(new THREE.AmbientLight(0x0a1a2e, 2.0));

const ceilingLight = new THREE.PointLight(0x3090ff, 1.5, 25);
ceilingLight.position.set(0, 5.5, 0);
ceilingLight.castShadow = true;
scene.add(ceilingLight);

const neonL = new THREE.PointLight(0x6600ff, 2.2, 18);
neonL.position.set(-7, 3, 0);
scene.add(neonL);

const neonR = new THREE.PointLight(0x00d4ff, 2.2, 18);
neonR.position.set(7, 3, 0);
scene.add(neonR);

const neonB = new THREE.PointLight(0xff2d78, 1.8, 14);
neonB.position.set(0, 2, -8);
scene.add(neonB);

const neonF = new THREE.PointLight(0x00fff7, 1.2, 10);
neonF.position.set(0, 2, 8);
scene.add(neonF);

// ─── Room ────────────────────────────────────────────────────────────────────

// Floor
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(26, 26),
  new THREE.MeshStandardMaterial({ color: 0x05102a, roughness: 0.08, metalness: 0.65 })
);
floorMesh.rotation.x = -Math.PI / 2;
floorMesh.receiveShadow = true;
scene.add(floorMesh);

// Floor grid
const grid = new THREE.GridHelper(26, 26, 0x001a4d, 0x001a4d);
grid.position.y = 0.01;
scene.add(grid);

// Ceiling
const ceilMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(26, 26),
  new THREE.MeshStandardMaterial({ color: 0x020813, roughness: 1 })
);
ceilMesh.rotation.x = Math.PI / 2;
ceilMesh.position.y = 6.2;
scene.add(ceilMesh);

// Walls helper
function wall(w, h, ry, px, py, pz, col = 0x040c20) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ color: col, roughness: 0.7, metalness: 0.1, side: THREE.FrontSide })
  );
  m.rotation.y = ry;
  m.position.set(px, py, pz);
  m.receiveShadow = true;
  scene.add(m);
}

wall(26, 6.2, 0, 0, 3.1, -13);
wall(26, 6.2, Math.PI, 0, 3.1, 13);
wall(26, 6.2, -Math.PI / 2, 13, 3.1, 0);
wall(26, 6.2, Math.PI / 2, -13, 3.1, 0);

// Neon wall strips
function neonStrip(col, px, py, pz, ry = 0) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(9, 0.07, 0.07),
    new THREE.MeshBasicMaterial({ color: col })
  );
  m.position.set(px, py, pz);
  m.rotation.y = ry;
  scene.add(m);
  const l = new THREE.PointLight(col, 1, 7);
  l.position.copy(m.position);
  scene.add(l);
}

neonStrip(0x00d4ff, 0, 5.5, -12.9);
neonStrip(0x6600ff, 0, 5.5, 12.9, Math.PI);
neonStrip(0x00d4ff, -12.9, 5.5, 0, Math.PI / 2);
neonStrip(0x6600ff, 12.9, 5.5, 0, Math.PI / 2);

// Lower wall accent strips
neonStrip(0x001133, 0, 0.25, -12.9);
neonStrip(0x001133, 0, 0.25, 12.9, Math.PI);

// ─── Products ────────────────────────────────────────────────────────────────

const products = [];

function buildProduct({ name, pos, color, geoFn }) {
  const g = new THREE.Group();
  g.position.set(...pos);
  g.userData = { name, type: 'product' };

  // Platform base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.75, 0.09, 40),
    new THREE.MeshStandardMaterial({ color: 0x0a1a35, roughness: 0.2, metalness: 0.85, emissive: new THREE.Color(color), emissiveIntensity: 0.35 })
  );
  base.receiveShadow = true;
  g.add(base);

  // Orbit ring
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.7, 0.025, 16, 72),
    new THREE.MeshBasicMaterial({ color })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.06;
  g.add(ring);
  g.userData.ring = ring;

  // Product body (unique per series)
  const body = new THREE.Mesh(
    geoFn(),
    new THREE.MeshStandardMaterial({
      color: 0xddeeff,
      roughness: 0.12,
      metalness: 0.92,
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.1,
    })
  );
  body.position.y = 0.72;
  body.castShadow = true;
  g.add(body);
  g.userData.body = body;

  // Floating glow orb (icon)
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 20, 20),
    new THREE.MeshBasicMaterial({ color })
  );
  orb.position.y = 1.85;
  g.add(orb);
  g.userData.orb = orb;

  // Vertical beam
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.008, 0.008, 1.75, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.25 })
  );
  beam.position.y = 0.95;
  g.add(beam);

  // Product light
  const pl = new THREE.PointLight(color, 1.3, 4);
  pl.position.y = 1.1;
  g.add(pl);
  g.userData.light = pl;

  scene.add(g);
  products.push(g);
  return g;
}

// Salt Series — tap silhouette (cylinder)
buildProduct({
  name: 'Salt Series',
  pos: [-5, 0, -6],
  color: 0x00d4ff,
  geoFn: () => new THREE.CylinderGeometry(0.16, 0.11, 1.3, 20),
});

// Super Series — smart panel (box)
buildProduct({
  name: 'Super Series',
  pos: [5, 0, -6],
  color: 0xb44fff,
  geoFn: () => new THREE.BoxGeometry(0.85, 0.45, 0.55),
});

// Spirit Series — showerhead (sphere)
buildProduct({
  name: 'Spirit Series',
  pos: [-5, 0, 2],
  color: 0x00fff7,
  geoFn: () => new THREE.SphereGeometry(0.3, 20, 20),
});

// 400 Series — mirror frame (torus)
buildProduct({
  name: '400 Series',
  pos: [5, 0, 2],
  color: 0xff2d78,
  geoFn: () => new THREE.TorusGeometry(0.28, 0.065, 14, 48),
});

// ─── Particles ───────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 350;
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(PARTICLE_COUNT * 3);
const pSpeed = [];

for (let i = 0; i < PARTICLE_COUNT; i++) {
  pPos[i * 3]     = (Math.random() - 0.5) * 24;
  pPos[i * 3 + 1] = Math.random() * 6;
  pPos[i * 3 + 2] = (Math.random() - 0.5) * 24;
  pSpeed.push(0.003 + Math.random() * 0.007);
}

pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
  color: 0x3080ff,
  size: 0.045,
  transparent: true,
  opacity: 0.55,
  sizeAttenuation: true,
}));
scene.add(particles);

// ─── Controls ────────────────────────────────────────────────────────────────

const controls = new PointerLockControls(camera, canvas);
const keys = { w: false, a: false, s: false, d: false };
const vel = new THREE.Vector3();
const dir = new THREE.Vector3();
const SPEED = 5.5;
const clock = new THREE.Clock();

document.addEventListener('keydown', e => {
  switch (e.key.toLowerCase()) {
    case 'w': case 'arrowup':    keys.w = true; hudKey('W', true); break;
    case 'a': case 'arrowleft':  keys.a = true; hudKey('A', true); break;
    case 's': case 'arrowdown':  keys.s = true; hudKey('S', true); break;
    case 'd': case 'arrowright': keys.d = true; hudKey('D', true); break;
    case 'escape': showLockUI(true); break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.key.toLowerCase()) {
    case 'w': case 'arrowup':    keys.w = false; hudKey('W', false); break;
    case 'a': case 'arrowleft':  keys.a = false; hudKey('A', false); break;
    case 's': case 'arrowdown':  keys.s = false; hudKey('S', false); break;
    case 'd': case 'arrowright': keys.d = false; hudKey('D', false); break;
  }
});

function hudKey(k, on) {
  const el = document.getElementById('hud-key-' + k);
  if (el) el.classList.toggle('active-key', on);
}

// ─── Lock UI ─────────────────────────────────────────────────────────────────

const lockUI = document.getElementById('lockOverlay');

function showLockUI(show) {
  if (show) {
    lockUI.classList.remove('hidden');
    if (controls.isLocked) controls.unlock();
  } else {
    lockUI.classList.add('hidden');
  }
}

lockUI.addEventListener('click', () => {
  lockUI.classList.add('hidden');
  controls.lock();
});

controls
  .on('lock', () => lockUI.classList.add('hidden'))
  .on('unlock', () => {
    setTimeout(() => { if (!document.hidden) lockUI.classList.remove('hidden'); }, 120);
  });

// ─── Raycasting & Focus ───────────────────────────────────────────────────────

const raycaster = new THREE.Raycaster();
const CENTER = new THREE.Vector2(0, 0);
let focusTarget = null;
let focusedGroup = null;
let focusTimer = null;

function getProductGroup(obj) {
  let o = obj;
  while (o) {
    if (products.includes(o)) return o;
    o = o.parent;
  }
  return null;
}

canvas.addEventListener('click', () => {
  if (!controls.isLocked) return;
  raycaster.setFromCamera(CENTER, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  if (hits.length) {
    const pg = getProductGroup(hits[0].object);
    if (pg) activateFocus(pg);
  }
});

function activateFocus(pg) {
  const infoEl = document.getElementById('productInfoOverlay');
  infoEl.querySelector('.pio-name').textContent = pg.userData.name;
  infoEl.classList.add('visible');

  // Move player toward product (lerp target)
  const toward = camera.position.clone().sub(pg.position).normalize().multiplyScalar(2.6);
  focusTarget = pg.position.clone().add(toward);
  focusTarget.y = 1.7;

  focusedGroup = pg;

  clearTimeout(focusTimer);
  focusTimer = setTimeout(() => {
    infoEl.classList.remove('visible');
    focusTarget = null;
    focusedGroup = null;
  }, 3800);
}

// ─── Animation Loop ───────────────────────────────────────────────────────────

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  // ── Movement ──
  if (controls.isLocked) {
    vel.x -= vel.x * 10 * dt;
    vel.z -= vel.z * 10 * dt;
    dir.z = Number(keys.w) - Number(keys.s);
    dir.x = Number(keys.d) - Number(keys.a);
    dir.normalize();
    if (keys.w || keys.s) vel.z -= dir.z * SPEED * dt * 14;
    if (keys.a || keys.d) vel.x -= dir.x * SPEED * dt * 14;
    controls.moveRight(-vel.x * dt);
    controls.moveForward(-vel.z * dt);
    camera.position.x = Math.max(-11, Math.min(11, camera.position.x));
    camera.position.z = Math.max(-11, Math.min(11, camera.position.z));
    camera.position.y = 1.7;
  }

  // ── Lerp to focus target ──
  if (focusTarget) {
    camera.position.lerp(focusTarget, 0.045);
    if (camera.position.distanceTo(focusTarget) < 0.12) focusTarget = null;
  }

  // ── Product animations ──
  products.forEach((pg, i) => {
    const isFocused = pg === focusedGroup;

    // Body rotate
    if (pg.userData.body) pg.userData.body.rotation.y += dt * 0.65;

    // Orb float
    if (pg.userData.orb) {
      pg.userData.orb.position.y = 1.85 + Math.sin(t * 2.2 + i * 1.4) * 0.1;
      pg.userData.orb.rotation.y += dt * 1.8;
    }

    // Ring rotate
    if (pg.userData.ring) pg.userData.ring.rotation.z += dt * 0.4;

    // Light pulse
    if (pg.userData.light) {
      pg.userData.light.intensity = isFocused
        ? 3.5 + Math.sin(t * 3.5) * 0.6
        : 1.3 + Math.sin(t * 2 + i) * 0.25;
      pg.userData.light.distance = isFocused ? 6 : 4;
    }

    // Emissive boost when focused
    if (pg.userData.body && pg.userData.body.material) {
      pg.userData.body.material.emissiveIntensity = isFocused
        ? 0.5 + Math.sin(t * 3) * 0.15
        : 0.1;
    }
  });

  // ── Particle drift ──
  const pa = particles.geometry.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pa[i * 3 + 1] += pSpeed[i] * dt * 28;
    if (pa[i * 3 + 1] > 6) pa[i * 3 + 1] = 0;
  }
  particles.geometry.attributes.position.needsUpdate = true;

  // ── Scene light animation ──
  neonL.intensity = 2.0 + Math.sin(t * 0.7) * 0.4;
  neonR.intensity = 2.0 + Math.sin(t * 0.9 + 1.1) * 0.4;
  neonB.intensity = 1.6 + Math.sin(t * 1.3) * 0.3;
  ceilingLight.intensity = 1.4 + Math.sin(t * 0.25) * 0.1;

  renderer.render(scene, camera);
}

// ─── Resize ──────────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Loading Screen ───────────────────────────────────────────────────────────

const loadScreen = document.getElementById('loadingScreen');
const loadBar = document.getElementById('loadingBar');
const loadStatus = document.getElementById('loadingStatus');

const steps = [
  'Initializing renderer…',
  'Building showroom geometry…',
  'Loading materials & shaders…',
  'Placing product collections…',
  'Calibrating neon lighting…',
  'Applying cinematic fog…',
  'Ready to explore',
];

let step = 0;
function tick() {
  if (step >= steps.length) {
    loadBar.style.width = '100%';
    setTimeout(() => {
      loadScreen.classList.add('hidden');
      lockUI.classList.remove('hidden');
    }, 500);
    return;
  }
  loadStatus.textContent = steps[step];
  loadBar.style.width = ((step / (steps.length - 1)) * 100) + '%';
  step++;
  setTimeout(tick, 280 + Math.random() * 180);
}

setTimeout(tick, 350);

// Start render loop
animate();
