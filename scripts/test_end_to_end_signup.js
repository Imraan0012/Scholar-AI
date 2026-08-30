import 'dotenv/config';
import { authService } from '../src/services/authService.js';
import pg from 'pg';
const { Client } = pg;

async function testE2E() {
  const pgClient = new Client({
    connectionString: 'process.env.SUPABASE_DB_URL',
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();
  await pgClient.query(`DELETE FROM auth.users WHERE LOWER(email) = 'mohamedimraan2003@gmail.com';`);
  await pgClient.end();

  console.log('--- Testing First-time Sign Up for mohamedimraan2003@gmail.com ---');
  const res1 = await authService.signUp({
    email: 'mohamedimraan2003@gmail.com',
    password: 'Password123!',
    fullName: 'Mohamed Imraan'
  });

  console.log('Result 1 (First signup):', res1);
  if (!res1.success || !res1.user) {
    throw new Error('Sign up failed!');
  }
  console.log('âœ… First-time Sign Up succeeded with authenticated user and session!');

  console.log('\n--- Testing Duplicate Sign Up for same email ---');
  const res2 = await authService.signUp({
    email: 'mohamedimraan2003@gmail.com',
    password: 'Password123!',
    fullName: 'Mohamed Imraan'
  });

  console.log('Result 2 (Duplicate signup):', res2);
  if (res2.success || !res2.isDuplicate) {
    throw new Error('Duplicate detection failed!');
  }
  console.log('âœ… Duplicate detection succeeded with message:', res2.message);

  console.log('\n--- Testing Native Sign In for created account ---');
  const res3 = await authService.signIn({
    email: 'mohamedimraan2003@gmail.com',
    password: 'Password123!'
  });

  console.log('Result 3 (Sign in):', {
    success: res3.success,
    user: res3.user?.id,
    session: !!res3.session
  });
  if (!res3.success || !res3.user) {
    throw new Error('Sign in failed!');
  }
  console.log('âœ… Native Sign In succeeded perfectly!');
}

testE2E().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
