import { supabaseAdmin } from '../supabase/admin';
import * as fs from 'fs';
import * as path from 'path';

export interface DiagnosticResult {
  totalProducts: number;
  missingAssets: string[];
  missingSEO: string[];
  brokenRelations: string[];
  passedCount: number;
  timestamp: string;
}

export async function runCatalogDiagnosis(): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    totalProducts: 0,
    missingAssets: [],
    missingSEO: [],
    brokenRelations: [],
    passedCount: 0,
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fetch all brands
    const { data: brands, error: brandErr } = await supabaseAdmin
      .from('brands')
      .select('id, name, slug');
      
    if (brandErr || !brands) {
      throw new Error(`Failed to fetch brands: ${brandErr?.message}`);
    }
    const brandMap = new Map(brands.map(b => [b.id, b]));

    // 2. Fetch all products
    const { data: products, error: prodErr } = await supabaseAdmin
      .from('products')
      .select('id, name, slug, type, brand_id, is_active');
      
    if (prodErr || !products) {
      throw new Error(`Failed to fetch products: ${prodErr?.message}`);
    }

    result.totalProducts = products.length;

    // 3. Loop through active products and validate
    for (const prod of products) {
      // Validate Brand relation
      if (!brandMap.has(prod.brand_id)) {
        result.brokenRelations.push(`Product "${prod.name}" (${prod.id}) has a broken brand_id reference.`);
        continue;
      }

      const brand = brandMap.get(prod.brand_id)!;

      // Check product media (gallery images)
      const { data: media, error: mediaErr } = await supabaseAdmin
        .from('product_media')
        .select('id, url')
        .eq('product_id', prod.id);

      if (mediaErr) {
        console.error(`Error fetching media for ${prod.id}:`, mediaErr);
      }
      
      if (!media || media.length === 0) {
        result.missingAssets.push(`[${brand.slug.toUpperCase()}] Product "${prod.name}" (slug: ${prod.slug}) is missing gallery assets in product_media.`);
      }

      // Check product SEO details
      const { data: seo, error: seoErr } = await supabaseAdmin
        .from('product_seo')
        .select('id, title, description')
        .eq('product_id', prod.id)
        .maybeSingle();

      if (seoErr) {
        console.error(`Error fetching SEO for ${prod.id}:`, seoErr);
      }

      if (!seo) {
        result.missingSEO.push(`[${brand.slug.toUpperCase()}] Product "${prod.name}" (slug: ${prod.slug}) is missing matching product_seo row.`);
      }

      if (media && media.length > 0 && seo) {
        result.passedCount++;
      }
    }
  } catch (err: any) {
    console.error('Diagnosis processing exception:', err);
    result.brokenRelations.push(`Diagnosis process failed with exception: ${err.message}`);
  }

  // Generate the markdown report content
  const reportPath = path.join(process.cwd(), 'DATABASE_DIAGNOSTIC_REPORT.md');
  const reportContent = `
# Real Data Catalog Integrity & Diagnostic Report

Generated: ${result.timestamp}
Target Environment: Production Real Data Mode

## Summary Statistics
- **Total Catalog Products Scanned**: ${result.totalProducts}
- **Fully Compliant Products**: ${result.passedCount}
- **Missing Gallery Assets**: ${result.missingAssets.length}
- **Missing SEO Metadata Rows**: ${result.missingSEO.length}
- **Broken Database Relations**: ${result.brokenRelations.length}

---

## 🚨 Broken Database Relations (${result.brokenRelations.length})
${result.brokenRelations.length === 0 ? '_No broken relations detected._' : result.brokenRelations.map(item => `- ${item}`).join('\n')}

---

## 🖼️ Missing Gallery Assets (${result.missingAssets.length})
${result.missingAssets.length === 0 ? '_All active catalog products have registered gallery assets._' : result.missingAssets.map(item => `- ${item}`).join('\n')}

---

## 🔍 Missing SEO Configurations (${result.missingSEO.length})
${result.missingSEO.length === 0 ? '_All active catalog products have custom SEO meta rows._' : result.missingSEO.map(item => `- ${item}`).join('\n')}

---
_End of diagnostic report._
`;

  try {
    fs.writeFileSync(reportPath, reportContent, 'utf-8');
    console.log(`✅ Integrity report written to ${reportPath}`);
  } catch (writeErr: any) {
    console.error('Failed to write markdown report file:', writeErr);
  }

  return result;
}
