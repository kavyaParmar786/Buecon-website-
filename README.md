# BUECON — Premium Bathroom Hardware Website (v2 — Upgraded)

> Designed to Speak. Built to Last.

## 📁 Project Structure

```
buecon/
├── index.html                     ← Main site
├── admin/
│   ├── index.html                 ← Admin panel (/admin)
│   ├── admin.css                  ← Admin styles
│   └── admin.js                   ← Admin logic (CRUD, localStorage)
├── api/
│   ├── contact.php                ← PHP mailer (shared hosting)
│   ├── contact.js                 ← Node.js + Nodemailer API
│   └── .env.example               ← Copy to .env and fill credentials
├── assets/
│   ├── images/                    ← Add product images here: salt.jpg, super.jpg, etc.
│   └── models/                    ← Add 3D models here: salt.glb, super.glb, etc.
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── base.css                   ← Cursor, buttons, glass panels, utilities
│   ├── loader.css
│   ├── navbar.css
│   ├── hero.css
│   ├── about.css
│   ├── products.css               ← Now includes image/3D viewer toggle styles
│   ├── why.css
│   ├── mission.css
│   ├── contact.css
│   ├── footer.css
│   ├── focus-mode.css
│   └── assistant.css
├── js/
│   ├── data.js                    ← All brand/product content + real contact info
│   ├── webgl-scene.js             ← UPGRADED: big objects, cinematic lighting, hover
│   ├── product-viewer.js          ← NEW: per-card 3D viewer with drag + zoom
│   ├── focus-mode.js              ← Cinematic product overlay
│   ├── animations.js              ← GSAP scroll, cursor, magnetic
│   ├── loader.js
│   ├── assistant.js               ← AI style filter
│   ├── main.js
│   └── sections/
│       ├── about.js
│       ├── products.js            ← UPGRADED: image/3D toggle per card
│       ├── why.js
│       ├── mission.js
│       ├── contact.js             ← UPGRADED: validation + loading + fallback mailto
│       └── footer.js
```

---

## 🚀 Run the Site

```bash
# Static — no install
npx serve .
# then open http://localhost:3000

# Admin panel
# http://localhost:3000/admin/
```

---

## 📧 Contact Form Setup

### Option A — PHP (shared hosting / cPanel)
Upload files to your hosting. `api/contact.php` will handle submissions automatically.

### Option B — Node.js
```bash
cd api
cp .env.example .env
# Edit .env with your Gmail App Password
npm install express nodemailer cors dotenv
node contact.js
# API runs on port 3001
```

**Gmail App Password:** Google Account → Security → 2FA → App Passwords → Generate

---

## 🖼️ Adding Real Product Images

Place images in `assets/images/` named:
- `salt.jpg`
- `super.jpg`
- `spirit.jpg`
- `400.jpg`

Then in `js/sections/products.js`, uncomment the `<img>` tag inside each card.

---

## 📦 Adding 3D Models (.glb)

1. Place your `.glb` files in `assets/models/`
2. In `js/product-viewer.js`, replace `buildProductMesh()` with a GLTF loader:

```js
const loader = new THREE.GLTFLoader();
loader.load('assets/models/' + productId + '.glb', (gltf) => {
  v.obj = gltf.scene;
  v.scene.add(v.obj);
});
```

You'll need to add GLTFLoader CDN:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/examples/js/loaders/GLTFLoader.js"></script>
```

---

## 🛠️ Admin Panel — /admin/

| Feature | Status |
|---|---|
| Product listing | ✅ |
| Add / Edit / Delete product | ✅ |
| Image upload UI | ✅ (manual save to assets/) |
| 3D model upload UI | ✅ (manual save to assets/) |
| Content editing | ✅ (localStorage) |
| Supabase connection test | ✅ |
| Live database sync | Connect Supabase in Settings |

---

## 🎨 Key Upgrades in v2

| Feature | What Changed |
|---|---|
| WebGL scene | Objects 1.4–1.65× larger, closer camera (z=5.5), dramatic 3-point + glow lighting |
| Product cards | Image / 3D toggle per card, drag-rotate, scroll-to-zoom |
| Contact form | Real validation, loading state, mailto fallback, real contact info |
| Admin panel | Full CRUD at /admin, product management, content editor, Supabase settings |
| Contact info | Phone: 9825591898 · Email: kavyaparmar7866@gmail.com |
