/* ═══════════════════════════════════════════
   BUECON — Products Section
   Category accordion • Sub-category tabs
   All data stored in localStorage so admin
   edits appear live with no glitch
   ═══════════════════════════════════════════ */

const PRODUCTS_DEFAULTS = {
  categories: [
    {
      id: 'accessories', name: 'Accessories', icon: '◈',
      description: 'Complete your bathroom with our premium hardware accessories — engineered for precision, finished for beauty.',
      hasSubCategories: true,
      subCategories: [
        {
          id: 'salt', name: 'Salt Series', tagline: 'Pure Form, Pure Function',
          products: [
            { id:'salt-1', name:'Salt Single Lever',  desc:'Minimalist single-lever mixer with ceramic disc cartridge. Marine-grade stainless body with matte white finish.', image:'' },
            { id:'salt-2', name:'Salt Wall Mixer',    desc:'Wall-mounted mixer tap with concealed fixing system. Anti-corrosion coating for lasting brilliance.', image:'' },
            { id:'salt-3', name:'Salt Towel Ring',    desc:'Geometric towel ring with brushed chrome finish. Part of the crystalline Salt hardware family.', image:'' },
            { id:'salt-4', name:'Salt Robe Hook',     desc:'Double robe hook with concealed mounting. Matte white finish with premium anti-tarnish coating.', image:'' },
            { id:'salt-5', name:'Salt Soap Dispenser',desc:'Wall-mounted soap dispenser with 300ml capacity. Seamless Salt family design language.', image:'' },
            { id:'salt-6', name:'Salt Paper Holder',  desc:'Flush-mount toilet paper holder with one-hand operation. Lifetime structural warranty.', image:'' },
            { id:'salt-7', name:'Salt Towel Bar 24"', desc:'24-inch towel bar with solid stainless steel construction. Brushed chrome finish.', image:'' },
            { id:'salt-8', name:'Salt Towel Bar 18"', desc:'18-inch towel bar with Salt Series minimalist profile. Easy installation system.', image:'' },
          ]
        },
        {
          id: 'super', name: 'Super Series', tagline: 'Power Meets Precision',
          products: [
            { id:'super-1', name:'Super Single Lever',  desc:'Bold single-lever mixer with heavy-duty zinc alloy core. Brushed nickel finish with anthracite detailing.', image:'' },
            { id:'super-2', name:'Super Thermostatic',  desc:'Precision thermostatic mixer valve with temperature memory. Flow-optimised spout geometry.', image:'' },
            { id:'super-3', name:'Super Towel Rail',    desc:'Statement towel rail with bold proportions. Brushed nickel finish matching the Super hardware family.', image:'' },
            { id:'super-4', name:'Super Robe Hook',     desc:'Heavy-duty double robe hook with Super Series bold profile. Maximum load bearing.', image:'' },
            { id:'super-5', name:'Super Soap Dish',     desc:'Wall-mounted soap dish with drainage slot. Solid zinc alloy, brushed nickel.', image:'' },
            { id:'super-6', name:'Super Paper Holder',  desc:'Heavy-gauge paper holder with cover. One-hand operation, anthracite trim.', image:'' },
            { id:'super-7', name:'Super Towel Bar 24"', desc:'24-inch Super Series towel bar. Bold profile, unmatched durability.', image:'' },
            { id:'super-8', name:'Super Corner Shelf',  desc:'Corner-mount shower shelf with Super Series angular design. Concealed fixings.', image:'' },
          ]
        },
        {
          id: 'spirit', name: 'Spirit Series', tagline: 'Where Art Meets Architecture',
          products: [
            { id:'spirit-1', name:'Spirit Mixer Tap',     desc:'Handcrafted lever mixer in PVD Matte Gold. Solid brass construction with organic curves.', image:'' },
            { id:'spirit-2', name:'Spirit Floor Mixer',   desc:'Freestanding floor-mounted bath mixer. Rose Gold PVD finish with bespoke engraving available.', image:'' },
            { id:'spirit-3', name:'Spirit Towel Ring',    desc:'Sculptural towel ring in PVD Matte Gold. Where accessory becomes art.', image:'' },
            { id:'spirit-4', name:'Spirit Robe Hook',     desc:'Organic form robe hook with Rose Gold finish. Soft-close mechanism included.', image:'' },
            { id:'spirit-5', name:'Spirit Soap Holder',   desc:'Cast brass soap holder with PVD Gold finish. Spirit signature sculptural form language.', image:'' },
            { id:'spirit-6', name:'Spirit Paper Holder',  desc:'Open-end paper holder in matte gold. Pairs with the full Spirit bathroom suite.', image:'' },
            { id:'spirit-7', name:'Spirit Towel Bar 24"', desc:'Solid brass 24" towel bar with PVD Matte Gold. Luxury that endures.', image:'' },
            { id:'spirit-8', name:'Spirit Towel Bar 18"', desc:'18" Spirit Series towel bar. Handcrafted finish, lifetime structural warranty.', image:'' },
          ]
        },
        {
          id: '400', name: '400 Series', tagline: 'The Foundation of Excellence',
          products: [
            { id:'400-1', name:'400 Single Lever',   desc:'Chrome-plated brass single lever mixer. WRAS approved, universal installation system.', image:'' },
            { id:'400-2', name:'400 Wall Mixer',     desc:'Wall-mount mixer tap with 5-year comprehensive warranty. Available in 3 finishes.', image:'' },
            { id:'400-3', name:'400 Towel Ring',     desc:'Classic towel ring with chrome finish. Built on the same core principles as our premium lines.', image:'' },
            { id:'400-4', name:'400 Robe Hook',      desc:'Single robe hook, chrome-plated brass. Reliable and refined.', image:'' },
            { id:'400-5', name:'400 Soap Dish',      desc:'Wall-mounted soap dish with chrome finish. Sturdy, simple, built to last.', image:'' },
            { id:'400-6', name:'400 Paper Holder',   desc:'Standard paper holder with chrome finish. Quick-fit wall mounting system.', image:'' },
            { id:'400-7', name:'400 Towel Bar 24"',  desc:'24-inch chrome towel bar. Universal installation, 5-year warranty.', image:'' },
            { id:'400-8', name:'400 Towel Bar 18"',  desc:'18-inch chrome towel bar. Matching 400 Series finish throughout.', image:'' },
          ]
        },
        {
          id: 'soft', name: 'Soft Series', tagline: 'Warmth in Every Detail',
          products: [
            { id:'soft-1', name:'Soft Single Lever',   desc:'Gently curved single-lever mixer with soft-touch matte finish. Designed for calm, spa-like bathrooms.', image:'' },
            { id:'soft-2', name:'Soft Wall Mixer',     desc:'Wall-mounted mixer tap with rounded soft-form spout. Warm champagne finish.', image:'' },
            { id:'soft-3', name:'Soft Towel Ring',     desc:'Smooth-contoured towel ring with soft matte finish. Gentle on towels, beautiful on walls.', image:'' },
            { id:'soft-4', name:'Soft Robe Hook',      desc:'Rounded double robe hook with soft matte coating. Adds warmth to any bathroom corner.', image:'' },
            { id:'soft-5', name:'Soft Soap Dispenser', desc:'Fluid-form wall soap dispenser with push-top mechanism. 350ml capacity.', image:'' },
            { id:'soft-6', name:'Soft Paper Holder',   desc:'Smooth-profile paper holder with soft-close arm. Pairs perfectly with the Soft Series suite.', image:'' },
            { id:'soft-7', name:'Soft Towel Bar 24"',  desc:'24-inch towel bar with smooth rounded ends. Soft matte finish for a relaxed bathroom feel.', image:'' },
            { id:'soft-8', name:'Soft Towel Bar 18"',  desc:'18-inch Soft Series towel bar. Gentle curves, premium durability.', image:'' },
          ]
        },
        {
          id: 'smart', name: 'Smart Series', tagline: 'Intelligence Meets Design',
          products: [
            { id:'smart-1', name:'Smart Sensor Tap',      desc:'Touchless infrared sensor tap with auto shut-off. Water-saving technology with premium brushed finish.', image:'' },
            { id:'smart-2', name:'Smart Thermostatic',    desc:'Digital thermostatic mixer with LED temperature display. Precision to ±0.5°C.', image:'' },
            { id:'smart-3', name:'Smart Towel Warmer',    desc:'Electric towel warmer with smart timer and eco-mode. Chrome-finish stainless heating rails.', image:'' },
            { id:'smart-4', name:'Smart Mirror Cabinet',  desc:'LED mirror cabinet with touch dimmer, anti-fog, and USB charging port built in.', image:'' },
            { id:'smart-5', name:'Smart Soap Dispenser',  desc:'Automatic no-touch soap dispenser. 400ml capacity with volume control dial.', image:'' },
            { id:'smart-6', name:'Smart Night Light',     desc:'Motion-activated LED night light with soft amber glow. Fits standard socket, auto on/off.', image:'' },
            { id:'smart-7', name:'Smart Shower Panel',    desc:'Multi-function shower panel with rainfall head, body jets, and handheld spray. Chrome finish.', image:'' },
            { id:'smart-8', name:'Smart Exhaust Fan',     desc:'Ultra-quiet exhaust fan with humidity sensor. Auto activates when moisture detected.', image:'' },
          ]
        }
      ]
    },
    {
      id: 'shelfs', name: 'Shelfs', icon: '▭',
      description: 'Elegant bathroom shelving that organises your space without compromising on style. Crafted for strength and beauty.',
      hasSubCategories: false,
      products: [
        { id:'shelf-1', name:'Glass Corner Shelf',    desc:'Tempered glass corner shelf with chrome brass brackets. Perfect for shower niches.', image:'' },
        { id:'shelf-2', name:'Stainless Shelf 12"',   desc:'12-inch wall shelf in brushed stainless steel. Mirror-polished edges, concealed mounting.', image:'' },
        { id:'shelf-3', name:'Stainless Shelf 18"',   desc:'18-inch extended shelf. Heavy-gauge stainless with anti-rust finish.', image:'' },
        { id:'shelf-4', name:'Double Tier Shelf',     desc:'Two-tier storage shelf with chrome finish. Space-efficient design for modern bathrooms.', image:'' },
        { id:'shelf-5', name:'Wooden Teak Shelf',     desc:'Natural teak wood shelf with stainless hardware. Warm tone contrast for luxury bathrooms.', image:'' },
        { id:'shelf-6', name:'Recessed Niche Shelf',  desc:'Built-in recess shelf with stainless tile insert. Seamless in-wall integration.', image:'' },
        { id:'shelf-7', name:'Floating Glass Shelf',  desc:'Frameless glass shelf with polished chrome standoff brackets. Clean modern aesthetic.', image:'' },
        { id:'shelf-8', name:'Over-Door Shelf',       desc:'Over-door hanging shelf with adjustable hooks. No drilling required, instant storage.', image:'' },
      ]
    },
    {
      id: 'handicap', name: 'Handicap Grab Bars', icon: '◎',
      description: 'Safety and dignity without compromise. Engineered to the highest load standards while maintaining the refined BUECON aesthetic.',
      hasSubCategories: false,
      products: [
        { id:'grab-1', name:'Straight Grab Bar 12"',  desc:'12-inch straight grab bar in chrome-plated stainless. 250kg rated load bearing, ANSI/ADA compliant.', image:'' },
        { id:'grab-2', name:'Straight Grab Bar 18"',  desc:'18-inch straight grab bar. Heavy-duty wall flanges with concealed screws.', image:'' },
        { id:'grab-3', name:'Straight Grab Bar 24"',  desc:'24-inch straight grab bar. Textured grip surface for wet environments.', image:'' },
        { id:'grab-4', name:'Angled Grab Bar 30"',    desc:'30-inch angled grab bar at 45°. Ideal for toilet and bathtub assistance.', image:'' },
        { id:'grab-5', name:'L-Shape Grab Bar',       desc:'L-shaped combination grab bar for corner installation. Full corner support system.', image:'' },
        { id:'grab-6', name:'Flip-Up Grab Bar',       desc:'Hinged fold-down grab bar for flexible installation. Folds flat when not in use.', image:'' },
        { id:'grab-7', name:'Shower Seat + Bar',      desc:'Integrated folding shower seat with grab bar. Space-saving safety solution.', image:'' },
        { id:'grab-8', name:'Toilet Safety Frame',    desc:'Freestanding toilet safety frame. No drilling required, adjustable height.', image:'' },
      ]
    }
  ]
};

/* ── Load data: localStorage first, then defaults ── */
function getProductsData() {
  try {
    const saved = localStorage.getItem('buecon_products_v2');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return JSON.parse(JSON.stringify(PRODUCTS_DEFAULTS));
}

/* ── Render ── */
function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  const data = getProductsData();

  el.innerHTML = `
    <div class="container">
      <div class="products-header">
        <span class="section-label">Collections</span>
        <h2 class="section-title">Our <span class="italic">Products</span></h2>
        <div class="gold-divider" style="margin:16px auto;"></div>
        <p class="section-sub">Explore our complete range of premium bathroom hardware — crafted in Rajkot, trusted across India.</p>
      </div>
      <div class="category-list" id="categoryList">
        ${data.categories.map(cat => buildCategoryItem(cat)).join('')}
      </div>
    </div>
  `;
}

function buildCategoryItem(cat) {
  const total = cat.hasSubCategories
    ? cat.subCategories.reduce((a, s) => a + s.products.length, 0)
    : cat.products.length;
  return `
    <div class="category-item" id="cat-${cat.id}">
      <div class="category-header" onclick="toggleCategory('${cat.id}')">
        <div class="cat-header-left">
          <span class="cat-icon">${cat.icon}</span>
          <div class="cat-header-text">
            <h3 class="cat-name">${cat.name}</h3>
            <p class="cat-desc-short">${cat.description}</p>
          </div>
        </div>
        <div class="cat-header-right">
          <span class="cat-count">${total} Products</span>
          <span class="cat-chevron">›</span>
        </div>
      </div>
      <div class="category-body" id="body-${cat.id}">
        <div class="category-body-inner">
          ${cat.hasSubCategories ? buildSubCategoryTabs(cat) : buildProductGrid(cat.products)}
        </div>
      </div>
    </div>`;
}

function buildSubCategoryTabs(cat) {
  return `
    <div class="subcategory-tabs" id="tabs-${cat.id}">
      ${cat.subCategories.map((sub, i) => `
        <button class="subcategory-tab ${i===0?'active':''}"
          onclick="switchSubCategory(event,'${cat.id}','${sub.id}')">
          ${sub.name}
          <span class="sub-tab-tagline">${sub.tagline}</span>
        </button>`).join('')}
    </div>
    <div class="subcategory-panels" id="panels-${cat.id}">
      ${cat.subCategories.map((sub, i) => `
        <div class="subcategory-panel ${i===0?'active':''}" id="panel-${cat.id}-${sub.id}">
          ${buildProductGrid(sub.products)}
        </div>`).join('')}
    </div>`;
}

function buildProductGrid(products) {
  return `
    <div class="products-grid-new">
      ${products.map(p => `
        <div class="product-card-new">
          <div class="product-card-img${!p.image?' no-img':''}">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.parentElement.classList.add('no-img');this.style.display='none'"/>` : ''}
            <div class="product-img-placeholder"><span>◈</span><small>Image coming soon</small></div>
          </div>
          <div class="product-card-info">
            <h4 class="product-card-name">${p.name}</h4>
            <p class="product-card-desc">${p.desc}</p>
            <a href="contact.html" class="product-card-link" onclick="if(document.getElementById('contact')){event.preventDefault();document.getElementById('contact').scrollIntoView({behavior:'smooth'});}">Enquire →</a>
          </div>
        </div>`).join('')}
    </div>`;
}

function toggleCategory(id) {
  const body  = document.getElementById('body-' + id);
  const item  = document.getElementById('cat-' + id);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.category-item.open').forEach(el => {
    el.classList.remove('open');
    document.getElementById('body-' + el.id.replace('cat-','')).style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    const inner = body.querySelector('.category-body-inner');
    body.style.maxHeight = (inner.scrollHeight + 80) + 'px';
    setTimeout(() => item.scrollIntoView({ behavior:'smooth', block:'nearest' }), 320);
  }
}

function switchSubCategory(e, catId, subId) {
  e.stopPropagation();
  document.querySelectorAll(`#tabs-${catId} .subcategory-tab`).forEach(t => t.classList.remove('active'));
  e.currentTarget.classList.add('active');
  document.querySelectorAll(`#panels-${catId} .subcategory-panel`).forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${catId}-${subId}`);
  if (panel) panel.classList.add('active');
  const body  = document.getElementById('body-' + catId);
  const inner = body.querySelector('.category-body-inner');
  setTimeout(() => { body.style.maxHeight = (inner.scrollHeight + 80) + 'px'; }, 50);
}
