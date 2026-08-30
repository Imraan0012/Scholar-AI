// =============================================================================
// UGC, AICTE, DST & RESEARCH SCHOLARSHIPS OF INDIA
// Sources: aicte-india.org, ugc.ac.in, online-inspire.gov.in, csirhrdg.res.in, pmrf.in
// Academic Year: 2026-27 | Status: VERIFIED (Level 1 Official Guidelines)
// =============================================================================

export const UGC_AICTE_DST_SCHOLARSHIPS = [
  {
    id: 'aicte-pragati-degree',
    name: 'AICTE Pragati Scholarship Scheme for Girl Students (Degree)',
    provider: 'All India Council for Technical Education (AICTE), Ministry of Education',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'AICTE, Ministry of Education',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Empowering young women in STEM by providing ₹50,000 per annum to girl students admitted to AICTE approved technical degree programs.',
    amount_display: '₹50,000 / year (Lump Sum)',
    amount_min: 50000,
    amount_max: 50000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://www.aicte-india.org/schemes/students-development-schemes/Pragati',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://www.aicte-india.org/sites/default/files/Pragati_Degree_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'gender',
        operator: '==',
        value: 'FEMALE',
        mandatory: true,
        description: 'Exclusively for female candidates. Max two girls per family.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'Enrolled in 1st year (or 2nd year lateral entry) of AICTE approved technical degree.'
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
      { code: 'DOC_CAP_ALLOTMENT', name: 'Centralized Admission Process (CAP) Allotment Letter', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Valid Income Certificate from Tehsildar (< ₹8L)', mandatory: true },
      { code: 'DOC_BONAFIDE', name: 'College Bonafide and Tuition Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'CONTINGENCY', amount: 50000, frequency: 'ANNUAL', notes: '₹50,000/year lump-sum grant for tuition, books, equipment, computer' }
    ]
  },

  {
    id: 'aicte-saksham-degree',
    name: 'AICTE Saksham Scholarship Scheme for Specially-Abled Students (Degree)',
    provider: 'All India Council for Technical Education (AICTE), Ministry of Education',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'AICTE, Ministry of Education',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Encouraging specially-abled students to pursue technical education with ₹50,000 per annum assistance.',
    amount_display: '₹50,000 / year (Lump Sum)',
    amount_min: 50000,
    amount_max: 50000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://www.aicte-india.org/schemes/students-development-schemes/Saksham',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://www.aicte-india.org/sites/default/files/Saksham_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'has_disability',
        operator: 'BOOLEAN',
        value: true,
        mandatory: true,
        description: 'Specially-abled candidate having disability of not less than 40%.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE'],
        mandatory: true,
        description: 'Admitted to 1st year of AICTE approved technical degree program.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 800000,
        unit: 'INR',
        mandatory: true,
        description: 'Family income must not exceed ₹8.00 Lakhs per annum.'
      }
    ],

    required_documents: [
      { code: 'DOC_UDID_DISABILITY', name: 'Disability Certificate / UDID Card (Min 40%)', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Tehsildar (< ₹8L)', mandatory: true },
      { code: 'DOC_CAP_LETTER', name: 'CAP Admission Letter & Fee Receipt', mandatory: true }
    ],

    benefits: [
      { type: 'CONTINGENCY', amount: 50000, frequency: 'ANNUAL', notes: '₹50,000/year lump-sum allowance' }
    ]
  },

  {
    id: 'aicte-pg-gate-stipend',
    name: 'AICTE Post Graduate (PG) Scholarship for GATE / CEED / GPAT Qualified Students',
    provider: 'All India Council for Technical Education (AICTE), Ministry of Education',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'AICTE, Ministry of Education',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Monthly postgraduate stipend awarded to full-time GATE, CEED, and GPAT qualified students admitted to AICTE approved M.E, M.Tech, M.Arch, M.Des, and M.Pharm programs.',
    amount_display: '₹12,400 / month (₹1,48,800 / year for 24 months)',
    amount_min: 148800,
    amount_max: 148800,
    amount_type: 'MONTHLY_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-30',
    verification_deadline: '2026-12-15',
    official_website_url: 'https://pgscholarship.aicte-india.org',
    official_application_url: 'https://pgscholarship.aicte-india.org',
    official_guideline_pdf_url: 'https://www.aicte-india.org/sites/default/files/PGS_Guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['POSTGRADUATE'],
        mandatory: true,
        description: 'Admitted to full-time regular M.Tech/M.E/M.Pharm/M.Arch in an AICTE approved college.'
      }
    ],

    required_documents: [
      { code: 'DOC_GATE_SCORECARD', name: 'Valid GATE / CEED / GPAT Scorecard', mandatory: true },
      { code: 'DOC_BONAFIDE', name: 'AICTE Institution Bonafide & Admission Order', mandatory: true },
      { code: 'DOC_AADHAAR_BANK', name: 'Aadhaar Seeded Savings Bank Account', mandatory: true }
    ],

    benefits: [
      { type: 'MONTHLY_STIPEND', amount: 148800, frequency: 'ANNUAL', notes: '₹12,400 per month for maximum 24 months' }
    ]
  },

  {
    id: 'ugc-pg-indira-gandhi-single-girl',
    name: 'Post-Graduate Indira Gandhi Scholarship for Single Girl Child',
    provider: 'University Grants Commission (UGC), Ministry of Education, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'University Grants Commission',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Promoting higher education among girls by supporting single girl children (or only daughters in family) pursuing regular full-time Master’s degree programs.',
    amount_display: '₹36,200 / year (₹3,100 / month for 2 years)',
    amount_min: 36200,
    amount_max: 36200,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://www.ugc.gov.in',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://www.ugc.gov.in/pdfnews/9324545_Guidelines-SGC.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'gender',
        operator: '==',
        value: 'FEMALE',
        mandatory: true,
        description: 'Exclusively for female students who are the ONLY child/daughter of parents (twin/fraternal daughters also eligible).'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['POSTGRADUATE'],
        mandatory: true,
        description: 'Admitted in 1st year of regular, full-time Master’s degree in any recognized university.'
      }
    ],

    required_documents: [
      { code: 'DOC_SGC_AFFIDAVIT', name: 'Stamp Paper Affidavit for Single Girl Child executed before First Class Magistrate/SDM', mandatory: true },
      { code: 'DOC_PG_BONAFIDE', name: 'University Post-Graduate Admission Verification & Bonafide', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 36200, frequency: 'ANNUAL', notes: '₹3,100 per month for 20 months (2 years)' }
    ]
  },

  {
    id: 'ugc-ishan-uday-ner',
    name: 'Ishan Uday Special Scholarship Scheme for North Eastern Region (NER)',
    provider: 'University Grants Commission (UGC), Ministry of Education, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'University Grants Commission',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Providing 10,000 fresh scholarships every year to students domiciled in the 8 North Eastern States (Assam, Arunachal, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura) pursuing general and professional undergraduate degrees.',
    amount_display: '₹5,400 / month (General UG) & ₹7,800 / month (Technical/Medical)',
    amount_min: 54000,
    amount_max: 78000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-07-15',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-20',
    official_website_url: 'https://www.ugc.gov.in',
    official_application_url: 'https://scholarships.gov.in',
    official_guideline_pdf_url: 'https://www.ugc.gov.in/pdfnews/ishan-uday-guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'domicile_state',
        operator: 'IN',
        value: ['Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'],
        mandatory: true,
        description: 'Native domicile / permanent resident of one of the 8 North-Eastern Region (NER) States.'
      },
      {
        field: 'current_year',
        operator: 'IN',
        value: [1],
        mandatory: true,
        description: 'Admitted into 1st Year of Undergraduate degree course.'
      },
      {
        field: 'annual_family_income',
        operator: '<=',
        value: 450000,
        unit: 'INR',
        mandatory: true,
        description: 'Income of parents must not exceed ₹4.50 Lakh per annum.'
      },
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'CLASS_12_PASSED'],
        mandatory: true,
        description: 'Admitted in 1st year of general degree, technical degree, or medical degree in India.'
      }
    ],

    required_documents: [
      { code: 'DOC_NER_DOMICILE', name: 'Domicile / Permanent Residence Certificate (PRC) of 8 NER States', mandatory: true },
      { code: 'DOC_INCOME_CERT', name: 'Income Certificate from Tehsildar / DC (< ₹4.5L)', mandatory: true },
      { code: 'DOC_12_MARKSHEET', name: 'Class 12 Marksheet', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 54000, frequency: 'ANNUAL', notes: '₹5,400/month for General Degree courses' },
      { type: 'ANNUAL_STIPEND', amount: 78000, frequency: 'ANNUAL', notes: '₹7,800/month for Technical, Medical, and Professional courses' }
    ]
  },

  {
    id: 'dst-inspire-she',
    name: 'INSPIRE Scholarship for Higher Education (SHE)',
    provider: 'Department of Science and Technology (DST), Ministry of Science & Technology',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Science and Technology',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'Prestigious national scholarship to attract meritorious youth to study natural and basic sciences at undergraduate and postgraduate levels with integrated summer research mentorship.',
    amount_display: '₹80,000 / year (₹60k Stipend + ₹20k Mentorship)',
    amount_min: 80000,
    amount_max: 80000,
    amount_type: 'ANNUAL_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-12-05',
    official_website_url: 'https://online-inspire.gov.in',
    official_application_url: 'https://online-inspire.gov.in',
    official_guideline_pdf_url: 'https://online-inspire.gov.in/Guideline/SHE_guidelines.pdf',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['UNDERGRADUATE', 'POSTGRADUATE', 'CLASS_12_PASSED'],
        mandatory: true,
        description: 'Enrolled in B.Sc, B.S, Int. M.Sc / M.S in Basic & Natural Sciences (Physics, Chemistry, Maths, Biology, Stats, Geology).'
      },
      {
        field: 'eligible_courses',
        operator: 'IN',
        value: ['B.Sc', 'BS', 'Bachelor of Science', 'Integrated M.Sc', 'Int M.Sc', 'Int M.S', 'Basic Sciences', 'Natural Sciences'],
        mandatory: true,
        description: 'Natural & Basic Sciences degree (B.Sc, BS, Int M.Sc).'
      },
      {
        field: 'current_year',
        operator: 'IN',
        value: [1],
        mandatory: true,
        description: 'Admitted in 1st year of Natural or Basic Science degree.'
      },
      {
        field: 'min_class_12_percentage',
        operator: '>=',
        value: 85.0,
        unit: 'PERCENTAGE',
        mandatory: true,
        description: 'Within top 1% percentile cutoff of respective State/Central Class 12 Board OR Rank in JEE/NEET/KVPY within top 10,000.'
      }
    ],

    required_documents: [
      { code: 'DOC_12_BOARD_MARKSHEET', name: 'Class 12 Board Marksheet showing Top 1% Percentile Eligibility', mandatory: true },
      { code: 'DOC_COLLEGE_BONAFIDE', name: 'Endorsement Form signed by Principal/Registrar of Science College/Univ', mandatory: true },
      { code: 'DOC_SBI_PASSBOOK', name: 'State Bank of India (SBI) Individual Savings Bank Account Passbook', mandatory: true }
    ],

    benefits: [
      { type: 'ANNUAL_STIPEND', amount: 60000, frequency: 'ANNUAL', notes: '₹5,000 per month deposited directly' },
      { type: 'CONTINGENCY', amount: 20000, frequency: 'ANNUAL', notes: 'Mentorship grant for summer research project at recognized research institute' }
    ]
  },

  {
    id: 'csir-ugc-jrf',
    name: 'CSIR-UGC NET Junior Research Fellowship (JRF) & SRF',
    provider: 'Council of Scientific and Industrial Research (CSIR) & UGC',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'CSIR, Ministry of Science & Technology',
    academic_year: '2026-27',
    application_type: 'FRESH_AND_RENEWAL',
    description: 'National doctoral research fellowship for scholars pursuing PhD in Chemical, Earth, Life, Mathematical & Physical Sciences, and Humanities.',
    amount_display: '₹37,000 / month + HRA + ₹20,000 Annual Contingency',
    amount_min: 464000,
    amount_max: 524000,
    amount_type: 'MONTHLY_STIPEND',
    application_start: '2026-06-01',
    application_deadline: '2026-10-31',
    verification_deadline: '2026-11-30',
    official_website_url: 'https://csirhrdg.res.in',
    official_application_url: 'https://csirnet.nta.ac.in',
    official_guideline_pdf_url: 'https://csirhrdg.res.in/Home/Index/1/Default/1865/58',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['POSTGRADUATE', 'PHD_RESEARCH'],
        mandatory: true,
        description: 'M.Sc or equivalent degree with minimum 55% marks for General/OBC and 50% for SC/ST/PwD.'
      }
    ],

    required_documents: [
      { code: 'DOC_NET_AWARD_LETTER', name: 'CSIR-UGC NET JRF Award Letter', mandatory: true },
      { code: 'DOC_PHD_JOINING', name: 'PhD Enrollment / Joining Report from University/IIT/NIT', mandatory: true }
    ],

    benefits: [
      { type: 'MONTHLY_STIPEND', amount: 444000, frequency: 'ANNUAL', notes: '₹37,000/month JRF (1st & 2nd year), upgradable to ₹42,000/month SRF' },
      { type: 'CONTINGENCY', amount: 20000, frequency: 'ANNUAL', notes: '₹20,000/year annual contingency grant' }
    ]
  },

  {
    id: 'pmrf-research-fellowship',
    name: 'Prime Minister’s Research Fellowship (PMRF)',
    provider: 'National Coordination Committee, Ministry of Education, Govt. of India',
    provider_type: 'GOVERNMENT',
    government_level: 'CENTRAL',
    state: 'ALL_INDIA',
    ministry_or_department: 'Ministry of Education',
    academic_year: '2026-27',
    application_type: 'FRESH',
    description: 'India’s most prestigious doctoral fellowship designed to attract talent into research in frontier science and technology domains at IITs, IISc, and IISERs.',
    amount_display: '₹70,000 to ₹80,000 / month + ₹2 Lakhs / year Research Grant',
    amount_min: 1040000,
    amount_max: 1160000,
    amount_type: 'MONTHLY_STIPEND',
    application_start: '2026-08-01',
    application_deadline: '2026-11-15',
    verification_deadline: '2026-12-01',
    official_website_url: 'https://www.pmrf.in',
    official_application_url: 'https://www.pmrf.in',
    official_guideline_pdf_url: 'https://www.pmrf.in/guidelines',
    source_reliability: 'LEVEL_1_OFFICIAL_GOVT',
    verification_status: 'VERIFIED',
    last_verified_at: '2026-08-20T10:00:00Z',

    rules: [
      {
        field: 'education_level',
        operator: 'IN',
        value: ['PHD_RESEARCH'],
        mandatory: true,
        description: 'Enrolled in full-time Ph.D. program in science & technology at IITs, IISc, IISERs, or Central Universities.'
      },
      {
        field: 'min_cgpa',
        operator: '>=',
        value: 8.0,
        unit: 'CGPA',
        mandatory: true,
        description: 'Minimum 8.0 CGPA or qualifying GATE rank in qualifying degree.'
      }
    ],

    required_documents: [
      { code: 'DOC_PMRF_PROPOSAL', name: 'Research Project Proposal & Statement of Purpose (SOP)', mandatory: true },
      { code: 'DOC_GRADE_TRANSCRIPT', name: 'Official Degree Transcripts (CGPA >= 8.0)', mandatory: true }
    ],

    benefits: [
      { type: 'MONTHLY_STIPEND', amount: 840000, frequency: 'ANNUAL', notes: '₹70,000/mo (Year 1-2), ₹75,000/mo (Year 3), ₹80,000/mo (Year 4-5)' },
      { type: 'CONTINGENCY', amount: 200000, frequency: 'ANNUAL', notes: '₹2 Lakhs/year annual research contingency grant' }
    ]
  }
];
