/**
 * GOOGLE MERCHANT CENTER XML FEED GENERATOR (STRICT XML ESCAPED)
 * Generates 100% Google Merchant Center compliant RSS 2.0 / XML feed
 */

const fs = require('fs');
const path = require('path');

const domain = "https://anshumanenterprises.online";

const products = [
  {
    id: "DN-PENDANT-01",
    title: "Ansh DecorateNow Gold Crystal Cylinder Pendant Light",
    description: "Luxury handcrafted gold cylinder pendant light featuring precision-cut oval K9 crystal gems set in an intricate metallic lattice frame. Includes 1.2M adjustable suspension cord & brass canopy.",
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
    category: "Home & Garden > Lighting > Pendant Lights"
  },
  {
    id: "DN-WALL-03",
    title: "Ansh DecorateNow Gold Crystal Wallchiere Lamp",
    description: "Premium gold finish, optical crystal, adjustable cord, sturdy metal frame & warm LED bulb included.",
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
    category: "Home & Garden > Lighting > Wall Lights & Sconces"
  },
  {
    id: "DN-WALL-01",
    title: "Ansh DecorateNow Aditya Wallchiere Lamp",
    description: "Handcrafted metallic wallchiere fixture (Without Bulb) with soft warm wall wash.",
    link: `${domain}/decoratenow/products.html#DN-WALL-01`,
    image: `${domain}/images/products/aditya-wallchiere-wall-lamp-without-bulb-1.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "Home & Garden > Lighting > Wall Lights & Sconces"
  },
  {
    id: "DN-WALL-02",
    title: "Ansh DecorateNow Brass Wallchiere Lamp",
    description: "Modern antique brass sconce (Without Bulb) for living rooms and luxury hallways.",
    link: `${domain}/decoratenow/products.html#DN-WALL-02`,
    image: `${domain}/images/products/ansh-wallchiere-wall-lamp-without-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "Home & Garden > Lighting > Wall Lights & Sconces"
  },
  {
    id: "DN-WALL-04",
    title: "Ansh DecorateNow Swing Arm Wall Light",
    description: "Adjustable dual-pivot arm lamp for reading desks and bedside illumination (With Bulb).",
    link: `${domain}/decoratenow/products.html#DN-WALL-04`,
    image: `${domain}/images/products/swing-arm-wall-light-wall-lamp-with-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "Home & Garden > Lighting > Wall Lights & Sconces"
  },
  {
    id: "DN-WALL-05",
    title: "Ansh DecorateNow Luxury Wallchiere Lamp",
    description: "High-end sconce with crystal accents & warm diffused glow (With Bulb).",
    link: `${domain}/decoratenow/products.html#DN-WALL-05`,
    image: `${domain}/images/products/wallchiere-wall-lamp-with-bulb.webp`,
    price: "499.00 INR",
    brand: "DecorateNow",
    category: "Home & Garden > Lighting > Wall Lights & Sconces"
  },
  {
    id: "WIRE-POLY-1.5",
    title: "Polycab FR House Wire 1.5 sq mm (100m Coil)",
    description: "Flame Retardant 99.97% pure copper wire for home electrical installation.",
    link: `${domain}/products.html#WIRE-POLY-1.5`,
    image: `${domain}/images/gallery/fr-frls-house-wiring-cables-wholesale.jpg`,
    price: "1450.00 INR",
    brand: "Polycab",
    category: "Hardware > Electrical Wires & Cables"
  },
  {
    id: "SWITCH-HAVELLS-6A",
    title: "Havells Crabtree 6A 1-Way Modular Switch",
    description: "Flame-retardant silver contact modular switch with smooth quiet action.",
    link: `${domain}/products.html#SWITCH-HAVELLS-6A`,
    image: `${domain}/images/gallery/premium-modular-electrical-switch.jpg`,
    price: "45.00 INR",
    brand: "Havells",
    category: "Hardware > Switches & Outlets"
  },
  {
    id: "CCTV-BOSCH-KIT4",
    title: "Bosch / Hikvision 4 Camera 1080p HD CCTV Security Kit",
    description: "Complete 4-channel DVR + 4 outdoor weatherproof night vision cameras + 1TB hard drive.",
    link: `${domain}/products.html#CCTV-BOSCH-KIT4`,
    image: `${domain}/images/gallery/cctv-dvr-camera-security-kit.jpg`,
    price: "12500.00 INR",
    brand: "Hikvision",
    category: "Electronics > Security Cameras"
  }
];

let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title><![CDATA[Anshuman Enterprises & DecorateNow Product Catalog]]></title>
    <link>${domain}</link>
    <description><![CDATA[Authorized Wholesale Electrical & Luxury Decorative Lighting Store Greater Noida]]></description>
`;

products.forEach(p => {
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
      <g:google_product_category><![CDATA[${p.category}]]></g:google_product_category>
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
console.log('google_merchant_feed.xml updated with strict CDATA XML escaping for Google Merchant Center.');
