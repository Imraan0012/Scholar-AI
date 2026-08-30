// =============================================================================
// CENTRAL GOVERNMENT SCHOLARSHIPS (NSP, MINISTRIES OF INDIA)
// Sources: National Scholarship Portal (scholarships.gov.in), MoE, MoSJE, MoTA, DEPwD, MoMA, MoLE, MHA
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official Guidelines)
// =============================================================================

export const CENTRAL_GOVT_SCHOLARSHIPS = [
  {
    id: 'nsp-pm-usp-csss',
    name: 'PM-USP Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Department of Higher Education, Ministry of Education, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Education',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Provides financial assistance to meritorious students from low-income families to meet day-to-day expenses while pursuing regular undergraduate and postgraduate courses.',
    amount_display: '₹12,000 / year (UG) to ₹20,000 / year (PG)',
    amount_min: 12000,
    amount_max: 20000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://www.education.gov.in/en/scholarships-education',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'CLASS_12_PASSED'],
        mandatory: true,
        description: 'Enrolled in a regular degree course in a recognized college/university.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 80.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Above 80th percentile of successful candidates in relevant stream from respective Board.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 450000,
        unit: 'INR',
        mandatory: true,
        description: 'Gross annual family income must not exceed ₹4.50 Lakhs.'
      },
      {
        field: 'category',
        operator: 'IN',
        value: ['GENERAL', 'OBC', 'SC', 'ST', 'EWS'],
        mandatory: true,
        description: 'Open to all categories (15% SC, 7.5% ST, 27% OBC, 10% EWS, 5% PwD).'
      },
      {
        field: 'domicile_state',
        operator: '==',
        value: 'ALL_INDIA',
        mandatory: true,
        description: 'Pan-India quota distributed among states based on population.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Board Marksheet', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate (< ₹4.5L)', mandatory: true },
      { code: 'DOC_BONAFIDE', name: 'College Bonafide Student Certificate', mandatory: true },
      { code: 'DOC_AADHAAR_BANK', name: 'Aadhaar Seeded Bank Account', mandatory: true }
    ],

    benefits: [
      { type: 'MAINTENANCE_ALLOWANCE', amount: 12000, frequency: 'ANNUAL', notes: '₹1,000/month for UG (1st to 3rd year)' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 20000, frequency: 'ANNUAL', notes: '₹2,000/month for 4th/5th year or PG' }
    ]
  },

  {
    id: 'mosje-post-matric-sc',
    name: 'Centrally Sponsored Post-Matric Scholarship Scheme for SC Students',
    provider: 'Ministry of Social Justice and Empowerment, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Social Justice and Empowerment',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Centrally sponsored national scheme covering 100% compulsory non-refundable fees and monthly maintenance allowance for Scheduled Caste (SC) students pursuing post-matriculation studies.',
    amount_display: 'Full Compulsory Fees + ₹13,500 / year Maintenance Allowance',
    amount_min: 13500,
    amount_max: 150000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://socialjustice.gov.in/schemes/26',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/PMS_SC_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'category',
        operator: '==',
        value: 'SC',
        mandatory: true,
        description: 'Exclusively for Scheduled Caste (SC) students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Total annual family income must not exceed ₹2.50 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PHD_RESEARCH'],
        mandatory: true,
        description: 'Pursuing recognized post-matric course in government or recognized private institutions.'
      }
    ],

    required_documents: [
      { code: 'DOC_CASTE_CERT', name: 'Digital SC Caste Certificate issued by Competent Authority', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Valid Income Certificate (< ₹2.5L)', mandatory: true },
      { code: 'DOC_ADMISSION_RECEIPT', name: 'Institute Admission Slip & Fee Structure', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 100000, frequency: 'ANNUAL', notes: '100% compulsory non-refundable fees reimbursed' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 13500, frequency: 'ANNUAL', notes: 'Direct DBT transfer for hostellers / day scholars' }
    ]
  },

  {
    id: 'mosje-post-matric-obc',
    name: 'Centrally Sponsored Post-Matric Scholarship Scheme for OBC Students',
    provider: 'Ministry of Social Justice and Empowerment, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Social Justice and Empowerment',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Financial assistance to Other Backward Classes (OBC) students for post-matric and higher studies to enable them to complete their education.',
    amount_display: 'Tuition Fee Waiver + Maintenance Allowance (₹4,000 – ₹10,000 / year)',
    amount_min: 15000,
    amount_max: 60000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://socialjustice.gov.in/schemes/32',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://socialjustice.gov.in/writereaddata/UploadFile/PMS_OBC_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'category',
        operator: 'IN',
        value: ['OBC', 'EBC', 'EWS'],
        mandatory: true,
        description: 'Exclusively for Other Backward Classes (OBC) non-creamy layer candidates.'
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
        value: ['CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Pursuing post-matric courses in recognized educational institutions.'
      }
    ],

    required_documents: [
      { code: 'DOC_OBC_NCL', name: 'OBC Non-Creamy Layer Certificate', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Revenue Authority (< ₹2.5L)', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'Institute Bonafide & Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 45000, frequency: 'ANNUAL', notes: 'Compulsory fee waiver' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 10000, frequency: 'ANNUAL', notes: 'Annual maintenance allowance' }
    ]
  },

  {
    id: 'mota-national-fellowship-st',
    name: 'National Fellowship and Scholarship for Higher Education of ST Students',
    provider: 'Ministry of Tribal Affairs, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Tribal Affairs',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Full tuition fee reimbursement and living allowance for Scheduled Tribe (ST) students studying in top notified higher education institutes (IITs, IIMs, NITs, AIIMS, Central Universities).',
    amount_display: 'Full Tuition Fee + ₹36,000 / year Living Allowance + ₹45,000 PC Grant',
    amount_min: 86000,
    amount_max: 350000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://tribal.nic.in/NFST.aspx',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://tribal.nic.in/downloads/Scholarship/NFST_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'category',
        operator: '==',
        value: 'ST',
        mandatory: true,
        description: 'Exclusively for Scheduled Tribe (ST) students.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Family income must not exceed ₹6.00 Lakhs per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'PHD_RESEARCH'],
        mandatory: true,
        description: 'Admitted to notified premier institutions (IITs, NITs, Central Universities).'
      }
    ],

    required_documents: [
      { code: 'DOC_ST_CERT', name: 'Digital ST Caste Certificate issued by Competent Authority', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Revenue Authority (< ₹6L)', mandatory: true },
      { code: 'DOC_ADMISSION_LETTER', name: 'Premier Institute Admission Letter & Fee Structure', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 250000, frequency: 'ANNUAL', notes: '100% full tuition fee paid directly' },
      { type: 'MAINTENANCE_ALLOWANCE', amount: 36000, frequency: 'ANNUAL', notes: '₹3,000/month living expenses' },
      { type: 'CONTINGENCY', amount: 45000, frequency: 'ONE_TIME', notes: 'One-time computer purchase grant' }
    ]
  },

  {
    id: 'mha-pmss-capf-ar',
    name: 'Prime Minister’s Scholarship Scheme (PMSS) for Central Armed Police Forces & Assam Rifles',
    provider: 'Welfare and Rehabilitation Board (WARB), Ministry of Home Affairs, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Home Affairs',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Scholarships for dependent wards and surviving widows of CAPF & AR personnel pursuing professional undergraduate and technical education (B.Tech, MBBS, BDS, B.Pharm, B.Sc Nursing).',
    amount_display: '₹3,000 / month (Girls) & ₹2,500 / month (Boys)',
    amount_min: 30000,
    amount_max: 360000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://warb-mha.gov.in',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://warb-mha.gov.in/PMSS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% marks in Class 12 / Diploma / Graduation for professional degree admission.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'First professional degree course recognized by regulatory bodies (MCI, AICTE, DCI, PCI).'
      },
      {
        field: 'current_year',
        operator: '==',
        value: 1,
        mandatory: true,
        description: 'Fresh applications are for 1st year students only.'
      }
    ],

    required_documents: [
      { code: 'DOC_WARB_CERT', name: 'Serving / Discharge Certificate of CAPF/Assam Rifles Parent', mandatory: true },
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Board Marksheet (Min 60%)', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'Bonafide Certificate from Principal of College', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 36000, frequency: 'ANNUAL', notes: '₹3,000/month for female wards' },
      { type: 'ANNUAL_STIPEND', amount: 30000, frequency: 'ANNUAL', notes: '₹2,500/month for male wards' }
    ]
  },

  {
    id: 'railways-pmss-rpf',
    name: 'Prime Minister’s Scholarship Scheme for RPF / RPSF',
    provider: 'Security Directorate, Ministry of Railways, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Railways',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Encouraging higher technical and professional education for the dependent wards of ex-RPF/RPSF personnel.',
    amount_display: '₹2,500 to ₹3,000 / month (Paid Annually)',
    amount_min: 30000,
    amount_max: 36000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://indianrailways.gov.in',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://scholarships.gov.in/public/schemeGuidelines/PMSS_RPF_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'is_ward_of_defense_or_capf',
        operator: '==',
        value: true,
        mandatory: true,
        description: 'Exclusively for dependent wards of Ex-RPF / RPSF railway security personnel.'
      },
      {
        field: 'current_year',
        operator: 'IN',
        value: [1],
        mandatory: true,
        description: 'Fresh admission in 1st Year of Professional Degree course.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% in Class 12 for technical and professional degree programs.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'Professional courses (Engineering, Medical, Dental, Veterinary, Architecture, MBA, MCA).'
      }
    ],

    required_documents: [
      { code: 'DOC_RPF_CERT', name: 'Service Certificate issued by Railway Security Directorate', mandatory: true },
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 36000, frequency: 'ANNUAL', notes: '₹36,000/year for girls, ₹30,000/year for boys' }
    ]
  },

  {
    id: 'mole-beedi-cine-workers',
    name: 'Financial Assistance for Education of the Wards of Beedi / Cine / IOMC Workers',
    provider: 'Labour Welfare Organisation, Ministry of Labour and Employment, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Labour and Employment',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Direct scholarship grants to the wards of beedi, iron ore, manganese ore, chrome ore, and cine workers from Class 1 to Professional Degree education.',
    amount_display: '₹3,000 to ₹25,000 / year (Based on Course Level)',
    amount_min: 3000,
    amount_max: 25000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://labour.gov.in',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://scholarships.gov.in/public/schemeGuidelines/MoLE_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 120000,
        unit: 'INR',
        mandatory: true,
        description: 'Total monthly income of parent worker must not exceed ₹10,000 (₹1.20 Lakh per annum).'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['CLASS_10', 'CLASS_12_PASSED', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA'],
        mandatory: true,
        description: 'Enrolled in any recognized school, college, or university.'
      }
    ],

    required_documents: [
      { code: 'DOC_WORKER_ID', name: 'Identity Card of Beedi/Cine/IOMC/LSDM Worker parent', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate / Salary Certificate (< ₹1.2L)', mandatory: true },
      { code: 'DOC_PREV_PASS', name: 'Previous Academic Year Passed Marksheet', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 25000, frequency: 'ANNUAL', notes: '₹25,000/year for Engineering, Medical, and professional degree courses' }
    ]
  }
];
