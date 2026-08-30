import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'process.env.SUPABASE_DB_URL',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  console.log('Connected to PostgreSQL database');

  const usersRes = await client.query(`
    SELECT id, email, created_at, last_sign_in_at, email_confirmed_at, raw_user_meta_data 
    FROM auth.users;
  `);

  console.log('Users in auth.users count:', usersRes.rows.length);
  console.log('Users:', JSON.stringify(usersRes.rows, null, 2));

  await client.end();
}

main().catch(console.error);
