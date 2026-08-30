// =============================================================================
// NORTH INDIAN STATE GOVERNMENT SCHOLARSHIPS
// States Covered: Uttar Pradesh, Delhi, Rajasthan, Punjab, Haryana, Himachal Pradesh
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official State Guidelines)
// =============================================================================

export const NORTH_INDIA_STATE_SCHOLARSHIPS = [
  // ── 1. UTTAR PRADESH (UP SCHOLARSHIP PORTAL) ───────────────────────────────
  {
    id: 'up-post-matric-other-than-inter-obc',
    name: 'UP Post-Matric Scholarship (Other than Intermediate) for OBC',
    provider: 'Backward Class Welfare Department, Govt. of Uttar Pradesh',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Uttar Pradesh',
    ministry_or_department: 'Backward Class Welfare Department, Uttar Pradesh',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Direct fee reimbursement and maintenance stipend for Other Backward Classes (OBC) students pursuing undergraduate, postgraduate, and professional diploma courses in UP.',
    amount_display: 'Full Non-Refundable Fee Reimbursement + ₹9,000 / year Maintenance',
    amount_min: 20000,
    amount_max: 85000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://scholarship.up.gov.in',
    official_application_url: 'https://scholarship.up.gov.in',
    official_guideline_pdf_url: 'https://scholarship.up.gov.in/pdf/PostMatric_OBC_GR.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Uttar Pradesh',
        mandatory: true,
        description: 'Must be a permanent domicile resident of Uttar Pradesh.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['OBC'],
        mandatory: true,
        description: 'Exclusively for Other Backward Classes (OBC) students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 200000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹2.00 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in recognized post-intermediate degree/diploma courses.'
      }
    ],

    required_documents: [
      { code: 'DOC_UP_DOMICILE', name: 'UP Domicile Certificate (Niwas Praman Patra)', mandatory: true },
      { code: 'DOC_UP_CASTE', name: 'Digital OBC Caste Certificate (Jati Praman Patra)', mandatory: true },
      { code: 'DOC_UP_INCOME', name: 'Income Certificate issued by Revenue Tehsildar (< ₹2L)', mandatory: true },
      { code: 'DOC_AADHAAR_BANK', name: 'Aadhaar Seeded Active Bank Account', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 65000, frequency: 'ANNUAL', notes: 'Full fee reimbursement of non-refundable college fees' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 9000, frequency: 'ANNUAL', notes: 'Monthly maintenance stipend' }
    ]
  },

  {
    id: 'up-post-matric-sc-st',
    name: 'UP Post-Matric Scholarship for SC / ST Students',
    provider: 'Social Welfare Department, Govt. of Uttar Pradesh',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Uttar Pradesh',
    ministry_or_department: 'Social Welfare Department, Uttar Pradesh',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% compulsory fee reimbursement and maintenance allowance for SC and ST students in Uttar Pradesh.',
    amount_display: '100% Compulsory Fee Waiver + ₹12,000 / year Maintenance',
    amount_min: 25000,
    amount_max: 100000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://scholarship.up.gov.in',
    official_application_url: 'https://scholarship.up.gov.in',
    official_guideline_pdf_url: 'https://scholarship.up.gov.in/pdf/PostMatric_SC_GR.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Uttar Pradesh',
        mandatory: true,
        description: 'Candidate must be a native domicile resident of Uttar Pradesh.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST'],
        mandatory: true,
        description: 'Exclusively for Scheduled Caste (SC) and Scheduled Tribe (ST) students.'
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
        description: 'Pursuing regular post-matric course.'
      }
    ],

    required_documents: [
      { code: 'DOC_UP_CASTE', name: 'Digital SC/ST Caste Certificate with Verification Number', mandatory: true },
      { code: 'DOC_UP_INCOME', name: 'Income Certificate from Tehsildar (< ₹2.5L)', mandatory: true },
      { code: 'DOC_COLLEGE_RECEIPT', name: 'College Admission Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 85000, frequency: 'ANNUAL', notes: '100% compulsory non-refundable fees reimbursed' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 12000, frequency: 'ANNUAL', notes: 'Annual maintenance allowance' }
    ]
  },

  // ── 2. DELHI (E-DISTRICT PORTAL) ───────────────────────────────────────────
  {
    id: 'delhi-merit-cum-means-higher-ed',
    name: 'Delhi Merit-cum-Means Income Linked Financial Assistance Scheme',
    provider: 'Delhi Higher Education Trust, Directorate of Higher Education, Govt. of NCT of Delhi',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Delhi',
    ministry_or_department: 'Directorate of Higher Education, Delhi',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Providing 100%, 50%, or 25% fee reimbursement for students pursuing undergraduate degree courses in Delhi State Universities (DTU, NSUT, IIITD, IGDTUW, IPU, DPSRU, DSEU).',
    amount_display: '100% Full Fee Waiver (Income < ₹2.5L) / 50% (Income ₹2.5L – ₹6L)',
    amount_min: 50000,
    amount_max: 200000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-08-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://edistrict.delhigovt.nic.in',
    official_application_url: 'https://edistrict.delhigovt.nic.in',
    official_guideline_pdf_url: 'https://www.delhi.gov.in/wps/wcm/connect/doit_dhe/DHE/Home/MCM_Scheme',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Delhi',
        mandatory: true,
        description: 'Candidate must be an Indian national pursuing undergraduate degree in a Delhi State University.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% marks in Class 12 board examination without backlogs.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: '100% fee waiver for NFSA/BPL Card or income < ₹2.5L; 50% waiver for income between ₹2.5L to ₹6.0L.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'Enrolled in full-time UG degree in Delhi State University.'
      }
    ],

    required_documents: [
      { code: 'DOC_DELHI_INCOME', name: 'Income Certificate issued by SDM (< ₹6L) or National Food Security Card (Ration Card)', mandatory: true },
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet (Min 60%)', mandatory: true },
      { code: 'DOC_UNIV_FEE_RECEIPT', name: 'Delhi State University Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 150000, frequency: 'ANNUAL', notes: '100% or 50% tuition fee reimbursement directly into student bank account' }
    ]
  },

  // ── 3. RAJASTHAN (RAJSSP & SJE) ────────────────────────────────────────────
  {
    id: 'rajasthan-sje-uttar-matric',
    name: 'Rajasthan Uttar Matric Scholarship Scheme (SJE)',
    provider: 'Social Justice and Empowerment Department, Govt. of Rajasthan',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Rajasthan',
    ministry_or_department: 'Social Justice and Empowerment Department, Rajasthan',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: '100% non-refundable fees reimbursement for SC, ST, OBC, MBC, EBC, and DNT students studying in higher educational institutions in Rajasthan.',
    amount_display: '100% Full Non-Refundable Fee Reimbursement',
    amount_min: 25000,
    amount_max: 120000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://sjmsnew.rajasthan.gov.in/scholarship',
    official_application_url: 'https://sso.rajasthan.gov.in',
    official_guideline_pdf_url: 'https://sje.rajasthan.gov.in/Default.aspx?PageID=38',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Rajasthan',
        mandatory: true,
        description: 'Candidate must be a bonafide resident of Rajasthan with Jan Aadhaar Card.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['SC', 'ST', 'OBC', 'EWS'],
        mandatory: true,
        description: 'Covering SC, ST, OBC, MBC, EBC, DNT, and PwD students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Family income must not exceed ₹2.50 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in post-matric recognized institutions.'
      }
    ],

    required_documents: [
      { code: 'DOC_JAN_AADHAAR', name: 'Rajasthan Jan Aadhaar Card / Bhamashah Card', mandatory: true },
      { code: 'DOC_RAJ_DOMICILE', name: 'Mool Niwas (Bonafide Domicile) Certificate with QR', mandatory: true },
      { code: 'DOC_RAJ_CASTE', name: 'Digital Caste Certificate (SC/ST/OBC/MBC)', mandatory: true },
      { code: 'DOC_RAJ_INCOME', name: 'Income Certificate from Tehsildar (< ₹2.5L)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 80000, frequency: 'ANNUAL', notes: '100% non-refundable fees reimbursed' }
    ]
  }
];
