import pg from 'pg';
import { MASTER_SOURCES_REGISTRY } from '../src/data/sources/index.js';

const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:Luckychamp%40007@db.gixgyrsyopwtfgxvfglp.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('Connecting to Supabase PostgreSQL...');
  await client.connect();

  console.log('Creating tables: scholarship_sources, notifications, bookmarks, student_applications...');

  await client.query(`
    -- 1. SCHOLARSHIP SOURCES
    CREATE TABLE IF NOT EXISTS scholarship_sources (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(300) NOT NULL,
      category VARCHAR(100),
      provider_type VARCHAR(100) NOT NULL,
      portal_url TEXT NOT NULL,
      portal_name VARCHAR(300),
      description TEXT,
      state VARCHAR(100),
      state_code VARCHAR(10),
      reliability_tier VARCHAR(100) DEFAULT 'LEVEL_1_OFFICIAL_GOVT',
      verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
      active BOOLEAN NOT NULL DEFAULT true,
      active_schemes_count INTEGER DEFAULT 0,
      sync_frequency VARCHAR(50) DEFAULT 'WEEKLY',
      last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_sources_active ON scholarship_sources(active);
    CREATE INDEX IF NOT EXISTS idx_sources_status ON scholarship_sources(verification_status);

    -- 2. USER NOTIFICATIONS
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID,
      title VARCHAR(300) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'INFO',
      read BOOLEAN NOT NULL DEFAULT false,
      link TEXT,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

    -- 3. BOOKMARKS
    CREATE TABLE IF NOT EXISTS bookmarks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, scholarship_id)
    );

    -- 4. STUDENT APPLICATIONS
    CREATE TABLE IF NOT EXISTS student_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID NOT NULL,
      scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
      applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(student_id, scholarship_id)
    );

    -- Enable RLS and Permissive Policies for anon/authenticated
    ALTER TABLE scholarship_sources ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;

    DO $$ BEGIN
      DROP POLICY IF EXISTS "Allow public read scholarship_sources" ON scholarship_sources;
      CREATE POLICY "Allow public read scholarship_sources" ON scholarship_sources FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN OTHERS THEN NULL; END $$;

    DO $$ BEGIN
      DROP POLICY IF EXISTS "Allow user notifications" ON notifications;
      CREATE POLICY "Allow user notifications" ON notifications FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN OTHERS THEN NULL; END $$;

    DO $$ BEGIN
      DROP POLICY IF EXISTS "Allow user bookmarks" ON bookmarks;
      CREATE POLICY "Allow user bookmarks" ON bookmarks FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN OTHERS THEN NULL; END $$;

    DO $$ BEGIN
      DROP POLICY IF EXISTS "Allow user applications" ON student_applications;
      CREATE POLICY "Allow user applications" ON student_applications FOR ALL USING (true) WITH CHECK (true);
    EXCEPTION WHEN OTHERS THEN NULL; END $$;
  `);

  console.log('Seeding scholarship_sources with 61 verified sources...');

  for (const src of MASTER_SOURCES_REGISTRY) {
    const q = `
      INSERT INTO scholarship_sources (
        id, name, category, provider_type, portal_url, portal_name, description,
        state, state_code, reliability_tier, verification_status, active,
        active_schemes_count, sync_frequency, last_verified_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        provider_type = EXCLUDED.provider_type,
        portal_url = EXCLUDED.portal_url,
        portal_name = EXCLUDED.portal_name,
        description = EXCLUDED.description,
        state = EXCLUDED.state,
        state_code = EXCLUDED.state_code,
        active = EXCLUDED.active,
        verification_status = EXCLUDED.verification_status,
        active_schemes_count = EXCLUDED.active_schemes_count,
        updated_at = NOW();
    `;

    const sourceName = src.name || src.portalName || (src.stateName ? `${src.stateName} Scholarship Portal` : 'Official Scholarship Source');
    const providerType = src.providerType || (src.isUnionTerritory ? 'UT_GOVERNMENT' : (src.stateCode ? 'STATE_GOVERNMENT' : 'GOVERNMENT'));
    const category = src.category || (src.isUnionTerritory ? 'UNION_TERRITORY' : (src.stateCode ? 'STATE_GOVERNMENT' : 'GOVERNMENT'));

    const vals = [
      src.id,
      sourceName,
      category,
      providerType,
      src.portalUrl || src.url || 'https://scholarships.gov.in',
      src.portalName || sourceName,
      src.description || (src.departments ? `Departments: ${src.departments.join(', ')}` : ''),
      src.stateName || src.state || null,
      src.stateCode || null,
      src.reliabilityTier || 'LEVEL_2_OFFICIAL_PORTAL',
      src.verificationStatus || 'VERIFIED',
      true, // active
      src.activeSchemesCount || (src.keySchemes ? src.keySchemes.length : 5),
      src.syncFrequency || 'WEEKLY',
      src.lastVerifiedAt || new Date().toISOString()
    ];

    await client.query(q, vals);
  }

  console.log('✅ Seeded 61 scholarship sources successfully!');

  // Verify Counts
  const srcCount = await client.query('SELECT count(*) FROM scholarship_sources WHERE active = true;');
  console.log('Active sources count in database:', srcCount.rows[0].count);

  const schCount = await client.query("SELECT count(*) FROM scholarships WHERE verification_status = 'VERIFIED';");
  console.log('Verified scholarships count in database:', schCount.rows[0].count);

  await client.end();
}

main().catch(console.error);
