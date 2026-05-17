const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index.html', 'utf8');

const regex = /<a href="[^"]+" class="prod-card">[\s\S]*?<div class="prod-img-wrap"><img[^>]+src="([^"]+)"/g;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
    let src = match[1];
    if (src.startsWith('data:image')) {
        src = 'data:image/...base64... (' + src.length + ' chars)';
    }
    console.log("Card " + i + ": src = " + src);
    i++;
}
