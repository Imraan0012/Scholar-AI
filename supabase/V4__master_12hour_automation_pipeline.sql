-- =============================================================================
-- SCHOLAR AI — V4 MASTER 12-HOUR AUTOMATION & SCAN RUNS MIGRATION
-- Production-Safe Idempotent Schema Migration
-- =============================================================================

-- 1. SCHOLARSHIP SCAN RUNS TABLE (12-Hour Automated Master Pipeline Execution History)
CREATE TABLE IF NOT EXISTS public.scholarship_scan_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'RUNNING',
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

-- 2. SCHOLARSHIPS DEADLINE & LIFECYCLE EXTENSIONS (Idempotent Column Additions)
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'OPEN';
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS application_open_date DATE;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS application_deadline DATE;
ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS is_deadline_extended BOOLEAN DEFAULT false;

-- 3. INDEXES FOR QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_scholarship_scan_runs_created ON public.scholarship_scan_runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scholarship_scan_runs_status ON public.scholarship_scan_runs(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON public.scholarships(status);
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(application_deadline);
