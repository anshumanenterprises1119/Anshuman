const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'Anshuman enterprises';
const TARGET_DIR = path.join('images', 'gallery');
const JSON_FILE = 'gallery_data.json';

// Create target directory if it doesn't exist
if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
    console.log(`Created directory: ${TARGET_DIR}`);
}

const files = fs.readdirSync(SOURCE_DIR);
const galleryData = [];

files.forEach(file => {
    const sourcePath = path.join(SOURCE_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);
    
    // Copy file
    try {
        fs.copyFileSync(sourcePath, targetPath);
        
        const ext = path.extname(file).toLowerCase();
        const type = (ext === '.mp4' || ext === '.mov') ? 'video' : 'image';
        
        // Simple category heuristic
        let category = 'Other';
        const lowerFile = file.toLowerCase();
        if (lowerFile.includes('elec') || lowerFile.includes('wire') || lowerFile.includes('switch')) category = 'Electrical';
        if (lowerFile.includes('cctv') || lowerFile.includes('cam')) category = 'CCTV';
        if (lowerFile.includes('net') || lowerFile.includes('rack')) category = 'Networking';
        if (lowerFile.includes('sec') || lowerFile.includes('lock')) category = 'Security';

        galleryData.push({
            id: `item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            category: category,
            title: file.split('.')[0].replace(/_/g, ' '),
            description: `Project installation: ${file}`,
            type: type,
            data: `images/gallery/${file}`
        });
    } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
    }
});

fs.writeFileSync(JSON_FILE, JSON.stringify(galleryData, null, 2));
console.log(`Successfully processed ${galleryData.length} items and created ${JSON_FILE}`);
