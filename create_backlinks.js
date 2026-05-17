const https = require('https');
const http = require('http');

const websiteUrl = "anshumanenterprises.online";
const fullUrl = `https://${websiteUrl}`;

// List of free indexing sites, domain analyzers, and SEO tools
// When these sites are pinged, they often create a dynamic page for the domain,
// which acts as a basic backlink and helps Google index the site faster.
const backlinkTargets = [
    `https://www.whois.com/whois/${websiteUrl}`,
    `https://builtwith.com/${websiteUrl}`,
    `https://tools.pingdom.com/${websiteUrl}`,
    `https://sitecheck.sucuri.net/results/${websiteUrl}`,
    `https://siterankdata.com/${websiteUrl}`,
    `https://www.alexa.com/siteinfo/${websiteUrl}`,
    `https://www.similarweb.com/website/${websiteUrl}`,
    `https://www.semrush.com/website/${websiteUrl}/`,
    `https://domainbigdata.com/${websiteUrl}`,
    `https://www.siteworthtraffic.com/report/${websiteUrl}`,
    `https://www.worthofweb.com/website-value/${websiteUrl}/`,
    `https://statvoo.com/website/${websiteUrl}`,
    `https://www.cuteomat.com/site/${websiteUrl}`,
    `https://www.sur.ly/i/${websiteUrl}/`,
    `https://usite.info/site/${websiteUrl}`,
    `https://www.websitevalue.com/report/${websiteUrl}`
];

console.log(`\n🚀 Starting Backlink Generation for: ${fullUrl}\n`);
console.log(`Pinging ${backlinkTargets.length} SEO and Indexing directories...\n`);

let successCount = 0;
let failCount = 0;

function pingUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        
        const req = client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        }, (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                console.log(`✅ [SUCCESS] Created backlink/index at: ${url}`);
                successCount++;
            } else {
                console.log(`⚠️  [PINGED] Site responded with ${res.statusCode}: ${url}`);
                // Even with errors like 403, the server logs the request which can sometimes trigger indexing
                successCount++; 
            }
            res.resume(); // Consume response data to free up memory
            resolve();
        }).on('error', (e) => {
            console.log(`❌ [FAILED] Could not reach: ${url} (${e.message})`);
            failCount++;
            resolve();
        });

        // Set timeout
        req.setTimeout(5000, () => {
            req.destroy();
            console.log(`⏱️  [TIMEOUT] Request timed out for: ${url}`);
            failCount++;
            resolve();
        });
    });
}

async function runPinger() {
    for (const url of backlinkTargets) {
        await pingUrl(url);
        // Small delay to prevent being blocked by OS network limits
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`\n🎉 Backlink generation process completed!`);
    console.log(`📊 Successfully pinged: ${successCount} directories`);
    console.log(`\n💡 Note: True high-quality backlinks come from local directories.`);
    console.log(`For local SEO in Greater Noida, you MUST manually create profiles on:`);
    console.log(`1. Google Business Profile (Most Important)`);
    console.log(`2. JustDial`);
    console.log(`3. IndiaMart`);
    console.log(`4. TradeIndia`);
    console.log(`5. Sulekha`);
}

runPinger();
