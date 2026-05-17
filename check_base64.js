const fs = require('fs');
const content = fs.readFileSync('c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\index.html', 'utf8');
const searchStr = 'src="data:image/jpeg;base64,';
const startIndex = content.indexOf(searchStr);
if (startIndex !== -1) {
    const endIndex = content.indexOf('"', startIndex + searchStr.length);
    if (endIndex !== -1) {
        console.log("Base64 string length: " + (endIndex - startIndex));
        console.log("Content after base64: \n" + content.substring(endIndex, endIndex + 500));
    }
}
