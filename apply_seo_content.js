const fs = require('fs');
const path = require('path');

const dir = __dirname;

function updateSEO(filePath, updates) {
    const fullPath = path.join(dir, filePath);
    if (!fs.existsSync(fullPath)) return;
    
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Update title
    if (updates.title) {
        content = content.replace(/<title>.*?<\/title>/s, `<title>${updates.title}</title>`);
    }
    
    // Update description
    if (updates.description) {
        content = content.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/s, `<meta name="description" content="${updates.description}">`);
    }

    // Custom replacements
    if (updates.replacements) {
        for (const [search, replace] of updates.replacements) {
            content = content.replace(search, replace);
        }
    }

    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`Updated ${filePath}`);
}

// 1. Update index.html
updateSEO('index.html', {
    title: 'Anshuman Enterprises | Best Electrical Supplier & Contractor in Greater Noida',
    description: 'Looking for an electrical shop in Greater Noida? Anshuman Enterprises is the best electrical supplier and commercial electrical contractor offering wholesale products and CCTV installation near you.',
    replacements: [
        [
            /<h1>(.*?)<\/h1>/, 
            '<h1>Best Electrical Supplier in Greater Noida</h1>'
        ],
        [
            /<p class="hero-desc">.*?<\/p>/s,
            `<p class="hero-desc">Your trusted <strong>electrical hardware store near me</strong>. We supply 100% branded electrical components, wires, and lighting at wholesale prices. Need professional help? We are top-rated <strong>commercial electrical contractors</strong> offering expert <a href="cctv-installation.html" style="color:var(--gold-light);text-decoration:underline;">CCTV installation</a> and <a href="services.html" style="color:var(--gold-light);text-decoration:underline;">wiring services</a>.</p>`
        ],
        [
            /<span class="label" style="border-color:var\(--gold\);color:var\(--gold\);">Power & Wiring<\/span>\s*<h2>Electrical Solutions<\/h2>/s,
            `<span class="label" style="border-color:var(--gold);color:var(--gold);">Power & Wiring</span>
        <h2>Commercial Electrical Contractors</h2>`
        ]
    ]
});

// 2. Update services.html
updateSEO('services.html', {
    title: 'Electrical Contracting & CCTV Installation Services in Greater Noida | Anshuman Enterprises',
    description: 'Professional electrical maintenance, LAN networking services, and CCTV installation in Greater Noida. Get expert biometric access control and smart security solutions from Anshuman Enterprises.',
    replacements: [
        [
            /<h1>Our Dedicated Services<\/h1>/,
            '<h1>Professional Electrical & Installation Services</h1>'
        ],
        [
            /<p>Beyond supplying top-quality electrical products, we provide professional installation, repair, and wiring\s*services to complete your projects flawlessly.<\/p>/s,
            `<p>Beyond supplying <a href="products.html" style="color:var(--gold-light);text-decoration:underline;">top-quality electrical products</a>, we provide professional <a href="electrical-contracting.html" style="color:var(--gold-light);text-decoration:underline;">electrical contracting in Greater Noida</a>, including <strong>CCTV installation</strong>, LAN network rack setups, and residential wiring services to complete your projects flawlessly.</p>`
        ],
        [
            /<h3>House Wiring & Rewiring<\/h3>/,
            '<h3><a href="electrical-contracting.html" style="color:inherit;text-decoration:none;">Residential Wiring Services</a></h3>'
        ],
        [
            /<h3>Interior Lights Fitting<\/h3>/,
            '<h3><a href="interior-lighting.html" style="color:inherit;text-decoration:none;">Interior Lighting Fitting</a></h3>'
        ],
        [
            /<h3>MCB & Distribution Board<\/h3>/,
            '<h3><a href="electrical-maintenance.html" style="color:inherit;text-decoration:none;">Distribution Board Installation</a></h3>'
        ],
        [
            /<h3>CCTV Installation<\/h3>/,
            '<h3><a href="cctv-installation.html" style="color:inherit;text-decoration:none;">CCTV Installation in Greater Noida</a></h3>'
        ]
    ]
});

// 3. Update products.html
updateSEO('products.html', {
    title: 'Wholesale Electrical Market in Greater Noida | Buy Electrical Products - Anshuman Enterprises',
    description: 'Anshuman Enterprises is the leading electrical components supplier in Noida. Buy electrical wires wholesale, modular switches, LED lighting, and PVC conduit pipes at the best B2B prices.',
    replacements: [
        [
            /<h1>Premium Electrical Products<\/h1>/,
            '<h1>Wholesale Electrical Market in Greater Noida</h1>'
        ],
        [
            /<p>We supply 100% genuine, branded electrical materials for residential, commercial, and industrial projects.<\/p>/s,
            `<p>As the leading <strong>electrical components supplier in Noida</strong>, we supply 100% genuine, branded electrical materials for residential, commercial, and industrial projects. From <a href="#wires" style="color:var(--gold-light);text-decoration:underline;">buy electrical wires wholesale</a> to <a href="#switches" style="color:var(--gold-light);text-decoration:underline;">modular switches</a>, we provide bulk electrical supply for builders and electricians at wholesale prices. Pair these with our <a href="services.html" style="color:var(--gold-light);text-decoration:underline;">expert installation services</a>.</p>`
        ]
    ]
});
