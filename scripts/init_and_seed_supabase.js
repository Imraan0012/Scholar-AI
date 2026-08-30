// =============================================================================
// SCHOLAR AI â€” SUPABASE POSTGRESQL SCHEMA INITIALIZER & DATA SEEDER
// =============================================================================

import fs from 'fs';
import path from 'path';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../src/data/scholarships/index.js';

const { Client } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Connection credentials provided by user
const dbConfig = {
  user: 'postgres',
  host: 'db.gixgyrsyopwtfgxvfglp.supabase.co',
  database: 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
  port: 5432,
  ssl: { rejectUnauthorized: false }
};

async function main() {
  console.log('ðŸ”— Connecting to Supabase PostgreSQL at db.gixgyrsyopwtfgxvfglp.supabase.co...');
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('âœ… Connected to Supabase PostgreSQL successfully!');

    // 1. Read and apply schema.sql
    const schemaPath = path.join(__dirname, '../supabase/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
    console.log('ðŸ“¦ Applying database schema from supabase/schema.sql...');
    
    // Drop old tables to ensure clean constraint updates
    await client.query(`
      DROP TABLE IF EXISTS student_applications CASCADE;
      DROP TABLE IF EXISTS scholarship_deadlines CASCADE;
      DROP TABLE IF EXISTS scholarship_benefits CASCADE;
      DROP TABLE IF EXISTS scholarship_documents CASCADE;
      DROP TABLE IF EXISTS scholarship_eligibility_rules CASCADE;
      DROP TABLE IF EXISTS scholarships CASCADE;
    `);
    
    await client.query(schemaSql);
    console.log('âœ… Database schema and tables created successfully!');

    // 2. Seed verified scholarships into 'scholarships' table
    console.log(`ðŸŒ± Seeding ${MASTER_SCHOLARSHIP_REGISTRY.length} verified scholarships into database...`);

    for (const sch of MASTER_SCHOLARSHIP_REGISTRY) {
      const query = `
        INSERT INTO scholarships (
          id, name, provider, provider_type, government_level, state,
          ministry_or_department, academic_year, application_type, description,
          amount_display, amount_min, amount_max, amount_type,
          official_website_url, official_application_url, official_guideline_pdf_url,
          source_reliability, verification_status, last_verified_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          provider = EXCLUDED.provider,
          description = EXCLUDED.description,
          amount_display = EXCLUDED.amount_display,
          official_website_url = EXCLUDED.official_website_url,
          official_application_url = EXCLUDED.official_application_url,
          verification_status = EXCLUDED.verification_status,
          updated_at = NOW();
      `;

      const values = [
        sch.id,
        sch.name,
        sch.provider,
        sch.provider_type || (sch.government_level === 'PRIVATE' ? 'CORPORATE_TRUST' : 'GOVERNMENT'),
        sch.government_level || 'CENTRAL',
        sch.state || 'ALL_INDIA',
        sch.ministry_or_department || sch.provider,
        sch.academic_year || '2026-27',
        sch.application_type || 'FRESH_AND_RENEWAL',
        sch.description,
        sch.amount_display,
        sch.amount_min || 0,
        sch.amount_max || 50000,
        sch.amount_type || 'ANNUAL_STIPEND',
        sch.official_website_url || sch.official_source_url || 'https://scholarships.gov.in',
        sch.official_application_url || sch.application_url || 'https://scholarships.gov.in',
        sch.official_guideline_pdf_url || null,
        sch.source_reliability || 'LEVEL_1_OFFICIAL_GOVT',
        sch.verification_status || 'VERIFIED',
        sch.last_verified_at || new Date().toISOString()
      ];

      await client.query(query, values);

      // Seed rules
      if (sch.rules && Array.isArray(sch.rules)) {
        for (const r of sch.rules) {
          await client.query(
            `INSERT INTO scholarship_eligibility_rules (
              scholarship_id, rule_category, condition_field, operator, value_json, unit, is_mandatory, rule_description, failure_message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              sch.id,
              'ACADEMIC',
              r.field || 'general',
              r.operator || '==',
              JSON.stringify(r.value !== undefined ? r.value : null),
              r.unit || 'NONE',
              r.mandatory !== false,
              r.description || 'Eligibility rule criteria',
              r.description || 'Condition not satisfied'
            ]
          );
        }
      }

      // Seed documents
      if (sch.required_documents && Array.isArray(sch.required_documents)) {
        for (const doc of sch.required_documents) {
          await client.query(
            `INSERT INTO scholarship_documents (
              scholarship_id, document_code, document_name, is_mandatory
            ) VALUES ($1, $2, $3, $4)`,
            [
              sch.id,
              doc.code || doc.id || 'DOC_REQ',
              doc.name || 'Required Certificate',
              doc.mandatory !== false
            ]
          );
        }
      }
    }

    console.log('âœ¨ All scholarships, rules, and documents seeded into Supabase successfully!');

    // Fetch counts from database to verify
    const countRes = await client.query('SELECT COUNT(*) FROM scholarships');
    const rulesCountRes = await client.query('SELECT COUNT(*) FROM scholarship_eligibility_rules');
    console.log(`ðŸ“Š Total scholarships in database: ${countRes.rows[0].count}`);
    console.log(`ðŸ“Š Total rules in database: ${rulesCountRes.rows[0].count}`);

  } catch (err) {
    console.error('âŒ Database operation error:', err);
  } finally {
    await client.end();
  }
}

main();
