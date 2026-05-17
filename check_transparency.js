const fs = require('fs');

const file = 'c:\\Users\\aditya tiwari\\Downloads\\ANSHU\\brands\\brand_anim_3.png'; // Havells
const buffer = fs.readFileSync(file);

// PNG format: bytes 24-25 is color type
// 0: grayscale, 2: RGB, 3: indexed, 4: grayscale+alpha, 6: RGBA
const colorType = buffer[25];
console.log(`Havells color type: ${colorType}`);

if (colorType === 6 || colorType === 4) {
    console.log("It has an alpha channel (Transparency)!");
} else {
    console.log("It does NOT have an alpha channel (Solid background).");
}
