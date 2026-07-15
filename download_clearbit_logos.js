const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const destDir = path.join('d:\\Downloads\\ANSHU\\images\\brands');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of local filenames to their respective corporate domain names for Clearbit API
const brandDomains = {
  polycab: 'polycab.com',
  havells: 'havells.com',
  kei: 'kei-ind.com',
  anchor: 'panasonic.com',
  orient: 'orientelectric.com',
  bosch: 'bosch.com',
  araldite: 'aralditeadhesives.ca',
  greatwhite: 'greatwhite.life',
  paras: 'parasrod.com',
  legrand: 'legrand.com',
  hikvision: 'hikvision.com',
  surya: 'surya.co.in'
};

function download(domain, filepath, callback) {
  try {
    // Clearbit Logo API serves transparent PNG logos for any domain
    const urlStr = `https://logo.clearbit.com/${domain}?size=256`;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(urlStr, options, (res) => {
      if (res.statusCode !== 200) {
        console.error(`[ERROR] Failed to fetch logo for ${domain} (Status: ${res.statusCode})`);
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
      console.error(`[CONN ERROR] ${err.message}`);
      callback(err);
    });
  } catch (err) {
    callback(err);
  }
}

let keys = Object.keys(brandDomains);
let index = 0;

function next() {
  if (index >= keys.length) {
    console.log("");
    console.log("====================================================");
    console.log("  Clearbit brand logo downloads completed!");
    console.log("====================================================");
    return;
  }
  
  const key = keys[index];
  const domain = brandDomains[key];
  const filepath = path.join(destDir, `${key}.png`);
  
  console.log(`Downloading ${key} logo via Clearbit (${domain})...`);
  download(domain, filepath, (err) => {
    index++;
    // Brief timeout to respect rate-limiting
    setTimeout(next, 300);
  });
}

console.log("====================================================");
console.log("  ANSHUMAN ENTERPRISES - CLEARBIT LOGO DOWNLOADER");
console.log("====================================================");
console.log("");
next();
