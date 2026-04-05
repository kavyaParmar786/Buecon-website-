/* ═══════════════════════════════════════════
   BUECON — Products Section
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
            { id:'salt-1',  name:'Salt Robe Hook',         desc:'Classic robe hook with concealed mounting. Matte white finish with premium anti-tarnish coating. SS-1107', image:'public/images/salt-robe-hook.png' },
            { id:'salt-2',  name:'Salt Tumbler Holder',    desc:'Wall-mounted tumbler holder with solid stainless bracket. Part of the crystalline Salt hardware family. SS-1103', image:'public/images/salt-tumbler-holder.png' },
            { id:'salt-3',  name:'Salt Soap Dish',         desc:'Geometric soap dish with brushed chrome finish. Marine-grade stainless body with matte white finish. SS-1101', image:'public/images/salt-soap-dish.png' },
            { id:'salt-4',  name:'Salt Napkin Holder',     desc:'Minimalist napkin holder with concealed fixing system. Anti-corrosion coating for lasting brilliance. SS-1104', image:'public/images/salt-napkin-holder.png' },
            { id:'salt-5',  name:'Salt Napkin Holder A',   desc:'Open-frame napkin holder variant with Salt Series angular profile. Lifetime structural warranty. SS-1104A', image:'public/images/salt-napkin-holder-a.png' },
            { id:'salt-6',  name:'Salt Napkin Holder S',   desc:'Slim-profile napkin holder with single-arm design. Easy one-hand operation. SS-1104S', image:'public/images/salt-napkin-holder-s.png' },
            { id:'salt-7',  name:'Salt Towel Rack',        desc:'18"/24" towel rack with double rail. Solid stainless steel construction, brushed chrome finish. SS-1110', image:'public/images/salt-towel-rack.png' },
            { id:'salt-8',  name:'Salt Towel Rod',         desc:'18"/24" single towel rod with Salt Series minimalist profile. Easy installation system. SS-1110', image:'public/images/salt-towel-rod.png' },
            { id:'salt-9',  name:'Salt Liquid Dispenser',  desc:'Wall-mounted liquid soap dispenser. Seamless Salt family design language. SS-1106', image:'public/images/salt-liquid-dispenser.png' },
            { id:'salt-10', name:'Salt Lid Paper',         desc:'Covered paper holder with flip-lid. Flush-mount with one-hand operation. Lifetime structural warranty. SS-1108L', image:'public/images/salt-lid-paper.png' },
            { id:'salt-11', name:'Salt Paper Holder',      desc:'Open paper holder with Salt Series geometric profile. Quick-fit wall mounting system. SS-1108', image:'public/images/salt-paper-holder.png' },
            { id:'salt-12', name:'Salt Tumbler Holder G',  desc:'Glass tumbler holder variant with frosted glass cup. Premium anti-tarnish coating. SS-1103G', image:'public/images/salt-tumbler-holder-g.png' },
            { id:'salt-13', name:'Salt Double Soap Dish',  desc:'Double soap dish with extended platform. Part of the crystalline Salt hardware family. SS-1102', image:'public/images/salt-double-soap-dish.png' },
            { id:'salt-14', name:'Salt Soap & Tumbler',    desc:'Combination soap dish with tumbler holder. Space-efficient dual-function design. SS-1105', image:'public/images/salt-soap-tumbler.png' },
            { id:'salt-15', name:'Salt Paper Holder S',    desc:'Slim paper holder variant with Salt Series profile. Concealed fixing system. SS-1108S', image:'public/images/salt-paper-holder-s.png' },
            { id:'salt-16', name:'Salt Soap Dish G',       desc:'Glass soap dish with chrome bracket. Frosted glass platform. SS-1103G', image:'public/images/salt-soap-dish-g.png' },
          ]
        },
        {
          id: 'super', name: 'Super Series', tagline: 'Power Meets Precision',
          products: [
            { id:'super-1',  name:'Super Robe Hook',         desc:'Bold single robe hook with heavy-duty zinc alloy core. Brushed nickel finish. SS-1207', image:'public/images/super-robe-hook.png' },
            { id:'super-2',  name:'Super Robe Hook S',       desc:'Slim robe hook variant with Super Series round profile. Maximum load bearing. SS-1207S', image:'public/images/super-robe-hook-s.png' },
            { id:'super-3',  name:'Super Tumbler Holder',    desc:'Precision tumbler holder with glass cup. Flow-optimised bracket geometry. SS-1203', image:'public/images/super-tumbler-holder.png' },
            { id:'super-4',  name:'Super Soap Dish',         desc:'Wall-mounted soap dish with drainage slot. Solid zinc alloy, brushed nickel. SS-1211', image:'public/images/super-soap-dish.png' },
            { id:'super-5',  name:'Super Single Tumbler',    desc:'Single tumbler holder with Super Series round profile. Anthracite trim. SS-1203S', image:'public/images/super-single-tumbler.png' },
            { id:'super-6',  name:'Super Napkin Holder',     desc:'Open napkin holder with bold Super Series profile. One-hand operation. SS-1204', image:'public/images/super-napkin-holder.png' },
            { id:'super-7',  name:'Super Napkin Holder 14',  desc:'Slim napkin holder arm. Brushed nickel finish matching the Super hardware family. SS-1214', image:'public/images/super-napkin-holder-14.png' },
            { id:'super-8',  name:'Super Towel Rod',         desc:'18"/24" single towel rod. Bold profile, unmatched durability. SS-1209', image:'public/images/super-towel-rod.png' },
            { id:'super-9',  name:'Super Towel Ring',        desc:'Statement towel ring with bold round proportions. Brushed nickel finish. SS-1204', image:'public/images/super-towel-ring.png' },
            { id:'super-10', name:'Super Towel Rack 24"',    desc:'24-inch double-rail towel rack. Bold profile, maximum load capacity. SS-1204', image:'public/images/super-towel-rack-24.png' },
            { id:'super-11', name:'Super Towel Rack 18"',    desc:'18-inch towel rack with Super Series bold proportions. Brushed nickel. SS-1210', image:'public/images/super-towel-rack-18.png' },
            { id:'super-12', name:'Super Liquid Dispenser',  desc:'Heavy-gauge liquid dispenser with cover. Anthracite trim. SS-1206', image:'public/images/super-liquid-dispenser.png' },
            { id:'super-13', name:'Super Double Soap',       desc:'Double soap dish with Super Series bold design. Solid zinc alloy construction. SS-1202', image:'public/images/super-double-soap.png' },
            { id:'super-14', name:'Super Double Tumbler',    desc:'Double tumbler holder with two glass cups. Bold Super Series aesthetic. SS-1205', image:'public/images/super-double-tumbler.png' },
            { id:'super-15', name:'Super Double Tumbler H',  desc:'Horizontal double tumbler holder variant. Matching Super Series finish. SS-1211', image:'public/images/super-double-tumb-h.png' },
            { id:'super-16', name:'Super Soap Dish S',       desc:'Slim soap dish variant with Super Series round profile. Chrome finish. SS-1201', image:'public/images/super-soap-dish-s.png' },
          ]
        },
        {
          id: 'spirit', name: 'Spirit Series', tagline: 'Where Art Meets Architecture',
          products: [
            { id:'spirit-1',  name:'Spirit Robe Hook',        desc:'Organic form robe hook with round rose gold finish. Soft-close mechanism included. SS-1407', image:'public/images/spirit-robe-hook.png' },
            { id:'spirit-2',  name:'Spirit Tumbler Holder',   desc:'Handcrafted tumbler holder with organic curves. Solid brass construction. SS-1403', image:'public/images/spirit-tumbler-holder.png' },
            { id:'spirit-3',  name:'Spirit Soap Dish',        desc:'Cast brass soap dish. Spirit signature sculptural form language. SS-1401', image:'public/images/spirit-soap-dish.png' },
            { id:'spirit-4',  name:'Spirit Napkin Holder',    desc:'Open-end napkin holder with round Spirit profile. Pairs with the full Spirit suite. SS-1404', image:'public/images/spirit-napkin-holder.png' },
            { id:'spirit-5',  name:'Spirit Napkin Ring',      desc:'Sculptural towel/napkin ring. Where accessory becomes art. SS-1404A', image:'public/images/spirit-napkin-ring.png' },
            { id:'spirit-6',  name:'Spirit Towel Rod',        desc:'18"/24" solid brass towel rod. Luxury that endures. SS-1409', image:'public/images/spirit-towel-rod.png' },
            { id:'spirit-7',  name:'Spirit Towel Rack',       desc:'18"/24" double-rail towel rack with Spirit round profile. Handcrafted finish. SS-1410', image:'public/images/spirit-towel-rack.png' },
            { id:'spirit-8',  name:'Spirit Liquid & Soap',    desc:'Combination liquid dispenser with soap dish platform. Spirit signature design. SS-1411', image:'public/images/spirit-liquid-soap.png' },
            { id:'spirit-9',  name:'Spirit Liquid Dispenser', desc:'Stand-alone liquid dispenser with organic lever. Cast brass, premium finish. SS-1406', image:'public/images/spirit-liquid-disp.png' },
            { id:'spirit-10', name:'Spirit Double Soap',      desc:'Double soap dish with Spirit sculptural form. Luxury that endures. SS-1402', image:'public/images/spirit-double-soap.png' },
            { id:'spirit-11', name:'Spirit Paper Holder S',   desc:'Paper holder with Spirit round profile. Bespoke finish available. SS-1408S', image:'public/images/spirit-paper-holder-s.png' },
            { id:'spirit-12', name:'Spirit Paper Holder',     desc:'Open paper holder. Pairs with the full Spirit bathroom suite. SS-1408', image:'public/images/spirit-paper-holder.png' },
            { id:'spirit-13', name:'Spirit Lid Paper',        desc:'Covered paper holder with flip lid. Spirit organic form language. SS-1408L', image:'public/images/spirit-lid-paper.png' },
          ]
        },
        {
          id: 'soft', name: 'Soft Series', tagline: 'Warmth in Every Detail',
          products: [
            { id:'soft-1',  name:'Soft Tumbler & Napkin',  desc:'Combination tumbler holder with napkin ring. Designed for calm, spa-like bathrooms. SS-1512', image:'public/images/soft-tumbler-napkin.png' },
            { id:'soft-2',  name:'Soft Soap Dish',         desc:'Gently curved soap dish with soft-touch matte finish. SS-1501', image:'public/images/soft-soap-dish.png' },
            { id:'soft-3',  name:'Soft Double Soap Dish',  desc:'Double soap dish with smooth rounded form. Warm champagne finish. SS-1502', image:'public/images/soft-double-soap.png' },
            { id:'soft-4',  name:'Soft Tumbler & Soap',    desc:'Combination tumbler holder with soap dish. SS-1205', image:'public/images/soft-tumbler-soap.png' },
            { id:'soft-5',  name:'Soft Tumbler Holder',    desc:'Single tumbler holder with soft round profile. SS-1503', image:'public/images/soft-tumbler-holder.png' },
            { id:'soft-6',  name:'Soft Robe Hook',         desc:'Rounded double robe hook with soft matte coating. Adds warmth to any bathroom corner. SS-1507', image:'public/images/soft-robe-hook.png' },
            { id:'soft-7',  name:'Soft Liquid & Napkin',   desc:'Liquid dispenser with integrated napkin ring. Fluid-form, space-efficient. SS-1513', image:'public/images/soft-liquid-napkin.png' },
            { id:'soft-8',  name:'Soft Napkin Ring',       desc:'Smooth-contoured napkin ring with soft matte finish. SS-1504', image:'public/images/soft-napkin-ring.png' },
            { id:'soft-9',  name:'Soft Spare Paper',       desc:'Spare paper holder with soft-close arm. SS-1504S', image:'public/images/soft-spare-paper.png' },
            { id:'soft-10', name:'Soft Liquid Holder',     desc:'Stand-alone liquid dispenser with rounded lever. 350ml capacity. SS-1506', image:'public/images/soft-liquid-holder.png' },
            { id:'soft-11', name:'Soft Paper Lid',         desc:'Covered paper holder with soft-close flip lid. SS-1508L', image:'public/images/soft-paper-lid.png' },
            { id:'soft-12', name:'Soft Paper Holder',      desc:'Open paper holder with smooth rounded ends. SS-1208', image:'public/images/soft-paper-holder.png' },
            { id:'soft-13', name:'Soft Tumbler Holder S',  desc:'Single tumbler holder variant with soft matte coating. SS-1503S', image:'public/images/soft-tumbler-holder-s.png' },
            { id:'soft-14', name:'Soft Double Tumbler',    desc:'Double tumbler holder with two frosted cups. SS-1511', image:'public/images/soft-double-tumbler.png' },
            { id:'soft-15', name:'Soft Towel Rod',         desc:'18"/24" towel rod with smooth rounded ends. Soft matte finish. SS-1509', image:'public/images/soft-towel-rod.png' },
            { id:'soft-16', name:'Soft Towel Rack',        desc:'Double-rail towel rack with gentle rounded profile. SS-1510', image:'public/images/soft-towel-rack.png' },
          ]
        },
        {
          id: 'smart', name: 'Smart Series', tagline: 'Intelligence Meets Design',
          products: [
            { id:'smart-1',  name:'Smart Paper Lid',        desc:'Covered paper holder with lid. Premium brushed finish. SS-2309L', image:'public/images/smart-paper-lid.png' },
            { id:'smart-2',  name:'Smart Robe Hook',        desc:'Sleek robe hook with Smart Series round profile. SS-2306', image:'public/images/smart-robe-hook.png' },
            { id:'smart-3',  name:'Smart Soap Dish',        desc:'Wall-mounted soap dish with Smart Series clean profile. Chrome finish. SS-2305', image:'public/images/smart-soap-dish.png' },
            { id:'smart-4',  name:'Smart Tumbler Holder',   desc:'Tumbler holder with frosted glass cup. Precision brushed finish. SS-2307', image:'public/images/smart-tumbler-holder.png' },
            { id:'smart-5',  name:'Smart Napkin Ring',      desc:'Clean round napkin ring with Smart Series aesthetic. SS-2308', image:'public/images/smart-napkin-ring.png' },
            { id:'smart-6',  name:'Smart Towel Rod',        desc:'Single towel rod with Smart Series round profile. Chrome finish. SS-2310', image:'public/images/smart-towel-rod.png' },
            { id:'smart-7',  name:'Smart Liquid Holder',    desc:'Liquid dispenser with frosted glass bottle. Volume control dial. SS-2312', image:'public/images/smart-liquid-holder.png' },
            { id:'smart-8',  name:'Smart Paper Holder',     desc:'Open paper holder with Smart round profile. Quick-fit mounting. SS-2309', image:'public/images/smart-paper-holder.png' },
            { id:'smart-9',  name:'Smart Towel Rack',       desc:'Double-rail towel rack with Smart Series profile. Chrome finish. SS-2311', image:'public/images/smart-towel-rack.png' },
            { id:'smart-10', name:'Smart Liquid & Napkin',  desc:'Combination liquid dispenser with napkin ring. Space-efficient. SS-2314', image:'public/images/smart-liquid-napkin.png' },
            { id:'smart-11', name:'Smart Tumbler & Paper',  desc:'Tumbler holder with integrated paper holder. Dual-function design. SS-2315', image:'public/images/smart-tumbler-paper.png' },
            { id:'smart-12', name:'Smart Double Tumbler',   desc:'Double tumbler holder with two frosted glass cups. SS-2321', image:'public/images/smart-double-tumbler.png' },
            { id:'smart-13', name:'Smart Tumbler & Soap',   desc:'Combination tumbler holder with soap dish. SS-2322', image:'public/images/smart-tumbler-soap.png' },
            { id:'smart-14', name:'Smart Double Soap',      desc:'Double soap dish with Smart Series clean profile. SS-2320', image:'public/images/smart-double-soap.png' },
            { id:'smart-15', name:'Smart Spare Paper',      desc:'Spare paper holder with Smart round profile. SS-2323', image:'public/images/smart-spare-paper.png' },
          ]
        }
      ]
    },
    {
      id: 'shelfs', name: 'Shelfs', icon: '▭',
      description: 'Elegant bathroom shelving that organises your space without compromising on style. Crafted for strength and beauty.',
      hasSubCategories: false,
      products: [
        { id:'shelf-1', name:'Double Soap dish',      desc:'Stainless Steel soap dish with chrome brackets. Perfect for shower niches.',                             image:'public/images/shelf-double-soap-dish.png' },
        { id:'shelf-2', name:'Soap Dish & Tumbler',   desc:'A kind of shelf with a soap dish and a tumbler with it. Mirror-polished edges, concealed mounting.',    image:'public/images/shelf-soap-tumbler.png'      },
        { id:'shelf-3', name:'Stainless Hooks',       desc:'Hook Shelf with 4 hooks inside it. Heavy-gauge stainless with anti-rust finish.',                       image:'public/images/shelf-hook.png'              },
        { id:'shelf-4', name:'Shelf + Napkin Holder', desc:'Two-tier storage shelf with chrome finish. Space-efficient design for modern bathrooms.',                image:'public/images/shelf-glass-napkin.png'      },
        { id:'shelf-5', name:'Shelf Glass Corner',    desc:'Shelf with glass hardware. Warm tone contrast for luxury bathrooms.',                                    image:'public/images/shelf-glass-corner.png'      },
        { id:'shelf-6', name:'Shelf (Ring shaped)',   desc:'Built-in recess shelf with stainless tile insert. Seamless in-wall integration.',                       image:'public/images/shelf-ring.png'              },
        { id:'shelf-7', name:'5 in 1 Shelf',          desc:'Steel shelf with polished chrome standoff brackets. Clean modern aesthetic.',                           image:'public/images/shelf-5-1.png'               },
        { id:'shelf-8', name:'Double Shelf',          desc:'A double shelf with extra space. No drilling required, instant storage.',                                image:'public/images/shelf-double-shelf.png'      },
      ]
    },
   
    {
      id: 'handicap', name: 'Handicap & Safety', icon: '◎',
      description: 'Safety and dignity without compromise. Engineered to the highest load standards while maintaining the refined BUECON aesthetic.',
      hasSubCategories: false,
      products: [
        {
          id: 'grab-1',
          name: 'Straight Grab Bar',
          desc: 'Classic straight grab bar in chrome-plated stainless steel. 250kg rated, ideal for shower and toilet areas. Concealed wall flanges for a clean finish.',
          image: 'public/images/grab-bar.png'
        },
        {
          id: 'grab-2',
          name: 'Heavy Duty Grab Bar',
          desc: 'Reinforced grab bar with extra-thick stainless wall. Built for high-traffic bathrooms and assisted living facilities. Maximum load bearing with premium chrome finish.',
          image: 'public/images/grab-bar-2.png'
        },
        {
          id: 'grab-3',
          name: 'Vertical Grab Bar',
          desc: 'Vertically oriented grab bar for entry and exit assistance. Ideal beside doorways, showers, and bathtubs. Anti-slip textured grip surface for wet environments.',
          image: 'public/images/vertical-grab-bar.png'
        },
        {
          id: 'grab-4',
          name: 'L-Shape Grab Bar',
          desc: 'L-shaped combination grab bar for corner installation. Provides dual-direction support for toilet and shower areas. Chrome-plated stainless with concealed screws.',
          image: 'public/images/L-shaper-grab-bar.png'
        },
        {
          id: 'grab-5',
          name: 'Flip-Up Grab Bar',
          desc: 'Hinged fold-down grab bar that folds flat against the wall when not in use. Perfect for compact bathrooms. Powder-coated finish with stainless steel hinge mechanism.',
          image: 'public/images/folding-grab-bar.png'
        },
        {
          id: 'grab-6',
          name: 'Urinal Grab Bar',
          desc: 'Specially designed grab bar for urinal assistance. Ergonomic angled profile for natural hand placement. Hygienic chrome finish, easy to clean.',
          image: 'public/images/urinal-grab-bar.png'
        },
        {
          id: 'grab-7',
          name: 'U-Shape Grab Bar',
          desc: 'U-shaped grab bar providing bilateral support for users requiring assistance on both sides. Heavy-gauge stainless steel, 300kg rated. Suitable for disabled bathrooms.',
          image: 'public/images/disable-u-grab-bar.png'
        },
        {
          id: 'grab-8',
          name: 'Folding Shower Seat',
          desc: 'Wall-mounted fold-down shower seat with stainless steel frame and durable plastic seat. Folds flat when not in use. Rated for 150kg, ideal for elderly and mobility-impaired users.',
          image: 'public/images/shower-seat.png'
        },
        {
          id: 'grab-9',
          name: 'Platform Wastring',
          desc: 'Stainless steel platform wastring designed for accessibility and hygiene in commercial and residential bathrooms. Robust construction with anti-corrosion coating.',
          image: 'public/images/platform-wastring.png'
        },
        {
          id: 'grab-10',
          name: 'Wall Mounted Dustbin',
          desc: 'Hygienic wall-mounted waste bin for accessible bathrooms. Stainless steel construction with soft-close lid. Easy to empty and clean, keeps floors clear for wheelchair access.',
          image: 'public/images/wall-mounted-dustbin.png'
        },
        {
          id: 'grab-11',
          name: 'Double Paper Holder with Stand',
          desc: 'Freestanding double toilet paper holder with chrome-plated stand. Holds two rolls for convenience in high-use accessible bathrooms. Weighted base for stability.',
          image: 'public/images/double-paper-holder-with-stand.png'
        },
        {
          id: 'grab-12',
          name: 'Paper Dispenser',
          desc: 'Wall-mounted paper dispenser in brushed stainless steel. High-capacity roll housing with one-hand operation — ideal for accessible and commercial bathroom installations.',
          image: 'public/images/paper-dispenser.png'
        },
      ]
    }
    {
  id: 'drainage',
  name: 'Drainage Systems',
  icon: '💧',
  description: 'Premium stainless steel floor drains with superior water flow. Engineered for modern bathrooms with anti-odor technology and elegant finishes.',
  hasSubCategories: false,
  products: [
    {
      id: 'drain-1',
      name: 'Square Rose Gold Grating Drain',
      desc: 'Rose gold PVD finish square floor drain with decorative grating pattern. KAVTOR SS-304 stainless steel construction.',
      image: 'public/images/KBA_70601_RG.png'
    },
    {
      id: 'drain-2',
      name: 'Square Matt Finish Tile Insert',
      desc: 'Minimalist matt finish tile insert drain with invisible edge design. Perfect for seamless bathroom floors.',
      image: 'public/images/70701_matt.png'
    },
    {
      id: 'drain-3',
      name: 'Square Rose Gold Linear Drain',
      desc: 'Premium rose gold linear grating drain with parallel slot design. KAVTOR SS-304 grade for long-lasting durability.',
      image: 'public/images/KBA_70301_RG.png'
    },
    {
      id: 'drain-4',
      name: 'Square Gold Center Outlet Drain',
      desc: 'Luxurious gold PVD finish with center circular outlet and linear slots. High-flow drainage for heavy water usage.',
      image: 'public/images/KBA_70501_G.png'
    },
    {
      id: 'drain-5',
      name: 'Square Rose Gold Center Drain',
      desc: 'Rose gold square drain with central circular outlet and geometric slot pattern. Anti-clog deep trap design.',
      image: 'public/images/KBA_70501_RG.png'
    },
    {
      id: 'drain-6',
      name: 'Square Black Tile Insert Drain',
      desc: 'Matte black tile insert drain with hidden frame system. Accepts tiles for complete floor integration.',
      image: 'public/images/70701_black.png'
    },
    {
      id: 'drain-7',
      name: 'Linear Matt Shower Channel',
      desc: 'Long linear shower channel drain with matt stainless finish and grid pattern grate. Wall-to-wall installation ready.',
      image: 'public/images/754_matt.png'
    },
    {
      id: 'drain-8',
      name: 'Linear Black Shower Channel',
      desc: 'Sleek matte black linear drain channel with perforated grating. Modern aesthetic with superior water evacuation.',
      image: 'public/images/754_black.png'
    },
    {
      id: 'drain-9',
      name: 'Linear Matt Tile Insert Channel',
      desc: 'Stainless steel linear channel with tile insert capability. Invisible drain solution for contemporary bathrooms.',
      image: 'public/images/751_mat.png'
    },
    {
      id: 'drain-10',
      name: 'Linear Black Tile Insert Channel',
      desc: 'Matte black linear tile insert channel drain. Customizable surface with hidden drainage technology.',
      image: 'public/images/751_black.png'
    }
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
          <div class="product-card-img${!p.image ? ' no-img' : ''}">
            ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" decoding="async" onerror="this.parentElement.classList.add('no-img');this.style.display='none'"/>` : ''}
            <div class="product-img-placeholder"><span>◈</span><small>Image coming soon</small></div>
          </div>
          <div class="product-card-info">
            <h4 class="product-card-name">${p.name}</h4>
            <p class="product-card-desc">${p.desc}</p>
          </div>
        </div>`).join('')}
    </div>`;
}

function toggleCategory(id) {
  const body   = document.getElementById('body-' + id);
  const item   = document.getElementById('cat-' + id);
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.category-item.open').forEach(el => {
    el.classList.remove('open');
    document.getElementById('body-' + el.id.replace('cat-', '')).style.maxHeight = '0';
  });
  if (!isOpen) {
    item.classList.add('open');
    const inner = body.querySelector('.category-body-inner');
    body.style.maxHeight = (inner.scrollHeight + 80) + 'px';
    setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 320);
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
