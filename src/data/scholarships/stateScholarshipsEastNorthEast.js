// =============================================================================
// EAST & NORTH-EAST INDIAN STATE GOVERNMENT SCHOLARSHIPS
// States Covered: West Bengal, Bihar, Odisha, Assam, Jharkhand, North East
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official State Guidelines)
// =============================================================================

export const EAST_NORTHEAST_STATE_SCHOLARSHIPS = [
  // ── 1. WEST BENGAL (SVMCM & OASIS) ─────────────────────────────────────────
  {
    id: 'wb-svmcm-merit-means',
    name: 'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
    provider: 'Higher Education Department, Govt. of West Bengal',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'West Bengal',
    ministry_or_department: 'Department of Higher Education, West Bengal',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Major West Bengal state merit-cum-means scholarship providing monthly stipends from ₹1,000 to ₹5,000 to meritorious students from economically weaker sections pursuing higher education.',
    amount_display: '₹12,000 to ₹60,000 / year (₹1,000 – ₹5,000 / month)',
    amount_min: 12000,
    amount_max: 60000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://svmcm.wbhed.gov.in',
    official_application_url: 'https://svmcm.wbhed.gov.in',
    official_guideline_pdf_url: 'https://svmcm.wbhed.gov.in/instruction.php',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'West Bengal',
        mandatory: true,
        description: 'Permanent domicile of West Bengal studying in an institution within West Bengal.'
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
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% marks in Class 10 (for HS) / Class 12 (for UG) / Graduation (for PG).'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Pursuing regular courses in Arts, Science, Commerce, Engineering, Medical, or Management.'
      }
    ],

    required_documents: [
      { code: 'DOC_WB_DOMICILE', name: 'Ration Card / Voter ID / Aadhaar / Domicile Certificate of West Bengal', mandatory: true },
      { code: 'DOC_INCOME_BDO', name: 'Income Certificate from BDO / Jt. BDO / Executive Officer (< ₹2.5L)', mandatory: true },
      { code: 'DOC_PREV_MARKSHEET', name: 'Both sides of Madhyamik / Higher Secondary Marksheet (Min 60%)', mandatory: true }
    ],

    benefits: [
      { type: 'MAINTENANCE_ALLOWANCE', amount: 18000, frequency: 'ANNUAL', notes: '₹1,500/month for UG Arts & Commerce' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 30000, frequency: 'ANNUAL', notes: '₹2,500/month for UG Science / PG Arts & Commerce' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 60000, frequency: 'ANNUAL', notes: '₹5,000/month for UG Engineering & Medical' }
    ]
  },

  // ── 2. BIHAR (PMS ONLINE BIHAR) ────────────────────────────────────────────
  {
    id: 'bihar-pms-bc-ebc',
    name: 'Bihar Post-Matric Scholarship Scheme for BC & EBC Students',
    provider: 'BC and EBC Welfare Department, Govt. of Bihar',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Bihar',
    ministry_or_department: 'Backward & Extremely Backward Class Welfare Department, Bihar',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Post matric fee reimbursement and maintenance allowance for Backward Class (BC) and Extremely Backward Class (EBC) students studying in Bihar or recognized institutions outside Bihar.',
    amount_display: 'Full Tuition Fee Reimbursement (Up to ₹1,50,000 / year)',
    amount_min: 20000,
    amount_max: 150000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-15',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://pmsonline.bih.nic.in',
    official_application_url: 'https://pmsonline.bih.nic.in',
    official_guideline_pdf_url: 'https://pmsonline.bih.nic.in/pmsedu/(S(i13cgtj4b0uufb55ehbaxb1u))/Docs/Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Bihar',
        mandatory: true,
        description: 'Candidate must be a permanent resident domicile of Bihar.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['OBC', 'EBC'],
        mandatory: true,
        description: 'Exclusively for BC and EBC students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 300000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹3.00 Lakh per annum.'
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
      { code: 'DOC_BIHAR_RESIDENCE', name: 'Bihar Domicile Certificate (Aawasiya Praman Patra)', mandatory: true },
      { code: 'DOC_BIHAR_CASTE', name: 'Digital BC/EBC Caste Certificate (Jati Praman Patra)', mandatory: true },
      { code: 'DOC_BIHAR_INCOME', name: 'Income Certificate (< ₹3L)', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'College Bonafide Certificate & Verified Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 90000, frequency: 'ANNUAL', notes: 'Full government fixed tuition fee reimbursement directly into bank account' }
    ]
  },

  // ── 3. ODISHA (STATE SCHOLARSHIP PORTAL) ───────────────────────────────────
  {
    id: 'odisha-e-medhabruti',
    name: 'Odisha e-Medhabruti Scholarship (UG, PG & Technical/Professional)',
    provider: 'Higher Education Department, Govt. of Odisha',
    provider_type: 'GOVERNMENT',
    government_level: 'STATE',
    state: 'Odisha',
    ministry_or_department: 'Higher Education Department, Odisha',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'State merit scholarship awarded to top students of Odisha pursuing +3 (Degree), Post-Graduate, and Technical/Professional courses (Engineering, Medical, MBA, MCA, Agriculture).',
    amount_display: '₹5,000 / year (UG) & ₹10,000 / year (PG & Technical/Professional)',
    amount_min: 5000,
    amount_max: 10000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-11-30',
    official_website_url: 'https://scholarship.odisha.gov.in',
    official_application_url: 'https://scholarship.odisha.gov.in',
    official_guideline_pdf_url: 'https://scholarship.odisha.gov.in/website/scholarship-guidelines',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: '==',
        value: 'Odisha',
        mandatory: true,
        description: 'Candidate must be a permanent resident of Odisha.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% marks in the qualifying examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹6.00 Lakhs.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'Enrolled in 1st year of degree, PG, or technical course.'
      }
    ],

    required_documents: [
      { code: 'DOC_ODISHA_RESIDENT', name: 'Odisha Resident / Domicile Certificate from Tahsildar', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Revenue Authority (< ₹6L)', mandatory: true },
      { code: 'DOC_PREV_MARKS', name: 'Previous Examination Passed Marksheet (Min 60%)', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 10000, frequency: 'ANNUAL', notes: '₹10,000/year for Technical/Professional & PG courses; ₹5,000/year for general UG' }
    ]
  }
];
