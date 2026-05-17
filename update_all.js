const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.env.GITHUB_TOKEN || ''; // Token environment variable se lo
const owner = 'anshumanenterprises1119';
const repo = 'Anshuman';

// ═══════════════════════════════════════════════════
// FLOATING BUTTONS HTML (WhatsApp + Google Review)
// ═══════════════════════════════════════════════════
const floatingButtons = `
<!-- ═══ FLOATING SOCIAL BUTTONS ═══ -->
<div id="float-panel" style="position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:10px;">

  <!-- Google Review Button -->
  <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank" title="Rate us on Google"
    style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#333;padding:10px 16px;border-radius:50px;
    font-size:13px;font-weight:600;text-decoration:none;box-shadow:0 4px 20px rgba(0,0,0,0.15);
    border:1px solid #e0e0e0;transition:all 0.3s;animation:floatIn 0.5s ease 0.6s both;">
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
    ⭐ Review Us
  </a>

  <!-- WhatsApp Button -->
  <a href="https://wa.me/917065815743?text=Hello%20Anshuman%20Enterprises" target="_blank" title="Chat on WhatsApp"
    style="display:inline-flex;align-items:center;justify-content:center;background:#25D366;color:#fff;
    width:58px;height:58px;border-radius:50%;font-size:26px;text-decoration:none;
    box-shadow:0 4px 20px rgba(37,211,102,0.5);transition:all 0.3s;animation:floatIn 0.5s ease 0.8s both;">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.062.525 4.003 1.447 5.694L0 24l6.47-1.428A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.6 9.6 0 01-4.895-1.347l-.351-.209-3.641.803.818-3.535-.229-.362A9.553 9.553 0 012.4 12C2.4 6.703 6.703 2.4 12 2.4S21.6 6.703 21.6 12 17.297 21.6 12 21.6z"/></svg>
  </a>
</div>
<style>
@keyframes floatIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
#float-panel a:hover { transform:translateY(-3px) scale(1.05); }
</style>
`;

// ═══════════════════════════════════════════════════
// SOCIAL MEDIA FOOTER BLOCK
// ═══════════════════════════════════════════════════
const socialBlock = `<div style="margin-top:16px;display:flex;gap:8px;">
          <a href="https://wa.me/917065815743"
            style="display:inline-flex;align-items:center;gap:5px;background:#25D366;color:#fff;padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">💬
            WhatsApp</a>
          <a href="tel:+917065815743"
            style="display:inline-flex;align-items:center;gap:5px;background:var(--gold);color:var(--maroon-dark);padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📞
            Call</a>
        </div>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="https://www.instagram.com/about.aaditya" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📸
            Instagram</a>
          <a href="https://youtube.com/@anshumanenterprises1119?si=NFaFo_glKpbk2WKX?sub_confirmation=1" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#FF0000;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">▶
            YouTube</a>
          <a href="https://www.linkedin.com/in/aditya-tiwari-18a1a2371?" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#0077B5;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">💼
            LinkedIn</a>
          <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#4285F4;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">⭐
            Review Us</a>
        </div>`;

const files = ['index.html', 'about.html', 'products.html', 'services.html', 'contact.html'];
const dir = __dirname;

files.forEach(f => {
  let filepath = path.join(dir, f);
  if (!fs.existsSync(filepath)) return;

  let content = fs.readFileSync(filepath, 'utf8');

  // 1. Replace logo.jpg references → logo.jpeg
  content = content.replace(/src="logo\.jpg"/g, 'src="logo.jpeg"');
  content = content.replace(/src='logo\.jpg'/g, "src='logo.jpeg'");

  // 2. Fix the logo img tag style for consistency
  content = content.replace(
    /<img src="logo\.jpeg"[^>]*>/g,
    `<img src="logo.jpeg" alt="Anshuman Enterprises" style="height:48px;width:auto;max-width:180px;object-fit:contain;border-radius:8px;background:transparent;">`
  );
  // Also fix footer logo (bigger)
  content = content.replace(
    /<img src="logo\.jpeg" alt="Anshuman Enterprises" style="height:48px[^"]*">/,
    `<img src="logo.jpeg" alt="Anshuman Enterprises" style="height:56px;width:auto;max-width:220px;object-fit:contain;border-radius:8px;background:transparent;">`
  );

  // 3. Ensure social block is present in footer (if not already)
  if (!content.includes('Review Us</a>')) {
    content = content.replace(
      /<a href="tel:\+917065815743"\s*style="display:inline-flex[^"]*">📞[^<]*<\/a>\s*<\/div>\s*<\/div>/,
      `<a href="tel:+917065815743"
            style="display:inline-flex;align-items:center;gap:5px;background:var(--gold);color:var(--maroon-dark);padding:7px 14px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📞
            Call</a>
        </div>
        <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
          <a href="https://www.instagram.com/about.aaditya" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">📸
            Instagram</a>
          <a href="https://youtube.com/@anshumanenterprises1119?si=NFaFo_glKpbk2WKX?sub_confirmation=1" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#FF0000;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">▶
            YouTube</a>
          <a href="https://www.linkedin.com/in/aditya-tiwari-18a1a2371?" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#0077B5;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">💼
            LinkedIn</a>
          <a href="https://g.page/r/CdZ99l9ezVvlEBE/review" target="_blank"
            style="display:inline-flex;align-items:center;gap:5px;background:#4285F4;color:#fff;padding:7px 12px;border-radius:50px;font-size:12px;font-weight:600;text-decoration:none;">⭐
            Review Us</a>
        </div>`
    );
  }

  // 4. Add floating buttons before </body> if not already present
  if (!content.includes('float-panel')) {
    content = content.replace('</body>', floatingButtons + '\n</body>');
  }

  fs.writeFileSync(filepath, content);
  console.log('Updated: ' + f);
});

console.log('\nAll HTML files updated. Now uploading to GitHub...');

// ═══════════════════════════════════════════════════
// GITHUB UPLOAD
// ═══════════════════════════════════════════════════
const filesToUpload = [
  'index.html',
  'about.html',
  'products.html',
  'services.html',
  'contact.html',
  'images/cctv_bg.png',
  'images/electrical_bg.png',
  'images/network_bg.png',
  'images/security_bg.png',
  'logo.jpeg'
];

function apiRequest(method, endpoint, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'NodeJS-Script',
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(body));
          else reject(new Error(`API ${res.statusCode}: ${body.substring(0,300)}`));
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function uploadFiles() {
  try {
    let refData;
    try { refData = await apiRequest('GET', `/repos/${owner}/${repo}/git/refs/heads/main`); }
    catch (e) { refData = await apiRequest('GET', `/repos/${owner}/${repo}/git/refs/heads/master`); }

    const commitSha = refData.object.sha;
    const commitData = await apiRequest('GET', `/repos/${owner}/${repo}/git/commits/${commitSha}`);
    const treeSha = commitData.tree.sha;

    const treeItems = [];
    for (const file of filesToUpload) {
      const filePath = path.join(dir, file);
      if (!fs.existsSync(filePath)) { console.log(`Skipping ${file} - not found`); continue; }
      const content = fs.readFileSync(filePath);
      console.log(`Uploading ${file}...`);
      const blobData = await apiRequest('POST', `/repos/${owner}/${repo}/git/blobs`, {
        content: content.toString('base64'),
        encoding: 'base64'
      });
      treeItems.push({ path: file, mode: '100644', type: 'blob', sha: blobData.sha });
    }

    const newTreeData = await apiRequest('POST', `/repos/${owner}/${repo}/git/trees`, { base_tree: treeSha, tree: treeItems });
    const newCommitData = await apiRequest('POST', `/repos/${owner}/${repo}/git/commits`, {
      message: 'Add logo.jpeg, WhatsApp+Google Review floating buttons, social media links on all pages',
      tree: newTreeData.sha,
      parents: [commitSha]
    });
    const refName = refData.ref.replace('refs/', '');
    await apiRequest('PATCH', `/repos/${owner}/${repo}/git/refs/${refName}`, { sha: newCommitData.sha, force: true });
    console.log('\n✅ SUCCESS! All files uploaded to GitHub.');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

uploadFiles();
