import pg from 'pg';
const { Client } = pg;

// Try pooler first, then direct
const connectionStrings = [
  'postgresql://postgres.gixgyrsyopwtfgxvfglp:process.env.SUPABASE_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres',
  'postgresql://postgres.gixgyrsyopwtfgxvfglp:process.env.SUPABASE_DB_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  'process.env.SUPABASE_DB_URL'
];

async function main() {
  let client = null;
  for (const connStr of connectionStrings) {
    try {
      console.log('Trying to connect with:', connStr.split('@')[1]);
      client = new Client({
        connectionString: connStr,
        ssl: { rejectUnauthorized: false }
      });
      await client.connect();
      console.log('âœ… Connected successfully!');
      break;
    } catch (e) {
      console.warn('Connection failed:', e.message);
      client = null;
    }
  }

  if (!client) {
    console.error('âŒ Could not connect to PostgreSQL directly');
    return;
  }

  // 1. Confirm all unconfirmed users in auth.users
  const updateRes = await client.query(`
    UPDATE auth.users 
    SET email_confirmed_at = NOW(), 
        confirmed_at = NOW(),
        updated_at = NOW()
    WHERE email_confirmed_at IS NULL OR confirmed_at IS NULL;
  `);
  console.log(`âœ… Auto-confirmed ${updateRes.rowCount} users in auth.users!`);

  // 2. Create RPC function public.auto_confirm_student
  await client.query(`
    CREATE OR REPLACE FUNCTION public.auto_confirm_student(p_email TEXT)
    RETURNS JSONB
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public, auth, extensions
    AS $$
    DECLARE
      v_email TEXT;
      v_rows INT;
    BEGIN
      v_email := LOWER(TRIM(p_email));
      UPDATE auth.users
      SET email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
          confirmed_at = COALESCE(confirmed_at, NOW()),
          updated_at = NOW()
      WHERE LOWER(email) = v_email;

      GET DIAGNOSTICS v_rows = ROW_COUNT;

      RETURN jsonb_build_object('success', true, 'confirmed_count', v_rows);
    END;
    $$;

    GRANT EXECUTE ON FUNCTION public.auto_confirm_student(TEXT) TO anon, authenticated, service_role;
  `);
  console.log('âœ… Created/Updated public.auto_confirm_student RPC');

  // 3. Inspect existing users
  const usersRes = await client.query(`
    SELECT id, email, created_at, email_confirmed_at, confirmed_at, raw_user_meta_data
    FROM auth.users;
  `);
  console.log(`ðŸ“Š Total registered users in Supabase auth.users: ${usersRes.rows.length}`);
  usersRes.rows.forEach(u => {
    console.log(` - Email: ${u.email} | Confirmed: ${u.email_confirmed_at ? 'YES (' + u.email_confirmed_at + ')' : 'NO'}`);
  });

  await client.end();
}

main().catch(console.error);
