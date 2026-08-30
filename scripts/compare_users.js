import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const users = await client.query(`SELECT * FROM auth.users;`);
  console.log('Users in auth.users:', JSON.stringify(users.rows, null, 2));

  const identities = await client.query(`SELECT * FROM auth.identities;`);
  console.log('Identities in auth.identities:', JSON.stringify(identities.rows, null, 2));

  await client.end();
}

main().catch(console.error);
