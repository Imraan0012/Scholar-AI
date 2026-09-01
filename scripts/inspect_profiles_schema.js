import 'dotenv/config';
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  user: 'postgres',
  host: 'db.gixgyrsyopwtfgxvfglp.supabase.co',
  database: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'student_profiles'
    ORDER BY ordinal_position;
  `);
  console.log('student_profiles columns:');
  console.table(res.rows);

  const rpc = await client.query(`
    SELECT pg_get_functiondef(oid)
    FROM pg_proc
    WHERE proname = 'register_student_account';
  `);
  console.log('RPC register_student_account definition:\n', rpc.rows[0]?.pg_get_functiondef);

  await client.end();
}

main().catch(console.error);
