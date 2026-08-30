// =============================================================================
// SCHOLAR AI — INSTITUTION & UNIVERSITY SCHOLARSHIP SOURCES REGISTRY
// Architecture for institutional scholarships (IITs, NITs, Central/State Universities).
// Academic Year: 2026-27 | Status: VERIFIED LEVEL 2 SOURCES
// =============================================================================

export const INSTITUTION_SCHOLARSHIP_SOURCES = [
  {
    id: 'src-inst-iit-madras',
    institutionId: 'inst_iit_madras',
    canonicalName: 'Indian Institute of Technology Madras (IIT Madras)',
    aliases: ['IIT Madras', 'IITM', 'IIT-M'],
    institutionType: 'INSTITUTE_OF_NATIONAL_IMPORTANCE',
    state: 'Tamil Nadu',
    city: 'Chennai',
    portalUrl: 'https://www.iitm.ac.in/academics/financial-assistance',
    description: 'Direct institutional merit-cum-means scholarships, free mess, and alumni endowment awards for enrolled B.Tech/Dual Degree students.',
    reliabilityTier: 'LEVEL_2_OFFICIAL_PORTAL',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['INSTITUTE_MCM', 'HALF_FREE_STUDENTSHIP', 'GIRLS_CONCESSION'],
    activeSchemesCount: 4
  },
  {
    id: 'src-inst-iit-bombay',
    institutionId: 'inst_iit_bombay',
    canonicalName: 'Indian Institute of Technology Bombay (IIT Bombay)',
    aliases: ['IIT Bombay', 'IITB', 'IIT-B'],
    institutionType: 'INSTITUTE_OF_NATIONAL_IMPORTANCE',
    state: 'Maharashtra',
    city: 'Mumbai',
    portalUrl: 'https://www.iitb.ac.in/en/education/scholarships',
    description: 'IIT Bombay Institute Merit-cum-Means (MCM) Scholarship and Free Messing facilities for SC/ST students.',
    reliabilityTier: 'LEVEL_2_OFFICIAL_PORTAL',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['INSTITUTE_MCM', 'SC_ST_FREE_MESS', 'NAMED_DONOR_AWARDS'],
    activeSchemesCount: 5
  },
  {
    id: 'src-inst-iisc-bangalore',
    institutionId: 'inst_iisc_bangalore',
    canonicalName: 'Indian Institute of Science Bangalore (IISc Bangalore)',
    aliases: ['IISc Bangalore', 'IISc', 'Indian Institute of Science'],
    institutionType: 'INSTITUTE_OF_NATIONAL_IMPORTANCE',
    state: 'Karnataka',
    city: 'Bengaluru',
    portalUrl: 'https://iisc.ac.in/admissions/financial-support',
    description: 'MHRD/MoE and CSIR fellowships for BS Research, M.Tech, and Integrated PhD candidates.',
    reliabilityTier: 'LEVEL_2_OFFICIAL_PORTAL',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['RESEARCH_STIPEND', 'KVPY_INSPIRE_TOPUP', 'MTECH_GATE_FELLOWSHIP'],
    activeSchemesCount: 3
  },
  {
    id: 'src-inst-du',
    institutionId: 'inst_delhi_university',
    canonicalName: 'University of Delhi (Delhi University)',
    aliases: ['Delhi University', 'DU', 'University of Delhi'],
    institutionType: 'CENTRAL_UNIVERSITY',
    state: 'Delhi',
    city: 'New Delhi',
    portalUrl: 'http://www.du.ac.in/index.php?page=scholarships',
    description: 'Delhi University Vice Chancellor Student Fund, Post-Graduate Merit Fellowships, and Endowed Medals.',
    reliabilityTier: 'LEVEL_2_OFFICIAL_PORTAL',
    verificationStatus: 'VERIFIED',
    lastVerifiedAt: '2026-08-20T10:00:00Z',
    supportedSchemeTypes: ['VC_STUDENT_FUND', 'DU_POSTGRADUATE_FELLOWSHIP', 'BLIND_STUDENTS_RELIEF'],
    activeSchemesCount: 6
  }
];
