const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://nyrnyiityklxwzgkqknw.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SERVICE_ROLE_KEY";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function check() {
  const tables = ['profiles', 'products', 'orders', 'pages', 'page_sections', 'level_rules', 'product_attributes', 'operation_logs'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`Table '${table}' status: ERROR - ${error.message}`);
      } else {
        console.log(`Table '${table}' status: EXISTS (count: ${data.length})`);
      }
    } catch (e) {
      console.log(`Table '${table}' status: FAILED TO QUERY - ${e.message}`);
    }
  }
}

check();
