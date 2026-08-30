// =============================================================================
// SCHOLAR AI — STANDARDIZED COURSE & DEPENDENT BRANCH DATASET
// Standardized for reliable scholarship classification and rule-engine matching.
// =============================================================================

export const COURSES_BY_EDUCATION_LEVEL = {
  UNDERGRADUATE: [
    { value: 'B.Tech / B.E.', label: 'B.Tech / B.E.', code: 'BTECH_BE', category: 'Engineering & Tech' },
    { value: 'B.Sc.', label: 'B.Sc.', code: 'BSC', category: 'Science' },
    { value: 'B.Com.', label: 'B.Com.', code: 'BCOM', category: 'Commerce & Finance' },
    { value: 'BBA', label: 'BBA', code: 'BBA', category: 'Management' },
    { value: 'BCA', label: 'BCA', code: 'BCA', category: 'Computer Applications' },
    { value: 'BA', label: 'BA', code: 'BA', category: 'Arts & Humanities' },
    { value: 'B.Arch', label: 'B.Arch', code: 'BARCH', category: 'Architecture' },
    { value: 'B.Pharm', label: 'B.Pharm', code: 'BPHARM', category: 'Pharmacy' },
    { value: 'MBBS', label: 'MBBS', code: 'MBBS', category: 'Medical' },
    { value: 'BDS', label: 'BDS', code: 'BDS', category: 'Dental' },
    { value: 'LLB', label: 'LLB', code: 'LLB', category: 'Law' },
    { value: 'B.Ed.', label: 'B.Ed.', code: 'BED', category: 'Education' },
    { value: 'Other Undergraduate', label: 'Other Undergraduate', code: 'OTHER_UG', category: 'Other' }
  ],
  POSTGRADUATE: [
    { value: 'M.Tech / M.E.', label: 'M.Tech / M.E.', code: 'MTECH_ME', category: 'Engineering & Tech' },
    { value: 'M.Sc.', label: 'M.Sc.', code: 'MSC', category: 'Science' },
    { value: 'M.Com.', label: 'M.Com.', code: 'MCOM', category: 'Commerce & Finance' },
    { value: 'MBA', label: 'MBA', code: 'MBA', category: 'Management' },
    { value: 'MCA', label: 'MCA', code: 'MCA', category: 'Computer Applications' },
    { value: 'MA', label: 'MA', code: 'MA', category: 'Arts & Humanities' },
    { value: 'M.Arch', label: 'M.Arch', code: 'MARCH', category: 'Architecture' },
    { value: 'M.Pharm', label: 'M.Pharm', code: 'MPHARM', category: 'Pharmacy' },
    { value: 'M.Ed.', label: 'M.Ed.', code: 'MED', category: 'Education' },
    { value: 'LLM', label: 'LLM', code: 'LLM', category: 'Law' },
    { value: 'MD / MS (Medical)', label: 'MD / MS (Medical)', code: 'MD_MS', category: 'Medical' },
    { value: 'Other Postgraduate', label: 'Other Postgraduate', code: 'OTHER_PG', category: 'Other' }
  ],
  DIPLOMA: [
    { value: 'Diploma in Engineering / Polytechnic', label: 'Diploma in Engineering / Polytechnic', code: 'DIPLOMA_ENG', category: 'Engineering & Tech' },
    { value: 'Diploma in Pharmacy', label: 'Diploma in Pharmacy', code: 'DIPLOMA_PHARM', category: 'Pharmacy' },
    { value: 'Diploma in Medical Lab Technology', label: 'Diploma in Medical Lab Technology', code: 'DIPLOMA_MLT', category: 'Medical' },
    { value: 'Diploma in Nursing / GNM', label: 'Diploma in Nursing / GNM', code: 'DIPLOMA_NURSING', category: 'Medical' },
    { value: 'General Diploma', label: 'General Diploma', code: 'DIPLOMA_GEN', category: 'General' }
  ],
  TWELFTH_COMPLETED: [
    { value: '12th / Higher Secondary', label: '12th / Higher Secondary', code: 'HIGHER_SECONDARY', category: 'School' }
  ]
};

export const BRANCHES_BY_COURSE = {
  // Engineering / B.Tech / M.Tech / Polytechnic
  'B.Tech / B.E.': [
    { value: 'Computer Science Engineering', label: 'Computer Science Engineering', code: 'CSE' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence', code: 'AI' },
    { value: 'Artificial Intelligence & Data Science', label: 'Artificial Intelligence & Data Science', code: 'AIDS' },
    { value: 'Information Technology', label: 'Information Technology', code: 'IT' },
    { value: 'Electronics & Communication Engineering', label: 'Electronics & Communication Engineering', code: 'ECE' },
    { value: 'Electrical & Electronics Engineering', label: 'Electrical & Electronics Engineering', code: 'EEE' },
    { value: 'Electrical Engineering', label: 'Electrical Engineering', code: 'EE' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering', code: 'MECH' },
    { value: 'Civil Engineering', label: 'Civil Engineering', code: 'CIVIL' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering', code: 'CHEM' },
    { value: 'Biotechnology', label: 'Biotechnology', code: 'BIOTECH' },
    { value: 'Aerospace Engineering', label: 'Aerospace Engineering', code: 'AERO' },
    { value: 'Automobile Engineering', label: 'Automobile Engineering', code: 'AUTO' },
    { value: 'Biomedical Engineering', label: 'Biomedical Engineering', code: 'BIOMED' },
    { value: 'Production Engineering', label: 'Production Engineering', code: 'PROD' },
    { value: 'Industrial Engineering', label: 'Industrial Engineering', code: 'IND' },
    { value: 'Cyber Security', label: 'Cyber Security', code: 'CYBER' },
    { value: 'Robotics & Automation', label: 'Robotics & Automation', code: 'ROBOTICS' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'M.Tech / M.E.': [
    { value: 'Computer Science Engineering', label: 'Computer Science Engineering', code: 'CSE' },
    { value: 'Artificial Intelligence & Data Science', label: 'Artificial Intelligence & Data Science', code: 'AIDS' },
    { value: 'Information Technology', label: 'Information Technology', code: 'IT' },
    { value: 'VLSI & Embedded Systems', label: 'VLSI & Embedded Systems', code: 'VLSI' },
    { value: 'Electronics & Communication', label: 'Electronics & Communication', code: 'ECE' },
    { value: 'Power Systems / Electrical', label: 'Power Systems / Electrical', code: 'EEE' },
    { value: 'Thermal / Mechanical Engineering', label: 'Thermal / Mechanical Engineering', code: 'MECH' },
    { value: 'Structural / Civil Engineering', label: 'Structural / Civil Engineering', code: 'CIVIL' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering', code: 'CHEM' },
    { value: 'Biotechnology', label: 'Biotechnology', code: 'BIOTECH' },
    { value: 'Aerospace Engineering', label: 'Aerospace Engineering', code: 'AERO' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'Diploma in Engineering / Polytechnic': [
    { value: 'Computer Science', label: 'Computer Science', code: 'CSE' },
    { value: 'Information Technology', label: 'Information Technology', code: 'IT' },
    { value: 'Mechanical Engineering', label: 'Mechanical Engineering', code: 'MECH' },
    { value: 'Civil Engineering', label: 'Civil Engineering', code: 'CIVIL' },
    { value: 'Electrical & Electronics', label: 'Electrical & Electronics', code: 'EEE' },
    { value: 'Electronics & Communication', label: 'Electronics & Communication', code: 'ECE' },
    { value: 'Automobile Engineering', label: 'Automobile Engineering', code: 'AUTO' },
    { value: 'Chemical Engineering', label: 'Chemical Engineering', code: 'CHEM' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // B.Sc. & M.Sc.
  'B.Sc.': [
    { value: 'Computer Science', label: 'Computer Science', code: 'CS' },
    { value: 'Information Technology', label: 'Information Technology', code: 'IT' },
    { value: 'Data Science', label: 'Data Science', code: 'DS' },
    { value: 'Mathematics', label: 'Mathematics', code: 'MATH' },
    { value: 'Physics', label: 'Physics', code: 'PHYS' },
    { value: 'Chemistry', label: 'Chemistry', code: 'CHEM' },
    { value: 'Biotechnology', label: 'Biotechnology', code: 'BIOTECH' },
    { value: 'Microbiology', label: 'Microbiology', code: 'MICRO' },
    { value: 'Biochemistry', label: 'Biochemistry', code: 'BIOCHEM' },
    { value: 'Statistics', label: 'Statistics', code: 'STAT' },
    { value: 'Botany', label: 'Botany', code: 'BOT' },
    { value: 'Zoology', label: 'Zoology', code: 'ZOOL' },
    { value: 'Agriculture', label: 'Agriculture', code: 'AGRI' },
    { value: 'Nursing', label: 'Nursing', code: 'NURSING' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'M.Sc.': [
    { value: 'Computer Science', label: 'Computer Science', code: 'CS' },
    { value: 'Data Science / Analytics', label: 'Data Science / Analytics', code: 'DS' },
    { value: 'Mathematics', label: 'Mathematics', code: 'MATH' },
    { value: 'Physics', label: 'Physics', code: 'PHYS' },
    { value: 'Chemistry', label: 'Chemistry', code: 'CHEM' },
    { value: 'Biotechnology', label: 'Biotechnology', code: 'BIOTECH' },
    { value: 'Microbiology', label: 'Microbiology', code: 'MICRO' },
    { value: 'Statistics', label: 'Statistics', code: 'STAT' },
    { value: 'Agriculture', label: 'Agriculture', code: 'AGRI' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // B.Com. & M.Com.
  'B.Com.': [
    { value: 'General', label: 'General', code: 'GEN' },
    { value: 'Accounting', label: 'Accounting', code: 'ACC' },
    { value: 'Finance', label: 'Finance', code: 'FIN' },
    { value: 'Banking', label: 'Banking', code: 'BANK' },
    { value: 'Computer Applications', label: 'Computer Applications', code: 'CA' },
    { value: 'Corporate Secretaryship', label: 'Corporate Secretaryship', code: 'CS' },
    { value: 'Taxation', label: 'Taxation', code: 'TAX' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'M.Com.': [
    { value: 'General', label: 'General', code: 'GEN' },
    { value: 'Accounting & Finance', label: 'Accounting & Finance', code: 'AF' },
    { value: 'Banking & Insurance', label: 'Banking & Insurance', code: 'BI' },
    { value: 'Taxation', label: 'Taxation', code: 'TAX' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // BCA & MCA
  'BCA': [
    { value: 'Computer Applications', label: 'Computer Applications', code: 'CA' },
    { value: 'Data Science', label: 'Data Science', code: 'DS' },
    { value: 'Artificial Intelligence', label: 'Artificial Intelligence', code: 'AI' },
    { value: 'Cloud Computing', label: 'Cloud Computing', code: 'CLOUD' },
    { value: 'Cyber Security', label: 'Cyber Security', code: 'CYBER' },
    { value: 'Software Engineering', label: 'Software Engineering', code: 'SE' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'MCA': [
    { value: 'Computer Applications', label: 'Computer Applications', code: 'CA' },
    { value: 'Data Analytics & AI', label: 'Data Analytics & AI', code: 'DA_AI' },
    { value: 'Cloud & DevOps', label: 'Cloud & DevOps', code: 'CLOUD' },
    { value: 'Cyber Security', label: 'Cyber Security', code: 'CYBER' },
    { value: 'Software Development', label: 'Software Development', code: 'DEV' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // BBA & MBA
  'BBA': [
    { value: 'General', label: 'General', code: 'GEN' },
    { value: 'Finance', label: 'Finance', code: 'FIN' },
    { value: 'Marketing', label: 'Marketing', code: 'MKT' },
    { value: 'Human Resources', label: 'Human Resources', code: 'HR' },
    { value: 'Business Analytics', label: 'Business Analytics', code: 'ANALYTICS' },
    { value: 'International Business', label: 'International Business', code: 'IB' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'MBA': [
    { value: 'Finance', label: 'Finance', code: 'FIN' },
    { value: 'Marketing', label: 'Marketing', code: 'MKT' },
    { value: 'Human Resources', label: 'Human Resources', code: 'HR' },
    { value: 'Business Analytics & Data', label: 'Business Analytics & Data', code: 'ANALYTICS' },
    { value: 'Operations & Supply Chain', label: 'Operations & Supply Chain', code: 'OPS' },
    { value: 'International Business', label: 'International Business', code: 'IB' },
    { value: 'Information Technology', label: 'Information Technology', code: 'IT' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // BA & MA
  'BA': [
    { value: 'English Literature', label: 'English Literature', code: 'ENG' },
    { value: 'Economics', label: 'Economics', code: 'ECON' },
    { value: 'History', label: 'History', code: 'HIST' },
    { value: 'Political Science', label: 'Political Science', code: 'POLSCI' },
    { value: 'Psychology', label: 'Psychology', code: 'PSYCH' },
    { value: 'Sociology', label: 'Sociology', code: 'SOCIO' },
    { value: 'Journalism & Mass Comm', label: 'Journalism & Mass Comm', code: 'JOURN' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'MA': [
    { value: 'English', label: 'English', code: 'ENG' },
    { value: 'Economics', label: 'Economics', code: 'ECON' },
    { value: 'History', label: 'History', code: 'HIST' },
    { value: 'Political Science', label: 'Political Science', code: 'POLSCI' },
    { value: 'Psychology', label: 'Psychology', code: 'PSYCH' },
    { value: 'Sociology', label: 'Sociology', code: 'SOCIO' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],

  // Medical / Pharmacy / Law / Architecture / Education
  'MBBS': [
    { value: 'General Medicine / MBBS', label: 'General Medicine / MBBS', code: 'GEN_MED' }
  ],
  'BDS': [
    { value: 'Dental Surgery / BDS', label: 'Dental Surgery / BDS', code: 'DENTAL' }
  ],
  'MD / MS (Medical)': [
    { value: 'General Medicine', label: 'General Medicine', code: 'MED' },
    { value: 'General Surgery', label: 'General Surgery', code: 'SURG' },
    { value: 'Pediatrics', label: 'Pediatrics', code: 'PED' },
    { value: 'Other Specialization', label: 'Other Specialization', code: 'OTHER' }
  ],
  'B.Pharm': [
    { value: 'Pharmacy', label: 'Pharmacy', code: 'GEN_PHARM' },
    { value: 'Pharmaceutics', label: 'Pharmaceutics', code: 'PHARM_CEUTICS' },
    { value: 'Pharmacology', label: 'Pharmacology', code: 'PHARM_COLOGY' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'M.Pharm': [
    { value: 'Pharmaceutics', label: 'Pharmaceutics', code: 'PHARM_CEUTICS' },
    { value: 'Pharmacology', label: 'Pharmacology', code: 'PHARM_COLOGY' },
    { value: 'Pharmaceutical Chemistry', label: 'Pharmaceutical Chemistry', code: 'PHARM_CHEM' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'LLB': [
    { value: 'General Law', label: 'General Law', code: 'GEN_LAW' },
    { value: 'Corporate Law', label: 'Corporate Law', code: 'CORP_LAW' },
    { value: 'Criminal Law', label: 'Criminal Law', code: 'CRIM_LAW' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'LLM': [
    { value: 'Corporate & Commercial Law', label: 'Corporate & Commercial Law', code: 'CORP_LAW' },
    { value: 'Constitutional & Administrative Law', label: 'Constitutional & Administrative Law', code: 'CONST_LAW' },
    { value: 'Criminal Law', label: 'Criminal Law', code: 'CRIM_LAW' },
    { value: 'International Law', label: 'International Law', code: 'INT_LAW' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'B.Arch': [
    { value: 'Architecture', label: 'Architecture', code: 'GEN_ARCH' },
    { value: 'Interior Architecture', label: 'Interior Architecture', code: 'INT_ARCH' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'M.Arch': [
    { value: 'Architectural Design', label: 'Architectural Design', code: 'ARCH_DES' },
    { value: 'Urban Design & Planning', label: 'Urban Design & Planning', code: 'URBAN' },
    { value: 'Landscape Architecture', label: 'Landscape Architecture', code: 'LANDSCAPE' },
    { value: 'Other', label: 'Other', code: 'OTHER' }
  ],
  'B.Ed.': [
    { value: 'Secondary Education', label: 'Secondary Education', code: 'SEC_ED' },
    { value: 'Elementary Education', label: 'Elementary Education', code: 'ELEM_ED' },
    { value: 'Special Education', label: 'Special Education', code: 'SPEC_ED' },
    { value: 'General', label: 'General', code: 'GEN' }
  ],
  'M.Ed.': [
    { value: 'Educational Management', label: 'Educational Management', code: 'ED_MGMT' },
    { value: 'Curriculum & Instruction', label: 'Curriculum & Instruction', code: 'CURR' },
    { value: 'General', label: 'General', code: 'GEN' }
  ],
  '12th / Higher Secondary': [
    { value: 'Science', label: 'Science', code: 'SCI' },
    { value: 'Commerce', label: 'Commerce', code: 'COMM' },
    { value: 'Arts / Humanities', label: 'Arts / Humanities', code: 'ARTS' },
    { value: 'Vocational', label: 'Vocational', code: 'VOC' },
    { value: 'Not Applicable', label: 'Not Applicable', code: 'NA' }
  ]
};

// Default fallback when a course has no specialized branch
export const DEFAULT_BRANCH_OPTIONS = [
  { value: 'Not Applicable', label: 'Not Applicable', code: 'NA' },
  { value: 'General', label: 'General', code: 'GEN' },
  { value: 'Other', label: 'Other', code: 'OTHER' }
];

export function getCoursesForEducationLevel(eduLevel) {
  const normalizedLevel = (eduLevel || 'UNDERGRADUATE').toUpperCase();
  if (normalizedLevel === 'TWELFTH_COMPLETED' || normalizedLevel === 'CLASS_12_PASSED') {
    return COURSES_BY_EDUCATION_LEVEL.TWELFTH_COMPLETED;
  }
  if (normalizedLevel === 'DIPLOMA') {
    return COURSES_BY_EDUCATION_LEVEL.DIPLOMA;
  }
  if (normalizedLevel === 'POSTGRADUATE') {
    return COURSES_BY_EDUCATION_LEVEL.POSTGRADUATE;
  }
  return COURSES_BY_EDUCATION_LEVEL.UNDERGRADUATE;
}

export function getBranchesForCourse(courseName) {
  if (!courseName) return DEFAULT_BRANCH_OPTIONS;
  
  // Direct match
  if (BRANCHES_BY_COURSE[courseName]) {
    return BRANCHES_BY_COURSE[courseName];
  }

  // Alias / Substring matching for flexible selection
  const lower = courseName.toLowerCase();
  if (lower.includes('b.tech') || lower.includes('b.e.') || lower.includes('btech') || lower.includes('engineering')) {
    return BRANCHES_BY_COURSE['B.Tech / B.E.'];
  }
  if (lower.includes('m.tech') || lower.includes('m.e.') || lower.includes('mtech')) {
    return BRANCHES_BY_COURSE['M.Tech / M.E.'];
  }
  if (lower.includes('b.sc') || lower.includes('bsc')) {
    return BRANCHES_BY_COURSE['B.Sc.'];
  }
  if (lower.includes('m.sc') || lower.includes('msc')) {
    return BRANCHES_BY_COURSE['M.Sc.'];
  }
  if (lower.includes('b.com') || lower.includes('bcom')) {
    return BRANCHES_BY_COURSE['B.Com.'];
  }
  if (lower.includes('m.com') || lower.includes('mcom')) {
    return BRANCHES_BY_COURSE['M.Com.'];
  }
  if (lower.includes('bca')) {
    return BRANCHES_BY_COURSE['BCA'];
  }
  if (lower.includes('mca')) {
    return BRANCHES_BY_COURSE['MCA'];
  }
  if (lower.includes('bba')) {
    return BRANCHES_BY_COURSE['BBA'];
  }
  if (lower.includes('mba')) {
    return BRANCHES_BY_COURSE['MBA'];
  }
  if (lower.includes('mbbs')) {
    return BRANCHES_BY_COURSE['MBBS'];
  }
  if (lower.includes('bds')) {
    return BRANCHES_BY_COURSE['BDS'];
  }
  if (lower.includes('pharm')) {
    return BRANCHES_BY_COURSE['B.Pharm'];
  }
  if (lower.includes('llb') || lower.includes('law')) {
    return BRANCHES_BY_COURSE['LLB'];
  }

  return DEFAULT_BRANCH_OPTIONS;
}
