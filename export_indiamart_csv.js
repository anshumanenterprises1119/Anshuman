const fs = require('fs');
const path = require('path');

const buildScriptPath = path.join(__dirname, 'build_products_html.js');
const csvOutputPath = path.join(__dirname, 'indiamart_products_upload.csv');

if (!fs.existsSync(buildScriptPath)) {
  console.error("Error: build_products_html.js not found in this directory!");
  process.exit(1);
}

const fileContent = fs.readFileSync(buildScriptPath, 'utf8');

// Match the products array structure
const startKeyword = 'const products = [';
const startIndex = fileContent.indexOf(startKeyword);

if (startIndex === -1) {
  console.error("Error: Could not find products array in build_products_html.js");
  process.exit(1);
}

// Find the ending bracket of the products array
// We'll scan from startIndex + startKeyword.length - 1 (the open bracket '[')
let braceCount = 1;
let endIndex = -1;
const scanStart = startIndex + startKeyword.length;

for (let i = scanStart; i < fileContent.length; i++) {
  if (fileContent[i] === '[') {
    braceCount++;
  } else if (fileContent[i] === ']') {
    braceCount--;
    if (braceCount === 0) {
      endIndex = i;
      break;
    }
  }
}

if (endIndex === -1) {
  console.error("Error: Could not find the end of products array");
  process.exit(1);
}

// Extract the products array text and evaluate it safely to get the actual array
const productsArrayText = fileContent.substring(startIndex + 'const products ='.length, endIndex + 1);

let products = [];
try {
  // Use Function to safely evaluate the array declaration context
  products = new Function(`return ${productsArrayText};`)();
} catch (e) {
  console.error("Error parsing products array text:", e);
  process.exit(1);
}

console.log(`Found ${products.length} products to export.`);

// Helper function to escape CSV values
function escapeCSVValue(val) {
  if (val === undefined || val === null) return '';
  let str = String(val).replace(/"/g, '""'); // Escape double quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    str = `"${str}"`;
  }
  return str;
}

// IndiaMART Bulk Upload standard headers:
// 1. Product Name (Required)
// 2. Description (Recommended)
// 3. Price (Optional)
// 4. Price Unit (e.g. Piece, Box, Meter)
// 5. Category (Optional)
// 6. Image Filename (Optional)
const headers = [
  'Product Name',
  'Description',
  'Price',
  'Price Unit',
  'Category',
  'Image Filename'
];

let csvContent = headers.join(',') + '\n';

products.forEach(p => {
  const row = [
    p.name,
    p.desc || '',
    '', // Price can be filled manually
    p.category === 'conduit' ? 'Meter' : 'Piece', // default unit based on category
    p.category || '',
    p.image || ''
  ];
  csvContent += row.map(escapeCSVValue).join(',') + '\n';
});

fs.writeFileSync(csvOutputPath, csvContent, 'utf8');
console.log(`CSV successfully created: ${csvOutputPath}`);
console.log('You can now open this CSV in Excel, adjust prices/units, and upload it to IndiaMART Seller Panel.');
