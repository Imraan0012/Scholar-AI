-- =============================================================================
-- SCHOLAR AI — SUPABASE V2 MIGRATION: SCHOLARSHIP SYNC & REVIEW QUEUE
-- Adds content hashing, check timestamps, and staged review queue for official updates.
-- =============================================================================

-- 1. Extend scholarships table with sync audit columns if not already present
ALTER TABLE IF EXISTS scholarships 
ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64),
ADD COLUMN IF NOT EXISTS last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS official_scheme_id VARCHAR(100);

-- 2. Create Scholarship Update Review Queue Table
CREATE TABLE IF NOT EXISTS scholarship_update_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    source_id VARCHAR(100),
    source_url TEXT NOT NULL,
    changed_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
    old_values JSONB NOT NULL DEFAULT '{}'::jsonb,
    proposed_values JSONB NOT NULL DEFAULT '{}'::jsonb,
    change_summary TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'APPLIED')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(100)
);

-- 3. Indexes for fast queue and audit lookups
CREATE INDEX IF NOT EXISTS idx_update_reviews_status ON scholarship_update_reviews(status);
CREATE INDEX IF NOT EXISTS idx_update_reviews_scholarship ON scholarship_update_reviews(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_scholarships_last_checked ON scholarships(last_checked_at);
CREATE INDEX IF NOT EXISTS idx_scholarships_content_hash ON scholarships(content_hash);
