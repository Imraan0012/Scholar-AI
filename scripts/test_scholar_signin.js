import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

async function testScholar() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'scholar.test2026@gmail.com',
    password: 'Password123!'
  });
  console.log('SignIn for scholar.test2026@gmail.com:', { data, error });
}

testScholar().catch(console.error);
