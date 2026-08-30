import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'process.env.SUPABASE_DB_URL',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  const queries = [
    "SELECT current_setting('app.settings.jwt_secret', true) as jwt_secret;",
    "SELECT current_setting('request.jwt.claim', true) as req_jwt;",
    "SELECT * FROM pg_settings WHERE name LIKE '%jwt%' OR name LIKE '%secret%';",
    "SELECT rolname, rolconfig FROM pg_roles WHERE rolname IN ('anon', 'authenticated', 'service_role', 'authenticator', 'supabase_admin');"
  ];

  for (const q of queries) {
    try {
      const res = await client.query(q);
      console.log('Query:', q, '=>', res.rows);
    } catch (e) {
      console.log('Query error:', q, '=>', e.message);
    }
  }

  await client.end();
}

main().catch(console.error);
