const fs = require('fs');
const path = require('path');

const dir = 'd:\\Downloads\\ANSHU';

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - POLICY & FAQ PAGES UPDATOR");
console.log("====================================================");
console.log("");

function updateFile(filename, replacements) {
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(filepath)) {
    console.error(`[ERROR] File not found: ${filename}`);
    return;
  }
  
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  
  replacements.forEach(([target, replacement]) => {
    if (content.includes(target)) {
      content = content.split(target).join(replacement);
    }
  });
  
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`[OK] Updated policy copy in: ${filename}`);
  } else {
    console.log(`[SKIP] No modifications needed for: ${filename}`);
  }
}

// 1. Update terms.html
updateFile('terms.html', [
  [
    '<title>Terms &amp; Conditions – Anshuman Enterprises</title>',
    '<title>Terms &amp; Conditions – Anshuman Enterprises (Electrical &amp; Hardware Supplier)</title>'
  ],
  [
    '<meta property="og:title" content="Terms &amp; Conditions – Anshuman Enterprises" />',
    '<meta property="og:title" content="Terms &amp; Conditions – Anshuman Enterprises (Electrical &amp; Hardware Supplier)" />'
  ]
]);

// 2. Update privacy.html
updateFile('privacy.html', [
  [
    '<title>Privacy Policy – Anshuman Enterprises</title>',
    '<title>Privacy Policy – Anshuman Enterprises (Electrical &amp; Hardware Supplier)</title>'
  ],
  [
    '<meta property="og:title" content="Privacy Policy – Anshuman Enterprises" />',
    '<meta property="og:title" content="Privacy Policy – Anshuman Enterprises (Electrical &amp; Hardware Supplier)" />'
  ]
]);

// 3. Update refund-shipping.html
updateFile('refund-shipping.html', [
  [
    '<title>Refund &amp; Shipping Policy – Anshuman Enterprises</title>',
    '<title>Refund &amp; Shipping Policy – Anshuman Enterprises (Electrical &amp; Hardware Supplier)</title>'
  ],
  [
    '<meta property="og:title" content="Refund &amp; Shipping Policy – Anshuman Enterprises" />',
    '<meta property="og:title" content="Refund &amp; Shipping Policy – Anshuman Enterprises (Electrical &amp; Hardware Supplier)" />'
  ],
  [
    'wholesale and retail store',
    'wholesale electrical and hardware store'
  ]
]);

// 4. Update faq.html
updateFile('faq.html', [
  [
    'Anshuman Enterprises is a project electrical supply company that provides branded electrical products',
    'Anshuman Enterprises is a project electrical and hardware supply company that provides branded electrical & hardware products'
  ],
  [
    'from other electrical suppliers?',
    'from other electrical & hardware suppliers?'
  ],
  [
    'Anshuman Enterprises supplies branded electrical products including wires',
    'Anshuman Enterprises supplies branded electrical and hardware products including wires'
  ],
  [
    'Anshuman Enterprises provides branded electrical project supply solutions',
    'Anshuman Enterprises provides branded electrical & hardware project supply solutions'
  ]
]);

console.log("");
console.log("====================================================");
console.log("  Policy & FAQ pages updates completed successfully!");
console.log("====================================================");
