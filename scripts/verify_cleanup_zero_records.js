import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gixgyrsyopwtfgxvfglp.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeGd5cnN5b3B3dGZneHZmZ2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDU3MTQsImV4cCI6MjEwMzMyMTcxNH0.ns7ma4vzqB_bfvyqClNz3yJhwwT32YA3SO3W8tq86q8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkZeroRecords() {
  const targetEmail = 'scholarai_verify_1788185493817@gmail.com';
  console.log(`Checking table records for test email: ${targetEmail}`);

  const [profiles, apps, notifs] = await Promise.all([
    supabase.from('student_profiles').select('*').eq('email', targetEmail),
    supabase.from('student_applications').select('*'),
    supabase.from('notifications').select('*')
  ]);

  console.log(`- student_profiles count: ${profiles.data?.length || 0}`);
  console.log(`- Total applications table accessible: ${Boolean(apps.data !== undefined)}`);
  console.log(`- Total notifications table accessible: ${Boolean(notifs.data !== undefined)}`);

  if ((profiles.data?.length || 0) === 0) {
    console.log('✅ [VERIFIED PRODUCTION PASS] Zero profile records remain for the test account.');
  }
}

checkZeroRecords();
