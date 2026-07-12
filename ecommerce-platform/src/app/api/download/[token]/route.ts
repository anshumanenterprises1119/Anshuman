import { NextRequest, NextResponse } from 'next/server';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createClient } from '@supabase/supabase-js';

// Setup admin Supabase instance (Bypassing RLS with Service Role Key for verification)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Cloudflare R2 Client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = params.token;

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  // 1. Fetch token records from database
  const { data: tokenData, error: tokenError } = await supabaseAdmin
    .from('digital_access_tokens')
    .select('*, order_items(product_id)')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    return NextResponse.json({ error: 'Invalid download token' }, { status: 404 });
  }

  // 2. Validate token rules: Expiration & usage
  if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Download token has expired' }, { status: 410 });
  }

  if (tokenData.max_downloads && tokenData.download_count >= tokenData.max_downloads) {
    return NextResponse.json({ error: 'Maximum download limit reached' }, { status: 410 });
  }

  // 3. Retrieve associated asset info
  const productId = tokenData.order_items.product_id;
  const { data: asset, error: assetError } = await supabaseAdmin
    .from('digital_assets')
    .select('file_path, file_name')
    .eq('product_id', productId)
    .single();

  if (assetError || !asset) {
    return NextResponse.json({ error: 'Digital asset not found' }, { status: 404 });
  }

  // 4. Generate Cloudflare R2 Pre-signed URL (Valid for 15 minutes)
  try {
    const bucketName = 'futurewithai-downloads';
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: asset.file_path,
      ResponseContentDisposition: `attachment; filename="${asset.file_name}"`,
    });

    const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });

    // 5. Increment access download counts
    await supabaseAdmin
      .from('digital_access_tokens')
      .update({ download_count: tokenData.download_count + 1 })
      .eq('id', tokenData.id);

    // Redirect to the pre-signed URL to start download securely
    return NextResponse.redirect(presignedUrl);
  } catch (err: any) {
    console.error('Error generating pre-signed URL:', err);
    return NextResponse.json({ error: 'Error generating secure download path' }, { status: 500 });
  }
}
