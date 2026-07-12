const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local for database credentials
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

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseSecret = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseSecret) {
  console.error('❌ Database credentials not found. Verify .env.local contains NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseSecret, {
  auth: { persistSession: false }
});

async function runSeeder() {
  console.log('🚀 Starting Pre-Production Database Seeding (Phase 7)...');
  const reportData = {
    customers: [],
    products: [],
    orders: [],
    coupons: [],
    reviewsCount: 0,
    wishlistCount: 0,
    notificationsCount: 0,
    warnings: [],
    timestamp: new Date().toISOString()
  };

  try {
    // 1. Fetch real brands dynamically to prevent foreign key errors
    console.log('🔍 Querying active brands from database...');
    const { data: dbBrands, error: brandsErr } = await supabase.from('brands').select('id, slug');
    if (brandsErr || !dbBrands || dbBrands.length === 0) {
      throw new Error(`Brands table not populated: ${brandsErr ? brandsErr.message : 'No rows found'}`);
    }

    const brandMap = {};
    dbBrands.forEach(b => {
      brandMap[b.slug] = b.id;
    });

    const PHYSICAL_BRAND_ID = brandMap['anshuman-enterprises'];
    const DIGITAL_BRAND_ID = brandMap['futurewithai'];

    if (!PHYSICAL_BRAND_ID || !DIGITAL_BRAND_ID) {
      throw new Error('Could not find both anshuman-enterprises and futurewithai brands in database.');
    }

    console.log(`✅ Loaded Brand IDs. Anshuman: ${PHYSICAL_BRAND_ID}, FutureWithAI: ${DIGITAL_BRAND_ID}`);

    // 2. Purge existing seed data to start fresh and avoid unique collisions
    console.log('🧹 Purging prior seed customer accounts and related database cascades...');
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;

    const seedUsers = (users || []).filter(u => u.email.startsWith('seed_customer_'));
    for (const u of seedUsers) {
      await supabase.auth.admin.deleteUser(u.id);
    }
    console.log(`Deleted ${seedUsers.length} old seeded customer auth credentials.`);

    // Clear remaining coupons starting with SEED
    await supabase.from('coupons').delete().like('code', 'SEED-%');

    // Clean up existing seed orders and their dependent tables
    console.log('🧹 Purging prior seed orders and associated items/logs...');
    const { data: oldOrders } = await supabase.from('orders').select('id').like('order_number', 'SEED-ORD-%');
    if (oldOrders && oldOrders.length > 0) {
      const oldOrderIds = oldOrders.map(o => o.id);
      
      // Delete from order_events
      await supabase.from('order_events').delete().in('order_id', oldOrderIds);
      
      // Delete from order_tracking
      await supabase.from('order_tracking').delete().in('order_id', oldOrderIds);

      // Delete from purchase_access
      await supabase.from('purchase_access').delete().in('order_id', oldOrderIds);

      // Get order items to clean up tokens
      const { data: oldItems } = await supabase.from('order_items').select('id').in('order_id', oldOrderIds);
      if (oldItems && oldItems.length > 0) {
        const oldItemIds = oldItems.map(i => i.id);
        await supabase.from('digital_access_tokens').delete().in('order_item_id', oldItemIds);
      }

      // Delete from order_items
      await supabase.from('order_items').delete().in('order_id', oldOrderIds);

      // Finally delete the orders
      await supabase.from('orders').delete().in('id', oldOrderIds);
      console.log(`Deleted ${oldOrderIds.length} old seeded order histories.`);
    }

    // 3. Seed Categories
    console.log('📦 Seeding active categories...');
    const categories = [
      { id: 'c101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Modular Switches', slug: 'modular-switches' },
      { id: 'c102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Wires & Cables', slug: 'wires-cables' },
      { id: 'c103b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'LED Lighting', slug: 'led-lighting' },
      { id: 'c104b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'CCTV & Security', slug: 'cctv-security' },
      { id: 'c105b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Conduit & Hardware', slug: 'conduit-hardware' },
      { id: 'c201a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', brand_id: DIGITAL_BRAND_ID, name: 'n8n Automation', slug: 'n8n-automation' },
      { id: 'c202a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', brand_id: DIGITAL_BRAND_ID, name: 'PHP scripts', slug: 'php-scripts' },
      { id: 'c203a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', brand_id: DIGITAL_BRAND_ID, name: 'SaaS Boilerplates', slug: 'saas-boilerplates' },
      { id: 'c204a1b0-9c2f-4b1a-8e2b-f3b184cc89e8', brand_id: DIGITAL_BRAND_ID, name: 'Prompt Blueprints', slug: 'prompt-blueprints' }
    ];
    for (const cat of categories) {
      await supabase.from('categories').upsert(cat);
    }

    // 4. Seed 20 Products (10 Physical, 10 Digital)
    console.log('🛍️ Seeding 20 realistic products (physical & digital)...');
    const productsData = [
      // Physical Products (Anshuman Enterprises) - replaced initial 'p' with 'e' (hex valid)
      { id: 'e101b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Premium COB Ceiling Light 12W', slug: 'premium-cob-ceiling-light-12w', sku: 'AE-COB-LED-01', base_price: 1200, type: 'physical', is_active: true },
      { id: 'e102b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Polycab FR House Wire 1.5 sq mm', slug: 'polycab-fr-house-wire-1.5-sq-mm', sku: 'AE-POL-FR-15', base_price: 1800, type: 'physical', is_active: true },
      { id: 'e103b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'KEI FRLS House Wire 2.5 sq mm', slug: 'kei-frls-house-wire-2.5-sq-mm', sku: 'AE-KEI-FRLS-25', base_price: 2800, type: 'physical', is_active: true },
      { id: 'e104b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Havells Crabtree Modular Switch (Graphite)', slug: 'havells-crabtree-modular-switch-graphite', sku: 'AE-HAV-CS-06', base_price: 120, type: 'physical', is_active: true },
      { id: 'e105b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Legrand Myrius 6A 2-Way Switch', slug: 'legrand-myrius-6a-2-way-switch', sku: 'AE-LEG-MY-2W', base_price: 150, type: 'physical', is_active: true },
      { id: 'e106b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Orient LED Batten Lamp 20W', slug: 'orient-led-batten-lamp-20w', sku: 'AE-ORI-BAT-20', base_price: 350, type: 'physical', is_active: true },
      { id: 'e107b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'CP Plus HD Dome Camera 2MP', slug: 'cp-plus-dome-camera-2mp', sku: 'AE-CPP-DOM-02', base_price: 1850, type: 'physical', is_active: true },
      { id: 'e108b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Schneider Acti9 16A SP MCB', slug: 'schneider-acti9-16a-sp-mcb', sku: 'AE-SCH-MCB-16', base_price: 450, type: 'physical', is_active: true },
      { id: 'e109b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'PVC Conduit Pipe 25mm (Medium)', slug: 'pvc-conduit-pipe-25mm-medium', sku: 'AE-PVC-CON-25', base_price: 60, type: 'physical', is_active: true },
      { id: 'e110b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'Fingerprint Smart Door Lock (CONA)', slug: 'fingerprint-smart-door-lock-cona', sku: 'AE-CON-SDL-01', base_price: 12500, type: 'physical', is_active: true },

      // Additional Physical Products (Anshuman Enterprises)
      { id: 'e111b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA PIPE HEAVY 25MM', slug: 'indeana-pipe-heavy-25mm', sku: 'AE-IND-HW-25', base_price: 90, type: 'physical', is_active: true },
      { id: 'e112b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA PIPE 20MM MEDIUM', slug: 'indeana-pipe-20mm-medium', sku: 'AE-IND-MW-20', base_price: 70, type: 'physical', is_active: true },
      { id: 'e113b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA PIPE 25MM MEDIUM', slug: 'indeana-pipe-25mm-medium', sku: 'AE-IND-MW-25', base_price: 80, type: 'physical', is_active: true },
      { id: 'e114b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA BAND 25MM', slug: 'indeana-band-25mm', sku: 'AE-IND-B-25', base_price: 15, type: 'physical', is_active: true },
      { id: 'e115b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA BAND 20MM MEDIUM', slug: 'indeana-band-20mm-medium', sku: 'AE-IND-BM-20', base_price: 12, type: 'physical', is_active: true },
      { id: 'e116b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'INDEANA BAND 25MM HEAVY', slug: 'indeana-band-25mm-heavy', sku: 'AE-IND-BH-25', base_price: 18, type: 'physical', is_active: true },
      { id: 'e117b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'ORIENT BATTEN LIGHT 2 FEET 20W', slug: 'orient-batten-light-2-feet-20w', sku: 'AE-ORI-BL-220', base_price: 250, type: 'physical', is_active: true },
      { id: 'e118b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'ORIENT BATTEN LIGHT 4 FEET 20W', slug: 'orient-batten-light-4-feet-20w', sku: 'AE-ORI-BL-420', base_price: 350, type: 'physical', is_active: true },
      { id: 'e119b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'ORIENT BATTEN LIGHT 2 FEET 10W', slug: 'orient-batten-light-2-feet-10w', sku: 'AE-ORI-BL-210', base_price: 180, type: 'physical', is_active: true },
      { id: 'e120b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '3 MODULAR BOX', slug: '3-modular-box', sku: 'AE-MB-3', base_price: 45, type: 'physical', is_active: true },
      { id: 'e121b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '2 MODULAR BOX', slug: '2-modular-box', sku: 'AE-MB-2', base_price: 35, type: 'physical', is_active: true },
      { id: 'e122b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '4 MODULAR BOX', slug: '4-modular-box', sku: 'AE-MB-4', base_price: 55, type: 'physical', is_active: true },
      { id: 'e123b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '6 MODULAR BOX', slug: '6-modular-box', sku: 'AE-MB-6', base_price: 75, type: 'physical', is_active: true },
      { id: 'e124b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '8 MODULAR BOX SQUARE', slug: '8-modular-box-square', sku: 'AE-MB-8S', base_price: 95, type: 'physical', is_active: true },
      { id: 'e125b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '8 MODULAR BOX', slug: '8-modular-box', sku: 'AE-MB-8', base_price: 95, type: 'physical', is_active: true },
      { id: 'e126b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: '12 MODULAR BOX', slug: '12-modular-box', sku: 'AE-MB-12', base_price: 140, type: 'physical', is_active: true },
      { id: 'e127b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FAN BOX HEAVY', slug: 'fan-box-heavy', sku: 'AE-FB-H', base_price: 80, type: 'physical', is_active: true },
      { id: 'e128b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'CONCIELD BOX HEAVY', slug: 'concield-box-heavy', sku: 'AE-CB-H', base_price: 60, type: 'physical', is_active: true },
      { id: 'e129b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FAN BOX MEDIUM', slug: 'fan-box-medium', sku: 'AE-FB-M', base_price: 60, type: 'physical', is_active: true },
      { id: 'e130b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'CONCIELD MEDIUM', slug: 'concield-medium', sku: 'AE-CB-M', base_price: 45, type: 'physical', is_active: true },
      { id: 'e131b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FLEXIBLE PIPE 20MM', slug: 'flexible-pipe-20mm', sku: 'AE-FP-20', base_price: 150, type: 'physical', is_active: true },
      { id: 'e132b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW .75 INCH', slug: 'screw-0-75-inch', sku: 'AE-SCR-075', base_price: 100, type: 'physical', is_active: true },
      { id: 'e133b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW 1 INCH', slug: 'screw-1-inch', sku: 'AE-SCR-100', base_price: 120, type: 'physical', is_active: true },
      { id: 'e134b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW 1.5 INCH', slug: 'screw-1-5-inch', sku: 'AE-SCR-150', base_price: 150, type: 'physical', is_active: true },
      { id: 'e135b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW 2 INCH', slug: 'screw-2-inch', sku: 'AE-SCR-200', base_price: 180, type: 'physical', is_active: true },
      { id: 'e136b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW 2.5 INCH', slug: 'screw-2-5-inch', sku: 'AE-SCR-250', base_price: 220, type: 'physical', is_active: true },
      { id: 'e137b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SCREW 3 INCH', slug: 'screw-3-inch', sku: 'AE-SCR-300', base_price: 260, type: 'physical', is_active: true },
      { id: 'e138b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'PVC SADDLE', slug: 'pvc-saddle', sku: 'AE-SAD-PVC', base_price: 50, type: 'physical', is_active: true },
      { id: 'e139b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FAN ROD 12 INCH', slug: 'fan-rod-12-inch', sku: 'AE-ROD-12', base_price: 90, type: 'physical', is_active: true },
      { id: 'e140b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'TEE COVER', slug: 'tee-cover', sku: 'AE-TEE-COV', base_price: 10, type: 'physical', is_active: true },
      { id: 'e141b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FAN COVER', slug: 'fan-cover', sku: 'AE-FAN-COV', base_price: 20, type: 'physical', is_active: true },
      { id: 'e142b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'STEELGRIP INSULATION TAPE', slug: 'steelgrip-insulation-tape', sku: 'AE-SG-TAPE', base_price: 15, type: 'physical', is_active: true },
      { id: 'e143b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'THERMOCOL', slug: 'thermocol', sku: 'AE-THERMO', base_price: 30, type: 'physical', is_active: true },
      { id: 'e144b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SOCKET', slug: 'socket', sku: 'AE-SOCK', base_price: 60, type: 'physical', is_active: true },
      { id: 'e145b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'FAN BOX LIGHT 500G', slug: 'fan-box-light-500g', sku: 'AE-FB-L500', base_price: 40, type: 'physical', is_active: true },
      { id: 'e146b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'MASKING TAPE', slug: 'masking-tape', sku: 'AE-MASK-TAPE', base_price: 45, type: 'physical', is_active: true },
      { id: 'e147b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SELF DRILLING SCREW 1 INCH', slug: 'self-drilling-screw-1-inch', sku: 'AE-SDS-100', base_price: 180, type: 'physical', is_active: true },
      { id: 'e148b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SELF DRILLING SCREW 1.5 INCH', slug: 'self-drilling-screw-1-5-inch', sku: 'AE-SDS-150', base_price: 220, type: 'physical', is_active: true },
      { id: 'e149b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SELF DRILLING SCREW 2 INCH', slug: 'self-drilling-screw-2-inch', sku: 'AE-SDS-200', base_price: 260, type: 'physical', is_active: true },
      { id: 'e150b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'HEATEX 5 KG', slug: 'heatex-5-kg', sku: 'AE-HEAT-5K', base_price: 450, type: 'physical', is_active: true },
      { id: 'e151b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'KEEL 1*14 SPN', slug: 'keel-1-14-spn', sku: 'AE-KL-114', base_price: 80, type: 'physical', is_active: true },
      { id: 'e152b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'KEEL 1.5*14 SPN', slug: 'keel-1-5-14-spn', sku: 'AE-KL-1514', base_price: 110, type: 'physical', is_active: true },
      { id: 'e153b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'KEEL 2*14 SPN', slug: 'keel-2-14-spn', sku: 'AE-KL-214', base_price: 140, type: 'physical', is_active: true },
      { id: 'e154b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WALL FIX BOND 50G', slug: 'wall-fix-bond-50g', sku: 'AE-WFB-50', base_price: 90, type: 'physical', is_active: true },
      { id: 'e155b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WALL FIX BOND 18G', slug: 'wall-fix-bond-18g', sku: 'AE-WFB-18', base_price: 40, type: 'physical', is_active: true },
      { id: 'e156b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'ARALDITE 1.8KG', slug: 'araldite-1-8kg', sku: 'AE-ARAL-18', base_price: 1450, type: 'physical', is_active: true },
      { id: 'e157b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'ZYPSEM SCREW 3/4 WHITE', slug: 'zypsem-screw-3-4-white', sku: 'AE-ZYP-34', base_price: 110, type: 'physical', is_active: true },
      { id: 'e158b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WOOD CUTTER BLADE 5/30 BOSCH', slug: 'wood-cutter-blade-5-30-bosch', sku: 'AE-WCB-530', base_price: 280, type: 'physical', is_active: true },
      { id: 'e159b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WOOD CUTTER BLADE 4/30 BOSCH', slug: 'wood-cutter-blade-4-30-bosch', sku: 'AE-WCB-430', base_price: 220, type: 'physical', is_active: true },
      { id: 'e160b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WALL CUTTER BLADE 4 INCH BOSCH', slug: 'wall-cutter-blade-4-inch-bosch', sku: 'AE-WLC-400', base_price: 320, type: 'physical', is_active: true },
      { id: 'e161b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'WALL CUTTER BLADE 5 INCH BOSCH', slug: 'wall-cutter-blade-5-inch-bosch', sku: 'AE-WLC-500', base_price: 450, type: 'physical', is_active: true },
      { id: 'e162b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SATTRING KEEL 1 INCH', slug: 'sattring-keel-1-inch', sku: 'AE-STK-1', base_price: 120, type: 'physical', is_active: true },
      { id: 'e163b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SATTRING KEEL 2 INCH', slug: 'sattring-keel-2-inch', sku: 'AE-STK-2', base_price: 150, type: 'physical', is_active: true },
      { id: 'e164b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SATTRING KEEL 3 INCH', slug: 'sattring-keel-3-inch', sku: 'AE-STK-3', base_price: 180, type: 'physical', is_active: true },
      { id: 'e165b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: PHYSICAL_BRAND_ID, name: 'SATTRING KEEL 4 INCH', slug: 'sattring-keel-4-inch', sku: 'AE-STK-4', base_price: 220, type: 'physical', is_active: true },

      // Digital Products (FutureWithAI)
      { id: 'e201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'Ultimate n8n AI Automation Pack', slug: 'ultimate-n8n-ai-pack', sku: 'FWAI-N8N-AI-PACK', base_price: 349, type: 'digital', is_active: true },
      { id: 'e202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: '400+ PHP Manually Tested Scripts', slug: 'php-web-scripts-bundle', sku: 'FWAI-PHP-SCRIPTS', base_price: 499, type: 'digital', is_active: true },
      { id: 'e203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'Ultimate Web Applications Bundle', slug: 'themes-plugins-ultimate', sku: 'FWAI-WEB-APPS', base_price: 999, type: 'digital', is_active: true },
      { id: 'e204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'Emergent Prompt Engineering Blueprint', slug: 'emergent-prompt-engineering', sku: 'FWAI-PROMPT-ENG', base_price: 199, type: 'digital', is_active: true },
      { id: 'e205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'NodeJS SaaS Boilerplate & Auth Template', slug: 'nodejs-saas-boilerplate', sku: 'FWAI-NODE-SAAS', base_price: 799, type: 'digital', is_active: true },
      { id: 'e206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'Python Autonomous Agent Scraper Suite', slug: 'python-agent-scraper', sku: 'FWAI-PY-SCRAPE', base_price: 399, type: 'digital', is_active: true },
      { id: 'e207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'Next.js Portfolio Tailwind Theme', slug: 'nextjs-portfolio-theme', sku: 'FWAI-NEXT-PORT', base_price: 299, type: 'digital', is_active: true },
      { id: 'e208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'WordPress WooCommerce Automation Plugin', slug: 'wp-woocommerce-automation', sku: 'FWAI-WP-WOO', base_price: 599, type: 'digital', is_active: true },
      { id: 'e209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'n8n Lead Generation Pipeline Template', slug: 'n8n-lead-generation-pipeline', sku: 'FWAI-N8N-LEAD', base_price: 249, type: 'digital', is_active: true },
      { id: 'e210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', brand_id: DIGITAL_BRAND_ID, name: 'PHP Database backup Automation Script', slug: 'php-db-backup-automation', sku: 'FWAI-PHP-BACKUP', base_price: 149, type: 'digital', is_active: true }
    ];

    for (const prod of productsData) {
      const { error } = await supabase.from('products').upsert(prod);
      if (error) {
        console.error(`❌ Failed to seed product "${prod.name}":`, error.message);
      } else {
        reportData.products.push({ id: prod.id, name: prod.name, price: prod.base_price, type: prod.type });
      }
    }
    console.log(`Seeded ${reportData.products.length} products successfully.`);

    // Seed inventory dynamically for physical items to support large product lists
    const inventoryData = [];
    productsData.forEach(prod => {
      if (prod.type === 'physical') {
        inventoryData.push({
          product_id: prod.id,
          quantity: prod.name.toLowerCase().includes('lock') ? 4 : prod.name.toLowerCase().includes('pipe') ? 300 : 100,
          reserved: 0,
          low_stock_threshold: 5
        });
      }
    });
    for (const inv of inventoryData) {
      await supabase.from('inventory').upsert(inv);
    }

    // Seed digital asset files metadata
    const digitalAssetsData = [
      { id: 'e201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e201b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/ultimate-n8n-ai-pack.zip', file_name: 'ultimate-n8n-ai-pack.zip', file_size: 15728640 },
      { id: 'e202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e202b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/php-web-scripts-bundle.zip', file_name: 'php-web-scripts-bundle.zip', file_size: 52428800 },
      { id: 'e203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e203b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/themes-plugins-ultimate.zip', file_name: 'themes-plugins-ultimate.zip', file_size: 104857600 },
      { id: 'e204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e204b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/emergent-prompt-engineering.zip', file_name: 'emergent-prompt-engineering.zip', file_size: 1048576 },
      { id: 'e205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e205b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/nodejs-saas-boilerplate.zip', file_name: 'nodejs-saas-boilerplate.zip', file_size: 5242880 },
      { id: 'e206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e206b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/python-agent-scraper.zip', file_name: 'python-agent-scraper.zip', file_size: 2097152 },
      { id: 'e207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e207b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/nextjs-portfolio-theme.zip', file_name: 'nextjs-portfolio-theme.zip', file_size: 8388608 },
      { id: 'e208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e208b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/wp-woocommerce-automation.zip', file_name: 'wp-woocommerce-automation.zip', file_size: 4194304 },
      { id: 'e209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e209b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/n8n-lead-generation-pipeline.zip', file_name: 'n8n-lead-generation-pipeline.zip', file_size: 12582912 },
      { id: 'e210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', product_id: 'e210b1c6-2c5e-4029-9a2e-c1e1bc89a74a', file_path: 'cloudflare-r2/vault/downloads/php-db-backup-automation.zip', file_name: 'php-db-backup-automation.zip', file_size: 524288 }
    ];
    for (const asset of digitalAssetsData) {
      await supabase.from('digital_assets').upsert(asset);
    }

    // 5. Seed Coupons
    console.log('🏷️ Seeding active coupons...');
    const couponsData = [
      { brand_id: PHYSICAL_BRAND_ID, code: 'SEED-AE10', type: 'percentage', value: 10, min_purchase_amount: 1000, is_active: true },
      { brand_id: PHYSICAL_BRAND_ID, code: 'SEED-AEFIXED', type: 'fixed_amount', value: 200, min_purchase_amount: 1500, is_active: true },
      { brand_id: DIGITAL_BRAND_ID, code: 'SEED-FWAI20', type: 'percentage', value: 20, min_purchase_amount: 200, is_active: true },
      { brand_id: DIGITAL_BRAND_ID, code: 'SEED-FWAIFIXED', type: 'fixed_amount', value: 50, min_purchase_amount: 300, is_active: true }
    ];
    for (const coup of couponsData) {
      const { data, error } = await supabase.from('coupons').insert(coup).select('id, code');
      if (data && data.length > 0) {
        reportData.coupons.push({ id: data[0].id, code: data[0].code });
      } else if (error) {
        console.warn(`Failed to seed coupon ${coup.code}: ${error.message}`);
      }
    }

    // 6. Seed 10 Customers (auth + profiles)
    console.log('👥 Creating 10 Customer authentication accounts and profiles...');
    const customerNames = [
      'Anshul Sharma', 'Priya Patel', 'Rahul Verma', 'Sneha Reddy', 'Amit Mishra',
      'Neha Gupta', 'Vikram Singh', 'Kavita Joshi', 'Sanjay Kumar', 'Ritu Saxena'
    ];

    // Verify if level column exists in active profiles table, otherwise ignore the field in updates
    const { data: colsCheck } = await supabase.from('profiles').select('*').limit(1);
    const hasLevelColumn = colsCheck && colsCheck.length > 0 && ('level' in colsCheck[0]);
    if (!hasLevelColumn) {
      reportData.warnings.push('Column "level" is missing from the database profiles table schema cache.');
    }

    for (let i = 1; i <= 10; i++) {
      const email = `seed_customer_${i}@gmail.com`;
      const password = 'Password123!';
      const fullName = customerNames[i - 1];
      const phoneNumber = `+9198765${10000 + i}`;

      // Create auth credentials
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (authErr) {
        console.error(`Error seeding auth user ${email}:`, authErr.message);
        continue;
      }

      const userId = authData.user.id;

      // Update profile
      const levelVal = i <= 3 ? 'bronze' : i <= 7 ? 'silver' : 'gold';
      const updatePayload = {
        full_name: fullName,
        phone_number: phoneNumber,
        role: 'customer'
      };
      if (hasLevelColumn) {
        updatePayload.level = levelVal;
      }

      const { error: profileErr } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userId);

      if (profileErr) {
        console.error(`Error updating profile for ${email}:`, profileErr.message);
      }

      // Add address
      await supabase.from('addresses').insert({
        profile_id: userId,
        type: 'shipping',
        address_line1: `${i * 12}, Sector ${i + 4}, Staging Complex`,
        city: i % 2 === 0 ? 'Delhi' : 'Mumbai',
        state: i % 2 === 0 ? 'Delhi' : 'Maharashtra',
        postal_code: `1100${i}2`,
        country: 'India',
        is_default: true
      });

      // Seed Points in rewards table (Phase 2/3) and reward_history (Phase 4)
      const initialPoints = i * 250;
      await supabase.from('rewards').insert({
        profile_id: userId,
        points: initialPoints,
        reason: 'Welcome registration staging reward points.'
      });

      await supabase.from('reward_history').insert({
        profile_id: userId,
        points_change: initialPoints,
        reason: 'Staging welcome registration points.'
      });

      reportData.customers.push({ id: userId, email, fullName, level: hasLevelColumn ? levelVal : 'default', initialPoints });
    }

    // 7. Seed Wishlists, Reviews & Notifications
    console.log('⭐ Seeding customer wishlists, reviews and notifications...');
    
    // Check if wishlists table exists in database
    const { error: wTableErr } = await supabase.from('wishlists').select('*').limit(1);
    const hasWishlistsTable = !wTableErr;
    if (!hasWishlistsTable) {
      reportData.warnings.push('Table "wishlists" is missing from database schema cache.');
    }

    for (let i = 0; i < reportData.customers.length; i++) {
      const cust = reportData.customers[i];
      const prod = productsData[i % productsData.length];
      const secondProd = productsData[(i + 5) % productsData.length];

      // Add Wishlist if table exists
      if (hasWishlistsTable) {
        const { error: wishErr } = await supabase.from('wishlists').insert({
          profile_id: cust.id,
          product_id: prod.id
        });
        if (!wishErr) reportData.wishlistCount++;
      }

      // Add Review
      const { error: revErr } = await supabase.from('reviews').insert({
        profile_id: cust.id,
        product_id: secondProd.id,
        rating: 4 + (i % 2),
        comment: `Excellent quality and extremely fast onboarding. Highly recommended in staging!`
      });
      if (!revErr) reportData.reviewsCount++;

      // Add Notification
      const { error: notErr } = await supabase.from('notifications').insert({
        profile_id: cust.id,
        title: 'Staging Seed Notification',
        message: 'Your pre-production customer account has been seeded successfully.',
        type: 'promotion',
        is_read: false
      });
      if (!notErr) reportData.notificationsCount++;
    }

    // 8. Seed 10 Complex Orders
    console.log('💳 Seeding 10 complex purchase orders...');
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const paymentMethods = ['card', 'upi', 'cod'];

    // Check if Phase 6 tables exist
    const { error: oeErr } = await supabase.from('order_events').select('*').limit(1);
    const hasOrderEvents = !oeErr;
    if (!hasOrderEvents) {
      reportData.warnings.push('Table "order_events" is missing from the database. Order status logs and idempotency checks will be skipped until migrations are applied.');
    }

    for (let i = 1; i <= 10; i++) {
      const customer = reportData.customers[i - 1];
      const isPhysical = i % 2 !== 0;
      const brandId = isPhysical ? PHYSICAL_BRAND_ID : DIGITAL_BRAND_ID;
      const orderNumber = `SEED-ORD-${20260000 + i}`;
      const status = orderStatuses[(i - 1) % orderStatuses.length];
      const method = paymentMethods[i % paymentMethods.length];
      
      const product = productsData[(i * 2) % productsData.length];
      const subtotal = product.base_price;
      const discount = i % 3 === 0 ? 50 : 0;
      const shipping = isPhysical ? 150 : 0;
      const total = subtotal - discount + shipping;

      const orderPayload = {
        brand_id: brandId,
        profile_id: customer.id,
        order_number: orderNumber,
        status: status,
        shipping_address: {
          address_line1: `${i * 12}, Sector ${i + 4}, Staging Complex`,
          city: 'Delhi',
          state: 'Delhi',
          postal_code: `1100${i}2`,
          country: 'India'
        },
        subtotal: subtotal,
        discount_amount: discount,
        shipping_fee: shipping,
        total_amount: total,
        payment_method: method,
        payment_status: status === 'cancelled' ? 'failed' : status === 'delivered' ? 'paid' : 'pending',
        tracking_number: isPhysical && status !== 'pending' ? `SR-WAYBILL-${9988 + i}` : null,
        carrier: isPhysical && status !== 'pending' ? 'Shiprocket' : null
      };

      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id, order_number, total_amount')
        .single();

      if (orderErr) {
        console.error(`Error inserting seed order ${orderNumber}:`, orderErr.message);
        continue;
      }

      // Add Order Item
      const { data: orderItem } = await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        quantity: 1,
        price: product.base_price,
        discount: discount,
        total: total
      }).select('id').single();

      // Seed Order Lock & Checkout Events in order_events (Phase 6)
      if (hasOrderEvents) {
        await supabase.from('order_events').insert({
          order_id: order.id,
          event_type: 'CHECKOUT_INIT',
          payload: {
            idempotency_key: `seed-uuid-key-0000-${i}`,
            checkout_total: total,
            item_count: 1
          },
          created_by: customer.id
        });

        await supabase.from('order_events').insert({
          order_id: order.id,
          event_type: 'LOCK',
          payload: { reason: 'Status change lock during staging' },
          created_by: customer.id
        });

        if (status === 'delivered') {
          await supabase.from('order_events').insert({
            order_id: order.id,
            event_type: 'PAYMENT_CLEARED',
            payload: { transaction_reference: `PHONEPE-TX-${100223 + i}` },
            created_by: customer.id
          });
        }
      }

      // If digital, seed digital access token
      if (!isPhysical && orderItem) {
        await supabase.from('digital_access_tokens').insert({
          order_item_id: orderItem.id,
          profile_id: customer.id,
          token: `seed_token_jwt_998_${i}`,
          download_count: 0,
          max_downloads: 10
        });

        const { error: paErr } = await supabase.from('purchase_access').insert({
          profile_id: customer.id,
          product_id: product.id,
          order_id: order.id,
          is_active: true
        });
        if (paErr) {
          console.warn('Skipped purchase_access row: table is missing.');
        }
      }

      // Seed order tracking records (Phase 2/3)
      if (isPhysical && status !== 'pending') {
        await supabase.from('order_tracking').insert({
          order_id: order.id,
          status: status,
          description: `Package state transitioned to ${status} in staging warehouse.`,
          location: 'New Delhi Staging Facility'
        });
      }

      reportData.orders.push({
        id: order.id,
        number: order.order_number,
        total: order.total_amount,
        status: status,
        type: isPhysical ? 'physical' : 'digital'
      });
    }

    console.log('✅ Database seeding operations completed successfully!');
    writeSeedReport(reportData);
  } catch (err) {
    console.error('❌ SEEDING CRITICAL FAILURE:', err);
    process.exit(1);
  }
}

function writeSeedReport(data) {
  const reportPath = path.join(__dirname, '../../seed-report.md');
  const markdown = `
# Pre-Production Database Seeding Report

Generated: ${data.timestamp}
Target Connection: Supabase Staging Database

## Seeding Summary Metrics
- **Auth Accounts Created**: ${data.customers.length} Customers (seeded_customer_*@gmail.com)
- **Active Products Upserted**: ${data.products.length} Products (10 Physical, 10 Digital)
- **Staging Orders Recorded**: ${data.orders.length} Complex Orders
- **Staging Coupons Seeded**: ${data.coupons.length} Promo Codes
- **Wishlist Items Mapped**: ${data.wishlistCount}
- **Product Reviews Logged**: ${data.reviewsCount}
- **Stored Notifications**: ${data.notificationsCount}

---

## 🚨 Seeding Integrity Alerts & Warnings (${data.warnings.length})
${data.warnings.length === 0 ? '_None. Database schema is fully synced._' : data.warnings.map(w => `> [!WARNING]\n> **${w}**`).join('\n\n')}

---

## 👥 Seeded Staging Customer Accounts
| User ID | Email Login | Name | Loyalty Level | Initial Points | Default Password |
| :--- | :--- | :--- | :---: | :---: | :--- |
${data.customers.map(c => `| \`${c.id}\` | \`${c.email}\` | ${c.fullName} | \`${c.level}\` | ${c.initialPoints} | \`Password123!\` |`).join('\n')}

---

## 🛍️ Active Products Seeding Log
| Product ID | Name | Base Price | Delivery Type |
| :--- | :--- | :---: | :---: |
${data.products.map(p => `| \`${p.id}\` | ${p.name} | ₹${p.price} | \`${p.type}\` |`).join('\n')}

---

## 💳 Seeded Transaction Orders Logs
| Order ID | Order Number | Total Amount | Order Status | Delivery Type |
| :--- | :--- | :---: | :---: | :---: |
${data.orders.map(o => `| \`${o.id}\` | \`${o.number}\` | ₹${o.total} | \`${o.status}\` | \`${o.type}\` |`).join('\n')}

---

## 🏷️ Seeded Active Coupons
| Coupon ID | Promo Code | Discount Type | Value |
| :--- | :--- | :---: | :---: |
${data.coupons.map((c, idx) => `| \`${c.id}\` | \`${c.code}\` | ${c.code.includes('FIXED') ? 'Fixed Amount' : 'Percentage'} | ${c.code.includes('FIXED') ? '₹200/₹50' : '10%/20%'} |`).join('\n')}

---
_Verify RLS controls and constraints mapping against these IDs during UAT._
`;

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`📝 Seeding Markdown Report written to ${reportPath}`);
}

runSeeder();
