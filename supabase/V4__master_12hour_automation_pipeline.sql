-- =============================================================================
-- SCHOLAR AI — V4 MASTER 12-HOUR AUTOMATION & SCAN RUNS MIGRATION
-- Production-Safe Idempotent Schema Migration
-- =============================================================================

-- 1. SCHOLARSHIP SCAN RUNS (12-Hour Automated Master Pipeline Execution History)
CREATE TABLE IF NOT EXISTS scholarship_scan_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('QUEUED', 'RUNNING', 'COMPLETED', 'PARTIAL', 'FAILED')),
    sources_total INTEGER NOT NULL DEFAULT 0,
    sources_checked INTEGER NOT NULL DEFAULT 0,
    sources_successful INTEGER NOT NULL DEFAULT 0,
    sources_failed INTEGER NOT NULL DEFAULT 0,
    raw_candidates INTEGER NOT NULL DEFAULT 0,
    duplicates INTEGER NOT NULL DEFAULT 0,
    new_candidates INTEGER NOT NULL DEFAULT 0,
    auto_published INTEGER NOT NULL DEFAULT 0,
    pending_review INTEGER NOT NULL DEFAULT 0,
    scholarships_updated INTEGER NOT NULL DEFAULT 0,
    deadlines_updated INTEGER NOT NULL DEFAULT 0,
    closed_count INTEGER NOT NULL DEFAULT 0,
    reopened_count INTEGER NOT NULL DEFAULT 0,
    error_summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SCHOLARSHIPS DEADLINE & LIFECYCLE EXTENSIONS (Idempotent column additions)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='status') THEN
        ALTER TABLE scholarships ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('NOT_YET_OPEN', 'OPEN', 'CLOSING_SOON', 'CLOSED', 'YEAR_ROUND', 'UNKNOWN'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='application_open_date') THEN
        ALTER TABLE scholarships ADD COLUMN application_open_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='application_deadline') THEN
        ALTER TABLE scholarships ADD COLUMN application_deadline DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='scholarships' AND column_name='is_deadline_extended') THEN
        ALTER TABLE scholarships ADD COLUMN is_deadline_extended BOOLEAN DEFAULT false;
    END IF;
END $$;

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_scholarship_scan_runs_created ON scholarship_scan_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON scholarships(application_deadline);
