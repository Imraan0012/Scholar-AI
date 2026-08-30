import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' AND table_name = 'identities';
  `);
  console.log('auth.identities columns:', cols.rows);

  const existingIdentities = await client.query(`SELECT * FROM auth.identities;`);
  console.log('Existing identities:', existingIdentities.rows);

  await client.end();
}

main().catch(console.error);
