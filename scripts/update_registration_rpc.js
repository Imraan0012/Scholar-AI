import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  await client.connect();

  const updateRpcSql = `
CREATE OR REPLACE FUNCTION public.register_student_account(p_email text, p_password text, p_full_name text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'extensions'
AS $function$
    DECLARE
      v_user_id UUID;
      v_identity_id UUID;
      v_existing_id UUID;
      v_normalized_email TEXT;
      v_meta JSONB;
    BEGIN
      v_normalized_email := LOWER(TRIM(p_email));

      IF v_normalized_email IS NULL OR v_normalized_email = '' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Email is required.');
      END IF;

      IF p_password IS NULL OR LENGTH(p_password) < 8 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Password must be at least 8 characters long.');
      END IF;

      -- Check if user already exists in auth.users
      SELECT id INTO v_existing_id FROM auth.users WHERE LOWER(email) = v_normalized_email;
      IF v_existing_id IS NOT NULL THEN
        RETURN jsonb_build_object(
          'success', false, 
          'is_duplicate', true, 
          'message', 'An account with this email already exists. Sign in instead.'
        );
      END IF;

      v_user_id := gen_random_uuid();
      v_identity_id := gen_random_uuid();
      v_meta := jsonb_build_object(
        'sub', v_user_id::text,
        'role', 'STUDENT',
        'email', v_normalized_email,
        'full_name', TRIM(p_full_name),
        'email_verified', true,
        'phone_verified', false
      );

      -- Insert into auth.users with pre-confirmed email
      INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        email_change_token_current,
        reauthentication_token,
        raw_app_meta_data,
        raw_user_meta_data,
        aud,
        role,
        is_sso_user,
        is_anonymous,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        '00000000-0000-0000-0000-000000000000',
        v_normalized_email,
        crypt(p_password, gen_salt('bf', 10)),
        NOW(),
        '',
        '',
        '',
        '',
        '',
        '',
        '{"provider":"email","providers":["email"]}'::jsonb,
        v_meta,
        'authenticated',
        'authenticated',
        false,
        false,
        NOW(),
        NOW()
      );

      -- Insert into auth.identities
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        v_identity_id,
        v_user_id,
        v_meta,
        'email',
        v_user_id::text,
        NOW(),
        NOW(),
        NOW()
      );

      -- Insert clean initial student profile with onboarding_complete = false
      INSERT INTO student_profiles (
        user_id,
        full_name,
        email,
        onboarding_complete,
        onboarding_step,
        created_at,
        updated_at
      ) VALUES (
        v_user_id,
        TRIM(p_full_name),
        v_normalized_email,
        false,
        1,
        NOW(),
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email;

      RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'email', v_normalized_email,
        'full_name', TRIM(p_full_name)
      );
    END;
$function$;
  `;

  await client.query(updateRpcSql);
  console.log('✓ Successfully updated register_student_account RPC in Supabase!');
  await client.end();
}

main().catch(console.error);
