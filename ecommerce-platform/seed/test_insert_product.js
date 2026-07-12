const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env.local');
let env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      env[match[1]] = value.trim();
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseSecret = env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseSecret);

async function testInsert() {
  const PHYSICAL_BRAND_ID = '7b849219-dd00-4cf5-be4d-da8b7d342504';
  const prod = {
    id: 'p101b1c6-2c5e-4029-9a2e-c1e1bc89a74a',
    brand_id: PHYSICAL_BRAND_ID,
    name: 'Premium COB Ceiling Light 12W',
    slug: 'premium-cob-ceiling-light-12w',
    sku: 'AE-COB-LED-01',
    base_price: 1200,
    type: 'physical',
    is_active: true
  };

  const { data, error } = await supabase.from('products').upsert(prod).select('*');
  if (error) {
    console.error('❌ Insert failed:', error.message);
    console.error('Details:', error);
  } else {
    console.log('✅ Insert success:', data);
  }
}

testInsert();
