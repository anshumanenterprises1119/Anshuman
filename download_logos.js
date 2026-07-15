const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

const destDir = path.join('d:\\Downloads\\ANSHU\\images\\brands');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const logoUrls = {
  polycab: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Polycab_India_logo.png',
  havells: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Havells_Logo.svg/512px-Havells_Logo.svg.png',
  kei: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/20-09-41-logo.png',
  anchor: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Panasonic_logo.svg/512px-Panasonic_logo.svg.png',
  orient: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Orient_Electric_logo.svg/512px-Orient_Electric_logo.svg.png',
  bosch: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Bosch_logo.svg/512px-Bosch_logo.svg.png',
  araldite: 'https://logodownload.org/wp-content/uploads/2020/09/araldite-logo.png',
  greatwhite: 'https://greatwhite.life/wp-content/themes/greatwhite/assets/img/logo.png',
  paras: 'https://parasrod.com/assets/images/logo.png',
  legrand: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Legrand_logo.svg/512px-Legrand_logo.svg.png',
  hikvision: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hikvision_logo.svg/512px-Hikvision_logo.svg.png',
  surya: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Surya-brand.png'
};

const fallbacks = {
  araldite: 'https://www.huntsman.com/PublishingImages/Brands/Araldite_Logo.png',
  greatwhite: 'https://greatwhite.life/wp-content/uploads/2020/07/logo.png',
  paras: 'https://parasrod.com/images/logo.png',
  surya: 'https://logonoid.com/images/surya-logo.png'
};

function download(urlStr, filepath, callback, fallbackUrl) {
  try {
    const parsedUrl = new URL(urlStr);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    client.get(urlStr, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, urlStr).toString();
        }
        return download(redirectUrl, filepath, callback, fallbackUrl);
      }

      if (res.statusCode !== 200) {
        console.error(`[ERROR] Failed: ${urlStr} (${res.statusCode})`);
        if (fallbackUrl) {
          console.log(`[TRYING FALLBACK] ${fallbackUrl}`);
          return download(fallbackUrl, filepath, callback, null);
        }
        return callback(new Error(`Status ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(filepath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[OK] Downloaded: ${path.basename(filepath)}`);
        callback(null);
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {});
        callback(err);
      });
    }).on('error', (err) => {
      if (fallbackUrl) {
        console.log(`[TRYING FALLBACK] ${fallbackUrl}`);
        return download(fallbackUrl, filepath, callback, null);
      }
      callback(err);
    });
  } catch (err) {
    callback(err);
  }
}

let keys = Object.keys(logoUrls);
let index = 0;

function next() {
  if (index >= keys.length) {
    console.log("");
    console.log("====================================================");
    console.log("  All downloads completed successfully!");
    console.log("====================================================");
    return;
  }
  
  const key = keys[index];
  const url = logoUrls[key];
  const fallback = fallbacks[key] || null;
  const filepath = path.join(destDir, `${key}.png`);
  
  console.log(`Downloading ${key} logo...`);
  download(url, filepath, (err) => {
    index++;
    setTimeout(next, 500);
  }, fallback);
}

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - BRAND LOGOS DOWNLOADER");
console.log("====================================================");
console.log("");
next();
