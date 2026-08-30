import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  console.log('--- Cleaning unwanted test application record ---');
  const deleteRes = await client.query(
    `DELETE FROM student_applications 
     WHERE student_id = 'c16a225d-29d5-4021-a951-e369def4c963' 
       AND scholarship_id = 'ugc-ishan-uday-ner'`
  );
  console.log('Deleted rows count:', deleteRes.rowCount);

  const remaining = await client.query(`
    SELECT sa.*, u.email 
    FROM student_applications sa 
    LEFT JOIN auth.users u ON sa.student_id = u.id
  `);
  console.log('Remaining student_applications in DB:', remaining.rows);

  await client.end();
}

main().catch(console.error);
