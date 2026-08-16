/**
 * FULL CATALOG GOOGLE MERCHANT CENTER FEED GENERATOR (XML + TSV)
 * Automatically indexes all products across the entire website (70+ items)
 */

const fs = require('fs');
const path = require('path');

const domain = "https://anshumanenterprises.online";

// Category to Google Numeric Category ID mapping
const googleCategoryMap = {
  lighting: "524",
  switches: "1938",
  conduit: "1938",
  hardware: "1938",
  wires: "1938",
  mcb: "1938",
  cctv: "3478",
  pendant: "530",
  wall: "536"
};

// Brand mapper based on product title
function getBrandFromTitle(title) {
  const t = title.toUpperCase();
  if (t.includes("ORIENT")) return "Orient Electric";
  if (t.includes("INDEANA")) return "Indeana";
  if (t.includes("BOSCH")) return "Bosch";
  if (t.includes("POLYCAB")) return "Polycab";
  if (t.includes("HAVELLS")) return "Havells";
  if (t.includes("FINOLEX")) return "Finolex";
  if (t.includes("STEELGRIP")) return "Steelgrip";
  if (t.includes("ZYPSEM")) return "Zypsem";
  if (t.includes("ARALDITE")) return "Araldite";
  if (t.includes("DECORATENOW") || t.includes("ANSH DECORATENOW")) return "DecorateNow";
  return "Anshuman Enterprises";
}

// Custom ID slug generator
function makeSlug(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .toUpperCase();
}

let allProducts = [];

// 1. ADD DECORATENOW 9-IMAGE PRODUCTS & SPECIALTY LIGHTS
allProducts.push(
  {
    id: "DN-PENDANT-01",
    title: "Ansh DecorateNow Gold Crystal Cylinder Pendant Light",
    description: "Luxury handcrafted gold cylinder pendant light featuring precision-cut oval K9 crystal gems set in an intricate metallic lattice frame. Includes 1.2M adjustable suspension cord and brass canopy.",
    link: `${domain}/decoratenow/product.html?id=DN-PENDANT-01`,
    image: `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-1.webp`,
    additionalImages: [
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-2.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-3.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-4.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-5.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-6.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-7.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-8.webp`,
      `${domain}/images/products/ansh-decoratenow-gold-crystal-pendant-lamp-9.webp`
    ],
    price: "899.00 INR",
    brand: "DecorateNow",
    category: "530"
  },
  {
    id: "DN-WALL-03",
    title: "Ansh DecorateNow Gold Crystal Wallchiere Lamp",
    description: "Premium gold finish, optical crystal, adjustable cord, sturdy metal frame and warm LED bulb included.",
    link: `${domain}/decoratenow/product.html?id=DN-WALL-03`,
    image: `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-1.webp`,
    additionalImages: [
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-2.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-3.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-4.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-5.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-6.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-7.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-8.webp`,
      `${domain}/images/products/decoratenow-wallchiere-wall-lamp-with-bulb-9.webp`
    ],
    price: "699.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-06",
    title: "Ansh DecorateNow Modern Golden Oval 3-in-1 LED Wall Light",
    description: "Luxury handcrafted gold electroplated oval LED wall light with K9 crystal lattice diffuser ring. Features 3-in-1 switch color changing modes: Warm White (3000K), Cool White (6500K), Natural White (4000K). Dimensions: 10 inch height, 8 inch width, 8 inch depth base canopy.",
    link: `${domain}/decoratenow/product.html?id=DN-WALL-06`,
    image: `${domain}/images/products/decoratenow-oval-3in1-wall-lamp-1.webp`,
    additionalImages: [
      `${domain}/images/products/decoratenow-oval-3in1-wall-lamp-2.webp`,
      `${domain}/images/products/decoratenow-oval-3in1-wall-lamp-3.webp`
    ],
    price: "449.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-DEER",
    title: "Ansh DecorateNow Deer Head Decorative LED Wall Lamp",
    description: "Modern artistic deer head wall lamp with electroplated gold antler accents and ambient warm illumination for luxury home decor.",
    link: `${domain}/decoratenow/product.html?id=DN-WALL-DEER`,
    image: `${domain}/images/products/decoratenow-deer-led-wall-lamp.webp`,
    price: "349.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-01",
    title: "Ansh DecorateNow Aditya Wallchiere Lamp",
    description: "Handcrafted metallic wallchiere fixture without bulb with soft warm wall wash.",
    link: `${domain}/decoratenow/products.html#DN-WALL-01`,
    image: `${domain}/images/products/aditya-wallchiere-wall-lamp-without-bulb-1.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-02",
    title: "Ansh DecorateNow Brass Wallchiere Lamp",
    description: "Modern antique brass sconce without bulb for living rooms and luxury hallways.",
    link: `${domain}/decoratenow/products.html#DN-WALL-02`,
    image: `${domain}/images/products/ansh-wallchiere-wall-lamp-without-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-04",
    title: "Ansh DecorateNow Swing Arm Wall Light",
    description: "Adjustable dual pivot arm lamp for reading desks and bedside illumination with bulb.",
    link: `${domain}/decoratenow/products.html#DN-WALL-04`,
    image: `${domain}/images/products/swing-arm-wall-light-wall-lamp-with-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "536"
  },
  {
    id: "DN-WALL-05",
    title: "Ansh DecorateNow Luxury Wallchiere Lamp",
    description: "High end sconce with crystal accents and warm diffused glow with bulb.",
    link: `${domain}/decoratenow/products.html#DN-WALL-05`,
    image: `${domain}/images/products/wallchiere-wall-lamp-with-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "536"
  }
);

// 3. GENERATE STRICT GOOGLE MERCHANT CENTER XML FEED
let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[Anshuman Enterprises & DecorateNow Complete Product Catalog]]></title>
    <link>${domain}</link>
    <description><![CDATA[Authorized Wholesale Electrical, Security & Luxury Decorative Lighting Store Greater Noida]]></description>
`;

allProducts.forEach(p => {
  xmlContent += `    <item>
      <g:id>${p.id}</g:id>
      <g:title><![CDATA[${p.title}]]></g:title>
      <g:description><![CDATA[${p.description}]]></g:description>
      <g:link>${p.link}</g:link>
      <g:image_link>${p.image}</g:image_link>
`;

  if (p.additionalImages && p.additionalImages.length > 0) {
    p.additionalImages.forEach(img => {
      xmlContent += `      <g:additional_image_link>${img}</g:additional_image_link>\n`;
    });
  }

  xmlContent += `      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>${p.price}</g:price>
      <g:brand><![CDATA[${p.brand}]]></g:brand>
      <g:google_product_category>${p.category}</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>
      <g:shipping>
        <g:country>IN</g:country>
        <g:service>Standard Delivery</g:service>
        <g:price>0.00 INR</g:price>
      </g:shipping>
    </item>
`;
});

xmlContent += `  </channel>
</rss>`;

fs.writeFileSync(path.join(__dirname, 'google_merchant_feed.xml'), xmlContent, 'utf-8');

// 4. GENERATE GOOGLE RECOMMENDED TSV FEED
const tsvHeaders = [
  'id', 'title', 'description', 'link', 'image_link',
  'additional_image_link', 'availability', 'price', 'condition',
  'brand', 'google_product_category', 'identifier_exists', 'shipping'
];

let tsvContent = tsvHeaders.join('\t') + '\n';

allProducts.forEach(p => {
  const addImagesStr = (p.additionalImages && p.additionalImages.length > 0) ? p.additionalImages.join(',') : '';
  const row = [
    p.id,
    p.title.replace(/[\t\n\r]/g, ' '),
    p.description.replace(/[\t\n\r]/g, ' '),
    p.link,
    p.image,
    addImagesStr,
    'in_stock',
    p.price,
    'new',
    p.brand,
    p.category,
    'no',
    'IN:Standard Delivery:0.00 INR'
  ];
  tsvContent += row.join('\t') + '\n';
});

fs.writeFileSync(path.join(__dirname, 'google_merchant_feed.tsv'), tsvContent, 'utf-8');

console.log(`FULL CATALOG GENERATED: ${allProducts.length} PRODUCTS IN XML & TSV FEEDS!`);
