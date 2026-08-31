-- =============================================================================
-- SCHOLAR AI — ALL-INDIA SCHOLARSHIP DISCOVERY PIPELINE MIGRATION (V3)
-- Staging and review table for newly discovered official scholarship candidates.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.scholarship_discovery_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id VARCHAR(100) NOT NULL,
    external_scheme_id VARCHAR(150),
    candidate_name VARCHAR(300) NOT NULL,
    provider VARCHAR(300) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'ALL_INDIA',
    government_level VARCHAR(80) NOT NULL DEFAULT 'CENTRAL',
    amount_display VARCHAR(200),
    source_url TEXT NOT NULL,
    candidate_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_hash VARCHAR(64) NOT NULL,
    duplicate_of VARCHAR(100),
    confidence_score DOUBLE PRECISION DEFAULT 1.0,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_REVIEW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_discovery_candidates_status 
    ON public.scholarship_discovery_candidates (status);

CREATE INDEX IF NOT EXISTS idx_discovery_candidates_hash 
    ON public.scholarship_discovery_candidates (content_hash);

CREATE INDEX IF NOT EXISTS idx_discovery_candidates_source 
    ON public.scholarship_discovery_candidates (source_id);

ALTER TABLE public.scholarship_discovery_candidates ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'scholarship_discovery_candidates' 
          AND policyname = 'Admins can manage discovery candidates'
    ) THEN
        CREATE POLICY "Admins can manage discovery candidates" 
            ON public.scholarship_discovery_candidates 
            FOR ALL 
            TO authenticated 
            USING (true) 
            WITH CHECK (true);
    END IF;
END $$;
