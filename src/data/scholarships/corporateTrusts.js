// =============================================================================
// PREMIER CORPORATE & PHILANTHROPIC SCHOLARSHIP TRUSTS OF INDIA
// Sources: reliancefoundation.org, tatatrusts.org, kotakeducation.org, sbifoundation.in, hdfcbank.com, ongcindia.com, infosys.org
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official Guidelines)
// =============================================================================

export const CORPORATE_TRUST_SCHOLARSHIPS = [
  {
    id: 'reliance-foundation-ug',
    name: 'Reliance Foundation Undergraduate Scholarship 2026',
    provider: 'Reliance Foundation (CSR Initiative of Reliance Industries)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Reliance Foundation Philanthropy',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Selects 5,000 meritorious Indian undergraduate students each year across all streams to support their entire degree duration with direct grants and leadership development programs.',
    amount_display: 'Up to ₹2,00,000 Total (Stipend over degree duration)',
    amount_min: 50000,
    amount_max: 200000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://www.scholarships.reliancefoundation.org',
    official_application_url: 'https://www.scholarships.reliancefoundation.org/UG_Scholarship.aspx',
    official_guideline_pdf_url: 'https://www.scholarships.reliancefoundation.org/assets/pdf/RF_UG_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'CLASS_12_PASSED'],
        mandatory: true,
        description: 'First-year full-time regular undergraduate students in any stream.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% aggregate in Class 12 board examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 1500000,
        unit: 'INR',
        mandatory: true,
        description: 'Household income < ₹15 Lakhs (Strong preference for income < ₹2.5 Lakhs).'
      }
    ],

    required_documents: [
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Board Marksheet (Min 60%)', mandatory: true },
      { code: 'DOC_INCOME_PROOF', name: 'Income Certificate / Salary Slip / Form 16 / ITR of parents', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'College Admission Bonafide / ID Card / Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 50000, frequency: 'ANNUAL', notes: 'Up to ₹2,00,000 distributed over the degree duration' }
    ]
  },

  {
    id: 'reliance-foundation-pg',
    name: 'Reliance Foundation Postgraduate Scholarship in Technology & AI 2026',
    provider: 'Reliance Foundation (CSR Initiative of Reliance Industries)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Reliance Foundation Philanthropy',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Selects 100 top postgraduate students in Computer Science, Artificial Intelligence, Mathematics & Computing, and Electrical Engineering with up to ₹6 Lakhs total grant.',
    amount_display: 'Up to ₹6,00,000 Total (Over Postgraduate Degree Duration)',
    amount_min: 300000,
    amount_max: 600000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://www.scholarships.reliancefoundation.org',
    official_application_url: 'https://www.scholarships.reliancefoundation.org/PG_Scholarship.aspx',
    official_guideline_pdf_url: 'https://www.scholarships.reliancefoundation.org/assets/pdf/RF_PG_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['POSTGRADUATE'],
        mandatory: true,
        description: 'First-year full-time regular postgraduate students (M.Tech/M.S) in Computer Science, AI, Data Science, Math & Computing, Electrical.'
      },
      {
        field: 'min_cgpa',
        operator: '>=',
        value: 7.5,
        unit: 'CGPA',
        mandatory: true,
        description: 'Minimum 7.5 CGPA in undergraduate degree OR GATE percentile >= 85.'
      }
    ],

    required_documents: [
      { code: 'DOC_UG_DEGREE_TRANSCRIPT', name: 'Undergraduate Degree Transcripts (Min 7.5 CGPA)', mandatory: true },
      { code: 'DOC_GATE_SCORE', name: 'GATE Scorecard / National Entrance Test Proof', mandatory: true },
      { code: 'DOC_STATEMENT_PURPOSE', name: 'Statement of Purpose (SOP) & Letters of Recommendation', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 300000, frequency: 'ANNUAL', notes: 'Up to ₹6,00,000 total grant (up to ₹3 Lakhs/year)' }
    ]
  },

  {
    id: 'tata-trusts-means-grant',
    name: 'Tata Trusts Means-cum-Merit Higher Education Grant',
    provider: 'Tata Trusts & Philanthropic Grants Department',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Tata Trusts Philanthropy',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Need-based direct fee assistance provided by Tata Trusts to underprivileged Indian students pursuing Bachelor’s and Master’s degrees in Engineering, Medicine, and Allied fields.',
    amount_display: 'Up to ₹1,00,000 (Based on Fee Structure & Need)',
    amount_min: 20000,
    amount_max: 100000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-07-01',
    application_deadline: '2026-09-30',
    verification_deadline: '2026-10-31',
    official_website_url: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
    official_application_url: 'https://igp.tatatrusts.org',
    official_guideline_pdf_url: 'https://www.tatatrusts.org/Upload/Content_Files/Education_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'Enrolled in recognized undergraduate or postgraduate program in India.'
      },
      {
        field: 'min_cgpa',
        operator: '>=',
        value: 6.5,
        unit: 'CGPA',
        mandatory: true,
        description: 'Minimum 6.5 CGPA or 60% in the previous academic year.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹6.00 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_PREV_MARKSHEET', name: 'Previous Academic Year Marksheet (Min 60% / 6.5 CGPA)', mandatory: true },
      { code: 'DOC_FEE_RECEIPT', name: 'Original College Fee Receipt for the Current Academic Year', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Official Income Certificate / Form 16 of earning parents', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 75000, frequency: 'ANNUAL', notes: 'Direct tuition fee payment made directly to institute' }
    ]
  },

  {
    id: 'kotak-kanya-scholarship',
    name: 'Kotak Kanya Scholarship for Girl Students in Professional Courses',
    provider: 'Kotak Education Foundation (Kotak Mahindra Group CSR)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Kotak Education Foundation',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Financial support to meritorious girl students from low-income families to pursue professional graduation courses in Engineering, Medical, Architecture, Law, and Design.',
    amount_display: 'Up to ₹1,50,000 / year until graduation',
    amount_min: 100000,
    amount_max: 150000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-07-01',
    application_deadline: '2026-09-30',
    verification_deadline: '2026-10-31',
    official_website_url: 'https://kotakeducation.org/kotak-kanya-scholarship',
    official_application_url: 'https://kotakeducation.org/kotak-kanya-scholarship',
    official_guideline_pdf_url: 'https://kotakeducation.org/assets/pdf/Kotak_Kanya_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'gender',
        operator: '==',
        value: 'FEMALE',
        mandatory: true,
        description: 'Exclusively for meritorious female applicants.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'First-year professional degree students (Engineering, MBBS, BDS, B.Arch, Integrated LLB, Design).'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 75.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 75% or equivalent CGPA in Class 12 board examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹6.00 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet (Min 75%)', mandatory: true },
      { code: 'DOC_ENTRANCE_SCORECARD', name: 'Competitive Entrance Exam Scorecard (JEE/NEET/CLAT/CET)', mandatory: true },
      { code: 'DOC_INCOME_PROOF', name: 'Income Certificate from Tehsildar or ITR of earning parents', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 150000, frequency: 'ANNUAL', notes: 'Covers tuition fees, hostel fees, books, laptop, and academic expenses' }
    ]
  },

  {
    id: 'sbi-asha-scholarship',
    name: 'SBI Foundation Asha Scholarship for Underprivileged Students',
    provider: 'SBI Foundation (CSR arm of State Bank of India)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'SBI Foundation',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Providing financial assistance to meritorious students from low-income backgrounds pursuing undergraduate and postgraduate studies from top NIRF-ranked institutions in India.',
    amount_display: '₹50,000 to ₹7,50,000 (Based on College Level)',
    amount_min: 50000,
    amount_max: 750000,
    amount_type: 'TUITION_FEE_WAIVER',
    application_start: '2026-08-01',
    application_deadline: '2026-10-15',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://www.sbifoundation.in',
    official_application_url: 'https://www.sbifoundation.in/asha-scholarship',
    official_guideline_pdf_url: 'https://www.sbifoundation.in/assets/pdf/Asha_Scholarship_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'Studying in top NIRF ranked universities / IITs / IIMs.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 75.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 75% marks in the previous academic qualifying examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 300000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹3.00 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_PREV_MARKSHEET', name: 'Class 12 / Graduation Marksheet (Min 75%)', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Valid Income Certificate (< ₹3 Lakhs)', mandatory: true },
      { code: 'DOC_FEE_RECEIPT', name: 'Current Year College Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 50000, frequency: 'ANNUAL', notes: 'Direct financial assistance for college tuition' }
    ]
  },

  {
    id: 'hdfc-badhte-kadam',
    name: 'HDFC Bank Parivartan’s ECSS Programme',
    provider: 'HDFC Bank (Parivartan Social Initiative)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'HDFC Bank Parivartan',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Educational Crisis Support Scholarship (ECSS) supporting students in distress facing personal or financial crisis to continue their education without dropping out.',
    amount_display: 'Up to ₹75,000 / year',
    amount_min: 30000,
    amount_max: 75000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility',
    official_application_url: 'https://www.hdfcbank.com/csr/scholarships',
    official_guideline_pdf_url: 'https://www.hdfcbank.com/assets/pdf/ECSS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'CLASS_12_PASSED'],
        mandatory: true,
        description: 'Pursuing general/professional undergraduate, postgraduate, or diploma courses.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 55.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Passed the previous qualifying exam with at least 55% marks.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 600000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹6.00 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_PREV_MARKSHEET', name: 'Previous Year Marksheet (Min 55%)', mandatory: true },
      { code: 'DOC_INCOME_PROOF', name: 'Income Certificate / ITR / BPL Card', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'College ID Card / Bonafide Certificate & Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 75000, frequency: 'ANNUAL', notes: 'One-time scholarship grant to clear college fees' }
    ]
  },

  {
    id: 'ongc-foundation-scholarship',
    name: 'ONGC Foundation Scholarship for Meritorious SC / ST / OBC / General-EWS Students',
    provider: 'ONGC Foundation (CSR arm of Oil and Natural Gas Corporation)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'ONGC Foundation',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Providing ₹48,000 per annum to 4,000 meritorious students pursuing full-time 1st-year Engineering, MBBS, MBA, or Master’s in Geophysics/Geology across India.',
    amount_display: '₹48,000 / year (₹4,000 / month until course completion)',
    amount_min: 48000,
    amount_max: 48000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-12-10',
    official_website_url: 'https://www.ongcscholar.org',
    official_application_url: 'https://www.ongcscholar.org',
    official_guideline_pdf_url: 'https://www.ongcscholar.org/assets/pdf/ONGC_Scholarship_Scheme.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'First-year regular students of Engineering, MBBS, MBA, or Master in Geophysics/Geology.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% marks in Class 12 or minimum 60% in Graduation for PG courses.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 200000,
        unit: 'INR',
        mandatory: true,
        description: 'Gross annual family income must not exceed ₹2.00 Lakhs per annum.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_GRAD_MARKS', name: 'Class 12 / Graduation Marksheet (Min 60%)', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Tehsildar/SDO (< ₹2L)', mandatory: true },
      { code: 'DOC_CASTE_CERT', name: 'Caste Certificate (for SC/ST/OBC categories) or EWS Certificate', mandatory: true },
      { code: 'DOC_ECS_MANDATE', name: 'Bank Account Passbook & ECS Mandate form', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 48000, frequency: 'ANNUAL', notes: '₹4,000/month disbursed directly through DBT' }
    ]
  },

  {
    id: 'infosys-foundation-stem-stars',
    name: 'Infosys Foundation STEM Stars Scholarship for Girl Students',
    provider: 'Infosys Foundation',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Infosys Foundation Philanthropy',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Supporting meritorious girl students from underprivileged backgrounds across India pursuing undergraduate degrees in STEM (Science, Technology, Engineering, Math) from NIRF-ranked institutions.',
    amount_display: 'Up to ₹1,00,000 / year for 4 years (Up to ₹4 Lakhs Total)',
    amount_min: 50000,
    amount_max: 100000,
    amount_type: 'FULL_FEES_PLUS_ALLOWANCE',
    application_start: '2026-08-15',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://www.infosys.org/infosys-foundation',
    official_application_url: 'https://www.infosys.org/infosys-foundation/stem-stars.html',
    official_guideline_pdf_url: 'https://www.infosys.org/infosys-foundation/assets/pdf/STEM_Stars_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
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
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'First-year female students enrolled in B.Tech/B.E, MBBS, or integrated STEM programs.'
      },
      {
        field: 'min_cgpa',
        operator: '>=',
        value: 7.0,
        unit: 'CGPA',
        mandatory: true,
        description: 'Minimum 7.0 CGPA throughout the degree for renewal.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 800000,
        unit: 'INR',
        mandatory: true,
        description: 'Annual family income must not exceed ₹8.00 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet', mandatory: true },
      { code: 'DOC_NIRF_COLLEGE_BONAFIDE', name: 'College Bonafide from NIRF Ranked Institution', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate / ITR (< ₹8L)', mandatory: true }
    ],

    benefits: [
      { type: 'TUITION_FEE', amount: 100000, frequency: 'ANNUAL', notes: 'Covers tuition fees, living expenses, and study materials up to ₹1 Lakh/year' }
    ]
  },

  {
    id: 'lic-golden-jubilee-scholarship',
    name: 'LIC Golden Jubilee Scholarship Scheme for Higher Education',
    provider: 'Life Insurance Corporation of India (LIC Golden Jubilee Foundation)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'LIC Golden Jubilee Foundation',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Provides scholarships to meritorious students from economically weaker families to pursue higher studies in medicine, engineering, graduation, and vocational/diploma courses in government-recognized colleges.',
    amount_display: '₹20,000 / year (General) to ₹40,000 / year (Special Girl Child)',
    amount_min: 20000,
    amount_max: 40000,
    amount_type: 'ANNUAL_GRANT',
    application_start: '2026-08-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://licindia.in',
    official_application_url: 'https://licindia.in/Bottom-Links/Golden-Jubilee-Foundation',
    official_guideline_pdf_url: 'https://licindia.in/assets/pdf/GJF_Scheme_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'CLASS_12_PASSED', 'DIPLOMA'],
        mandatory: true,
        description: 'Passed Class 12 or equivalent and enrolled in regular college/diploma course.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Minimum 60% aggregate in Class 12 board examination.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 250000,
        unit: 'INR',
        mandatory: true,
        description: 'Gross annual family income must not exceed ₹2.50 Lakhs.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Board Marksheet', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Revenue Authority', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'Bonafide Certificate of College Admission', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_GRANT', amount: 20000, frequency: 'ANNUAL', notes: 'Paid directly via Direct Benefit Transfer in 3 installments' }
    ]
  },

  {
    id: 'kc-mahindra-talent-scholarship',
    name: 'K.C. Mahindra All India Talent Scholarship for Diploma Students',
    provider: 'K.C. Mahindra Education Trust',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'Mahindra Education Trust',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Awarded to youth from economically disadvantaged families who have secured admission in government or recognized polytechnic institutes for diploma courses.',
    amount_display: '₹10,000 / year for 3 years (₹30,000 Total)',
    amount_min: 10000,
    amount_max: 30000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-15',
    official_website_url: 'https://www.kcmet.org',
    official_application_url: 'https://www.kcmet.org/what-we-do-Scholarships-All-India-Talent.aspx',
    official_guideline_pdf_url: 'https://www.kcmet.org/pdf/AITS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['DIPLOMA', 'POLYTECHNIC'],
        mandatory: true,
        description: 'First-year students enrolled in recognized polytechnic diploma courses.'
      },
      {
        field: 'current_year',
        operator: 'IN',
        value: [1],
        mandatory: true,
        description: 'Admitted into 1st Year of Polytechnic Diploma.'
      },
      {
        field: 'min_class_10_percentage',
        operator: '>=',
        value: 60.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Passed Class 10/12 board exams with minimum 60% marks.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 300000,
        unit: 'INR',
        mandatory: true,
        description: 'Family income must not exceed ₹3.00 Lakhs per annum.'
      }
    ],

    required_documents: [
      { code: 'DOC_10_MARKSHEET', name: 'Class 10 Board Marksheet', mandatory: true },
      { code: 'DOC_DIPLOMA_ADMISSION', name: 'Polytechnic Diploma Admission Letter', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Family Income Certificate', mandatory: true }
    ],

    benefits: [
      { type: 'DIPLOMA_STIPEND', amount: 10000, frequency: 'ANNUAL', notes: 'Renewed annually based on passing diploma grades' }
    ]
  },

  {
    id: 'lt-build-india-scholarship',
    name: 'L&T Build India Scholarship for Postgraduate Engineering',
    provider: 'Larsen & Toubro (L&T Construction CSR)',
    provider_type: 'CORPORATE_TRUST',
    government_level: 'PRIVATE',
    state: 'ALL_INDIA',
    ministry_or_department: 'L&T Corporate HR & CSR',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'Sponsors full-time M.Tech in Construction Technology & Management at IIT Madras, IIT Delhi, NITK Surathkal, and VNIT Nagpur with full fee sponsorship, monthly stipend, and direct employment on completion.',
    amount_display: 'Full M.Tech Tuition Fees + ₹13,400 / month Stipend + Job Placement at L&T',
    amount_min: 160000,
    amount_max: 350000,
    amount_type: 'FULL_MTECH_SPONSORSHIP',
    application_start: '2026-08-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://www.lntecc.com',
    official_application_url: 'https://www.lntecc.com/careers/build-india-scholarship',
    official_guideline_pdf_url: 'https://www.lntecc.com/assets/pdf/BIS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE'],
        mandatory: true,
        description: 'Final year graduating B.E./B.Tech students pursuing M.Tech sponsorship.'
      },
      {
        field: 'eligible_branches',
        operator: 'IN',
        value: ['Civil Engineering', 'Electrical Engineering', 'Civil', 'Electrical', 'EEE', 'Civil & Environmental'],
        mandatory: true,
        description: 'Core B.E./B.Tech degree in Civil or Electrical Engineering branches.'
      },
      {
        field: 'current_year',
        operator: 'IN',
        value: [4],
        mandatory: true,
        description: 'Must be in Final Year (Year 4) of B.E./B.Tech graduating in current academic year.'
      },
      {
        field: 'min_cgpa',
        operator: '>=',
        value: 7.0,
        unit: 'CGPA',
        mandatory: true,
        description: 'Minimum 70% or 7.0 CGPA in B.Tech degree throughout all semesters.'
      }
    ],

    required_documents: [
      { code: 'DOC_BTECH_TRANSCRIPT', name: 'B.Tech All-Semester Transcripts (Civil/Electrical)', mandatory: true },
      { code: 'DOC_IDENTITY', name: 'Aadhaar / National ID', mandatory: true }
    ],

    benefits: [
      { type: 'FULL_SPONSORSHIP', amount: 350000, frequency: 'TWO_YEAR_PROGRAM', notes: 'Complete IIT/NIT tuition fees + monthly stipend + direct Executive placement' }
    ]
  }
];

