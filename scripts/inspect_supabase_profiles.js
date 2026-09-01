import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

async function main() {
  const { data, error } = await supabase.from('student_profiles').select('*').limit(3);
  console.log('Error:', error);
  console.log('Sample rows:', data);
  if (data && data.length > 0) {
    console.log('Column keys:', Object.keys(data[0]));
  }
}

main().catch(console.error);
