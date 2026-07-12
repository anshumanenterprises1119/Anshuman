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

async function inspect() {
  console.log('--- Database Schema Audit ---');
  
  // 1. Fetch brands
  const { data: brands, error: bErr } = await supabase.from('brands').select('*');
  console.log('Brands:', bErr ? bErr.message : brands);

  // 2. Fetch profiles columns
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(1);
  console.log('Profiles sample:', pErr ? pErr.message : profiles);

  // 3. Reload schema cache using rpc or standard query if possible
  console.log('Attempting PostgREST schema reload...');
  try {
    const { data, error } = await supabase.rpc('reload_schema_cache');
    console.log('RPC reload schema cache status:', error ? error.message : 'SUCCESS');
  } catch (err) {
    console.log('RPC not defined/failed:', err.message);
  }
}

inspect();
