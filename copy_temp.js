const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\aditya tiwari\\.gemini\\antigravity-ide\\brain\\07b0390d-491a-47ce-8617-d276e1f01585';
const destDir = 'd:\\Downloads\\ANSHU\\images\\products';

const mappings = {
  'marble_cutter_blade_4_inch_1784119084366.png': 'marble-cutter-blade-4-inch.webp',
  'marble_cutter_blade_5_inch_1784119142106.png': 'marble-cutter-blade-5-inch.webp',
  'marble_cutter_blade_6_inch_1784119157558.png': 'marble-cutter-blade-6-inch.webp',
  'sds_plus_hammer_drill_bit_6mm_1784119171253.png': 'sds-plus-hammer-drill-bit-6mm.webp',
  'sds_plus_hammer_drill_bit_8mm_1784119183760.png': 'sds-plus-hammer-drill-bit-8mm.webp',
  'sds_plus_hammer_drill_bit_10mm_1784119197158.png': 'sds-plus-hammer-drill-bit-10mm.webp',
  'sds_plus_hammer_drill_bit_12mm_1784119210560.png': 'sds-plus-hammer-drill-bit-12mm.webp',
  'sds_plus_hammer_drill_bit_16mm_1784119224463.png': 'sds-plus-hammer-drill-bit-16mm.webp',
  'paras_threaded_rod_1m_1784119237912.png': 'paras-threaded-rod-1m.webp',
  'bosch_cutting_wheel_14_inch_1784119253925.png': 'bosch-cutting-wheel-14-inch.webp',
  'bosch_grinding_wheel_4_inch_1784119268031.png': 'bosch-grinding-wheel-4-inch.webp'
};

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log("Copying generated product images...");
let successCount = 0;
for (const [srcFile, destFile] of Object.entries(mappings)) {
  const srcPath = path.join(srcDir, srcFile);
  const destPath = path.join(destDir, destFile);
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`[OK] Copied ${srcFile} -> ${destFile}`);
      successCount++;
    } else {
      console.warn(`[WARN] Source file not found: ${srcPath}`);
    }
  } catch (e) {
    console.error(`[ERROR] Failed to copy ${srcFile}:`, e);
  }
}

console.log(`\nSuccessfully copied ${successCount} of ${Object.keys(mappings).length} images.`);
