/**
 * IndiaMART Bulk Add Automation Script with Prices, Units, and Image Mappings.
 * -----------------------------------------------------------------------------
 * How to use:
 * 1. Go to IndiaMART "Add Multiple Products Quickly" page.
 * 2. Open Console (F12 -> Console).
 * 3. Copy/paste this code and press Enter.
 */
(async function() {
  const baseImgPath = "d:\\Downloads\\ANSHU\\images\\products\\";
  const products = [
    { name: "ORIENT BATTEN LIGHT 2 FEET 20W", price: 126, unit: "Piece", img: "orient-led-batten-light-2ft-20w.jpg" },
    { name: "ORIENT BATTEN LIGHT 4 FEET 20W", price: 126, unit: "Piece", img: "orient-led-batten-light-4ft-20w.jpg" },
    { name: "ORIENT BATTEN LIGHT 2 FEET 10W", price: 126, unit: "Piece", img: "orient-led-batten-light-2ft-10w.webp" },
    { name: "2 MODULAR BOX", price: 30, unit: "Piece", img: "galvanized-iron-2-modular-switch-box.webp" },
    { name: "3 MODULAR BOX", price: 36, unit: "Piece", img: "galvanized-iron-3-modular-switch-box.jpg" },
    { name: "4 MODULAR BOX", price: 42, unit: "Piece", img: "galvanized-iron-4-modular-switch-box.webp" },
    { name: "6 MODULAR BOX", price: 60, unit: "Piece", img: "galvanized-iron-6-modular-switch-box.webp" },
    { name: "8 MODULAR BOX SQUARE", price: 72, unit: "Piece", img: "galvanized-iron-8-modular-square-switch-box.webp" },
    { name: "8 MODULAR BOX", price: 60, unit: "Piece", img: "galvanized-iron-8-modular-rectangular-switch-box.jpg" },
    { name: "12 MODULAR BOX", price: 84, unit: "Piece", img: "galvanized-iron-12-modular-switch-box.webp" },
    { name: "INDEANA PIPE HEAVY 25MM", price: 2016, unit: "Bundle", img: "indeana-heavy-duty-pvc-conduit-pipe-25mm.jpg" },
    { name: "INDEANA PIPE 20MM MEDIUM", price: 1920, unit: "Bundle", img: "indeana-medium-duty-pvc-conduit-pipe-20mm.jpg" },
    { name: "INDEANA PIPE 25MM MEDIUM", price: 1704, unit: "Bundle", img: "indeana-medium-duty-pvc-conduit-pipe-25mm.webp" },
    { name: "INDEANA BAND 25MM", price: 156, unit: "Packet", img: "indeana-pvc-conduit-bend-band-25mm.jpg" },
    { name: "INDEANA BAND 20MM MEDIUM", price: 216, unit: "Packet", img: "indeana-medium-pvc-conduit-bend-band-20mm.jpg" },
    { name: "INDEANA BAND 25MM HEAVY", price: 240, unit: "Packet", img: "indeana-heavy-pvc-conduit-bend-band-25mm.jpg" },
    { name: "FAN BOX HEAVY", price: 96, unit: "Piece", img: "ceiling-fan-junction-box-heavy-duty-700g.jpg" },
    { name: "CONCIELD BOX HEAVY", price: 42, unit: "Piece", img: "concealed-ceiling-junction-box-heavy-duty.jpg" },
    { name: "FAN BOX MEDIUM", price: 78, unit: "Piece", img: "ceiling-fan-junction-box-medium-duty-500g.webp" },
    { name: "CONCIELD MEDIUM", price: 36, unit: "Piece", img: "concealed-ceiling-junction-box-medium-duty-180g.jpg" },
    { name: "FLEXIBLE PIPE 20MM", price: 94, unit: "Piece", img: "pvc-flexible-corrugated-conduit-pipe-20mm.jpg" },
    { name: "FAN ROD 12 INCH", price: 22, unit: "Piece", img: "ceiling-fan-downrod-iron-12-inch.webp" },
    { name: "TEE COVER", price: 3, unit: "Piece", img: "pvc-conduit-tee-connection-cover.jpg" },
    { name: "FAN COVER", price: 12, unit: "Piece", img: "ceiling-fan-canopy-replacement-cover.jpg" },
    { name: "SCREW .75 INCH", price: 240, unit: "Box", img: "premium-threaded-mounting-screws-0-75-inch.jpg" },
    { name: "SCREW 1 INCH", price: 264, unit: "Box", img: "premium-threaded-mounting-screws-1-inch.png" },
    { name: "SCREW 1.5 INCH", price: 240, unit: "Box", img: "premium-threaded-mounting-screws-1-5-inch.webp" },
    { name: "SCREW 2 INCH", price: 264, unit: "Box", img: "premium-threaded-mounting-screws-2-inch.webp" },
    { name: "SCREW 2.5 INCH", price: 300, unit: "Box", img: "premium-threaded-mounting-screws-2-5-inch.png" },
    { name: "SCREW 3 INCH", price: 336, unit: "Box", img: "premium-threaded-mounting-screws-3-inch.jpg" },
    { name: "PVC SADDLE", price: 180, unit: "Packet", img: "pvc-conduit-pipe-saddle-clamp-25mm.webp" },
    { name: "STEELGRIP INSULATION TAPE", price: 324, unit: "Box", img: "steelgrip-pvc-insulation-tape-pidilite.webp" },
    { name: "THERMOCOL", price: 72, unit: "Piece", img: "thermocol-sheets-roof-insulation-50mm.webp" },
    { name: "socket", price: 7, unit: "Piece", img: null },
    { name: "Fan box light 500G", price: 72, unit: "Piece", img: "ceiling-fan-junction-box-medium-duty-500g.webp" },
    { name: "MASKING TAPE", price: 24, unit: "Piece", img: "high-adhesion-masking-tape.webp" },
    { name: "SELF DRILLING SCREW 1 INCH", price: 1.5, unit: "Piece", img: "self-drilling-metal-screws-1-inch.jpg" },
    { name: "SELF DRILLING SCREW 1.5 INCH", price: 360, unit: "Box", img: "self-drilling-metal-screws-1-5-inch.webp" },
    { name: "SELF DRILLING SCREW 2 INCH", price: 360, unit: "Box", img: "self-drilling-metal-screws-2-inch.jpg" },
    { name: "HEATEX 5 KG", price: 2820, unit: "Piece", img: "heatex-adhesive-seal-bond-compound-5kg.jpg" },
    { name: "KEEL 1*14 SPN", price: 114, unit: "Kg", img: "concrete-nails-keel-1-inch-14-spn.jpg" },
    { name: "KEEL 1.5*14 SPN", price: 114, unit: "Kg", img: "concrete-nails-keel-1-5-inch-14-spn.jpg" },
    { name: "KEEL 2*14 SPN", price: 114, unit: "Kg", img: "concrete-nails-keel-1-inch-14-spn.jpg" },
    { name: "WALL FIX BOND 50G", price: 108, unit: "Piece", img: "wall-fix-rapid-adhesive-bond-50g.webp" },
    { name: "WALL FIX BOND 18G", price: 54, unit: "Piece", img: "wall-fix-rapid-adhesive-bond-18g.jpg" },
    { name: "ARALDITE 1.8KG", price: 1224, unit: "Piece", img: "araldite-standard-epoxy-adhesive-1-8kg.webp" },
    { name: "ZYPSEM SCREW 3/4 WHITE", price: 300, unit: "Box", img: "zypsem-drywall-screws-3-4-inch-white.webp" },
    { name: "WOOD CUTTER BLADE 5/30 BOSCH", price: 276, unit: "Piece", img: "bosch-wood-cutter-circular-saw-blade-5-inch-30t.webp" },
    { name: "WOOD CUTTER BLADE 4/30 BOSCH", price: 252, unit: "Piece", img: "bosch-wood-cutter-circular-saw-blade-4-inch-30t.jpg" },
    { name: "SATTRING KEEL 1 INCH", price: 82, unit: "Kg", img: "shuttering-concrete-nails-1-inch.jpg" },
    { name: "SATTRING KEEL 2 INCH", price: 82, unit: "Kg", img: "shuttering-concrete-nails-2-inch.jpg" },
    { name: "SATTRING KEEL 3 INCH", price: 82, unit: "Kg", img: "shuttering-concrete-nails-3-inch.jpg" },
    { name: "SATTRING KEEL 4 INCH", price: 82, unit: "Kg", img: "shuttering-concrete-nails-4-inch.jpg" },
    { name: "MARBLE CUTTER BLADE 4 INCH", price: 180, unit: "Piece", img: "marble-cutter-blade-4-inch.webp" },
    { name: "MARBLE CUTTER BLADE 5 INCH", price: 220, unit: "Piece", img: "marble-cutter-blade-5-inch.webp" },
    { name: "MARBLE CUTTER BLADE 6 INCH", price: 260, unit: "Piece", img: "marble-cutter-blade-6-inch.webp" },
    { name: "SDS PLUS HAMMER DRILL BIT 6 X 110MM", price: 45, unit: "Piece", img: "sds-plus-hammer-drill-bit-6mm.webp" },
    { name: "SDS PLUS HAMMER DRILL BIT 8 X 160MM", price: 55, unit: "Piece", img: "sds-plus-hammer-drill-bit-8mm.webp" },
    { name: "SDS PLUS HAMMER DRILL BIT 10 X 160MM", price: 65, unit: "Piece", img: "sds-plus-hammer-drill-bit-10mm.webp" },
    { name: "SDS PLUS HAMMER DRILL BIT 12 X 160MM", price: 85, unit: "Piece", img: "sds-plus-hammer-drill-bit-12mm.webp" },
    { name: "SDS PLUS HAMMER DRILL BIT 16 X 200MM", price: 135, unit: "Piece", img: "sds-plus-hammer-drill-bit-16mm.webp" },
    { name: "PARAS THREADED ROD 1 METER", price: 110, unit: "Piece", img: "paras-threaded-rod-1m.webp" },
    { name: "BOSCH CUTTING WHEEL 14 INCH", price: 210, unit: "Piece", img: "bosch-cutting-wheel-14-inch.webp" },
    { name: "BOSCH GRINDING WHEEL 4 INCH", price: 50, unit: "Piece", img: "bosch-grinding-wheel-4-inch.webp" }
  ];

  console.log("Starting automation for " + products.length + " products with prices...");

  function getAddBtn() {
    return Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim().includes('+ Add More'));
  }

  let attempts = 0;
  while (!document.getElementById(`qa_${products.length - 1}`) && attempts < 150) {
    const btn = getAddBtn();
    if (!btn) break;
    btn.click();
    await new Promise(r => setTimeout(r, 120));
    attempts++;
  }

  console.log("Created rows. Filling data...");

  let filled = 0;
  for (let i = 0; i < products.length; i++) {
    const prod = products[i];
    const nameEl = document.getElementById(`qa_${i}`);
    const priceEl = document.getElementById(`qaprice_${i}`);
    const unitEl = document.getElementById(`punitinputbpa_${i + 1}`);

    if (nameEl) {
      nameEl.value = prod.name;
      nameEl.dispatchEvent(new Event('input', { bubbles: true }));
      nameEl.dispatchEvent(new Event('change', { bubbles: true }));
      nameEl.dispatchEvent(new Event('blur', { bubbles: true }));
    }
    if (priceEl) {
      priceEl.value = prod.price;
      priceEl.dispatchEvent(new Event('input', { bubbles: true }));
      priceEl.dispatchEvent(new Event('change', { bubbles: true }));
      priceEl.dispatchEvent(new Event('blur', { bubbles: true }));
    }
    if (unitEl) {
      unitEl.value = prod.unit;
      unitEl.dispatchEvent(new Event('input', { bubbles: true }));
      unitEl.dispatchEvent(new Event('change', { bubbles: true }));
      unitEl.dispatchEvent(new Event('blur', { bubbles: true }));
      filled++;
    }
  }

  console.log(`Filled ${filled} products.`);
})();
