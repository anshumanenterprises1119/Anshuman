const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index.html', 'utf8');

const images = [
    '20859.webp',   // Wires
    '20860.webp',   // Switches
    '20862.webp',   // MCB
    '20864.webp',   // Conduit
    '20865.webp',   // Hardware
    'logo.webp'     // Founder
];

let i = 0;
const cleanContent = content.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, (match) => {
    const replacement = 'src="' + (images[i] || 'logo.webp') + '"';
    i++;
    return replacement;
});

fs.writeFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index.html', cleanContent);
console.log("Replaced " + i + " base64 images with webp images in index.html.");
