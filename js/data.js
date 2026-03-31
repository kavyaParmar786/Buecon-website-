/* ═══════════════════════════════════════════
   BUECON — Brand Data & Product Catalogue
   ═══════════════════════════════════════════ */

const BUECON = {

  brand: {
    name: 'BUECON',
    founded: 2016,
    city: 'Rajkot',
    state: 'Gujarat',
    country: 'India',
    tagline: 'Designed to Speak. Built to Last.',
    about: `Founded in 2016 in Rajkot, Gujarat, BUECON was born from a singular
    conviction — that the hardware you live with every day should be as
    beautiful as the space it inhabits. We craft bathroom hardware that
    elevates the ordinary into something worth noticing.`,
    quote: `Hardware isn't just functional. It is the first thing you touch
    in the morning and the last at night. It should speak to you.`,
    stats: [
      { value: '8+', label: 'Years of Craft' },
      { value: '4', label: 'Collections' },
      { value: '500+', label: 'Design Installs' },
      { value: '100%', label: 'Rajkot Made' },
    ],
  },

  products: [
    {
      id: 'salt',
      series: 'Salt Series',
      name: 'Salt',
      icon: '◈',
      style: ['modern', 'minimal'],
      tagline: 'Pure Form, Pure Function',
      description: `The Salt Series distills hardware down to its purest geometric
      form. Inspired by crystalline structures, every piece reflects light
      with quiet authority. Perfect for spaces that celebrate the minimal.`,
      features: [
        'Marine-grade stainless body',
        'Matte white & brushed chrome finishes',
        'Concealed fixing system',
        'Anti-corrosion coating',
        'Lifetime structural warranty',
      ],
      insight: 'Perfect for modern, minimal interiors',
      badge: '✨ Recommended for Modern Spaces',
    },
    {
      id: 'super',
      series: 'Super Series',
      name: 'Super',
      icon: '◇',
      style: ['modern', 'luxury'],
      tagline: 'Power Meets Precision',
      description: `The Super Series is for those who refuse to compromise. With
      precision-engineered internals and bold exterior proportions, it
      delivers performance that matches its striking presence.`,
      features: [
        'Heavy-duty zinc alloy core',
        'Brushed nickel & anthracite finishes',
        'Ceramic disc cartridge technology',
        'Flow-optimised spout geometry',
        'Temperature memory valve',
      ],
      insight: 'Ideal for statement bathrooms',
      badge: '🔥 Bestselling Collection',
    },
    {
      id: 'spirit',
      series: 'Spirit Series',
      name: 'Spirit',
      icon: '✦',
      style: ['luxury', 'minimal'],
      tagline: 'Where Art Meets Architecture',
      description: `Spirit is our most expressive collection — where hardware
      transcends function and becomes sculpture. Gold-toned finishes and
      organic curves define spaces of extraordinary taste.`,
      features: [
        'Solid brass construction',
        'PVD Matte Gold & Rose Gold finish',
        'Handcrafted lever handles',
        'Soft-close hinge mechanism',
        'Bespoke engraving available',
      ],
      insight: 'Curated for premium, luxury interiors',
      badge: '✨ Our Most Luxurious',
    },
    {
      id: '400',
      series: '400 Series',
      name: '400',
      icon: '▣',
      style: ['modern', 'minimal', 'luxury'],
      tagline: 'The Foundation of Excellence',
      description: `The 400 Series represents BUECON's commitment to accessible
      excellence. Built on the same core principles as our premium lines,
      it brings thoughtful design to every budget without compromise.`,
      features: [
        'Chrome-plated brass fittings',
        'Universal installation system',
        'WRAS approved components',
        'Available in 3 finishes',
        '5-year comprehensive warranty',
      ],
      insight: 'Versatile — suits all interior styles',
      badge: '⭐ Best Value',
    },
  ],

  why: [
    {
      icon: '⬡',
      title: 'Premium Quality',
      text: 'Every component is held to the highest material standards — chosen not just for durability, but for how they feel in your hand, every single day.',
    },
    {
      icon: '◯',
      title: 'Modern Design',
      text: 'Our design philosophy sits at the intersection of international trends and timeless elegance — never chasing trends, always ahead of them.',
    },
    {
      icon: '◈',
      title: 'Built to Last',
      text: 'BUECON hardware is engineered for decades of use. We test beyond industry standards because your home deserves hardware that endures.',
    },
    {
      icon: '✦',
      title: 'Trusted Brand',
      text: 'Since 2016, hundreds of architects, interior designers, and homeowners across India have trusted BUECON to complete their most prized spaces.',
    },
  ],

  mission: {
    mission: {
      label: 'Our Mission',
      title: 'Elevate the Everyday',
      body: `At BUECON, our mission is to transform the most intimate spaces in your
      home into places of quiet luxury. We believe that exceptional hardware
      is not a luxury — it is a necessity for a life well-designed.`,
      values: ['Uncompromising craftsmanship', 'Thoughtful minimalism', 'Sustainable manufacturing'],
    },
    vision: {
      label: 'Our Vision',
      title: 'India\'s Most Trusted Luxury Hardware Brand',
      body: `We envision a future where BUECON hardware graces the finest homes,
      hotels, and spaces across India and beyond — where our name is
      synonymous with quality, beauty, and enduring value.`,
      values: ['Innovation in material science', 'Global design standards', 'Community-rooted manufacturing'],
    },
  },

  contact: {
    address: 'Rajkot, Gujarat, India — 360001',
    phone: '9825591898',
    email: 'kavyaparmar7866@gmail.com',
    hours: 'Mon – Sat, 9:00 AM – 6:00 PM IST',
    map: 'https://maps.google.com/?q=Rajkot,Gujarat,India',
  },

};
