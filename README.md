# BUECON — Premium Bathroom Hardware Website

> Designed to Speak. Built to Last.

A cinematic, WebGL-powered luxury website for BUECON, a premium bathroom hardware brand based in Rajkot, Gujarat, India (est. 2016).

---

## 📁 Project Structure

```
buecon/
├── index.html                  ← Main HTML shell
│
├── css/
│   ├── variables.css           ← All design tokens (colors, fonts, spacing)
│   ├── reset.css               ← CSS reset
│   ├── base.css                ← Body, typography, buttons, utilities
│   ├── loader.css              ← Intro loader animation
│   ├── navbar.css              ← Sticky navbar + mobile menu
│   ├── hero.css                ← Full-screen hero section
│   ├── about.css               ← About / brand story section
│   ├── products.css            ← Product series grid & cards
│   ├── why.css                 ← Why BUECON section
│   ├── mission.css             ← Mission & Vision split panels
│   ├── contact.css             ← Contact form + info
│   ├── footer.css              ← Footer layout
│   ├── focus-mode.css          ← Cinematic product overlay
│   └── assistant.css           ← AI style advisor bubble
│
├── js/
│   ├── data.js                 ← All brand content & product data
│   ├── webgl-scene.js          ← Three.js hero scene (floating hardware)
│   ├── focus-mode.js           ← Cinematic product click interaction
│   ├── animations.js           ← GSAP ScrollTrigger, cursor, magnetic btns
│   ├── loader.js               ← Loader timing controller
│   ├── assistant.js            ← AI style advisor panel
│   ├── main.js                 ← App entry point / boot sequence
│   │
│   └── sections/               ← Each section renders its own HTML
│       ├── about.js
│       ├── products.js
│       ├── why.js
│       ├── mission.js
│       ├── contact.js
│       └── footer.js
```

---

## 🚀 How to Run

This is a **pure HTML/CSS/JS** site — no build step needed.

1. Unzip the folder
2. Open `index.html` in a browser directly, **or**
3. Serve with any static server for best results:

```bash
# Using VS Code Live Server (recommended)
# Right-click index.html → Open with Live Server

# Or using Node.js
npx serve .

# Or using Python
python -m http.server 8080
```

> ⚠️ **Note:** WebGL works best over a local server (file:// may block some features in certain browsers).

---

## 🎨 Tech Stack

| Layer         | Technology                  |
|---------------|-----------------------------|
| Structure     | HTML5                       |
| Styling       | CSS3 (custom properties)    |
| 3D / WebGL    | Three.js r128               |
| Animations    | GSAP 3 + ScrollTrigger      |
| Fonts         | Playfair Display + Poppins  |

All libraries are loaded via CDN — no npm install required.

---

## 🧩 Key Features

- **WebGL Hero** — 6 floating hardware objects (faucet, handle, towel ring, soap dispenser, knob, bracket) with metallic PBR materials, mouse parallax, and scroll-driven camera
- **Cinematic Loader** — Minimal logo animation before site entry
- **Focus Mode** — Click any product card to enter a cinematic overlay with a dedicated 3D scene, spotlight lighting, and product detail panel
- **AI Style Advisor** — Floating bubble that filters products by style (Modern / Minimal / Luxury)
- **GSAP Scroll Animations** — Every section reveals with staggered, physics-feel animations
- **Magnetic Buttons** — Hero CTA buttons follow the cursor with a gentle pull
- **Custom Cursor** — Gold dot + ring cursor with hover reactions
- **Responsive** — Full mobile support with hamburger menu

---

## 🎨 Customisation

### Update Brand Content
All text, product data, and brand details live in one place:
```
js/data.js
```

### Change Colors
All color tokens are in:
```
css/variables.css
```

### Add/Remove Products
Edit the `products` array in `js/data.js`, then update `js/sections/products.js` if you need layout changes.

### Disable WebGL (fallback only)
In `js/main.js`, comment out:
```js
WebGLScene.init('webgl-canvas');
```
The site will fall back to a premium static gradient.

---

## 📦 CDN Dependencies

```html
<!-- Three.js -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- GSAP Core -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- GSAP ScrollTrigger -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

---

## 🏷️ Brand

**BUECON** — Rajkot, Gujarat, India · Est. 2016  
*Hardware that transforms spaces into experiences.*
