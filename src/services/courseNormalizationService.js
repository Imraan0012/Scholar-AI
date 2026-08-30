// =============================================================================
// SCHOLAR AI — COURSE & DEGREE NORMALIZATION SERVICE
// Maps diverse course titles (B.Tech, B.E., Bachelor of Engineering, MBBS, B.Sc)
// to canonical course taxonomy groups while preserving source text.
// =============================================================================

export const CANONICAL_COURSE_GROUPS = {
  ENGINEERING_UG: {
    id: 'ENGINEERING_UG',
    label: 'B.Tech / B.E. / Engineering (UG)',
    aliases: ['btech', 'b.tech', 'be', 'b.e.', 'bachelor of technology', 'bachelor of engineering', 'b tech', 'engineering']
  },
  MEDICAL_UG: {
    id: 'MEDICAL_UG',
    label: 'MBBS / BDS / AYUSH (UG)',
    aliases: ['mbbs', 'bds', 'bams', 'bhms', 'bums', 'medicine', 'dental', 'ayush']
  },
  SCIENCE_UG: {
    id: 'SCIENCE_UG',
    label: 'B.Sc / BS (Science Honours & General)',
    aliases: ['bsc', 'b.sc', 'bs', 'b.s.', 'bachelor of science', 'pure science']
  },
  COMMERCE_UG: {
    id: 'COMMERCE_UG',
    label: 'B.Com / BBA / BMS',
    aliases: ['bcom', 'b.com', 'bba', 'b.b.a.', 'bms', 'bachelor of commerce', 'bachelor of business administration']
  },
  ARTS_HUMANITIES_UG: {
    id: 'ARTS_HUMANITIES_UG',
    label: 'B.A. / Humanities / Social Sciences',
    aliases: ['ba', 'b.a.', 'bachelor of arts', 'humanities', 'social science']
  },
  COMPUTER_APPLICATIONS_UG: {
    id: 'COMPUTER_APPLICATIONS_UG',
    label: 'BCA / IT / Computer Science',
    aliases: ['bca', 'b.c.a.', 'bachelor of computer applications', 'bsc it', 'bsc cs']
  },
  DIPLOMA_POLYTECHNIC: {
    id: 'DIPLOMA_POLYTECHNIC',
    label: 'Polytechnic / Technical Diploma',
    aliases: ['diploma', 'polytechnic', 'diploma in engineering', 'iti', 'vocational diploma']
  },
  POSTGRADUATE_MASTERS: {
    id: 'POSTGRADUATE_MASTERS',
    label: 'M.Tech / M.E. / M.Sc / M.Com / M.A. / MBA / MCA',
    aliases: ['mtech', 'm.tech', 'me', 'm.e.', 'msc', 'm.sc', 'mba', 'mca', 'm.com', 'ma', 'm.a.', 'postgraduate', 'master']
  },
  DOCTORAL_PHD: {
    id: 'DOCTORAL_PHD',
    label: 'Ph.D. / Research Fellowships',
    aliases: ['phd', 'ph.d.', 'doctorate', 'fellowship', 'research scholar']
  }
};

/**
 * Normalizes an input course name to its canonical taxonomy group.
 */
export function normalizeCourse(courseInput) {
  if (!courseInput) return { canonicalId: 'GENERAL_ANY', sourceCourseName: 'Any Stream' };

  const cleaned = courseInput.trim().toLowerCase();

  for (const group of Object.values(CANONICAL_COURSE_GROUPS)) {
    if (group.aliases.some(alias => cleaned.includes(alias) || cleaned === alias)) {
      return {
        canonicalId: group.id,
        label: group.label,
        sourceCourseName: courseInput
      };
    }
  }

  return {
    canonicalId: 'GENERAL_ANY',
    label: courseInput,
    sourceCourseName: courseInput
  };
}
