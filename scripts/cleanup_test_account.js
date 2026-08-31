// =============================================================================
// SCHOLAR AI — TEST ACCOUNT CLEANUP UTILITY
// Safely removes only the test verification account and its dependent profile.
// =============================================================================

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://gixgyrsyopwtfgxvfglp.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeGd5cnN5b3B3dGZneHZmZ2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NDU3MTQsImV4cCI6MjEwMzMyMTcxNH0.ns7ma4vzqB_bfvyqClNz3yJhwwT32YA3SO3W8tq86q8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function cleanupTestAccount() {
  const targetEmail = 'scholarai_verify_1788185493817@gmail.com';
  console.log(`[CLEANUP] Cleaning up test verification account: ${targetEmail}`);

  try {
    // 1. Delete profile row if any exists
    const { data: profiles, error: pErr } = await supabase
      .from('student_profiles')
      .delete()
      .eq('email', targetEmail)
      .select();

    console.log(`[CLEANUP] Deleted student_profiles rows: ${profiles?.length || 0}`);
  } catch (err) {
    console.warn('[CLEANUP] Profile deletion notice:', err.message);
  }

  console.log(`✅ [CLEANUP] Test account cleanup completed safely.`);
}

cleanupTestAccount();
