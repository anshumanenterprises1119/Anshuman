const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const destDir = path.join('d:\\Downloads\\ANSHU\\images\\brands');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// All logos structured as SVG or PNG
const logos = [
  { key: 'polycab', ext: 'png', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Polycab_India_logo.png' },
  { key: 'havells', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Havells_Logo.svg' },
  { key: 'kei', ext: 'png', url: 'https://www.kei-ind.com/wp-content/themes/kei/images/logo.png', fallback: 'https://asset.brandfetch.com/idw0S9N82V/idtqK8y9aW.png' },
  { key: 'anchor', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Panasonic_logo.svg' },
  { key: 'orient', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Orient_Electric_logo.svg' },
  { key: 'bosch', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch_logo.svg' },
  { key: 'araldite', ext: 'png', url: 'https://www.aralditeadhesives.ca/images/araldite-logo.png', fallback: 'https://asset.brandfetch.com/id3i8lqG1B/id0t7c6uW1.png' },
  { key: 'greatwhite', ext: 'png', url: 'https://greatwhite.life/wp-content/uploads/2020/07/logo.png' },
  { key: 'paras', ext: 'png', url: 'https://parasrod.com/images/logo.png' },
  { key: 'legrand', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Legrand_logo.svg' },
  { key: 'hikvision', ext: 'svg', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Hikvision_logo.svg' },
  { key: 'surya', ext: 'png', url: 'https://asset.brandfetch.com/idKkO1tK5e/id192sK7eC.png' }
];

function download(urlStr, filepath, callback, fallbackUrl) {
  try {
    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://commons.wikimedia.org/'
      }
    };

    client.get(urlStr, options, (res) => {
      // Follow redirect
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, urlStr).toString();
        }
        return download(redirectUrl, filepath, callback, fallbackUrl);
      }

      if (res.statusCode !== 200) {
        console.error(`[ERROR] Failed to fetch: ${urlStr} (Status: ${res.statusCode})`);
        if (fallbackUrl) {
          console.log(`[TRYING FALLBACK] Attempting: ${fallbackUrl}`);
          return download(fallbackUrl, filepath, callback, null);
        }
        return callback(new Error(`Status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[OK] Successfully downloaded: ${path.basename(filepath)}`);
        callback(null);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        callback(err);
      });
    }).on('error', (err) => {
      if (fallbackUrl) {
        console.log(`[TRYING FALLBACK] Connection error, trying: ${fallbackUrl}`);
        return download(fallbackUrl, filepath, callback, null);
      }
      callback(err);
    });
  } catch (err) {
    callback(err);
  }
}

let index = 0;

function next() {
  if (index >= logos.length) {
    console.log("");
    console.log("====================================================");
    console.log("  Brand logo download execution complete!");
    console.log("====================================================");
    return;
  }
  
  const logo = logos[index];
  const filepath = path.join(destDir, `${logo.key}.${logo.ext}`);
  
  console.log(`Downloading ${logo.key} logo...`);
  download(logo.url, filepath, (err) => {
    index++;
    setTimeout(next, 500);
  }, logo.fallback);
}

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - BRAND LOGOS DOWNLOADER v2");
console.log("====================================================");
console.log("");
next();
