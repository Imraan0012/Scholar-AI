-- =============================================================================
-- SCHOLAR AI — SUPABASE POSTGRESQL RELATIONAL SCHEMA
-- Production-Ready Schema for Indian Scholarship Knowledge Base & Rule Engine
-- =============================================================================

-- 1. SCHOLARSHIPS MASTER TABLE
CREATE TABLE IF NOT EXISTS scholarships (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    provider VARCHAR(300) NOT NULL,
    provider_type VARCHAR(80) NOT NULL DEFAULT 'GOVERNMENT',
    government_level VARCHAR(80) NOT NULL DEFAULT 'CENTRAL',
    state VARCHAR(100) NOT NULL DEFAULT 'ALL_INDIA',
    ministry_or_department VARCHAR(300),
    academic_year VARCHAR(20) NOT NULL DEFAULT '2026-27',
    application_type VARCHAR(30) NOT NULL DEFAULT 'FRESH_AND_RENEWAL' CHECK (application_type IN ('FRESH', 'RENEWAL', 'FRESH_AND_RENEWAL')),
    description TEXT NOT NULL,
    amount_display VARCHAR(200) NOT NULL,
    amount_min NUMERIC(12, 2) DEFAULT 0,
    amount_max NUMERIC(12, 2) NOT NULL,
    amount_type VARCHAR(80) NOT NULL DEFAULT 'ANNUAL_GRANT',
    official_website_url TEXT NOT NULL,
    official_application_url TEXT NOT NULL,
    official_guideline_pdf_url TEXT,
    source_reliability VARCHAR(50) NOT NULL DEFAULT 'LEVEL_1_OFFICIAL_GOVT',
    verification_status VARCHAR(50) NOT NULL DEFAULT 'VERIFIED',
    last_verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 2. SCHOLARSHIP ELIGIBILITY RULES (Machine-Readable Vectors)
CREATE TABLE IF NOT EXISTS scholarship_eligibility_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    rule_category VARCHAR(50) NOT NULL DEFAULT 'GENERAL',
    condition_field VARCHAR(100) NOT NULL,
    operator VARCHAR(30) NOT NULL DEFAULT '==',
    value_json JSONB NOT NULL,
    unit VARCHAR(30) DEFAULT 'NONE',
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    rule_description TEXT NOT NULL,
    failure_message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SCHOLARSHIP REQUIRED DOCUMENTS
CREATE TABLE IF NOT EXISTS scholarship_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    document_code VARCHAR(100) NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    issuing_authority VARCHAR(200),
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    guidance_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SCHOLARSHIP BENEFITS & ALLOWANCE BREAKDOWN
CREATE TABLE IF NOT EXISTS scholarship_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    benefit_type VARCHAR(50) NOT NULL CHECK (benefit_type IN ('TUITION_FEE', 'MAINTENANCE_ALLOWANCE', 'HOSTEL_FEE', 'BOOK_GRANT', 'CONTINGENCY', 'DISABILITY_ALLOWANCE', 'TRAVEL_ALLOWANCE')),
    amount NUMERIC(12, 2) NOT NULL,
    frequency VARCHAR(30) NOT NULL CHECK (frequency IN ('ANNUAL', 'MONTHLY', 'ONE_TIME', 'SEMESTER')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SCHOLARSHIP DEADLINES & TIMELINES
CREATE TABLE IF NOT EXISTS scholarship_deadlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    application_start_date DATE NOT NULL,
    application_end_date DATE NOT NULL,
    institute_verification_deadline DATE,
    district_verification_deadline DATE,
    is_extended BOOLEAN DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('NOT_YET_OPEN', 'OPEN', 'CLOSING_SOON', 'CLOSED', 'YEAR_ROUND', 'UNKNOWN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    education_level VARCHAR(50) NOT NULL CHECK (education_level IN ('CLASS_10', 'CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PHD_RESEARCH')),
    course VARCHAR(150) NOT NULL,
    current_year INTEGER NOT NULL DEFAULT 1,
    institution_name VARCHAR(300) NOT NULL,
    institution_type VARCHAR(100) NOT NULL,
    class_10_percentage NUMERIC(5, 2),
    class_12_percentage NUMERIC(5, 2),
    undergraduate_cgpa NUMERIC(4, 2),
    postgraduate_cgpa NUMERIC(4, 2),
    annual_family_income NUMERIC(12, 2) NOT NULL,
    has_income_certificate BOOLEAN DEFAULT false,
    domicile_state VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('GENERAL', 'OBC', 'SC', 'ST', 'EWS')),
    gender VARCHAR(30) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'TRANSGENDER', 'OTHER')),
    is_minority BOOLEAN DEFAULT false,
    minority_community VARCHAR(50),
    has_disability BOOLEAN DEFAULT false,
    disability_percentage NUMERIC(5, 2) DEFAULT 0,
    has_udid_card BOOLEAN DEFAULT false,
    competitive_exam_name VARCHAR(100),
    competitive_exam_score NUMERIC(8, 2),
    competitive_exam_rank INTEGER,
    is_first_graduate BOOLEAN DEFAULT false,
    is_orphan BOOLEAN DEFAULT false,
    is_single_girl_child BOOLEAN DEFAULT false,
    is_ward_of_defense_or_capf BOOLEAN DEFAULT false,
    profile_completion_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ELIGIBILITY EVALUATION AUDIT RESULTS
CREATE TABLE IF NOT EXISTS eligibility_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    scholarship_id VARCHAR(100) REFERENCES scholarships(id) ON DELETE CASCADE,
    evaluation_status VARCHAR(30) NOT NULL CHECK (evaluation_status IN ('ELIGIBLE', 'POSSIBLE_MATCH', 'NOT_ELIGIBLE')),
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    matched_criteria JSONB NOT NULL DEFAULT '[]',
    failed_criteria JSONB NOT NULL DEFAULT '[]',
    missing_information JSONB NOT NULL DEFAULT '[]',
    required_documents JSONB NOT NULL DEFAULT '[]',
    recommendation_rank INTEGER DEFAULT 0,
    evaluation_explanation TEXT NOT NULL,
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SCHOLARSHIP SOURCES REGISTRY
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
    last_verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 9. USER NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title VARCHAR(300) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'INFO',
    read BOOLEAN NOT NULL DEFAULT false,
    link TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, scholarship_id)
);

-- 11. STUDENT APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS student_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL,
    scholarship_id VARCHAR(100) NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED',
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, scholarship_id)
);

-- Indexing for fast search and recommendation retrieval
CREATE INDEX IF NOT EXISTS idx_scholarships_gov_level ON scholarships(government_level);
CREATE INDEX IF NOT EXISTS idx_scholarships_state ON scholarships(state);
CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(verification_status);
CREATE INDEX IF NOT EXISTS idx_rules_scholarship_id ON scholarship_eligibility_rules(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_scholarship_id ON scholarship_deadlines(scholarship_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_student ON eligibility_results(student_id);
CREATE INDEX IF NOT EXISTS idx_sources_active ON scholarship_sources(active);
CREATE INDEX IF NOT EXISTS idx_sources_status ON scholarship_sources(verification_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read);

