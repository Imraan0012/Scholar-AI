import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'process.env.SUPABASE_DB_URL',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  console.log('--- 1. TABLE STRUCTURE ---');
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'student_applications'
    ORDER BY ordinal_position;
  `);
  console.log(cols.rows);

  console.log('--- 2. CONSTRAINTS ---');
  const constraints = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE conrelid = 'student_applications'::regclass;
  `);
  console.log(constraints.rows);

  console.log('--- 3. RLS STATUS & POLICIES ---');
  const rls = await client.query(`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'student_applications';
  `);
  console.log(rls.rows);

  const policies = await client.query(`
    SELECT policyname, permissive, roles, cmd, qual, with_check
    FROM pg_policies
    WHERE tablename = 'student_applications';
  `);
  console.log(policies.rows);

  console.log('--- 4. ALL ROWS IN STUDENT_APPLICATIONS ---');
  const rows = await client.query(`
    SELECT sa.*, u.email as user_email
    FROM student_applications sa
    LEFT JOIN auth.users u ON sa.student_id = u.id;
  `);
  console.log(rows.rows);

  await client.end();
}

main().catch(console.error);
