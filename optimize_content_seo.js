const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - CONTENT SEO OPTIMIZER");
console.log("====================================================");
console.log("");

function updateFile(filename, replacements) {
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  replacements.forEach(([target, replacement]) => {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
    }
  });
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`[OK] Content SEO optimized: ${filename}`);
  }
}

// 1. Optimize wires-cables.html
updateFile('wires-cables.html', [
  [
    '<title>Wires & Cables Supplier in Greater Noida – Wholesale Polycab, Havells</title>',
    '<title>Wires, Cables & Electrical Hardware Supplier in Greater Noida – Wholesale Polycab, Havells</title>'
  ],
  [
    'content="Buy genuine FR, FRLS, ZHFR and armoured wires at wholesale rates. Anshuman Enterprises supplies Polycab, Havells, Finolex cables in Greater Noida with factory-direct pricing."',
    'content="Buy genuine FR, FRLS, ZHFR wires, and electrical project hardware at wholesale rates. Anshuman Enterprises supplies Polycab, Havells, and Finolex in Greater Noida."'
  ]
]);

// 2. Optimize modular-switches.html
updateFile('modular-switches.html', [
  [
    '<title>Modular Switches Wholesale – GreatWhite, Anchor | GN Electrical Shop</title>',
    '<title>Modular Switches & Switchboard Hardware Wholesale – Greater Noida</title>'
  ]
]);

// 3. Optimize conduit-pipes.html
updateFile('conduit-pipes.html', [
  [
    '<title>PVC Conduit Pipe Supplier – AKG, Precision | GN Electrical Shop</title>',
    '<title>PVC Conduit Pipe & Sourcing Hardware Supplier – Greater Noida</title>'
  ]
]);

// 4. Optimize distribution-boards.html
updateFile('distribution-boards.html', [
  [
    '<title>MCB, RCCB & DB Panels – Wholesale Electrical Components in GN</title>',
    '<title>MCB, RCCB & Distribution Board Hardware Wholesale – Greater Noida</title>'
  ]
]);

// 5. Optimize led-lighting.html
updateFile('led-lighting.html', [
  [
    '<title>LED Lighting Suppliers in Greater Noida – Philips, Syska, Havells</title>',
    '<title>LED Lighting & Sourcing Hardware Supplier in Greater Noida – Philips, Syska, Havells</title>'
  ]
]);

console.log("");
console.log("====================================================");
console.log("  Content SEO Optimization Complete!");
console.log("====================================================");
