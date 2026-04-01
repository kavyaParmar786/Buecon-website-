/* ═══════════════════════════════════════════
   BUECON — Products Section
   Category accordion with sub-category drill-down
   ═══════════════════════════════════════════ */

const PRODUCTS_DATA = {
  categories: [
    {
      id: 'accessories',
      name: 'Accessories',
      icon: '◈',
      description: 'Complete your bathroom with our premium hardware accessories — engineered for precision, finished for beauty.',
      hasSubCategories: true,
      subCategories: [
        {
          id: 'salt', name: 'Salt Series', tagline: 'Pure Form, Pure Function',
          products: [
            { id: 'salt-1', name: 'Salt Single Lever', desc: 'Minimalist single-lever mixer with ceramic disc cartridge. Marine-grade stainless body with matte white finish.', image: 'assets/images/accessories/salt/salt-1.jpg' },
            { id: 'salt-2', name: 'Salt Wall Mixer', desc: 'Wall-mounted mixer tap with concealed fixing system. Anti-corrosion coating for lasting brilliance.', image: 'assets/images/accessories/salt/salt-2.jpg' },
            { id: 'salt-3', name: 'Salt Towel Ring', desc: 'Geometric towel ring with brushed chrome finish.', image: 'assets/images/accessories/salt/salt-3.jpg' },
            { id: 'salt-4', name: 'Salt Robe Hook', desc: 'Double robe hook with concealed mounting. Matte white finish with premium anti-tarnish coating.', image: 'assets/images/accessories/salt/salt-4.jpg' },
            { id: 'salt-5', name: 'Salt Soap Dispenser', desc: 'Wall-mounted soap dispenser with 300ml capacity.', image: 'assets/images/accessories/salt/salt-5.jpg' },
            { id: 'salt-6', name: 'Salt Paper Holder', desc: 'Flush-mount toilet paper holder with one-hand operation. Lifetime structural warranty.', image: 'assets/images/accessories/salt/salt-6.jpg' },
            { id: 'salt-7', name: 'Salt Towel Bar 24"', desc: '24-inch towel bar with solid stainless steel construction. Brushed chrome finish.', image: 'assets/images/accessories/salt/salt-7.jpg' },
            { id: 'salt-8', name: 'Salt Towel Bar 18"', desc: '18-inch towel bar with Salt Series minimalist profile.', image: 'assets/images/accessories/salt/salt-8.jpg' },
          ]
        },
        {
          id: 'super', name: 'Super Series', tagline: 'Power Meets Precision',
          products: [
            { id: 'super-1', name: 'Super Single Lever', desc: 'Bold single-lever mixer with heavy-duty zinc alloy core. Brushed nickel finish.', image: 'assets/images/accessories/super/super-1.jpg' },
            { id: 'super-2', name: 'Super Thermostatic', desc: 'Precision thermostatic mixer valve with temperature memory.', image: 'assets/images/accessories/super/super-2.jpg' },
            { id: 'super-3', name: 'Super Towel Rail', desc: 'Statement towel rail with bold proportions. Brushed nickel finish.', image: 'assets/images/accessories/super/super-3.jpg' },
            { id: 'super-4', name: 'Super Robe Hook', desc: 'Heavy-duty double robe hook with Super Series bold profile.', image: 'assets/images/accessories/super/super-4.jpg' },
            { id: 'super-5', name: 'Super Soap Dish', desc: 'Wall-mounted soap dish with drainage slot. Solid zinc alloy, brushed nickel.', image: 'assets/images/accessories/super/super-5.jpg' },
            { id: 'super-6', name: 'Super Paper Holder', desc: 'Heavy-gauge paper holder with cover. One-hand operation, anthracite trim.', image: 'assets/images/accessories/super/super-6.jpg' },
            { id: 'super-7', name: 'Super Towel Bar 24"', desc: '24-inch Super Series towel bar. Bold profile, unmatched durability.', image: 'assets/images/accessories/super/super-7.jpg' },
            { id: 'super-8', name: 'Super Corner Shelf', desc: 'Corner-mount shower shelf with Super Series angular design.', image: 'assets/images/accessories/super/super-8.jpg' },
          ]
        },
        {
          id: 'spirit', name: 'Spirit Series', tagline: 'Where Art Meets Architecture',
          products: [
            { id: 'spirit-1', name: 'Spirit Mixer Tap', desc: 'Handcrafted lever mixer in PVD Matte Gold. Solid brass construction with organic curves.', image: 'assets/images/accessories/spirit/spirit-1.jpg' },
            { id: 'spirit-2', name: 'Spirit Floor Mixer', desc: 'Freestanding floor-mounted bath mixer. Rose Gold PVD finish.', image: 'assets/images/accessories/spirit/spirit-2.jpg' },
            { id: 'spirit-3', name: 'Spirit Towel Ring', desc: 'Sculptural towel ring in PVD Matte Gold.', image: 'assets/images/accessories/spirit/spirit-3.jpg' },
            { id: 'spirit-4', name: 'Spirit Robe Hook', desc: 'Organic form robe hook with Rose Gold finish. Soft-close mechanism.', image: 'assets/images/accessories/spirit/spirit-4.jpg' },
            { id: 'spirit-5', name: 'Spirit Soap Holder', desc: 'Cast brass soap holder with PVD Gold finish.', image: 'assets/images/accessories/spirit/spirit-5.jpg' },
            { id: 'spirit-6', name: 'Spirit Paper Holder', desc: 'Open-end paper holder in matte gold.', image: 'assets/images/accessories/spirit/spirit-6.jpg' },
            { id: 'spirit-7', name: 'Spirit Towel Bar 24"', desc: 'Solid brass 24" towel bar with PVD Matte Gold. Luxury that endures.', image: 'assets/images/accessories/spirit/spirit-7.jpg' },
            { id: 'spirit-8', name: 'Spirit Towel Bar 18"', desc: '18" Spirit Series towel bar. Handcrafted finish, lifetime warranty.', image: 'assets/images/accessories/spirit/spirit-8.jpg' },
          ]
        },
        {
          id: '400', name: '400 Series', tagline: 'The Foundation of Excellence',
          products: [
            { id: '400-1', name: '400 Single Lever', desc: 'Chrome-plated brass single lever mixer. WRAS approved, universal installation.', image: 'assets/images/accessories/400/400-1.jpg' },
            { id: '400-2', name: '400 Wall Mixer', desc: 'Wall-mount mixer tap with 5-year warranty. Available in 3 finishes.', image: 'assets/images/accessories/400/400-2.jpg' },
            { id: '400-3', name: '400 Towel Ring', desc: 'Classic towel ring with chrome finish.', image: 'assets/images/accessories/400/400-3.jpg' },
            { id: '400-4', name: '400 Robe Hook', desc: 'Single robe hook, chrome-plated brass. Reliable and refined.', image: 'assets/images/accessories/400/400-4.jpg' },
            { id: '400-5', name: '400 Soap Dish', desc: 'Wall-mounted soap dish with chrome finish.', image: 'assets/images/accessories/400/400-5.jpg' },
            { id: '400-6', name: '400 Paper Holder', desc: 'Standard paper holder with chrome finish. Quick-fit wall mounting.', image: 'assets/images/accessories/400/400-6.jpg' },
            { id: '400-7', name: '400 Towel Bar 24"', desc: '24-inch chrome towel bar. Universal installation, 5-year warranty.', image: 'assets/images/accessories/400/400-7.jpg' },
            { id: '400-8', name: '400 Towel Bar 18"', desc: '18-inch chrome towel bar. Matching 400 Series finish throughout.', image: 'assets/images/accessories/400/400-8.jpg' },
          ]
        }
      ]
    },
    {
      id: 'shelfs',
      name: 'Shelfs',
      icon: '▭',
      description: 'Elegant bathroom shelving that organises your space without compromising on style. Crafted for strength and beauty.',
      hasSubCategories: false,
      products: [
        { id: 'shelf-1', name: 'Glass Corner Shelf', desc: 'Tempered glass corner shelf with chrome brass brackets. Perfect for shower niches.', image: 'assets/images/shelfs/shelf-1.jpg' },
        { id: 'shelf-2', name: 'Stainless Shelf 12"', desc: '12-inch wall shelf in brushed stainless steel. Mirror-polished edges, concealed mounting.', image: 'assets/images/shelfs/shelf-2.jpg' },
        { id: 'shelf-3', name: 'Stainless Shelf 18"', desc: '18-inch extended shelf. Heavy-gauge stainless with anti-rust finish.', image: 'assets/images/shelfs/shelf-3.jpg' },
        { id: 'shelf-4', name: 'Double Tier Shelf', desc: 'Two-tier storage shelf with chrome finish. Space-efficient design.', image: 'assets/images/shelfs/shelf-4.jpg' },
        { id: 'shelf-5', name: 'Wooden Teak Shelf', desc: 'Natural teak wood shelf with stainless hardware. Warm tone for luxury bathrooms.', image: 'assets/images/shelfs/shelf-5.jpg' },
        { id: 'shelf-6', name: 'Recessed Niche Shelf', desc: 'Built-in recess shelf with stainless tile insert. Seamless in-wall integration.', image: 'assets/images/shelfs/shelf-6.jpg' },
        { id: 'shelf-7', name: 'Floating Glass Shelf', desc: 'Frameless glass shelf with polished chrome standoff brackets.', image: 'assets/images/shelfs/shelf-7.jpg' },
        { id: 'shelf-8', name: 'Over-Door Shelf', desc: 'Over-door hanging shelf with adjustable hooks. No drilling required.', image: 'assets/images/shelfs/shelf-8.jpg' },
      ]
    },
    {
      id: 'handicap',
      name: 'Handicap Grab Bars',
      icon: '◎',
      description: 'Safety and dignity without compromise. Engineered to the highest load standards while maintaining the BUECON aesthetic.',
      hasSubCategories: false,
      products: [
        { id: 'grab-1', name: 'Straight Grab Bar 12"', desc: '12-inch straight grab bar in chrome-plated stainless. 250kg rated, ANSI/ADA compliant.', image: 'assets/images/handicap/grab-1.jpg' },
        { id: 'grab-2', name: 'Straight Grab Bar 18"', desc: '18-inch straight grab bar. Heavy-duty wall flanges with concealed screws.', image: 'assets/images/handicap/grab-2.jpg' },
        { id: 'grab-3', name: 'Straight Grab Bar 24"', desc: '24-inch straight grab bar. Textured grip surface for wet environments.', image: 'assets/images/handicap/grab-3.jpg' },
        { id: 'grab-4', name: 'Angled Grab Bar 30"', desc: '30-inch angled grab bar at 45°. Ideal for toilet and bathtub assistance.', image: 'assets/images/handicap/grab-4.jpg' },
        { id: 'grab-5', name: 'L-Shape Grab Bar', desc: 'L-shaped combination grab bar for corner installation.', image: 'assets/images/handicap/grab-5.jpg' },
        { id: 'grab-6', name: 'Flip-Up Grab Bar', desc: 'Hinged fold-down grab bar. Folds flat when not in use.', image: 'assets/images/handicap/grab-6.jpg' },
        { id: 'grab-7', name: 'Shower Seat + Bar Combo', desc: 'Integrated folding shower seat with grab bar. Space-saving safety solution.', image: 'assets/images/handicap/grab-7.jpg' },
        { id: 'grab-8', name: 'Toilet Safety Frame', desc: 'Freestanding toilet safety frame. Adjustable height, no drilling required.', image: 'assets/images/handicap/grab-8.jpg' },
      ]
    }
  ]
};

function renderProducts() {
  const el = document.getElementById('products-content');
  if (!el) return;

  el.innerHTML = `
    <div class="container">
      <div class="products-header">
        <span class="section-label">Collections</span>
        <h2 class="section-title">Our <span class="italic">Products</span></h2>
        <div class="gold-divider" style="margin:16px auto;"></div>
        <p class="section-sub">Explore our complete range of premium bathroom hardware — crafted in Rajkot, trusted across India.</p>
      </div>
      <div class="category-list" id="categoryList">
        ${PRODUCTS_DATA.categories.map((cat, i) => buildCategoryItem(cat, i)).join('')}
      </div>
    </div>
  `;
}

function buildCategoryItem(cat) {
  const totalProducts = cat.hasSubCategories
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
          <span class="cat-count">${totalProducts} Products</span>
          <span class="cat-chevron">›</span>
        </div>
      </div>
      <div class="category-body" id="body-${cat.id}">
        <div class="category-body-inner">
          ${cat.hasSubCategories ? buildSubCategoryTabs(cat) : buildProductGrid(cat.products)}
        </div>
      </div>
    </div>
  `;
}

function buildSubCategoryTabs(cat) {
  return `
    <div class="subcategory-tabs" id="tabs-${cat.id}">
      ${cat.subCategories.map((sub, i) => `
        <button class="subcategory-tab ${i === 0 ? 'active' : ''}"
          onclick="switchSubCategory(event,'${cat.id}','${sub.id}')">
          ${sub.name}
          <span class="sub-tab-tagline">${sub.tagline}</span>
        </button>
      `).join('')}
    </div>
    <div class="subcategory-panels" id="panels-${cat.id}">
      ${cat.subCategories.map((sub, i) => `
        <div class="subcategory-panel ${i === 0 ? 'active' : ''}" id="panel-${cat.id}-${sub.id}">
          ${buildProductGrid(sub.products)}
        </div>
      `).join('')}
    </div>
  `;
}

function buildProductGrid(products) {
  return `
    <div class="products-grid-new">
      ${products.map(p => `
        <div class="product-card-new">
          <div class="product-card-img">
            <img src="${p.image}" alt="${p.name}" loading="lazy"
              onerror="this.parentElement.classList.add('no-img')" />
            <div class="product-img-placeholder">
              <span>◈</span>
              <small>Image coming soon</small>
            </div>
          </div>
          <div class="product-card-info">
            <h4 class="product-card-name">${p.name}</h4>
            <p class="product-card-desc">${p.desc}</p>
            <a href="#contact" class="product-card-link">Enquire →</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function toggleCategory(id) {
  const body   = document.getElementById('body-' + id);
  const item   = document.getElementById('cat-' + id);
  const isOpen = item.classList.contains('open');

  /* Close all first */
  document.querySelectorAll('.category-item.open').forEach(el => {
    el.classList.remove('open');
    document.getElementById('body-' + el.id.replace('cat-', '')).style.maxHeight = '0';
  });

  if (!isOpen) {
    item.classList.add('open');
    const inner = body.querySelector('.category-body-inner');
    body.style.maxHeight = inner.scrollHeight + 80 + 'px';
    setTimeout(() => { item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 320);
  }
}

function switchSubCategory(e, catId, subId) {
  e.stopPropagation();

  /* Tabs */
  document.querySelectorAll(`#tabs-${catId} .subcategory-tab`).forEach(t => t.classList.remove('active'));
  e.currentTarget.classList.add('active');

  /* Panels */
  document.querySelectorAll(`#panels-${catId} .subcategory-panel`).forEach(p => p.classList.remove('active'));
  const panel = document.getElementById(`panel-${catId}-${subId}`);
  if (panel) panel.classList.add('active');

  /* Recalc height */
  const body  = document.getElementById('body-' + catId);
  const inner = body.querySelector('.category-body-inner');
  setTimeout(() => { body.style.maxHeight = inner.scrollHeight + 80 + 'px'; }, 50);
}
