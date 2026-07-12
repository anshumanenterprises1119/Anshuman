const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceDir = __dirname;
const productsDir = path.join(workspaceDir, "images", "products");
const galleryDir = path.join(workspaceDir, "images", "gallery");

// Ensure directories exist
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });

// Check if Python is available on this system
let hasPython = false;
let pythonCommand = 'python';

try {
    execSync('python --version', { stdio: 'ignore' });
    hasPython = true;
} catch (e) {
    try {
        execSync('py --version', { stdio: 'ignore' });
        hasPython = true;
        pythonCommand = 'py';
    } catch (e2) {}
}

if (hasPython) {
    console.log(`Python is available (using '${pythonCommand}'). Launching Python-based WebP conversion script...`);
    try {
        execSync(`${pythonCommand} "${path.join(workspaceDir, "process_images_and_catalog.py")}"`, { stdio: 'inherit' });
        console.log("Python script completed successfully!");
        process.exit(0);
    } catch (e) {
        console.error("Python script execution failed, falling back to pure Node.js mapping:", e.message);
    }
} else {
    console.log("Python is NOT available. Proceeding with pure Node.js fallback (preserving original image formats)...");
}

// --------------------- PURE NODE.JS FALLBACK FLOW ---------------------

// Product mapping: Uploaded filename -> SEO name and original extension
const uploadMappings = {
    "Orient Batten Light 2 Feet 20W.jfif": { name: "orient-led-batten-light-2ft-20w", ext: ".jfif" },
    "Orient Batten Light 4 Feet 20W.jpg": { name: "orient-led-batten-light-4ft-20w", ext: ".jpg" },
    "Orient Batten Light 2 Feet 10W.webp": { name: "orient-led-batten-light-2ft-10w", ext: ".webp" },
    "2-modular-box.webp": { name: "galvanized-iron-2-modular-switch-box", ext: ".webp" },
    "3-modular-box.jfif": { name: "galvanized-iron-3-modular-switch-box", ext: ".jfif" },
    "4-modular-box.webp": { name: "galvanized-iron-4-modular-switch-box", ext: ".webp" },
    "6-modular-box.webp": { name: "galvanized-iron-6-modular-switch-box", ext: ".webp" },
    "8-modular-box square": { name: "galvanized-iron-8-modular-square-switch-box", ext: ".webp" }, // treats extensionless as webp
    "8-modular-box.jpg": { name: "galvanized-iron-8-modular-rectangular-switch-box", ext: ".jpg" },
    "12-modular-box.webp": { name: "galvanized-iron-12-modular-switch-box", ext: ".webp" },
    "INDEANA PIPE HEAVY 25MM.jfif": { name: "indeana-heavy-duty-pvc-conduit-pipe-25mm", ext: ".jfif" },
    "indeana-pipe-20mm-medium.jfif": { name: "indeana-medium-duty-pvc-conduit-pipe-20mm", ext: ".jfif" },
    "indeana-pipe-25 mm-medium.webp": { name: "indeana-medium-duty-pvc-conduit-pipe-25mm", ext: ".webp" },
    "indeana-band-25mm.jfif": { name: "indeana-pvc-conduit-bend-band-25mm", ext: ".jfif" },
    "indeana-band-20mm-medium.jpg": { name: "indeana-medium-pvc-conduit-bend-band-20mm", ext: ".jpg" },
    "Indeana PVC Band 25mm Heavy Duty (indeana-band-25mm-heavy).jfif": { name: "indeana-heavy-pvc-conduit-bend-band-25mm", ext: ".jfif" },
    "fan-box-heavy 700 gram.jfif": { name: "ceiling-fan-junction-box-heavy-duty-700g", ext: ".jfif" },
    "concealed-box-heavy.jpg": { name: "concealed-ceiling-junction-box-heavy-duty", ext: ".jpg" },
    "fan-box-medium 500 gram.webp": { name: "ceiling-fan-junction-box-medium-duty-500g", ext: ".webp" },
    "concealed-box-medium. 180 gram.jpg": { name: "concealed-ceiling-junction-box-medium-duty-180g", ext: ".jpg" },
    "flexible-pipe-20mm.jpg": { name: "pvc-flexible-corrugated-conduit-pipe-20mm", ext: ".jpg" },
    "fan-rod-12-inch.webp": { name: "ceiling-fan-downrod-iron-12-inch", ext: ".webp" },
    "tee-cover.jfif": { name: "pvc-conduit-tee-connection-cover", ext: ".jfif" },
    "Ceiling Fan Canopy  Cover (fan-cover).jpg": { name: "ceiling-fan-canopy-replacement-cover", ext: ".jpg" },
    "screw-0.75-inch.jfif": { name: "premium-threaded-mounting-screws-0-75-inch", ext: ".jfif" },
    "screw-1-inch.png": { name: "premium-threaded-mounting-screws-1-inch", ext: ".png" },
    "screw-1.5-inch.webp": { name: "premium-threaded-mounting-screws-1-5-inch", ext: ".webp" },
    "screw-2-inch.webp": { name: "premium-threaded-mounting-screws-2-inch", ext: ".webp" },
    "screw-2.5 inch.jpeg": { name: "premium-threaded-mounting-screws-2-5-inch", ext: ".jpeg" },
    "screw-3.jfif": { name: "premium-threaded-mounting-screws-3-inch", ext: ".jfif" },
    "pvc-saddle 25mm.webp": { name: "pvc-conduit-pipe-saddle-clamp-25mm", ext: ".webp" },
    "padilite steel grip insutlation tape.webp": { name: "steelgrip-pvc-insulation-tape-pidilite", ext: ".webp" },
    "Thermocol-Sheets-For-Roof-Insulation 50mm.webp": { name: "thermocol-sheets-roof-insulation-50mm", ext: ".webp" },
    "masking-tape.webp": { name: "high-adhesion-masking-tape", ext: ".webp" },
    "self drelling screw 1 inch.jpg": { name: "self-drilling-metal-screws-1-inch", ext: ".jpg" },
    "self-drilling-screw 1.5 inch.webp": { name: "self-drilling-metal-screws-1-5-inch", ext: ".webp" },
    "self-drilling-screw-2-inch.jpg": { name: "self-drilling-metal-screws-2-inch", ext: ".jpg" },
    "heatex-5kg.jfif": { name: "heatex-adhesive-seal-bond-compound-5kg", ext: ".jfif" },
    "keel-1x14-spn.jfif": { name: "concrete-nails-keel-1-inch-14-spn", ext: ".jfif" },
    "keel-1-5x14-spn.jfif": { name: "concrete-nails-keel-1-5-inch-14-spn", ext: ".jfif" },
    "wall-fix-bond-50g.webp": { name: "wall-fix-rapid-adhesive-bond-50g", ext: ".webp" },
    "wall-fix-bond-18g.jfif": { name: "wall-fix-rapid-adhesive-bond-18g", ext: ".jfif" },
    "araldite-1-8kg.webp": { name: "araldite-standard-epoxy-adhesive-1-8kg", ext: ".webp" },
    "zypsem-screw-3-4-white.webp": { name: "zypsem-drywall-screws-3-4-inch-white", ext: ".webp" },
    "wood-cutter-blade-5-30-bosch.webp": { name: "bosch-wood-cutter-circular-saw-blade-5-inch-30t", ext: ".webp" },
    "wood-cutter-blade-4-30-bosch.jfif": { name: "bosch-wood-cutter-circular-saw-blade-4-inch-30t", ext: ".jfif" },
    "sattring-keel-1-inch.jfif": { name: "shuttering-concrete-nails-1-inch", ext: ".jfif" },
    "sattring-keel-2-inch.jfif": { name: "shuttering-concrete-nails-2-inch", ext: ".jfif" },
    "sattring-keel-3-inch.jfif": { name: "shuttering-concrete-nails-3-inch", ext: ".jfif" },
    "sattring-keel-4-inch.jfif": { name: "shuttering-concrete-nails-4-inch", ext: ".jfif" }
};

// Mappings for banner images in root to images/gallery/ with SEO names
const bannerMappings = {
    "20798.webp": "fr-frls-house-wiring-cables-wholesale.webp",
    "20859.webp": "electrical-wholesale-distributor-background.webp",
    "20860.webp": "modern-interior-lighting-solutions.webp",
    "20862.webp": "solar-and-electrical-cables-display.webp",
    "20863.webp": "cctv-dvr-camera-security-kit.webp",
    "20864.webp": "mcb-distribution-board-electrical.webp",
    "20865.webp": "led-strip-ceiling-lighting-design.webp",
    "20866.webp": "premium-modular-switch-gold-frame.webp",
    "20867.webp": "premium-modular-electrical-switch.webp",
    "20868.webp": "cctv-security-camera-installation.webp",
    "20869.webp": "mcb-breaker-panel-installation.webp",
    "20870.webp": "pvc-conduit-pipes-fittings.webp"
};

// Scan root directory files
const rootFiles = fs.readdirSync(workspaceDir);
const rootFilesNormalized = {};
rootFiles.forEach(f => {
    rootFilesNormalized[f.toLowerCase().trim()] = f;
});

// Process product images
console.log("--- Processing Product Images (Preserving Formats) ---");
Object.keys(uploadMappings).forEach(srcName => {
    const destInfo = uploadMappings[srcName];
    const srcNorm = srcName.toLowerCase().trim();
    if (rootFilesNormalized[srcNorm]) {
        const actualFilename = rootFilesNormalized[srcNorm];
        const srcPath = path.join(workspaceDir, actualFilename);
        const destFilename = destInfo.name + destInfo.ext;
        const destPath = path.join(productsDir, destFilename);
        
        try {
            console.log(`Copying: ${actualFilename} -> images/products/${destFilename}`);
            fs.copyFileSync(srcPath, destPath);
            fs.unlinkSync(srcPath);
        } catch (e) {
            console.error(`Error processing product image ${actualFilename}:`, e.message);
        }
    } else {
        console.log(`Skipping (not found in root): ${srcName}`);
    }
});

// Process banner images
console.log("\n--- Processing Banner Images ---");
Object.keys(bannerMappings).forEach(srcName => {
    const destName = bannerMappings[srcName];
    const srcNorm = srcName.toLowerCase().trim();
    if (rootFilesNormalized[srcNorm]) {
        const actualFilename = rootFilesNormalized[srcNorm];
        const srcPath = path.join(workspaceDir, actualFilename);
        const destPath = path.join(galleryDir, destName);
        
        try {
            console.log(`Moving Banner: ${actualFilename} -> images/gallery/${destName}`);
            fs.copyFileSync(srcPath, destPath);
            fs.unlinkSync(srcPath);
        } catch (e) {
            console.error(`Error processing banner ${actualFilename}:`, e.message);
        }
    }
});

// Delete duplicate files in root
const duplicatesToDelete = [
    "20798-1.webp", "20859-1.webp", "20860-1.webp", "20861.webp", "20861-1.webp"
];
console.log("\n--- Cleaning Up Unreferenced Duplicates ---");
duplicatesToDelete.forEach(f => {
    const fNorm = f.toLowerCase().trim();
    if (rootFilesNormalized[fNorm]) {
        const actualFilename = rootFilesNormalized[fNorm];
        try {
            console.log(`Deleting duplicate: ${actualFilename}`);
            fs.unlinkSync(path.join(workspaceDir, actualFilename));
        } catch (e) {
            console.error(`Error deleting ${actualFilename}:`, e.message);
        }
    }
});

// Products to delete (those that do not have images)
const productsToRemove = [
    "Socket",
    "Fan box light 500G",
    "KEEL 2*14 SPN",
    "WALL CUTTER BLADE 4 INCH BOSCH",
    "WALL CUTTER BLADE 5 INCH BOSCH",
    "WALL CUTTER BLADE5 INCH BOSCH"
];

function removeCardByName(htmlContent, productName) {
    const escapedName = productName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`<h4\\s+[^>]*>\\s*${escapedName}\\s*</h4>`, 'i');
    const match = regex.exec(htmlContent);
    if (!match) return htmlContent;
    
    const h4Start = match.index;
    const cardStart = htmlContent.lastIndexOf('<div class="prod-static-card"', h4Start);
    if (cardStart === -1) return htmlContent;
    
    let divBalance = 0;
    let pos = cardStart;
    let cardEnd = -1;
    
    while (pos < htmlContent.length) {
        if (htmlContent.substring(pos, pos + 4) === '<div') {
            divBalance++;
            pos += 4;
        } else if (htmlContent.substring(pos, pos + 6) === '</div>') {
            divBalance--;
            pos += 6;
            if (divBalance === 0) {
                cardEnd = pos;
                break;
            }
        } else {
            pos++;
        }
    }
    
    if (cardEnd !== -1) {
        console.log(`Removed HTML product card for: ${productName}`);
        return htmlContent.substring(0, cardStart) + htmlContent.substring(cardEnd);
    }
    return htmlContent;
}

// Update products.html
const productsHtmlPath = path.join(workspaceDir, "products.html");
if (fs.existsSync(productsHtmlPath)) {
    console.log("\n--- Updating products.html ---");
    let htmlContent = fs.readFileSync(productsHtmlPath, 'utf8');

    // Remove the cards of the 5 missing products
    productsToRemove.forEach(prodName => {
        htmlContent = removeCardByName(htmlContent, prodName);
    });

    // Replace old product image paths with new SEO-optimized image paths (pointing to their actual formats)
    Object.keys(uploadMappings).forEach(oldImg => {
        const destInfo = uploadMappings[oldImg];
        const oldBase = oldImg.split('.')[0];
        const oldRef = `images/products/${oldBase}.webp`;
        const newRef = `images/products/${destInfo.name}${destInfo.ext}`;
        
        if (htmlContent.includes(oldRef)) {
            // Replace globally
            htmlContent = htmlContent.split(oldRef).join(newRef);
            console.log(`Updated reference: ${oldRef} -> ${newRef}`);
        }
    });

    // Replace old banner image paths with new SEO-optimized banner paths
    Object.keys(bannerMappings).forEach(oldBanner => {
        const newBanner = bannerMappings[oldBanner];
        htmlContent = htmlContent.split(`"${oldBanner}"`).join(`"images/gallery/${newBanner}"`);
        htmlContent = htmlContent.split(`'${oldBanner}'`).join(`'images/gallery/${newBanner}'`);
    });

    fs.writeFileSync(productsHtmlPath, htmlContent, 'utf8');
    console.log("products.html updated successfully!");
}

// Update index.html
const indexHtmlPath = path.join(workspaceDir, "index.html");
if (fs.existsSync(indexHtmlPath)) {
    console.log("\n--- Updating index.html ---");
    let indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

    Object.keys(bannerMappings).forEach(oldBanner => {
        const newBanner = bannerMappings[oldBanner];
        indexContent = indexContent.split(`"${oldBanner}"`).join(`"images/gallery/${newBanner}"`);
        indexContent = indexContent.split(`'${oldBanner}'`).join(`'images/gallery/${newBanner}'`);
    });

    fs.writeFileSync(indexHtmlPath, indexContent, 'utf8');
    console.log("index.html updated successfully!");
}

// Update build_products_html.js
const jsPath = path.join(workspaceDir, "build_products_html.js");
if (fs.existsSync(jsPath)) {
    console.log("\n--- Updating build_products_html.js ---");
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const jsLines = jsContent.split('\n');

    const newJsLines = [];
    jsLines.forEach(line => {
        let shouldKeep = true;
        productsToRemove.forEach(prod => {
            if (line.includes(`name: '${prod}'`) || line.includes(`name: "${prod}"`)) {
                shouldKeep = false;
                console.log(`Removed product from JS database: ${prod}`);
            }
        });
        
        if (shouldKeep) {
            Object.keys(uploadMappings).forEach(oldImg => {
                const destInfo = uploadMappings[oldImg];
                const oldBase = oldImg.split('.')[0];
                const oldWebpVal = `image: '${oldBase}.webp'`;
                const newWebpVal = `image: '${destInfo.name}${destInfo.ext}'`;
                if (line.includes(oldWebpVal)) {
                    line = line.split(oldWebpVal).join(newWebpVal);
                    console.log(`Updated JS image path: ${oldWebpVal} -> ${newWebpVal}`);
                }
            });
            newJsLines.push(line);
        }
    });

    fs.writeFileSync(jsPath, newJsLines.join('\n'), 'utf8');
    console.log("build_products_html.js updated successfully!");
}

// Update gallery_data.json
const galleryPath = path.join(workspaceDir, "gallery_data.json");
if (fs.existsSync(galleryPath)) {
    console.log("\n--- Updating gallery_data.json ---");
    let galleryContent = fs.readFileSync(galleryPath, 'utf8');

    const galleryReplacements = {
        "images/gallery/20862.jpg": "images/gallery/solar-and-electrical-cables-display.webp",
        "images/gallery/20863.jpg": "images/gallery/cctv-dvr-camera-security-kit.webp"
    };

    Object.keys(galleryReplacements).forEach(oldVal => {
        const newVal = galleryReplacements[oldVal];
        galleryContent = galleryContent.split(oldVal).join(newVal);
    });

    fs.writeFileSync(galleryPath, galleryContent, 'utf8');
    console.log("gallery_data.json updated successfully!");
}

console.log("\n==============================================");
printSuccessMessage();
console.log("==============================================");

function printSuccessMessage() {
    console.log("CATALOG OPTIMIZATION & IMAGE SETUP DONE!");
}
