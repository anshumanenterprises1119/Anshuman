const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const indexFile = path.join(projectDir, 'index.html');
let content = fs.readFileSync(indexFile, 'utf8');

const newBrandsHtml = `
  <!-- PREMIUM BRANDS SHOWCASE -->
  <style>
    .premium-brands-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 25px;
        margin-top: 40px;
        padding-bottom: 20px;
    }
    .brand-card {
        background: #ffffff;
        border-radius: 12px;
        width: 160px;
        height: 90px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        padding: 15px;
        border: 1px solid rgba(0,0,0,0.05);
    }
    .brand-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 25px rgba(201, 168, 76, 0.25);
        border-color: rgba(201, 168, 76, 0.3);
    }
    .brand-card img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        opacity: 0; /* Hidden until processed */
        transition: opacity 0.5s ease;
    }
  </style>

  <div class="premium-brands-grid">
    <div class="brand-card"><img src="brands/brand_anim_1.png" alt="Orient" class="dynamic-logo"></div>
    <div class="brand-card"><img src="brands/brand_anim_2.png" alt="Anchor" class="dynamic-logo"></div>
    <div class="brand-card"><img src="brands/brand_anim_3.png" alt="Havells" class="dynamic-logo"></div>
    <div class="brand-card"><img src="brands/brand_anim_4.png" alt="Philips" class="dynamic-logo"></div>
    <div class="brand-card"><img src="brands/brand_anim_5.png" alt="Crompton" class="dynamic-logo"></div>
  </div>

  <script>
    // Advanced background removal script to ensure logos look perfect on white cards
    document.addEventListener("DOMContentLoaded", function() {
        const images = document.querySelectorAll('.dynamic-logo');
        images.forEach(img => {
            if(img.complete) processImage(img);
            else img.addEventListener('load', () => processImage(img));
        });

        function processImage(img) {
            // Already processed
            if (img.dataset.processed) return;
            img.dataset.processed = "true";

            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                canvas.width = img.naturalWidth || img.width;
                canvas.height = img.naturalHeight || img.height;
                
                if(canvas.width === 0) {
                    img.style.opacity = 1;
                    return;
                }
                
                ctx.drawImage(img, 0, 0);
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Sample corners to determine background
                const corners = [
                    (0) * 4, // top-left
                    (canvas.width - 1) * 4, // top-right
                    ((canvas.height - 1) * canvas.width) * 4, // bottom-left
                    ((canvas.height - 1) * canvas.width + canvas.width - 1) * 4 // bottom-right
                ];
                
                let bgR = 0, bgG = 0, bgB = 0;
                corners.forEach(i => {
                    bgR += data[i]; bgG += data[i+1]; bgB += data[i+2];
                });
                bgR /= 4; bgG /= 4; bgB /= 4;
                
                const isWhite = bgR > 230 && bgG > 230 && bgB > 230;
                const isBlack = bgR < 20 && bgG < 20 && bgB < 20;
                
                if (isWhite || isBlack) {
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i], g = data[i+1], b = data[i+2];
                        if (isWhite && r > 220 && g > 220 && b > 220) {
                            data[i+3] = 0; // Make transparent
                        }
                        else if (isBlack && r < 30 && g < 30 && b < 30) {
                            data[i+3] = 0; // Make transparent
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                    img.src = canvas.toDataURL('image/png');
                }
            } catch(e) {
                console.log("CORS or canvas error, displaying original image.");
            }
            img.style.opacity = 1;
        }
    });
  </script>
`;

// Replace the old marquee or brand grid
const marqueeRegex = /<style>[\s\S]*?<\/style>\s*<div class="marquee-container">[\s\S]*?<\/div>\s*<\/div>/;
if (marqueeRegex.test(content)) {
    content = content.replace(marqueeRegex, newBrandsHtml);
} else {
    // Try catching any brand-grid if it's there
    const oldGridRegex = /<div class="brand-grid"[^>]*>[\s\S]*?<\/div>/;
    if (oldGridRegex.test(content)) {
        content = content.replace(oldGridRegex, newBrandsHtml);
    }
}

fs.writeFileSync(indexFile, content, 'utf8');
console.log('Successfully redesigned brands section with smart background removal!');
