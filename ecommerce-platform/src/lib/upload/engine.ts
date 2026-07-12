import { supabaseAdmin } from '../supabase/admin';

const BRAND_MAX_QUOTA_BYTES = 50 * 1024 * 1024; // 50MB limit per brand

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileSize?: number;
  webpGenerated: boolean;
  compressed: boolean;
  version: number;
  error?: string;
}

/**
 * Upload Engine - Pre-Production Hardened
 */
export class UploadEngine {
  /**
   * Check if brand has enough storage quota left.
   */
  static async checkQuota(brandSlug: string, newFileSize: number): Promise<{ allowed: boolean; usedBytes: number; quotaBytes: number }> {
    const { data, error } = await supabaseAdmin
      .from('upload_logs')
      .select('file_size')
      .eq('brand_slug', brandSlug);

    if (error) {
      console.error('Error fetching brand uploads for quota validation:', error.message);
      return { allowed: true, usedBytes: 0, quotaBytes: BRAND_MAX_QUOTA_BYTES }; // Fallback to allowed on error, log alert
    }

    const totalUsed = (data || []).reduce((sum, item) => sum + Number(item.file_size || 0), 0);
    const allowed = (totalUsed + newFileSize) <= BRAND_MAX_QUOTA_BYTES;
    
    return {
      allowed,
      usedBytes: totalUsed,
      quotaBytes: BRAND_MAX_QUOTA_BYTES
    };
  }

  /**
   * Process and log a secure mock upload, converting to WebP & compressing it.
   */
  static async secureUpload(
    fileName: string,
    fileSize: number,
    mimeType: string,
    brandSlug: string,
    userId?: string
  ): Promise<UploadResult> {
    // 1. Quota Check
    const quotaCheck = await this.checkQuota(brandSlug, fileSize);
    if (!quotaCheck.allowed) {
      return {
        success: false,
        webpGenerated: false,
        compressed: false,
        version: 1,
        error: `Quota exceeded: Brand storage limit of 50MB would be breached. Used: ${(quotaCheck.usedBytes / 1024 / 1024).toFixed(2)}MB.`
      };
    }

    // 2. Simulated WebP and compression
    const isImage = mimeType.startsWith('image/');
    const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    const finalFileName = isImage ? `${baseName}.webp` : fileName;
    const finalMimeType = isImage ? 'image/webp' : mimeType;
    
    // Simulate 40% image file compression
    const finalSize = isImage ? Math.round(fileSize * 0.6) : fileSize;

    // 3. Versioning Check
    let version = 1;
    let urlCandidate = `/uploads/${brandSlug}/${finalFileName}`;
    
    const { data: existing } = await supabaseAdmin
      .from('upload_logs')
      .select('file_url, version')
      .eq('brand_slug', brandSlug)
      .like('file_url', `/uploads/${brandSlug}/${baseName}%`);

    if (existing && existing.length > 0) {
      version = Math.max(...existing.map(e => e.version || 1)) + 1;
      urlCandidate = `/uploads/${brandSlug}/${baseName}_v${version}.${isImage ? 'webp' : mimeType.split('/')[1] || 'bin'}`;
    }

    // 4. Log to upload_logs in DB
    const { error: insertErr } = await supabaseAdmin
      .from('upload_logs')
      .insert({
        file_name: finalFileName,
        file_url: urlCandidate,
        file_size: finalSize,
        mime_type: finalMimeType,
        is_compressed: isImage,
        webp_generated: isImage,
        brand_slug: brandSlug,
        version: version,
        uploaded_by: userId || null
      });

    if (insertErr) {
      return {
        success: false,
        webpGenerated: false,
        compressed: false,
        version: 1,
        error: `Failed to insert upload record: ${insertErr.message}`
      };
    }

    return {
      success: true,
      fileUrl: urlCandidate,
      fileSize: finalSize,
      webpGenerated: isImage,
      compressed: isImage,
      version
    };
  }

  /**
   * Register a file reference to prevent accidental deletion.
   */
  static async registerUsage(
    fileUrl: string,
    refType: 'cms_section' | 'product_detail' | 'brand_logo' | 'category_image',
    refId: string,
    brandSlug: string
  ): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('media_usage')
      .insert({
        file_url: fileUrl,
        reference_type: refType,
        reference_id: refId,
        brand_slug: brandSlug
      });

    if (error) {
      console.error('Failed to register media usage:', error.message);
      return false;
    }
    return true;
  }

  /**
   * Delete protection: block delete if active.
   */
  static async deleteAsset(fileUrl: string, brandSlug: string): Promise<{ success: boolean; error?: string }> {
    // 1. Verify usage active reference
    const { data: usage, error: usageErr } = await supabaseAdmin
      .from('media_usage')
      .select('id, reference_type, reference_id')
      .eq('file_url', fileUrl)
      .eq('brand_slug', brandSlug);

    if (usageErr) {
      return { success: false, error: `Database reference lookup failed: ${usageErr.message}` };
    }

    if (usage && usage.length > 0) {
      const activeRef = usage[0];
      return {
        success: false,
        error: `Delete Protection: Active reference exists in component [${activeRef.reference_type}] (ID: ${activeRef.reference_id}). Remove reference first.`
      };
    }

    // 2. Perform deletion from upload logs
    const { error: delErr } = await supabaseAdmin
      .from('upload_logs')
      .delete()
      .eq('file_url', fileUrl)
      .eq('brand_slug', brandSlug);

    if (delErr) {
      return { success: false, error: `Failed to delete upload logs: ${delErr.message}` };
    }

    return { success: true };
  }
}
