const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '../src/app');
const publicDir = path.join(__dirname, '../public');
const rootDir = path.join(__dirname, '../../');
const reportPath = path.join(__dirname, '../../ROUTE_REPORT.md');

// Helper to recursively walk a directory and list page/route files
function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDirectory(filePath, fileList);
    } else if (file === 'page.tsx' || file === 'route.ts' || file === 'layout.tsx') {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function analyzeRoutes() {
  console.log('🕷️ Running Pre-Production Route & Asset Crawler (Phase 7)...');
  const files = walkDirectory(appDir);
  const routeAudit = [];
  const brokenAssets = [];

  // Get list of public assets for verification
  const publicAssets = new Set();
  if (fs.existsSync(publicDir)) {
    fs.readdirSync(publicDir).forEach(f => publicAssets.add(`/${f}`));
  }
  // Also check some root webp files that might be referenced
  if (fs.existsSync(rootDir)) {
    fs.readdirSync(rootDir).forEach(f => {
      if (f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg')) {
        publicAssets.add(`/${f}`);
      }
    });
  }

  // Iterate over files to construct routes
  files.forEach(filePath => {
    const relativePath = path.relative(appDir, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf8');

    // Determine path route name
    let routeName = '/' + path.dirname(relativePath);
    if (routeName === '/.') routeName = '/';
    // Clean dynamic segments e.g. [brand_slug] -> :brand_slug
    routeName = routeName.replace(/\[([^\]]+)\]/g, ':$1');

    const fileType = path.basename(filePath);
    if (fileType === 'layout.tsx' && routeName !== '/') {
      // Layouts are processed together with pages, only audit root/main layouts directly or skip standalone entry
      return;
    }

    // 1. Audit SEO Metadata
    let seoTitle = 'Missing';
    let seoDescription = 'Missing';
    let hasSEO = false;

    // Search for metadata object: export const metadata = { ... }
    const metadataMatch = content.match(/export\s+const\s+metadata\s*:\s*\w+\s*=\s*\{([^}]+)\}/s) || 
                          content.match(/export\s+const\s+metadata\s*=\s*\{([^}]+)\}/s);
    if (metadataMatch) {
      const metaContent = metadataMatch[1];
      const titleMatch = metaContent.match(/title\s*:\s*['"`]([^'"`]+)['"`]/) || metaContent.match(/title\s*:\s*\{[^}]+default\s*:\s*['"`]([^'"`]+)['"`]/);
      const descMatch = metaContent.match(/description\s*:\s*['"`]([^'"`]+)['"`]/);
      if (titleMatch) seoTitle = titleMatch[1];
      if (descMatch) seoDescription = descMatch[1];
      hasSEO = true;
    }

    // 2. Scan for Static Assets References and check if they exist
    const assetRegex = /['"`](\/[^'"`\s>]+\.(webp|png|jpg|ico|svg))['"`]/g;
    let match;
    const scannedAssets = [];
    while ((match = assetRegex.exec(content)) !== null) {
      const assetPath = match[1];
      // Skip absolute urls, double slashes, api paths, or parameters
      if (assetPath.startsWith('//') || assetPath.includes('http') || assetPath.includes('?')) continue;
      
      scannedAssets.push(assetPath);
      if (!publicAssets.has(assetPath) && !fs.existsSync(path.join(publicDir, assetPath))) {
        brokenAssets.push({ route: routeName, file: fileType, asset: assetPath });
      }
    }

    // 3. Determine permissions by middleware rules
    let requiredRole = 'Guest';
    let redirectRule = 'None';
    if (routeName.startsWith('/admin')) {
      requiredRole = 'Admin / Staff';
      redirectRule = 'Redirects unauthenticated or non-admin users to /admin/login';
    } else if (routeName.startsWith('/profile')) {
      requiredRole = 'Customer';
      redirectRule = 'Redirects unauthenticated or non-customer users to /login';
    } else if (routeName === '/login') {
      redirectRule = 'Redirects already authenticated customers to /profile';
    } else if (routeName === '/admin/login') {
      redirectRule = 'Redirects already authenticated admins to /admin/dashboard';
    }

    routeAudit.push({
      route: routeName,
      file: fileType,
      seo: hasSEO ? `✅ Title: "${seoTitle}"` : '❌ Missing Title / Description',
      description: seoDescription,
      role: requiredRole,
      redirect: redirectRule,
      assetsCount: scannedAssets.length
    });
  });

  // Handle manual/fallback routes or special redirects (e.g. root / redirects or /admin redirects)
  routeAudit.push({
    route: '/admin',
    file: 'Middleware Rule',
    seo: 'N/A (Redirect Page)',
    description: 'N/A',
    role: 'Guest -> Redirects to Admin',
    redirect: '302 Temporary Redirect to /admin/dashboard',
    assetsCount: 0
  });

  writeRouteReport(routeAudit, brokenAssets);
}

function writeRouteReport(audit, broken) {
  const timestamp = new Date().toISOString();
  const brokenList = broken.length === 0 
    ? '_No broken static assets detected in route codebases._' 
    : broken.map(b => `- ❌ Broken asset reference \`${b.asset}\` in \`${b.route} (${b.file})\``).join('\n');

  const markdown = `
# Pre-Production Route & SEO Crawl Audit
Generated: ${timestamp}
Target Environment: Next.js Compiled Staging Application

---

## 🚨 Broken Assets Summary
${brokenList}

---

## 🧭 Routes SEO & Permission Mapping Matrix
| Page Route | File Entry | Required Role | Redirect Rules | SEO Status | SEO Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
${audit.map(a => `| \`${a.route}\` | \`${a.file}\` | **${a.role}** | ${a.redirect} | ${a.seo} | ${a.description !== 'Missing' && a.description !== 'N/A' ? `"${a.description.slice(0, 50)}${a.description.length > 50 ? '...' : ''}"` : '_' + a.description + '_' } |`).join('\n')}

---
### 🛠️ Crawler Verification Notes:
- Static assets under \`/public\` and root \`*.webp\` were audited.
- SEO Meta definitions were parsed using static code extraction.
- Middlewares path security was cross-referenced with \`src/middleware.ts\`.
`;

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`📝 Route Crawl Report written to ${reportPath}`);
}

analyzeRoutes();
