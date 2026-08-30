import 'dotenv/config';
import { supabase } from '../src/lib/supabaseClient.js';

async function testRpc() {
  const testEmail = 'mohamedimraan2003@gmail.com';
  const testPassword = 'Password123!';
  const testName = 'Mohamed Imraan';

  console.log('Testing RPC registration for:', testEmail);
  const { data: rpcData, error: rpcError } = await supabase.rpc('register_student_account', {
    p_email: testEmail,
    p_password: testPassword,
    p_full_name: testName
  });

  console.log('RPC result:', { rpcData, rpcError });

  if (rpcData?.success || rpcData?.is_duplicate) {
    console.log('Testing native signIn with Supabase for newly registered user...');
    const { data: signData, error: signError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    console.log('SignIn result:', {
      user: signData?.user?.id,
      email: signData?.user?.email,
      session: !!signData?.session,
      error: signError
    });
  }
}

testRpc().catch(console.error);
