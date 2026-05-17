const fs = require('fs');
const path = require('path');

/**
 * Gallery Optimization Script for Anshuman Enterprises
 * 
 * This script:
 * 1. Scans 'Anshuman enterprises' folder for 74+ media assets.
 * 2. Compresses images to WebP format (max 1600px width) for high performance.
 * 3. Copies videos directly to the gallery folder.
 * 4. Generates a structured gallery_data.json file for the website.
 * 
 * Requirements:
 * - Node.js
 * - Run 'npm install sharp' before executing.
 */

// Configuration
const SOURCE_DIR = 'Anshuman enterprises';
const TARGET_DIR = path.join('images', 'gallery');
const JSON_FILE = 'gallery_data.json';

// Categories mapping (optional: refine these as needed)
const categoryKeywords = {
    'CCTV': ['cctv', 'cam', 'dvr', 'nvr', 'surveillance'],
    'Networking': ['net', 'rack', 'wifi', 'router', 'cable', 'cat6'],
    'Security': ['secu', 'lock', 'door', 'bio', 'alarm'],
    'Other': ['logis', 'deli', 'wa_', 'truck', 'site'],
    'Electrical': [] // Default category
};

async function optimize() {
    console.log('--- Starting Gallery Optimization ---');
    
    // Ensure target directory exists
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
        console.log(`Created directory: ${TARGET_DIR}`);
    }

    let sharp;
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error('\nERROR: "sharp" library not found.');
        console.log('Please run: npm install sharp');
        return;
    }

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error(`\nERROR: Source directory "${SOURCE_DIR}" not found.`);
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR);
    const galleryData = [];

    console.log(`Found ${files.length} files in source folder.\n`);

    for (const file of files) {
        const sourcePath = path.join(SOURCE_DIR, file);
        const stats = fs.statSync(sourcePath);
        
        if (stats.isDirectory()) continue;

        const ext = path.extname(file).toLowerCase();
        const isImage = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'].includes(ext);
        const isVideo = ['.mp4', '.mov', '.webm', '.avi'].includes(ext);

        if (!isImage && !isVideo) {
            console.log(`Skipping non-media file: ${file}`);
            continue;
        }

        const targetFile = isImage ? `${path.parse(file).name}.webp` : file;
        const targetPath = path.join(TARGET_DIR, targetFile);

        try {
            if (isImage) {
                process.stdout.write(`Optimizing Image: ${file}... `);
                await sharp(sourcePath)
                    .resize(1600, null, { 
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80, effort: 6 })
                    .toFile(targetPath);
                console.log('DONE');
            } else {
                process.stdout.write(`Copying Video: ${file}... `);
                fs.copyFileSync(sourcePath, targetPath);
                console.log('DONE');
            }

            // Category assignment based on filename
            let category = 'Electrical';
            const lowerFile = file.toLowerCase();
            
            for (const [cat, keywords] of Object.entries(categoryKeywords)) {
                if (keywords.some(kw => lowerFile.includes(kw))) {
                    category = cat;
                    break;
                }
            }

            // Create professional title
            const cleanTitle = path.parse(file).name
                .replace(/[_-]/g, ' ')
                .replace(/\d+/g, '') // Remove numbers
                .trim()
                .replace(/\b\w/g, l => l.toUpperCase()) || 'Project Installation';

            galleryData.push({
                id: `item_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
                category: category,
                title: cleanTitle,
                description: `High-quality ${category.toLowerCase()} installation performed by Anshuman Enterprises.`,
                type: isVideo ? 'video' : 'image',
                data: `images/gallery/${targetFile}`,
                timestamp: stats.mtimeMs // Useful for sorting
            });
        } catch (err) {
            console.error(`\nFAILED to process ${file}: ${err.message}`);
        }
    }

    // Sort by timestamp (newest first)
    galleryData.sort((a, b) => b.timestamp - a.timestamp);
    
    // Remove timestamp from final output to keep it clean
    const finalData = galleryData.map(({timestamp, ...item}) => item);

    fs.writeFileSync(JSON_FILE, JSON.stringify(finalData, null, 2));
    
    console.log('\n--- Optimization Complete ---');
    console.log(`Total processed: ${finalData.length} items`);
    console.log(`Data file updated: ${JSON_FILE}`);
    console.log(`Assets stored in: ${TARGET_DIR}`);
}

optimize().catch(err => console.error('Unhandled error:', err));
