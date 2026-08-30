import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `);
  
  const tables = {};
  for (const r of res.rows) {
    if (!tables[r.table_name]) tables[r.table_name] = [];
    tables[r.table_name].push({
      column: r.column_name,
      type: r.data_type,
      udt: r.udt_name,
      nullable: r.is_nullable,
      default: r.column_default
    });
  }
  
  console.log(JSON.stringify(tables, null, 2));
  await client.end();
}

main().catch(console.error);
