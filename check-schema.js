import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkSchema() {
  const { data, error } = await supabase.from('menu_items_site2').select('*').limit(1);
  if (error) console.error("Error menu:", error.message);
  else console.log("Menu columns:", Object.keys(data[0] || {}));

  const { data: cData, error: cErr } = await supabase.from('categories_site2').select('*').limit(1);
  if (cErr) console.error("Error categories:", cErr.message);
  else console.log("Categories columns:", Object.keys(cData[0] || {}));

  const { data: pData, error: pErr } = await supabase.from('promotions_site2').select('*').limit(1);
  if (pErr) console.error("Error promotions:", pErr.message);
  else console.log("Promotions columns:", Object.keys(pData[0] || {}));

  const { data: rData, error: rErr } = await supabase.from('reviews_site2').select('*').limit(1);
  if (rErr) console.error("Error reviews:", rErr.message);
  else console.log("Reviews columns:", Object.keys(rData[0] || {}));

  const { data: gData, error: gErr } = await supabase.from('gallery_site2').select('*').limit(1);
  if (gErr) console.error("Error gallery:", gErr.message);
  else console.log("Gallery columns:", Object.keys(gData[0] || {}));
  
  const { data: sData, error: sErr } = await supabase.from('settings_site2').select('*').limit(1);
  if (sErr) console.error("Error settings:", sErr.message);
  else console.log("Settings columns:", Object.keys(sData[0] || {}));
}

checkSchema();
