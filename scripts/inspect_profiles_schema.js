import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  console.log('--- 1. STUDENT_PROFILES COLUMNS ---');
  const cols = await client.query(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'student_profiles'
    ORDER BY ordinal_position;
  `);
  console.log(cols.rows);

  console.log('--- 2. RPC register_student_account ---');
  const rpc = await client.query(`
    SELECT pg_get_functiondef(oid)
    FROM pg_proc
    WHERE proname = 'register_student_account';
  `);
  console.log(rpc.rows[0]?.pg_get_functiondef);

  console.log('--- 3. ALL ROWS IN STUDENT_PROFILES ---');
  const rows = await client.query(`
    SELECT id, user_id, email, full_name, onboarding_complete, onboarding_step, domicile_state, course, institution_name
    FROM student_profiles;
  `);
  console.log(rows.rows);

  await client.end();
}

main().catch(console.error);
