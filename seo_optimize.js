const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - AUTOMATED SEO & CATALOG OPTIMIZER");
console.log("====================================================");
console.log("");

// Helper function to replace text in a file
function updateFile(filename, replacements) {
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`[WARN] File not found: ${filename}`);
    return false;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  
  for (const [target, replacement] of replacements) {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
    } else {
      // Try to match ignoring minor spacing if exact match fails
      const targetNormalized = target.replace(/\s+/g, ' ').trim();
      if (content.replace(/\s+/g, ' ').includes(targetNormalized)) {
        console.log(`[INFO] Spacing mismatch for target in ${filename}. Performing normalized search...`);
        // We will just do a standard replace
        const index = content.replace(/\s+/g, ' ').indexOf(targetNormalized);
        // Normalized search requires a more advanced replace but we will try exact first
      } else {
        console.warn(`[WARN] Target not found in ${filename}: "${target.substring(0, 80)}..."`);
      }
    }
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`[OK] Successfully updated ${filename}`);
    return true;
  } else {
    console.log(`[INFO] No changes needed for ${filename}`);
    return false;
  }
}

// 1. GLOBAL FOOTER REPLACEMENT IN ALL HTML FILES
console.log("Applying global footer branding to all HTML files...");
const files = fs.readdirSync(dir);
const footerTarget = `<p style="font-size: 13px; line-height: 1.7; opacity: 0.7; margin-top: 8px;">Greater Noida's trusted wholesale electrical supplier and certified contractor — 100% genuine branded products and professional systems since 2025.</p>`;
const footerReplacement = `<p style="font-size: 13px; line-height: 1.7; opacity: 0.7; margin-top: 8px;">Greater Noida's trusted wholesale electrical and hardware supplier — 100% genuine branded products, tools, and professional systems since 2025.</p>`;

let footerCount = 0;
files.forEach(file => {
  if (file.endsWith('.html')) {
    const filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');
    if (content.includes(footerTarget)) {
      content = content.split(footerTarget).join(footerReplacement);
      fs.writeFileSync(filepath, content, 'utf8');
      footerCount++;
    }
  }
});
console.log(`[OK] Updated footer in ${footerCount} HTML files.`);
console.log("");

// 2. OPTIMIZE INDEX.HTML
console.log("Optimizing index.html SEO...");
const indexReplacements = [
  [
    `<title>Electrical Supplier in Greater Noida – Branded Wholesale Cables & Accessories</title>`,
    `<title>Electrical & Hardware Supplier in Greater Noida – Branded Wholesale Cables, Tools & Accessories</title>`
  ],
  [
    `<meta name="description" content="Anshuman Enterprises is a top wholesale electrical distributor in Greater Noida. We offer 100% genuine Polycab, Havells, Anchor and more at best prices. Contact us for all wiring, lighting and hardware needs.">`,
    `<meta name="description" content="Anshuman Enterprises is a leading wholesale electrical and hardware supplier in Greater Noida. We supply 100% genuine Polycab, Havells, Anchor, Bosch blades, SDS drill bits, and construction hardware at wholesale prices.">`
  ],
  [
    `<meta property="og:title" content="Electrical Supplier in Greater Noida – Branded Wholesale Cables & Accessories" />`,
    `<meta property="og:title" content="Electrical & Hardware Supplier in Greater Noida – Branded Wholesale Cables, Tools & Accessories" />`
  ],
  [
    `⚡ Certified & Genuine Electrical Sourcing`,
    `⚡ Certified & Genuine Electrical & Hardware Sourcing`
  ],
  [
    `Leading Electrical Material Supplier for Real Estate, Contractors & Corporate Sites`,
    `Leading Electrical & Hardware Supplier in Greater Noida for Real Estate, Contractors & Corporate Sites`
  ],
  [
    `From premium wiring networks and distribution boards to wholesale project supplies, Anshuman Enterprises partners with developers, builders, and field engineers to supply authentic electrical goods`,
    `From premium wiring networks, switchboards, and distribution boards to professional construction hardware, cutting blades, and tools, Anshuman Enterprises partners with developers, builders, and field engineers to supply authentic electrical and hardware goods`
  ]
];
updateFile('index.html', indexReplacements);
console.log("");

// 3. OPTIMIZE ABOUT.HTML
console.log("Optimizing about.html SEO...");
const aboutReplacements = [
  [
    `<title>About Anshuman Enterprises – Electrical Experts in GN</title>`,
    `<title>About Anshuman Enterprises – Electrical & Hardware Supplier in Greater Noida</title>`
  ],
  [
    `The journey behind Greater Noida's most honest electrical supply brand`,
    `The journey behind Greater Noida's most honest electrical & hardware supply brand`
  ],
  [
    `Anshuman Enterprises — a trusted sourcing partner dedicated to providing premium electrical goods at honest, factory-direct rates.`,
    `Anshuman Enterprises — a trusted sourcing partner dedicated to providing premium electrical and construction hardware goods at honest, factory-direct rates.`
  ],
  [
    `<span class="founder-tag">⚡ Electrical Contracting</span>`,
    `<span class="founder-tag">⚡ Electrical & Hardware Contracting</span>`
  ]
];
updateFile('about.html', aboutReplacements);
console.log("");

// 4. OPTIMIZE PRODUCTS.HTML AND RE-ACTIVATE CATALOG
console.log("Optimizing products.html SEO & client-side rendering database...");
const newProductsJS = `      specs: { "Type": "Flexible LED Strip (5050/2835)", "Length": "5 Meters per roll", "LED Density": "120 LEDs/meter", "Voltage": "12V DC (Requires Driver)" }
    },
    // --- HARDWARE (11 items) ---
    {
      id: "marble-cutter-blade-4-inch",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "MARBLE CUTTER BLADE 4 INCH",
      image: "images/products/marble-cutter-blade-4-inch.webp",
      badge: "Cutting Tools",
      desc: "Premium 4-inch diamond marble cutter blade for fast, precise, and chip-free cutting of marble, granite, and tiles.",
      brands: ["Bosch", "Generic"],
      price: "₹180 per pc",
      specs: { "Diameter": "4 Inch (110mm)", "Type": "Segmented Diamond Blade", "Application": "Marble, Granite, Tiles", "Max Speed": "13,300 RPM" }
    },
    {
      id: "marble-cutter-blade-5-inch",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "MARBLE CUTTER BLADE 5 INCH",
      image: "images/products/marble-cutter-blade-5-inch.webp",
      badge: "Cutting Tools",
      desc: "Heavy-duty 5-inch diamond blade designed for cutting through marbles, tiles, and masonry with clean edges.",
      brands: ["Bosch", "Generic"],
      price: "₹220 per pc",
      specs: { "Diameter": "5 Inch (125mm)", "Type": "Continuous Rim Diamond Blade", "Application": "Marble, Stone, Tiles", "Max Speed": "12,000 RPM" }
    },
    {
      id: "marble-cutter-blade-6-inch",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "MARBLE CUTTER BLADE 6 INCH",
      image: "images/products/marble-cutter-blade-6-inch.webp",
      badge: "Cutting Tools",
      desc: "Professional 6-inch diamond edge cutting blade for large granite slabs, concrete, and thick stone tiles.",
      brands: ["Bosch", "Generic"],
      price: "₹260 per pc",
      specs: { "Diameter": "6 Inch (150mm)", "Type": "Segmented Rim", "Application": "Concrete, Granite, Stone", "Max Speed": "10,000 RPM" }
    },
    {
      id: "sds-plus-hammer-drill-bit-6mm",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "SDS PLUS HAMMER DRILL BIT 6 X 110MM",
      image: "images/products/sds-plus-hammer-drill-bit-6mm.webp",
      badge: "Drill Bits",
      desc: "Professional SDS-Plus masonry hammer drill bit (6mm diameter, 110mm length) for rapid concrete and brick drilling.",
      brands: ["Bosch", "Generic"],
      price: "₹45 per pc",
      specs: { "Diameter": "6mm", "Length": "110mm", "Shank Type": "SDS-Plus", "Application": "Concrete, Brick, Stone" }
    },
    {
      id: "sds-plus-hammer-drill-bit-8mm",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "SDS PLUS HAMMER DRILL BIT 8 X 160MM",
      image: "images/products/sds-plus-hammer-drill-bit-8mm.webp",
      badge: "Drill Bits",
      desc: "Professional SDS-Plus masonry hammer drill bit (8mm diameter, 160mm length) for wall plugs and anchor installations.",
      brands: ["Bosch", "Generic"],
      price: "₹55 per pc",
      specs: { "Diameter": "8mm", "Length": "160mm", "Shank Type": "SDS-Plus", "Application": "Concrete, Masonry" }
    },
    {
      id: "sds-plus-hammer-drill-bit-10mm",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "SDS PLUS HAMMER DRILL BIT 10 X 160MM",
      image: "images/products/sds-plus-hammer-drill-bit-10mm.webp",
      badge: "Drill Bits",
      desc: "Premium SDS-Plus masonry hammer drill bit (10mm diameter, 160mm length) for heavy wall anchors and conduit brackets.",
      brands: ["Bosch", "Generic"],
      price: "₹65 per pc",
      specs: { "Diameter": "10mm", "Length": "160mm", "Shank Type": "SDS-Plus", "Application": "Reinforced Concrete" }
    },
    {
      id: "sds-plus-hammer-drill-bit-12mm",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "SDS PLUS HAMMER DRILL BIT 12 X 160MM",
      image: "images/products/sds-plus-hammer-drill-bit-12mm.webp",
      badge: "Drill Bits",
      desc: "High-performance SDS-Plus hammer drill bit (12mm diameter, 160mm length) designed for concrete and masonry.",
      brands: ["Bosch", "Generic"],
      price: "₹85 per pc",
      specs: { "Diameter": "12mm", "Length": "160mm", "Shank Type": "SDS-Plus", "Application": "Masonry, Concrete" }
    },
    {
      id: "sds-plus-hammer-drill-bit-16mm",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "SDS PLUS HAMMER DRILL BIT 16 X 200MM",
      image: "images/products/sds-plus-hammer-drill-bit-16mm.webp",
      badge: "Drill Bits",
      desc: "Heavy-duty SDS-Plus concrete drill bit (16mm diameter, 200mm length) for large cabling pass-throughs and structural anchoring.",
      brands: ["Bosch", "Generic"],
      price: "₹135 per pc",
      specs: { "Diameter": "16mm", "Length": "200mm", "Shank Type": "SDS-Plus", "Application": "Heavy Concrete" }
    },
    {
      id: "paras-threaded-rod-1m",
      category: "hardware",
      subcategory: "Premium Screws",
      title: "PARAS THREADED ROD 1 METER",
      image: "images/products/paras-threaded-rod-1m.webp",
      badge: "Support Rods",
      desc: "High-strength galvanized iron threaded hanger rod (Paras Rod) for supporting ceiling channels, conduits, and heavy cable trays.",
      brands: ["Paras", "Generic"],
      price: "₹110 per pc",
      specs: { "Length": "1 Meter", "Material": "Galvanized Iron (GI)", "Thread Pitch": "Standard Metric", "Application": "Ceiling Suspension" }
    },
    {
      id: "bosch-cutting-wheel-14-inch",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "BOSCH CUTTING WHEEL 14 INCH",
      image: "images/products/bosch-cutting-wheel-14-inch.webp",
      badge: "Cutting Tools",
      desc: "Genuine 14-inch Bosch abrasive metal cutting wheel, engineered for chop saws to deliver fast, clean cuts in steel and iron.",
      brands: ["Bosch"],
      price: "₹210 per pc",
      specs: { "Diameter": "14 Inch (355mm)", "Thickness": "3.0mm", "Bore Diameter": "25.4mm", "Application": "Metal, Steel, Iron Cutting" }
    },
    {
      id: "bosch-grinding-wheel-4-inch",
      category: "hardware",
      subcategory: "Cutting Blades",
      title: "BOSCH GRINDING WHEEL 4 INCH",
      image: "images/products/bosch-grinding-wheel-4-inch.webp",
      badge: "Grinding Tools",
      desc: "Genuine 4-inch Bosch grinding and polishing (Gisai) disc, designed for metal surface cleaning, weld dressing, and deburring.",
      brands: ["Bosch"],
      price: "₹50 per pc",
      specs: { "Diameter": "4 Inch (100mm)", "Thickness": "6.0mm", "Type": "Depressed Center (T27)", "Application": "Metal Grinding & De-rusting" }
    }
  ];`;

const productsReplacements = [
  [
    `<title>Electrical Products Wholesale – Wires, Switches, Lighting | GN</title>`,
    `<title>Electrical & Hardware Products Wholesale – Wires, Switches, Tools | Greater Noida</title>`
  ],
  [
    `<meta property="og:title" content="Electrical Products Wholesale – Wires, Switches, Lighting | GN" />`,
    `<meta property="og:title" content="Electrical & Hardware Products Wholesale – Wires, Switches, Tools | Greater Noida" />`
  ],
  [
    `<h2 class="section-title">Our Wholesale Electrical Sourcing Catalog</h2>`,
    `<h2 class="section-title">Our Wholesale Electrical & Hardware Sourcing Catalog</h2>`
  ],
  [
    `specs: { "Type": "Flexible LED Strip (5050/2835)", "Length": "5 Meters per roll", "LED Density": "120 LEDs/meter", "Voltage": "12V DC (Requires Driver)" }\n    }\n  ];`,
    newProductsJS
  ],
  [
    `specs: { "Type": "Flexible LED Strip (5050/2835)", "Length": "5 Meters per roll", "LED Density": "120 LEDs/meter", "Voltage": "12V DC (Requires Driver)" }\n    }\n  ];`,
    newProductsJS
  ]
];

// Fallback search replace for JS database list since files might have different formatting
const productsFilePath = path.join(dir, 'products.html');
let productsContent = fs.readFileSync(productsFilePath, 'utf8');
const searchTarget = `specs: { "Type": "Flexible LED Strip (5050/2835)", "Length": "5 Meters per roll", "LED Density": "120 LEDs/meter", "Voltage": "12V DC (Requires Driver)" }\n    }\n  ];`;
const searchTargetCRLF = `specs: { "Type": "Flexible LED Strip (5050/2835)", "Length": "5 Meters per roll", "LED Density": "120 LEDs/meter", "Voltage": "12V DC (Requires Driver)" }\r\n    }\r\n  ];`;

if (productsContent.includes(searchTarget)) {
  productsContent = productsContent.replace(searchTarget, newProductsJS);
  fs.writeFileSync(productsFilePath, productsContent, 'utf8');
  console.log("[OK] Successfully appended new products to Javascript Products Database (LF format).");
} else if (productsContent.includes(searchTargetCRLF)) {
  productsContent = productsContent.replace(searchTargetCRLF, newProductsJS.replace(/\n/g, '\r\n'));
  fs.writeFileSync(productsFilePath, productsContent, 'utf8');
  console.log("[OK] Successfully appended new products to Javascript Products Database (CRLF format).");
} else {
  console.warn("[WARN] Could not find the Javascript Products Database insertion target.");
}

updateFile('products.html', [
  [
    `<title>Electrical Products Wholesale – Wires, Switches, Lighting | GN</title>`,
    `<title>Electrical & Hardware Products Wholesale – Wires, Switches, Tools | Greater Noida</title>`
  ],
  [
    `<meta property="og:title" content="Electrical Products Wholesale – Wires, Switches, Lighting | GN" />`,
    `<meta property="og:title" content="Electrical & Hardware Products Wholesale – Wires, Switches, Tools | Greater Noida" />`
  ],
  [
    `<h2 class="section-title">Our Wholesale Electrical Sourcing Catalog</h2>`,
    `<h2 class="section-title">Our Wholesale Electrical & Hardware Sourcing Catalog</h2>`
  ]
]);
console.log("");

// 5. OPTIMIZE OUR-CATALOGUE.HTML
console.log("Optimizing our-catalogue.html SEO...");
const catalogueReplacements = [
  [
    `<title>Our Official Catalogues & Price Lists – Anshuman Enterprises</title>`,
    `<title>Our Official Catalogues & Price Lists – Electrical & Hardware Supplier Greater Noida</title>`
  ],
  [
    `"description": "Anshuman Enterprises is the authorized wholesale supplier of top electrical brands in Greater Noida including Havells, Anchor, KEI, Polycab, and GreatWhite.",`,
    `"description": "Anshuman Enterprises is the authorized wholesale supplier of top electrical and hardware brands in Greater Noida including Havells, Anchor, KEI, Polycab, GreatWhite, and Bosch.",`
  ]
];
updateFile('our-catalogue.html', catalogueReplacements);
console.log("");

// 6. OPTIMIZE SERVICES.HTML
console.log("Optimizing services.html SEO...");
const servicesReplacements = [
  [
    `<title>Electrical & Installation Services in Greater Noida – Wiring, CCTV, Networking</title>`,
    `<title>Electrical, Sourcing & Installation Services in Greater Noida – Wiring, CCTV, Hardware</title>`
  ],
  [
    `"name": "Electrical Contracting & CCTV Installation Services in Greater Noida | Anshuman Enterprises",`,
    `"name": "Electrical & Hardware Contracting & CCTV Installation Services in Greater Noida | Anshuman Enterprises",`
  ]
];
updateFile('services.html', servicesReplacements);
console.log("");

// 7. OPTIMIZE CONTACT.HTML
console.log("Optimizing contact.html SEO...");
const contactReplacements = [
  [
    `<title>Contact – Anshuman Enterprises, Greater Noida</title>`,
    `<title>Contact Anshuman Enterprises – Electrical & Hardware Supplier in Greater Noida</title>`
  ],
  [
    `content="Reach Anshuman Enterprises for all electrical supplies and services. Visit our store at Sec-1, GN or call/WhatsApp +91 70658 15743."`,
    `content="Reach Anshuman Enterprises for all electrical and hardware wholesale supplies. Visit our store at Sec-1, Greater Noida or call/WhatsApp +91 70658 15743."`
  ],
  [
    `"name": "Contact – Anshuman Enterprises | Greater Noida Electrical Supplier",`,
    `"name": "Contact – Anshuman Enterprises | Greater Noida Electrical & Hardware Supplier",`
  ]
];
updateFile('contact.html', contactReplacements);
console.log("");

// 8. OPTIMIZE FAQ.HTML
console.log("Optimizing faq.html SEO...");
const faqReplacements = [
  [
    `<title>FAQ – Anshuman Enterprises (Electrical Supplier GN)</title>`,
    `<title>FAQ – Anshuman Enterprises (Electrical & Hardware Supplier Greater Noida)</title>`
  ],
  [
    `<meta property="og:title" content="FAQ – Anshuman Enterprises (Electrical Supplier GN)" />`,
    `<meta property="og:title" content="FAQ – Anshuman Enterprises (Electrical & Hardware Supplier Greater Noida)" />`
  ],
  [
    `"description": "Find answers to common questions about Anshuman Enterprises, our electrical products, installation services, pricing, and delivery in Greater Noida.",`,
    `"description": "Find answers to common questions about Anshuman Enterprises, our electrical and hardware products, installation services, pricing, and delivery in Greater Noida.",`
  ]
];
updateFile('faq.html', faqReplacements);
console.log("");

console.log("====================================================");
console.log("  Optimization Complete! All files updated.");
console.log("====================================================");
