const fs = require('fs');
const path = require('path');

const aboutPath = path.join(__dirname, 'about.html');
const content = fs.readFileSync(aboutPath, 'utf8');

const imgRegex = /<img[^>]+>/g;
const srcRegex = /src="([^"]+)"/;
const altRegex = /alt="([^"]+)"/;
const classRegex = /class="([^"]+)"/;

let match;
while ((match = imgRegex.exec(content)) !== null) {
    const imgTag = match[0];
    const srcMatch = imgTag.match(srcRegex);
    const altMatch = imgTag.match(altRegex);
    const classMatch = imgTag.match(classRegex);
    
    let src = srcMatch ? srcMatch[1] : 'No src';
    let alt = altMatch ? altMatch[1] : 'No alt';
    let className = classMatch ? classMatch[1] : 'No class';
    
    if (src.startsWith('data:image')) {
        src = src.substring(0, 40) + '...[base64]';
    }
    
    console.log(`Class: ${className} | Alt: ${alt} | Src: ${src}`);
}
