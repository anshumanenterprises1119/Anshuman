const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const destDir = path.join('d:\\Downloads\\ANSHU\\images\\brands');

const svgUrls = {
  anchor: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Panasonic_logo.svg',
  orient: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Orient_Electric_logo.svg',
  bosch: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch_logo.svg',
  legrand: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Legrand_logo.svg',
  hikvision: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Hikvision_logo.svg'
};

function download(urlStr, filepath, callback) {
  try {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };

    https.get(urlStr, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, filepath, callback);
      }

      if (res.statusCode !== 200) {
        console.error(`[ERROR] Status ${res.statusCode} for ${urlStr}`);
        return callback(new Error(`Status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[OK] Downloaded SVG: ${path.basename(filepath)}`);
        callback(null);
      });
    }).on('error', (err) => {
      console.error(`[CONN ERROR] ${err.message}`);
      callback(err);
    });
  } catch (err) {
    callback(err);
  }
}

let keys = Object.keys(svgUrls);
let index = 0;

function next() {
  if (index >= keys.length) {
    console.log("SVG downloads completed.");
    return;
  }
  const key = keys[index];
  const url = svgUrls[key];
  const filepath = path.join(destDir, `${key}.svg`);
  
  download(url, filepath, () => {
    index++;
    setTimeout(next, 500);
  });
}

next();
