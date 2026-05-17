const fs = require('fs');
const file = 'c:\\Users\\aditya tiwari\\Downloads\\index.html';
const lines = fs.readFileSync(file, 'utf8').split('\n');
console.log('Total lines:', lines.length);
console.log('Line 893 length:', lines[892].length);

// Replace line 893 with clean img tag  
lines[892] = '        <img src="logo.webp" alt="Anshuman Enterprises Logo" style="height:48px;width:auto;">\r';

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('File fixed!');

const newLines = fs.readFileSync(file, 'utf8').split('\n');
console.log('New total lines:', newLines.length);
console.log('New line 893:', newLines[892]);
