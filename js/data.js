/* ═══════════════════════════════════════════
   BUECON — Data Layer
   Loads products + content from Supabase.
   Falls back to hardcoded defaults if DB
   is unreachable (offline / first load).
   ═══════════════════════════════════════════ */

/* ── Hardcoded fallback data ── */
const BUECON_DEFAULTS = {
  brand: {
    name: 'BUECON', founded: 2016, city: 'Rajkot', state: 'Gujarat', country: 'India',
    tagline: 'Designed to Speak. Built to Last.',
    about: `Founded in 2016 in Rajkot, Gujarat, BUECON was born from a singular
    conviction — that the hardware you live with every day should be as
    beautiful as the space it inhabits.`,
    quote: `Hardware isn't just functional. It is the first thing you touch
    in the morning and the last at night. It should speak to you.`,
    stats: [
      { value: '8+', label: 'Years of Craft' },
      { value: '4',  label: 'Collections' },
      { value: '500+', label: 'Design Installs' },
      { value: '100%', label: 'Rajkot Made' },
    ],
  },

  products: [
    {
      id: 'salt', series: 'Salt Series', name: 'Salt', icon: '◈',
      style: ['modern', 'minimal'],
      tagline: 'Pure Form, Pure Function',
      description: `The Salt Series distills hardware down to its purest geometric form.
      Inspired by crystalline structures, every piece reflects light with quiet authority.`,
      features: ['Marine-grade stainless body','Matte white & brushed chrome finishes','Concealed fixing system','Anti-corrosion coating','Lifetime structural warranty'],
      insight: 'Perfect for modern, minimal interiors',
      badge: '✨ Recommended for Modern Spaces',
      image_url: '', model_url: '',
    },
    {
      id: 'super', series: 'Super Series', name: 'Super', icon: '◇',
      style: ['modern', 'luxury'],
      tagline: 'Power Meets Precision',
      description: `The Super Series is for those who refuse to compromise. Bold exterior
      proportions deliver performance that matches their striking presence.`,
      features: ['Heavy-duty zinc alloy core','Brushed nickel & anthracite finishes','Ceramic disc cartridge','Flow-optimised spout geometry','Temperature memory valve'],
      insight: 'Ideal for statement bathrooms',
      badge: '🔥 Bestselling Collection',
      image_url: '', model_url: '',
    },
    {
      id: 'spirit', series: 'Spirit Series', name: 'Spirit', icon: '✦',
      style: ['luxury', 'minimal'],
      tagline: 'Where Art Meets Architecture',
      description: `Spirit is our most expressive collection — where hardware transcends
      function and becomes sculpture. Gold-toned finishes and organic curves define spaces of extraordinary taste.`,
      features: ['Solid brass construction','PVD Matte Gold & Rose Gold finish','Handcrafted lever handles','Soft-close hinge mechanism','Bespoke engraving available'],
      insight: 'Curated for premium, luxury interiors',
      badge: '✨ Our Most Luxurious',
      image_url: '', model_url: '',
    },
    {
      id: '400', series: '400 Series', name: '400', icon: '▣',
      style: ['modern', 'minimal', 'luxury'],
      tagline: 'The Foundation of Excellence',
      description: `The 400 Series brings thoughtful design to every budget without
      compromise — built on the same core principles as our premium lines.`,
      features: ['Chrome-plated brass fittings','Universal installation system','WRAS approved components','Available in 3 finishes','5-year comprehensive warranty'],
      insight: 'Versatile — suits all interior styles',
      badge: '⭐ Best Value',
      image_url: '', model_url: '',
    },
  ],

  why: [
    { icon: '⬡', title: 'Premium Quality',  text: 'Every component is held to the highest material standards — chosen not just for durability, but for how they feel in your hand, every single day.' },
    { icon: '◯', title: 'Modern Design',     text: 'Our design philosophy sits at the intersection of international trends and timeless elegance — never chasing trends, always ahead of them.' },
    { icon: '◈', title: 'Built to Last',     text: 'BUECON hardware is engineered for decades of use. We test beyond industry standards because your home deserves hardware that endures.' },
    { icon: '✦', title: 'Trusted Brand',     text: 'Since 2016, hundreds of architects, interior designers, and homeowners across India have trusted BUECON to complete their most prized spaces.' },
  ],

  mission: {
    mission: {
      label: 'Our Mission', title: 'Elevate the Everyday',
      body: `At BUECON, our mission is to transform the most intimate spaces in your home
      into places of quiet luxury. We believe that exceptional hardware is a necessity for a life well-designed.`,
      values: ['Uncompromising craftsmanship', 'Thoughtful minimalism', 'Sustainable manufacturing'],
    },
    vision: {
      label: 'Our Vision', title: "India's Most Trusted Luxury Hardware Brand",
      body: `We envision a future where BUECON hardware graces the finest homes, hotels,
      and spaces across India and beyond — where our name is synonymous with quality, beauty, and enduring value.`,
      values: ['Innovation in material science', 'Global design standards', 'Community-rooted manufacturing'],
    },
  },

  contact: {
    address: 'Rajkot, Gujarat, India — 360001',
    phone:   '9825591898',
    email:   'kavyaparmar7866@gmail.com',
    hours:   'Mon – Sat, 9:00 AM – 6:00 PM IST',
    map:     'https://maps.google.com/?q=Rajkot,Gujarat,India',
  },
};

/* ── Live BUECON object (gets populated below) ── */
const BUECON = { ...BUECON_DEFAULTS };

/* ── Load from Supabase ── */
async function loadBueconData() {
  try {
    /* Load products */
    const products = await SB.get('products', '?order=created_at.asc');
    if (products && products.length > 0) {
      /* Normalize: style + features may come as postgres arrays or JSON strings */
      BUECON.products = products.map(p => ({
        ...p,
        style:    Array.isArray(p.style)    ? p.style    : (p.style    || '').split(',').map(s => s.trim()).filter(Boolean),
        features: Array.isArray(p.features) ? p.features : (p.features || '').split('\n').map(s => s.trim()).filter(Boolean),
      }));
    }

    /* Load content */
    const content = await SB.get('content');
    if (content && content.length > 0) {
      const map = {};
      content.forEach(row => { map[row.key] = row.value; });

      /* Patch brand + contact from content table */
      if (map.hero_headline)   BUECON.brand.tagline       = map.hero_headline;
      if (map.hero_subline)    BUECON.brand.subline        = map.hero_subline;
      if (map.about_text)      BUECON.brand.about          = map.about_text;
      if (map.contact_phone)   BUECON.contact.phone        = map.contact_phone;
      if (map.contact_email)   BUECON.contact.email        = map.contact_email;

      /* Store full map for other uses */
      BUECON.contentMap = map;
    }

    console.log(`BUECON: loaded ${BUECON.products.length} products from Supabase ✓`);
  } catch (err) {
    console.warn('BUECON: Supabase load failed, using defaults.', err.message);
  }
}
