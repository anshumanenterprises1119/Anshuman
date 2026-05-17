const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const artifactsDir = 'C:\\Users\\aditya tiwari\\.gemini\\antigravity\\brain\\d272e68f-60da-4cda-ae74-64c46b55ce2a';
const brandsDir = path.join(projectDir, 'brands');

if (!fs.existsSync(brandsDir)) {
    fs.mkdirSync(brandsDir, { recursive: true });
}

// Get the 5 newest files
const artifactFiles = fs.readdirSync(artifactsDir).filter(f => f.startsWith('media__') && f.endsWith('.png'));
artifactFiles.sort(); 
const latestLogos = artifactFiles.slice(-5);

let marqueeHtml = `
  <style>
    .marquee-container {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      padding: 30px 0;
      background: #fff;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
      position: relative;
    }
    .marquee-container::before, .marquee-container::after {
      content: '';
      position: absolute;
      top: 0;
      width: 100px;
      height: 100%;
      z-index: 2;
    }
    .marquee-container::before {
      left: 0;
      background: linear-gradient(to right, #fff, transparent);
    }
    .marquee-container::after {
      right: 0;
      background: linear-gradient(to left, #fff, transparent);
    }
    .marquee-content {
      display: inline-flex;
      align-items: center;
      gap: 50px;
      animation: scrollMarquee 15s linear infinite;
    }
    .marquee-content:hover {
      animation-play-state: paused;
    }
    .brand-logo-img {
      height: 50px;
      max-width: 150px;
      object-fit: contain;
      filter: grayscale(100%);
      opacity: 0.7;
      transition: all 0.3s ease;
      mix-blend-mode: multiply; /* Helps blend white backgrounds into the container */
    }
    .brand-logo-img:hover {
      filter: grayscale(0%);
      opacity: 1;
      transform: scale(1.1);
    }
    @keyframes scrollMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  </style>
  <div class="marquee-container">
    <div class="marquee-content">
`;

// Build the image tags. We duplicate the set of logos to create a seamless infinite loop.
let imgTags = '';
latestLogos.forEach((file, index) => {
    const src = path.join(artifactsDir, file);
    const destName = `brand_anim_${index + 1}.png`;
    const dest = path.join(brandsDir, destName);
    fs.copyFileSync(src, dest);
    
    imgTags += `<img src="brands/${destName}" alt="Brand Logo" class="brand-logo-img" style="margin: 0 30px;">`;
});

// Duplicate the set of images for seamless scrolling
marqueeHtml += imgTags + imgTags + `
    </div>
  </div>
`;

const indexFile = path.join(projectDir, 'index.html');
let content = fs.readFileSync(indexFile, 'utf8');

// Replace the old brand grid with the animated marquee
const brandGridRegex = /<div class="brand-grid"[^>]*>[\s\S]*?<\/div>/;
if (brandGridRegex.test(content)) {
    content = content.replace(brandGridRegex, marqueeHtml);
} else {
    // If it was already replaced previously and has a different class/style, we look for brands-row or something similar
    // We can also target the section:
    const sectionRegex = /<div class="brand-grid"[^>]*>[\s\S]*?<\/div>/;
    // Just try replacing the previously injected grid which had style="display:grid..."
    const prevGridRegex = /<div class="brand-grid" style="display:grid;[^>]*>[\s\S]*?<\/div>/;
    if (prevGridRegex.test(content)) {
        content = content.replace(prevGridRegex, marqueeHtml);
    }
}

// Ensure old style brands row at the bottom is also updated
const brandsRowRegex = /<div class="brands-row">[\s\S]*?<\/div>/;
if (brandsRowRegex.test(content)) {
    content = content.replace(brandsRowRegex, marqueeHtml);
}

fs.writeFileSync(indexFile, content, 'utf8');

console.log('Successfully created animated marquee for brand logos!');
