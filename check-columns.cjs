const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
supabase.from('menu_items_site2').select('*').limit(1).then(r => console.log(Object.keys(r.data[0] || {})));
