import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'process.env.SUPABASE_DB_URL',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('Tables in public schema:', tablesRes.rows.map(r => r.table_name));

  for (const row of tablesRes.rows) {
    try {
      const countRes = await client.query(`SELECT count(*) FROM "${row.table_name}";`);
      console.log(`Table ${row.table_name}: ${countRes.rows[0].count} rows`);
    } catch (e) {
      console.log(`Table ${row.table_name}: error ${e.message}`);
    }
  }

  await client.end();
}

main().catch(console.error);
