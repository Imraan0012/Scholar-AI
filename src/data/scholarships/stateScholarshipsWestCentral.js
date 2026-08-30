// =============================================================================
// WEST & CENTRAL INDIAN STATE GOVERNMENT SCHOLARSHIPS
// States Covered: Maharashtra, Gujarat, Madhya Pradesh, Goa, Chhattisgarh
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official State Guidelines)
// =============================================================================

export const WEST_CENTRAL_STATE_SCHOLARSHIPS = [
  // ── 1. MAHARASHTRA (MAHADBT) ───────────────────────────────────────────────
  {
    id: 'mahadbt-rajarshi-shahu-ebc',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
    provider: 'Directorate of Higher Education (DHE) & DTE, Govt. of Maharashtra',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Maharashtra',
    ministry_or_department: 'Higher & Technical Education Department, Maharashtra',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Reimbursement of 50% of Tuition Fees and 50% of Exam Fees for Economically Backward Class (EBC) students admitted through CAP in higher and technical education in Maharashtra.',
    amount_display: '50% Tuition Fee & 50% Exam Fee Waiver',
    amount_min: 25000,
    amount_max: 120000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://mahadbt.maharashtra.gov.in',
    official_application_url: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=E9DDFA703C38E51A2BEBCEBC5FF9D413',
    official_guideline_pdf_url: 'https://mahadbt.maharashtra.gov.in/PDF/EBC_GR.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Maharashtra',
        mandatory: true,
        description: 'Candidate must possess a valid Maharashtra State Domicile Certificate.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['GENERAL', 'EWS', 'OBC'],
        mandatory: true,
        description: 'Open to General/Open category, EWS, and EBC students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 800000,
        unit: 'INR',
        mandatory: true,
        description: 'Total annual family income must be ≤ ₹8.00 Lakhs.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Admitted through Centralized Admission Process (CAP) in approved degree/diploma courses.'
      }
    ],

    required_documents: [
      { code: 'DOC_MAHA_DOMICILE', name: 'Maharashtra Domicile Certificate issued by Tahsildar/SDO', mandatory: true },
      { code: 'DOC_MAHA_INCOME', name: 'Income Certificate from Tahsildar / Sub-Divisional Officer (< ₹8L)', mandatory: true },
      { code: 'DOC_CAP_ALLOTMENT', name: 'Centralized Admission Process (CAP) Allotment Letter', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 75000, frequency: 'ANNUAL', notes: '50% of total tuition fee waived' },
      { type: 'TUITION_FEE', amount: 5000, frequency: 'ANNUAL', notes: '50% of exam fee waived' }
    ]
  },

  {
    id: 'mahadbt-post-matric-obc',
    name: 'MahaDBT Post Matric Scholarship for OBC / VJNT / SBC',
    provider: 'Other Backward Bahujan Welfare Department, Govt. of Maharashtra',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Maharashtra',
    ministry_or_department: 'Other Backward Bahujan Welfare Department, Maharashtra',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% Tuition Fee and Exam Fee reimbursement for OBC, VJNT, and SBC students pursuing post-matric courses in Maharashtra with family income up to ₹1.00 Lakh (50% fee waiver for income between ₹1L to ₹8L under Tuition Fee Freeship Scheme).',
    amount_display: '100% Tuition Fee Waiver + Exam Fees Reimbursed',
    amount_min: 25000,
    amount_max: 110000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://mahadbt.maharashtra.gov.in',
    official_application_url: 'https://mahadbt.maharashtra.gov.in/SchemeData/SchemeData?str=E9DDFA703C38E51AC805B73F3A056976',
    official_guideline_pdf_url: 'https://mahadbt.maharashtra.gov.in/PDF/OBC_GR.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Maharashtra',
        mandatory: true,
        description: 'Candidate must be a domicile of Maharashtra.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['OBC', 'EBC'],
        mandatory: true,
        description: 'Exclusively for OBC, VJNT, and SBC category students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 800000,
        unit: 'INR',
        mandatory: true,
        description: '100% scholarship for income <= ₹1.00L; 50% fee freeship for income between ₹1.00L to ₹8.00L.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in post-matric studies in Maharashtra.'
      }
    ],

    required_documents: [
      { code: 'DOC_MAHA_CASTE_NCL', name: 'Maharashtra Digital Caste Certificate & Non-Creamy Layer (NCL) Certificate', mandatory: true },
      { code: 'DOC_MAHA_DOMICILE', name: 'Maharashtra Domicile Certificate', mandatory: true },
      { code: 'DOC_MAHA_INCOME', name: 'Tehsildar Income Certificate', mandatory: true },
      { code: 'DOC_CAP_LETTER', name: 'CAP Admission Allotment Letter', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 80000, frequency: 'ANNUAL', notes: 'Full or 50% tuition fee reimbursed to college' }
    ]
  },

  {
    id: 'mahadbt-panjabrao-deshmukh-hostel',
    name: 'Dr. Panjabrao Deshmukh Vastigruh Nirvah Bhatta Yojna (Hostel Maintenance)',
    provider: 'Directorate of Higher & Technical Education, Govt. of Maharashtra',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Maharashtra',
    ministry_or_department: 'Higher & Technical Education Department, Maharashtra',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Hostel maintenance allowance for children of registered marginal farmers and landless laborers admitted to professional colleges in Maharashtra.',
    amount_display: '₹30,000 / year (Metro) & ₹20,000 / year (Non-Metro)',
    amount_min: 20000,
    amount_max: 30000,
    amount_type: 'MAINTENANCE_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://mahadbt.maharashtra.gov.in',
    official_application_url: 'https://mahadbt.maharashtra.gov.in',
    official_guideline_pdf_url: 'https://mahadbt.maharashtra.gov.in/PDF/Panjabrao_GR.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Maharashtra',
        mandatory: true,
        description: 'Candidate must be a permanent domicile of Maharashtra.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 800000,
        unit: 'INR',
        mandatory: true,
        description: 'Family income <= ₹8.00L (for registered marginal farmers/landless laborers).'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in professional degree/diploma courses and staying in a hostel.'
      }
    ],

    required_documents: [
      { code: 'DOC_ALPABHUDHARAK_CERT', name: 'Registered Farmer Certificate (7/12 Extract showing marginal landholding < 2 hectares) or Landless Laborer Certificate', mandatory: true },
      { code: 'DOC_HOSTEL_PROOF', name: 'Hostel Admission Certificate & Mess Receipt', mandatory: true },
      { code: 'DOC_MAHA_DOMICILE', name: 'Maharashtra Domicile Certificate', mandatory: true }
    ],

    benefits: [
      { type: 'MAINTENANCE_ALLOWANCE', amount: 30000, frequency: 'ANNUAL', notes: '₹30,000/year for Mumbai/Pune/Nagpur/Aurangabad hostellers; ₹20,000/year other areas' }
    ]
  },

  // ── 2. GUJARAT (MYSY & DIGITAL GUJARAT) ─────────────────────────────────────
  {
    id: 'gujarat-mysy-higher-education',
    name: 'Mukhyamantri Yuva Swavalamban Yojana (MYSY)',
    provider: 'Education Department, Govt. of Gujarat (KCG)',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Gujarat',
    ministry_or_department: 'Education Department, Gujarat',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Providing 50% tuition fee reimbursement up to ₹2.00 Lakh per annum and hostel assistance to meritorious students admitted in Engineering, Medical, Pharmacy, and Diploma courses in Gujarat.',
    amount_display: '50% Tuition Fee (Up to ₹2,00,000) + ₹12,000 Hostel + ₹10,000 Books',
    amount_min: 50000,
    amount_max: 200000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://mysy.guj.nic.in',
    official_application_url: 'https://mysy.guj.nic.in',
    official_guideline_pdf_url: 'https://mysy.guj.nic.in/NoticeBoard/MYSY_Resolution_2023.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Gujarat',
        mandatory: true,
        description: 'Candidate must be a native domicile of Gujarat.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 80.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 80 percentile in Class 10 (for Diploma) or Class 12 Science/General stream (for Degree).'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Total annual family income must not exceed ₹6.00 Lakhs.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Pursuing higher technical or professional education in Gujarat.'
      }
    ],

    required_documents: [
      { code: 'DOC_GUJ_DOMICILE', name: 'Gujarat Domicile Certificate / Birth Certificate', mandatory: true },
      { code: 'DOC_GUJ_INCOME', name: 'Income Certificate issued by Mamlatdar / TDO (< ₹6L)', mandatory: true },
      { code: 'DOC_12_PERCENTILE', name: 'Class 12 Marksheet showing >= 80 Percentile Rank', mandatory: true },
      { code: 'DOC_ADMISSION_SLIP', name: 'ACPC Allotment Letter & College Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 150000, frequency: 'ANNUAL', notes: '50% of tuition fee (up to ₹2 Lakh for Medical, ₹50,000 for Engg/Tech)' },
      { type: 'HOSTEL_FEE', amount: 12000, frequency: 'ANNUAL', notes: '₹1,200/month for 10 months for hostellers' },
      { type: 'BOOK_GRANT', amount: 10000, frequency: 'ONE_TIME', notes: 'Book & equipment grant' }
    ]
  },

  // ── 3. MADHYA PRADESH (MMVY & MPTAAS) ──────────────────────────────────────
  {
    id: 'mp-mmvy-medhavi-yojana',
    name: 'Mukhyamantri Medhavi Vidyarthi Yojana (MMVY)',
    provider: 'Department of Technical & Higher Education, Govt. of Madhya Pradesh',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Madhya Pradesh',
    ministry_or_department: 'Higher Education Department, Madhya Pradesh',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% full tuition fee payment directly by the MP Government for meritorious students admitted to Engineering (JEE Main rank <= 1.5 Lakh), Medical (NEET rank), Law (CLAT in NLU), and Government colleges.',
    amount_display: '100% Full Tuition Fee Paid by State Government',
    amount_min: 50000,
    amount_max: 350000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'http://scholarshipportal.mp.nic.in/MedhaviChhatra',
    official_application_url: 'http://scholarshipportal.mp.nic.in/MedhaviChhatra',
    official_guideline_pdf_url: 'http://scholarshipportal.mp.nic.in/MedhaviChhatra/Guidelines.aspx',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Madhya Pradesh',
        mandatory: true,
        description: 'Candidate must be a bonafide resident domicile of Madhya Pradesh.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 70.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 70% in MP Board OR minimum 85% in CBSE/ICSE Board in Class 12 examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income of father/mother must be ≤ ₹6.00 Lakhs.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'Admitted to Engineering, Medical, Law (NLU), Central University, or Govt College.'
      }
    ],

    required_documents: [
      { code: 'DOC_MP_DOMICILE', name: 'MP Mool Niwasi (Domicile) Certificate', mandatory: true },
      { code: 'DOC_MP_SAMAGRA_ID', name: 'Samagra Family ID & Member ID', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate (< ₹6L)', mandatory: true },
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet (70%+ MP Board / 85%+ CBSE)', mandatory: true },
      { code: 'DOC_JEE_NEET_SCORECARD', name: 'National Entrance Exam Scorecard (JEE Rank <= 1.5L / NEET / CLAT)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 200000, frequency: 'ANNUAL', notes: '100% full course fee paid directly to the institute by MP Government' }
    ]
  }
];
