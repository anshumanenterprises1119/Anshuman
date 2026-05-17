const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU';
const files = fs.readdirSync(projectDir).filter(f => f.endsWith('.html'));

let updatedCount = 0;

for (const file of files) {
    const filePath = path.join(projectDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // The trailing spaces or exact unicode sequence might have prevented previous replace
    content = content.replace(/ðŸ¤ /g, '🤝');
    content = content.replace(/ðŸ“ /g, '📍');
    content = content.replace(/✔‰/g, '✉️');
    content = content.replace(/â­ /g, '⭐');
    
    // Just in case there's one without space
    content = content.replace(/ðŸ¤/g, '🤝');
    content = content.replace(/ðŸ“/g, '📍');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed leftover emojis in ${file}`);
        updatedCount++;
    }
}

console.log(`\nSuccessfully fixed remaining emojis across ${updatedCount} pages!`);
