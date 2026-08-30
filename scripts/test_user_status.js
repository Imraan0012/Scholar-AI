import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';
import { authService } from '../src/services/authService.js';

async function test() {
  console.log('--- Testing SignIn for mohamedimraan2003@gmail.com ---');
  const res1 = await authService.signIn({
    email: 'mohamedimraan2003@gmail.com',
    password: 'Password123!'
  });
  console.log('SignIn result (gmail):', res1);

  console.log('\n--- Testing SignIn for mohamedimraan2003@gmai.com ---');
  const res2 = await authService.signIn({
    email: 'mohamedimraan2003@gmai.com',
    password: 'Password123!'
  });
  console.log('SignIn result (gmai typo):', res2);
}

test().catch(console.error);
