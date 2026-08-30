// =============================================================================
// SOUTH INDIAN STATE GOVERNMENT SCHOLARSHIPS
// States Covered: Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Kerala
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official State Guidelines)
// =============================================================================

export const SOUTH_INDIA_STATE_SCHOLARSHIPS = [
  // ── 1. TAMIL NADU ──────────────────────────────────────────────────────────
  {
    id: 'tn-free-education-bc-mbc',
    name: 'Tamil Nadu Free Education Scheme for BC, MBC, DNC (UG & Professional)',
    provider: 'BC, MBC & Minorities Welfare Department, Govt. of Tamil Nadu',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Tamil Nadu',
    ministry_or_department: 'Backward Classes & Minorities Welfare Department, TN',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Full tuition fee waiver and special fee reimbursement for BC, MBC, and DNC students pursuing 3-year Arts/Science degrees and 4-year Professional Engineering/Medical degrees in Tamil Nadu.',
    amount_display: 'Full Tuition Fee Waiver + Special College Fees',
    amount_min: 20000,
    amount_max: 85000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://bcmbcmw.tn.gov.in',
    official_application_url: 'https://escholarship.tn.gov.in',
    official_guideline_pdf_url: 'https://bcmbcmw.tn.gov.in/schemes_scholarship.htm',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Tamil Nadu',
        mandatory: true,
        description: 'Candidate must be a native permanent domicile resident of Tamil Nadu.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['OBC', 'EWS', 'GENERAL'],
        mandatory: true,
        description: 'Applicable to BC (Backward Classes), MBC (Most Backward Classes), and DNC communities.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹2.50 Lakhs (No income ceiling for First Graduate in family).'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Pursuing regular UG degree or Polytechnic Diploma in government or aided colleges in Tamil Nadu.'
      }
    ],

    required_documents: [
      { code: 'DOC_TN_COMMUNITY', name: 'Tamil Nadu Digital Community Certificate (BC/MBC/DNC)', mandatory: true },
      { code: 'DOC_TN_NATIVITY', name: 'Tamil Nadu Nativity / Domicile Certificate', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Tahsildar (< ₹2.5L)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 65000, frequency: 'ANNUAL', notes: 'Complete exemption from tuition fees, special fees, and exam fees' }
    ]
  },

  {
    id: 'tn-post-matric-sc-st',
    name: 'Tamil Nadu Post-Matric Scholarship for SC, ST & SCC Students',
    provider: 'Adi Dravidar and Tribal Welfare Department, Govt. of Tamil Nadu',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Tamil Nadu',
    ministry_or_department: 'Adi Dravidar and Tribal Welfare Department, Tamil Nadu',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% compulsory non-refundable fee waiver and maintenance allowance for SC, ST, and Scheduled Caste Converts to Christianity (SCC) in Tamil Nadu.',
    amount_display: '100% Fee Waiver + ₹13,500 / year Maintenance Allowance',
    amount_min: 13500,
    amount_max: 120000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://adw.tn.gov.in',
    official_application_url: 'https://escholarship.tn.gov.in',
    official_guideline_pdf_url: 'https://adw.tn.gov.in/schemes_postmatric.htm',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Tamil Nadu',
        mandatory: true,
        description: 'Must be a native domicile of Tamil Nadu.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST'],
        mandatory: true,
        description: 'Exclusively for SC, ST, and SCC students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹2.50 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PHD_RESEARCH'],
        mandatory: true,
        description: 'Enrolled in any recognized post-matric course.'
      }
    ],

    required_documents: [
      { code: 'DOC_TN_CASTE', name: 'Digital SC/ST Community Certificate with QR code', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Tahsildar (< ₹2.5L)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 100000, frequency: 'ANNUAL', notes: '100% compulsory non-refundable fees reimbursed' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 13500, frequency: 'ANNUAL', notes: 'Direct bank transfer for living expenses' }
    ]
  },

  {
    id: 'tn-pudhumai-penn-scheme',
    name: 'Moovalur Ramamirtham Ammaiyar Higher Education Assurance Scheme (Pudhumai Penn)',
    provider: 'Social Welfare and Women Empowerment Department, Govt. of Tamil Nadu',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Tamil Nadu',
    ministry_or_department: 'Social Welfare Department, Tamil Nadu',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Provides ₹1,000 per month directly into bank accounts of girl students who studied in Government Schools (Classes 6 to 12) to pursue higher graduation degrees.',
    amount_display: '₹1,000 / month (₹12,000 / year until graduation)',
    amount_min: 12000,
    amount_max: 12000,
    amount_type: 'MONTHLY_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://pudhumaipenn.tn.gov.in',
    official_application_url: 'https://pudhumaipenn.tn.gov.in',
    official_guideline_pdf_url: 'https://pudhumaipenn.tn.gov.in/guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Tamil Nadu',
        mandatory: true,
        description: 'Must be a native of Tamil Nadu.'
      },
      {
        field: 'gender',
        operator: '==',
        value: 'FEMALE',
        mandatory: true,
        description: 'Exclusively for female students.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Pursuing regular UG degree, professional degree, or diploma.'
      }
    ],

    required_documents: [
      { code: 'DOC_GOVT_SCHOOL_STUDY', name: 'EMIS Certificate proving study from Classes 6 to 12 in Tamil Nadu Government School', mandatory: true },
      { code: 'DOC_COLLEGE_ID', name: 'College Admission Bonafide and Aadhaar Seeded Bank Account', mandatory: true }
    ],

    benefits: [
      { type: 'MONTHLY_STIPEND', amount: 12000, frequency: 'ANNUAL', notes: '₹1,000/month credited directly through DBT until course completion' }
    ]
  },

  // ── 2. KARNATAKA ───────────────────────────────────────────────────────────
  {
    id: 'karnataka-ssp-post-matric',
    name: 'Karnataka State Scholarship Portal (SSP) Post-Matric Scholarship',
    provider: 'Social Welfare & Backward Classes Welfare Department, Govt. of Karnataka',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Karnataka',
    ministry_or_department: 'Social Welfare & BCWD, Karnataka',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Unified state scholarship portal for Karnataka domicile students covering tuition fee reimbursement, maintenance charges, and Vidyasiri food & accommodation stipends.',
    amount_display: 'Full Fee Reimbursement + ₹1,500 / month Vidyasiri Stipend',
    amount_min: 18000,
    amount_max: 95000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-15',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-10',
    official_website_url: 'https://ssp.postmatric.karnataka.gov.in',
    official_application_url: 'https://ssp.postmatric.karnataka.gov.in',
    official_guideline_pdf_url: 'https://ssp.postmatric.karnataka.gov.in/docs/Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Karnataka',
        mandatory: true,
        description: 'Must be a permanent domicile resident of Karnataka.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST', 'OBC', 'EWS'],
        mandatory: true,
        description: 'Covering SC, ST, Category-1, 2A, 2B, 3A, 3B OBC communities.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Income ceiling of ₹2.5L for SC/ST/Cat-1 and ₹1.0L for other OBC categories.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in post-matric studies in Karnataka.'
      }
    ],

    required_documents: [
      { code: 'DOC_KUTUMBA_ID', name: 'Karnataka Kutumba Family ID & Caste/Income RD Certificate Number', mandatory: true },
      { code: 'DOC_COLLEGE_REG', name: 'University / College Student Registration Number (USN / Reg No)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 60000, frequency: 'ANNUAL', notes: 'Direct tuition fee credit to college' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 15000, frequency: 'ANNUAL', notes: '₹1,500/month for 10 months for hostellers/Vidyasiri' }
    ]
  },

  // ── 3. ANDHRA PRADESH ──────────────────────────────────────────────────────
  {
    id: 'ap-jagananna-vidya-deevena',
    name: 'Jagananna Vidya Deevena (Reimbursement of Tuition Fee - RTF)',
    provider: 'Higher Education Department & Social Welfare, Govt. of Andhra Pradesh',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Andhra Pradesh',
    ministry_or_department: 'Social Welfare Department, Andhra Pradesh',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% full fee reimbursement for eligible students pursuing ITI, Polytechnic, Degree, B.Tech, MBA, MCA, Pharmacy, and PG courses in Andhra Pradesh.',
    amount_display: '100% Full Tuition Fee Reimbursement (Credited Quarterly)',
    amount_min: 20000,
    amount_max: 120000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://jnanabhumi.ap.gov.in',
    official_application_url: 'https://jnanabhumi.ap.gov.in',
    official_guideline_pdf_url: 'https://jnanabhumi.ap.gov.in/Guidelines.edu',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Andhra Pradesh',
        mandatory: true,
        description: 'Must be a native domicile resident of Andhra Pradesh.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Total family income must not exceed ₹2.50 Lakhs per annum.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST', 'OBC', 'EWS', 'GENERAL'],
        mandatory: true,
        description: 'Covering SC, ST, BC, EBC, Kapu, Minority, and Differently Abled students.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in recognized higher education courses in AP.'
      }
    ],

    required_documents: [
      { code: 'DOC_AP_RATION_CARD', name: 'AP Rice Card / Household Ration Card', mandatory: true },
      { code: 'DOC_CASTE_INCOME_MEESEVA', name: 'MeeSeva Integrated Caste and Income Certificate', mandatory: true },
      { code: 'DOC_MOTHER_BANK_ACC', name: 'Mother’s Aadhaar-linked Bank Account Passbook (JVD funds deposited to mother)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 85000, frequency: 'ANNUAL', notes: '100% full tuition and special fee credited in 4 quarterly installments' }
    ]
  },

  // ── 4. TELANGANA ───────────────────────────────────────────────────────────
  {
    id: 'ts-epass-post-matric',
    name: 'Telangana ePASS Post Matric Scholarship (RTF & MTF)',
    provider: 'Scheduled Castes / BC / Tribal Development Department, Govt. of Telangana',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Telangana',
    ministry_or_department: 'BC & Social Welfare Department, Telangana',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Post matric Reimbursement of Tuition Fee (RTF) and Maintenance Fee (MTF) for Telangana students pursuing graduation, engineering, medicine, and post-graduation.',
    amount_display: 'Full Tuition Fee Waiver + ₹5,500 to ₹15,000 / year MTF',
    amount_min: 25000,
    amount_max: 110000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-15',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://telanganaepass.cgg.gov.in',
    official_application_url: 'https://telanganaepass.cgg.gov.in',
    official_guideline_pdf_url: 'https://telanganaepass.cgg.gov.in/PostmatricSchemeDetails.do',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Telangana',
        mandatory: true,
        description: 'Candidate must be a domicile of Telangana.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 200000,
        unit: 'INR',
        mandatory: true,
        description: 'Income ≤ ₹2.00 Lakh for SC/ST/BC (Rural) and ₹1.50 Lakh for BC (Urban).'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST', 'OBC', 'EWS'],
        mandatory: true,
        description: 'Covering SC, ST, BC, EBC, Minority, and Disabled students.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in recognized post-matric degree/diploma courses.'
      }
    ],

    required_documents: [
      { code: 'DOC_TS_MEESEVA_CASTE', name: 'MeeSeva Caste & Income Certificate', mandatory: true },
      { code: 'DOC_CET_ALLOTMENT', name: 'EAMCET / ECET / ICET / PGECET Convener Allotment Order', mandatory: true },
      { code: 'DOC_AADHAAR_BANK', name: 'Aadhaar Seeded Nationalized Bank Account', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 80000, frequency: 'ANNUAL', notes: 'Direct tuition fee credit to college' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 15000, frequency: 'ANNUAL', notes: 'Monthly mess and hostel allowance' }
    ]
  },

  // ── 5. KERALA ──────────────────────────────────────────────────────────────
  {
    id: 'kerala-dce-state-merit',
    name: 'Kerala State Merit Scholarship (SMS)',
    provider: 'Directorate of Collegiate Education (DCE), Govt. of Kerala',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Kerala',
    ministry_or_department: 'Higher Education Department, Kerala',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Merit scholarship awarded to top students admitted to first-year undergraduate and postgraduate programs in Government and Aided Arts and Science colleges in Kerala.',
    amount_display: '₹1,250 / year (UG) & ₹1,500 / year (PG)',
    amount_min: 1250,
    amount_max: 1500,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-11-30',
    official_website_url: 'http://www.dcescholarship.kerala.gov.in',
    official_application_url: 'http://www.dcescholarship.kerala.gov.in',
    official_guideline_pdf_url: 'http://www.dcescholarship.kerala.gov.in/dce/he_ma/he_sms.php',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Kerala',
        mandatory: true,
        description: 'Candidate must be a native domicile of Kerala.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 50.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 50% marks in Plus Two / Qualifying exam.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 100000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹1.00 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: '1st year students of UG/PG degree courses.'
      }
    ],

    required_documents: [
      { code: 'DOC_KERALA_NATIVITY', name: 'Nativity Certificate issued by Village Officer', mandatory: true },
      { code: 'DOC_INCOME_VILLAGE', name: 'Income Certificate from Village Officer (< ₹1L)', mandatory: true },
      { code: 'DOC_PLUS_TWO_MARKS', name: 'Plus Two / Degree Passed Marksheet', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 1500, frequency: 'ANNUAL', notes: 'Direct financial assistance' }
    ]
  }
];
