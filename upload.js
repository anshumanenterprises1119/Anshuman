const https = require('https');
const fs = require('fs');
const path = require('path');

const token = process.env.GITHUB_TOKEN || ''; // Token environment variable se lo
const owner = 'anshumanenterprises1119';
const repo = 'Anshuman';
const branch = 'main'; // try main first, fallback to master if needed

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
    'logo.jpg'
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
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(new Error(`API Error ${res.statusCode}: ${body}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function uploadFiles() {
    try {
        console.log('Fetching repository info...');
        let refData;
        try {
            refData = await apiRequest('GET', `/repos/${owner}/${repo}/git/refs/heads/main`);
        } catch (e) {
            console.log('main branch not found, trying master...');
            refData = await apiRequest('GET', `/repos/${owner}/${repo}/git/refs/heads/master`);
        }
        
        const commitSha = refData.object.sha;
        
        console.log('Fetching commit info...');
        const commitData = await apiRequest('GET', `/repos/${owner}/${repo}/git/commits/${commitSha}`);
        const treeSha = commitData.tree.sha;

        console.log('Creating blobs...');
        const treeItems = [];
        for (const file of filesToUpload) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                console.log(`Skipping ${file} - file not found.`);
                continue;
            }
            
            const content = fs.readFileSync(filePath);
            const contentBase64 = content.toString('base64');
            
            console.log(`Uploading ${file}...`);
            const blobData = await apiRequest('POST', `/repos/${owner}/${repo}/git/blobs`, {
                content: contentBase64,
                encoding: 'base64'
            });
            
            treeItems.push({
                path: file,
                mode: '100644',
                type: 'blob',
                sha: blobData.sha
            });
        }

        console.log('Creating new tree...');
        const newTreeData = await apiRequest('POST', `/repos/${owner}/${repo}/git/trees`, {
            base_tree: treeSha,
            tree: treeItems
        });

        console.log('Creating new commit...');
        const newCommitData = await apiRequest('POST', `/repos/${owner}/${repo}/git/commits`, {
            message: 'Updated Services page, navigation, and mobile responsiveness',
            tree: newTreeData.sha,
            parents: [commitSha]
        });

        console.log('Updating branch reference...');
        const refName = refData.ref.replace('refs/', '');
        await apiRequest('PATCH', `/repos/${owner}/${repo}/git/refs/${refName}`, {
            sha: newCommitData.sha,
            force: true
        });

        console.log('SUCCESS! All files have been uploaded to GitHub.');
    } catch (error) {
        console.error('ERROR during upload:', error.message);
    }
}

uploadFiles();
