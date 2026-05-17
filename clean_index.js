const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index.html', 'utf8');
const cleanContent = content.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="placeholder.webp"');
fs.writeFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index_clean.html', cleanContent);
console.log("Cleaned index.html saved as index_clean.html");
