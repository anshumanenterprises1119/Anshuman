const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'products.html');

console.log("Loading products list data with image paths...");

const products = [
  // Lighting
  { category: 'lighting', name: 'ORIENT BATTEN LIGHT 2 FEET 20W', icon: '💡', image: 'orient-batten-light-2ft-20w.webp', desc: 'Premium 2-feet Orient LED Batten Light (20W) offering bright, glare-free, and energy-saving lighting for homes and offices.' },
  { category: 'lighting', name: 'ORIENT BATTEN LIGHT 4 FEET 20W', icon: '💡', image: 'orient-batten-light-4ft-20w.webp', desc: 'Premium 4-feet Orient LED Batten Light (20W) providing optimal lumens and high energy savings for commercial layouts.' },
  { category: 'lighting', name: 'ORIENT BATTEN LIGHT 2 FEET 10W', icon: '💡', image: 'orient-batten-light-2ft-10w.webp', desc: 'Compact 2-feet Orient LED Batten Light (10W), perfect for narrow spaces, corridors, and minor installations.' },

  // Switches
  { category: 'switches', name: '2 MODULAR BOX', icon: '💠', image: 'galvanized-iron-2-modular-switch-box.webp', desc: 'Premium quality 2-module switchboard mounting metal box made of galvanized steel for rust resistance.' },
  { category: 'switches', name: '3 MODULAR BOX', icon: '💠', image: 'galvanized-iron-3-modular-switch-box.jfif', desc: 'Robust 3-module galvanized iron modular mounting box with standard threads for modular switch plates.' },
  { category: 'switches', name: '4 MODULAR BOX', icon: '💠', image: 'galvanized-iron-4-modular-switch-box.webp', desc: 'Galvanized 4-module switch box, durable and corrosion-resistant for concealed wiring setups.' },
  { category: 'switches', name: '6 MODULAR BOX', icon: '💠', image: 'galvanized-iron-6-modular-switch-box.webp', desc: 'Galvanized steel 6-module mounting box, engineered for standard switches and power outlets.' },
  { category: 'switches', name: '8 MODULAR BOX SQUARE', icon: '💠', image: '8-modular-box-square.webp', desc: 'Square 8-module metal switchboard box, optimized space utilization for complex modular grids.' },
  { category: 'switches', name: '8 MODULAR BOX', icon: '💠', image: 'galvanized-iron-8-modular-rectangular-switch-box.jpg', desc: 'Standard rectangular 8-module galvanized switch box for heavy home appliances and multiple points.' },
  { category: 'switches', name: '12 MODULAR BOX', icon: '💠', image: 'galvanized-iron-12-modular-switch-box.webp', desc: 'Spacious 12-module galvanized modular switchboard box for complete room control and panel distribution.' },

  // Conduit & Pipes
  { category: 'conduit', name: 'INDEANA PIPE HEAVY 25MM', icon: '🧰', image: 'indeana-pipe-heavy-25mm.webp', desc: 'Heavy-duty 25mm PVC conduit pipe by Indeana. High impact-resistant and fire-retardant wiring protection.' },
  { category: 'conduit', name: 'INDEANA PIPE 20MM MEDIUM', icon: '🧰', image: 'indeana-medium-duty-pvc-conduit-pipe-20mm.jfif', desc: 'Medium-duty 20mm PVC conduit pipe by Indeana, flexible and robust for concealed ceiling and wall installations.' },
  { category: 'conduit', name: 'INDEANA PIPE 25MM MEDIUM', icon: '🧰', image: 'indeana-pipe-25mm-medium.webp', desc: 'Medium-duty 25mm PVC conduit pipe by Indeana, ideal for standard cable distribution and layouts.' },
  { category: 'conduit', name: 'INDEANA BAND 25MM', icon: '🧰', image: 'indeana-pvc-conduit-bend-band-25mm.jfif', desc: 'Robust 25mm PVC bend/band by Indeana, designed for smooth pulling of wires without damage at corners.' },
  { category: 'conduit', name: 'INDEANA BAND 20MM MEDIUM', icon: '🧰', image: 'indeana-medium-pvc-conduit-bend-band-20mm.jpg', desc: 'Medium-duty 20mm PVC bend for connecting wall conduits seamlessly at right angles.' },
  { category: 'conduit', name: 'INDEANA BAND 25MM HEAVY', icon: '🧰', image: 'indeana-band-25mm-heavy.webp', desc: 'Heavy-duty 25mm PVC conduit bend, offering high physical impact tolerance for floor and structural bends.' },
  { category: 'conduit', name: 'FAN BOX HEAVY', icon: '🧰', image: 'fan-box-heavy.webp', desc: 'Heavy-duty ceiling fan mounting junction box, designed to bear high load and structural vibrations.' },
  { category: 'conduit', name: 'CONCIELD BOX HEAVY', icon: '🧰', image: 'concealed-ceiling-junction-box-heavy-duty.jpg', desc: 'Heavy-duty concealed ceiling junction box for neat wiring connections and profile lights.' },
  { category: 'conduit', name: 'FAN BOX MEDIUM', icon: '🧰', image: 'fan-box-medium.webp', desc: 'Standard medium-duty fan junction box for residential housing projects.' },
  { category: 'conduit', name: 'CONCIELD MEDIUM', icon: '🧰', image: 'concealed-ceiling-junction-box-medium-duty-180g.jpg', desc: 'Concealed medium-duty wall junction box, flame-retardant and durable.' },
  { category: 'conduit', name: 'FLEXIBLE PIPE 20MM', icon: '🧰', image: 'pvc-flexible-corrugated-conduit-pipe-20mm.jpg', desc: 'Corrugated 20mm PVC flexible pipe, perfect for linking main conduits to switch boards around pillars.' },
  { category: 'conduit', name: 'FAN ROD 12 INCH', icon: '🧰', image: 'ceiling-fan-downrod-iron-12-inch.webp', desc: 'Heavy iron ceiling fan downrod (12 inches) with rust-resistant paint and secure key bolt slots.' },
  { category: 'conduit', name: 'TEE COVER', icon: '🧰', image: 'pvc-conduit-tee-connection-cover.jfif', desc: 'Standard PVC Tee cover for securing T-junction connections of surface wiring casing/pipes.' },
  { category: 'conduit', name: 'FAN COVER', icon: '🧰', image: 'fan-cover.webp', desc: 'High-quality replacement canopy/cover set for ceiling fans, white glossy finish.' },

  // Hardware
  { category: 'hardware', name: 'SCREW .75 INCH', icon: '🔧', image: 'screw-0-75-inch.webp', desc: 'Standard 0.75-inch premium threaded metal screws for switchboards and general hardware fittings.' },
  { category: 'hardware', name: 'SCREW 1 INCH', icon: '🔧', image: 'premium-threaded-mounting-screws-1-inch.png', desc: 'Threaded 1-inch metal screws, durable and rust-resistant for secure electrical hardware mounting.' },
  { category: 'hardware', name: 'SCREW 1.5 INCH', icon: '🔧', image: 'screw-1-5-inch.webp', desc: 'Heavy-duty 1.5-inch mounting screws for conduits, junction boxes, and frame clamping.' },
  { category: 'hardware', name: 'SCREW 2 INCH', icon: '🔧', image: 'premium-threaded-mounting-screws-2-inch.webp', desc: 'High-tensile 2-inch screws, perfect for deep wall plug anchorage and heavy fixtures.' },
  { category: 'hardware', name: 'SCREW 2.5 INCH', icon: '🔧', image: 'screw-2-5-inch.webp', desc: 'Premium 2.5-inch structural screws for ceiling box fittings and secure heavy clamping.' },
  { category: 'hardware', name: 'SCREW 3 INCH', icon: '🔧', image: 'screw-3-inch.webp', desc: 'Extra-long 3-inch steel mounting screws for deep concrete plug anchoring and brackets.' },
  { category: 'hardware', name: 'PVC SADDLE', icon: '🔧', image: 'pvc-saddle.webp', desc: 'High-grade PVC conduit pipe clamp/saddle for rigid surface routing and ceiling clipping.' },
  { category: 'hardware', name: 'STEELGRIP INSULATION TAPE', icon: '🔧', image: 'steelgrip-insulation-tape.webp', desc: 'Premium Steelgrip self-adhesive PVC insulation tape, high dielectric strength and heat resistant.' },
  { category: 'hardware', name: 'THERMOCOL', icon: '🔧', image: 'thermocol.webp', desc: 'Premium grade thermocol sheets/blocks for shockproofing and packaging utility.' },
  { category: 'hardware', name: 'MASKING TAPE', icon: '🔧', image: 'high-adhesion-masking-tape.webp', desc: 'High-adhesion masking tape for site painting protection and structural marking.' },
  { category: 'hardware', name: 'SELF DRILLING SCREW 1 INCH', icon: '🔧', image: 'self-drilling-screw-1-inch.webp', desc: 'High-efficiency 1-inch self-drilling screws for metal casing and GI pipe frames.' },
  { category: 'hardware', name: 'SELF DRILLING SCREW 1.5 INCH', icon: '🔧', image: 'self-drilling-screw-1-5-inch.webp', desc: 'Self-drilling 1.5-inch metal screws, drills and fastens in a single action.' },
  { category: 'hardware', name: 'SELF DRILLING SCREW 2 INCH', icon: '🔧', image: 'self-drilling-metal-screws-2-inch.jpg', desc: 'Heavy-duty 2-inch self-drilling metal screws for thick sheets and frames.' },
  { category: 'hardware', name: 'HEATEX 5 KG', icon: '🔧', image: 'heatex-adhesive-seal-bond-compound-5kg.jfif', desc: 'High-grade Heatex adhesive / seal bond compound (5 Kg bucket) for construction joints.' },
  { category: 'hardware', name: 'KEEL 1*14 SPN', icon: '🔧', image: 'concrete-nails-keel-1-inch-14-spn.jfif', desc: 'Standard 1x14 concrete nails / keels for fast ceiling and wall anchoring.' },
  { category: 'hardware', name: 'KEEL 1.5*14 SPN', icon: '🔧', image: 'concrete-nails-keel-1-5-inch-14-spn.jfif', desc: 'High-strength 1.5x14 concrete nails for conduit clips and wiring casing anchoring.' },
  { category: 'hardware', name: 'WALL FIX BOND 50G', icon: '🔧', image: 'wall-fix-rapid-adhesive-bond-50g.webp', desc: 'Rapid curing Wall Fix adhesive bond (50g tube) for quick panel and channel fixing.' },
  { category: 'hardware', name: 'WALL FIX BOND 18G', icon: '🔧', image: 'wall-fix-rapid-adhesive-bond-18g.jfif', desc: 'Compact Wall Fix adhesive bond (18g tube) for minor repairs and quick hardware locking.' },
  { category: 'hardware', name: 'ARALDITE 1.8KG', icon: '🔧', image: 'araldite-standard-epoxy-adhesive-1-8kg.webp', desc: 'Industrial grade Araldite epoxy adhesive pack (1.8 Kg), ultra-strong bonding strength.' },
  { category: 'hardware', name: 'ZYPSEM SCREW 3/4 WHITE', icon: '🔧', image: 'zypsem-drywall-screws-3-4-inch-white.webp', desc: 'Premium white Zypsem drywall screws (3/4 inch) for dry partition board wiring setups.' },
  { category: 'hardware', name: 'WOOD CUTTER BLADE 5/30 BOSCH', icon: '🔧', image: 'bosch-wood-cutter-circular-saw-blade-5-inch-30t.webp', desc: 'Genuine 5-inch 30-teeth wood cutter circular saw blade by Bosch. Ultra-sharp teeth for clean cuts.' },
  { category: 'hardware', name: 'WOOD CUTTER BLADE 4/30 BOSCH', icon: '🔧', image: 'bosch-wood-cutter-circular-saw-blade-4-inch-30t.jfif', desc: 'Genuine 4-inch 30-teeth wood cutter circular saw blade by Bosch, engineered for high RPM.' },
  { category: 'hardware', name: 'SATTRING KEEL 1 INCH', icon: '🔧', image: 'shuttering-concrete-nails-1-inch.jfif', desc: 'Standard 1-inch shuttering concrete keels/nails for wooden structuring and support.' },
  { category: 'hardware', name: 'SATTRING KEEL 2 INCH', icon: '🔧', image: 'shuttering-concrete-nails-2-inch.jfif', desc: 'Heavy 2-inch shuttering concrete nails for frame support and conduit pipe anchoring.' },
  { category: 'hardware', name: 'SATTRING KEEL 3 INCH', icon: '🔧', image: 'shuttering-concrete-nails-3-inch.jfif', desc: 'Heavy-duty 3-inch shuttering nails for heavy structural frames and timber support.' },
  { category: 'hardware', name: 'SATTRING KEEL 4 INCH', icon: '🔧', image: 'shuttering-concrete-nails-4-inch.jfif', desc: 'Extra-long 4-inch concrete shuttering nails for high-load timber structures.' }
];

function generateGridHTML(categoryName) {
  const filtered = products.filter(p => p.category === categoryName);
  if (filtered.length === 0) return '';

  let html = `
    <!-- Dynamic Product Grid for ${categoryName} -->
    <div class="category-products-grid" style="max-width:1200px; margin:36px auto 0; padding: 0 5%; display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
  `;

  filtered.forEach(p => {
    html += `
      <div class="prod-static-card" style="background:#fff; border:1px solid rgba(107,28,35,0.1); border-radius:12px; padding:22px; display:flex; flex-direction:column; box-shadow:var(--shadow-sm); transition:all 0.3s; position:relative;">
        <div style="height:140px; background:linear-gradient(135deg, var(--gold-pale), #fff); display:flex; align-items:center; justify-content:center; border-radius:8px; margin-bottom:14px; overflow:hidden; position:relative;">
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:48px; z-index:1;">${p.icon}</div>
          <img src="images/products/${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; display:block; position:absolute; top:0; left:0; z-index:2;" onerror="this.style.display='none';" />
        </div>
        <h4 style="font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:700; color:var(--maroon-dark); margin-bottom:8px; line-height:1.2;">${p.name}</h4>
        <p style="font-size:12.5px; color:var(--text-mid); line-height:1.65; margin-bottom:16px;">${p.desc}</p>
        <div style="margin-top:auto;">
          <a href="https://wa.me/917065815743?text=I%20am%20interested%20in%20${encodeURIComponent(p.name)}%20wholesale%20price" target="_blank" style="display:flex; align-items:center; justify-content:center; gap:6px; background:var(--gold); color:var(--maroon-dark); padding:10px; border-radius:50px; font-size:12px; font-weight:700; text-decoration:none; transition:all 0.2s;" onmouseover="this.style.background='var(--gold-light)'" onmouseout="this.style.background='var(--gold)'">
            💬 Get Quote
          </a>
        </div>
      </div>
    `;
  });

  html += `</div>\n`;
  return html;
}

if (!fs.existsSync(productsFilePath)) {
  console.error("products.html not found!");
  process.exit(1);
}

let content = fs.readFileSync(productsFilePath, 'utf8');

// 1. Insert Lighting Products Grid
console.log("Inserting Lighting Products...");
const lightingTarget = `  </div>
</section>

<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  WIRES — ALT SECTION ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`;
const lightingGrid = generateGridHTML('lighting');
content = content.replace(lightingTarget, `  </div>\n${lightingGrid}</section>\n\n<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  WIRES — ALT SECTION ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`);

// 2. Insert Switches Products Grid
console.log("Inserting Switches Products...");
const switchesTarget = `  </div>
</section>

<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  CCTV — ALT SECTION ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`;
const switchesGrid = generateGridHTML('switches');
content = content.replace(switchesTarget, `  </div>\n${switchesGrid}</section>\n\n<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  CCTV — ALT SECTION ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`);

// 3. Insert Conduits Products Grid
console.log("Inserting Conduit Products...");
const conduitTarget = `  </div>
</section>

<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  BRANDS SLIDER ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`;
const conduitGrid = generateGridHTML('conduit');
content = content.replace(conduitTarget, `  </div>\n${conduitGrid}</section>\n\n<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  BRANDS SLIDER ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`);

// 4. Create and Insert Hardware Category Section
console.log("Inserting Hardware Section...");
const hardwareGrid = generateGridHTML('hardware');
const hardwareSectionHTML = `
<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  HARDWARE — ALT SECTION ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->
<section class="alt-section alt-dark" id="hardware">
  <div class="alt-inner">
    <div class="alt-img-wrap">
      <div class="alt-img-placeholder" style="display:flex; height:100%; width:100%; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--maroon-dark), var(--maroon-mid)); font-size:80px; color:#fff;">🔧</div>
      <div class="alt-img-badge">
        <div class="badge-label">Industrial Grade</div>
        <div class="badge-val">Professional Hardware & Tools</div>
      </div>
    </div>
    <div class="alt-content">
      <span class="section-label">Category 07</span>
      <h2 class="section-title">Construction Hardware & Cutting Blades</h2>
      <p class="section-subtitle">Premium site construction hardware, self-drilling screws, wood/wall cutter blades, and adhesives for electrical installation site work.</p>
      <ul class="alt-list">
        <li>Self-Drilling & Drywall Screws</li>
        <li>Bosch Wood Cutter Blades</li>
        <li>Bosch Wall Cutter Blades</li>
        <li>Wall Fix Bond & Araldite Adhesives</li>
        <li>Sattring Keels & Concrete Nails</li>
      </ul>
      <div class="alt-features">
        <span class="alt-feat">✔ Bosch & Top Brands</span>
        <span class="alt-feat">✔ High Durability</span>
        <span class="alt-feat">✔ Precision Cutting</span>
        <span class="alt-feat">✔ Heavy Adhesion</span>
      </div>
      <a href="https://wa.me/917065815743?text=I%20need%20construction%20hardware%20pricing" target="_blank" class="btn-request">Request Pricing →</a>
    </div>
  </div>
  ${hardwareGrid}
</section>
`;

// Insert the new Hardware section right before the Brands section
const brandsSectionTarget = `<!-- ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  BRANDS SLIDER ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═ ═  -->`;
content = content.replace(brandsSectionTarget, `${hardwareSectionHTML}\n\n${brandsSectionTarget}`);

// 5. Update why-section ID to why-choose-us to avoid conflict
console.log("Updating why-section ID...");
content = content.replace('class="why-section section" id="hardware"', 'class="why-section section" id="why-choose-us"');

// Save the updated file
fs.writeFileSync(productsFilePath, content, 'utf8');
console.log("products.html updated successfully!");

// Create products list text file for the user
console.log("Writing list of image paths for the user...");
let imageListText = "========================================================================\n";
imageListText += "IMAGE PATHS LIST FOR PRODUCTS (SAVE WEBP FILES IN: images/products/)\n";
imageListText += "========================================================================\n\n";
products.forEach((p, index) => {
  imageListText += `${index + 1}. Product: ${p.name}\n   Save Image As: images/products/${p.image}\n\n`;
});
fs.writeFileSync(path.join(__dirname, 'PRODUCT_IMAGE_LIST.txt'), imageListText, 'utf8');

// Self-destruct
try {
  fs.unlinkSync(__filename);
} catch(e) {}
