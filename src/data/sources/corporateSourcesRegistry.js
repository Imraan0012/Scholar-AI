// =============================================================================
// SCHOLAR AI — PREMIER CORPORATE, CSR & PHILANTHROPIC TRUST SOURCES REGISTRY
// Covers major verified Indian CSR Foundations, Philanthropic Trusts, and
// verified scholarship portals (Reliance, Tata, HDFC, Kotak, SBI, ONGC, Infosys, etc.).
// Academic Year: 2026-27 | Status: VERIFIED LEVEL 1 & LEVEL 3 SOURCES
// =============================================================================

export const CORPORATE_TRUST_SOURCES = [
  {
    id: 'src-reliance-foundation',
    name: 'Reliance Foundation (RIL CSR)',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://www.scholarships.reliancefoundation.org',
    description: 'CSR initiative of Reliance Industries Limited awarding 5,000 UG and 100 PG scholarships across all streams.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT', // Direct official provider
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['UNDERGRADUATE_MERIT_MEANS', 'POSTGRADUATE_FUTURE_TECH', 'FEMALE_SCHOLARS'],
    activeSchemesCount: 2
  },
  {
    id: 'src-tata-trusts',
    name: 'Tata Trusts & Tata Capital',
    category: 'PHILANTHROPIC_TRUST',
    providerType: 'FOUNDATION_TRUST',
    portalUrl: 'https://www.tatatrusts.org',
    applicationUrl: 'https://igp.tatatrusts.org',
    description: 'One of India’s oldest philanthropic institutions providing direct means grants and travel fellowships for higher education.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['MEANS_GRANT_COLLEGE', 'LADY_MEHERBAI_TATA', 'JN_TATA_ENDOWMENT'],
    activeSchemesCount: 4
  },
  {
    id: 'src-kotak-education',
    name: 'Kotak Education Foundation (Kotak Mahindra Group)',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://kotakeducation.org',
    description: 'Operates the premier Kotak Kanya Scholarship supporting meritorious female students in professional undergraduate courses.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['FEMALE_PROFESSIONAL_DEGREE', 'ENGINEERING_MEDICINE_LAW'],
    activeSchemesCount: 2
  },
  {
    id: 'src-sbi-foundation',
    name: 'SBI Foundation (State Bank of India CSR)',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://www.sbifoundation.in',
    description: 'SBI Asha Scholarship for higher education providing financial assistance to low-income students in top premier institutions.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['IIT_IIM_STUDENTS', 'UNDERGRADUATE_MERIT', 'COLLEGE_STIPEND'],
    activeSchemesCount: 3
  },
  {
    id: 'src-hdfc-parivartan',
    name: 'HDFC Bank Parivartan (Badhte Kadam)',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://www.hdfcbank.com/csr/scholarships',
    description: 'CSR initiative supporting students facing personal or financial crisis to prevent dropouts in school and college.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['CRISIS_SUPPORT', 'GENERAL_DEGREE', 'PROFESSIONAL_DEGREE'],
    activeSchemesCount: 3
  },
  {
    id: 'src-ongc-foundation',
    name: 'ONGC Foundation',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://www.ongcscholar.org',
    description: 'Awards scholarships for SC, ST, OBC, and General EWS students pursuing Engineering, MBBS, MBA, or Geology/Geophysics.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['SC_ST_ENGINEERING_MBBS', 'OBC_MERIT_MEANS', 'EWS_COLLEGE'],
    activeSchemesCount: 3
  },
  {
    id: 'src-infosys-foundation',
    name: 'Infosys Foundation (STEM Stars)',
    category: 'CORPORATE_CSR_FOUNDATION',
    providerType: 'CORPORATE_CSR',
    portalUrl: 'https://www.infosys.org/infosys-foundation',
    description: 'STEM Stars scholarship covering tuition fees, hostel, and living expenses for female students pursuing STEM degrees at NIRF-ranked institutions.',
    reliabilityTier: 'LEVEL_1_OFFICIAL_GOVT',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['FEMALE_STEM_ENGINEERING', 'NIRF_TOP_RANKED'],
    activeSchemesCount: 2
  },
  {
    id: 'src-vidyasaarathi',
    name: 'Vidyasaarathi (NSDL e-Governance CSR Portal)',
    category: 'TRUSTED_CSR_AGGREGATOR',
    providerType: 'FOUNDATION_TRUST',
    portalUrl: 'https://www.vidyasaarathi.co.in',
    description: 'Centralized CSR scholarship management platform powered by Protean (NSDL) managing schemes for ACC, JSW, Tata Motors, Care Ratings, etc.',
    reliabilityTier: 'LEVEL_3_TRUSTED_AGGREGATOR',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['MULTI_CORPORATE_CSR', 'DIPLOMA_UG_PG', 'ACC_JSW_SCHEMES'],
    activeSchemesCount: 18
  },
  {
    id: 'src-buddy4study',
    name: 'Buddy4Study Discovery Feed',
    category: 'TRUSTED_AGGREGATOR',
    providerType: 'FOUNDATION_TRUST',
    portalUrl: 'https://www.buddy4study.com',
    description: 'Scholarship aggregator and discovery index used for secondary cross-referencing and verification.',
    reliabilityTier: 'LEVEL_3_TRUSTED_AGGREGATOR',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['CROSS_REFERENCE_DISCOVERY', 'CSR_TRACKER'],
    activeSchemesCount: 45
  }
];
