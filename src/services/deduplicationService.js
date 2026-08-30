// =============================================================================
// SCHOLAR AI — SCHOLARSHIP DEDUPLICATION & CANONICAL MERGE ENGINE
// Detects when the same scholarship appears across multiple feeds (e.g., NSP,
// state portal, provider website, Buddy4Study) and merges into one canonical record.
// =============================================================================

function normalizeText(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Jaccard word similarity between two titles.
 */
function calculateSimilarity(titleA, titleB) {
  const wordsA = new Set(normalizeText(titleA).split(' ').filter(w => w.length > 2));
  const wordsB = new Set(normalizeText(titleB).split(' ').filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  wordsA.forEach(w => {
    if (wordsB.has(w)) intersection++;
  });

  const union = wordsA.size + wordsB.size - intersection;
  return union > 0 ? intersection / union : 0;
}

/**
 * Deduplicates an array of raw scholarship records.
 * Prioritizes LEVEL 1 Official Govt/Provider over secondary aggregators.
 */
export function deduplicateScholarships(scholarshipList) {
  const canonicalMap = new Map();

  scholarshipList.forEach(item => {
    const canonicalKey = item.canonicalScholarshipId || item.id;
    
    // Check if an existing entry shares high similarity or same ID
    let matchedKey = null;
    for (const [key, existing] of canonicalMap.entries()) {
      if (key === canonicalKey) {
        matchedKey = key;
        break;
      }
      
      const isSameProvider = normalizeText(existing.provider) === normalizeText(item.provider);
      const isSameLevel = existing.government_level === item.government_level;
      const sim = calculateSimilarity(existing.name, item.name);

      if (isSameProvider && isSameLevel && sim > 0.7) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      const existing = canonicalMap.get(matchedKey);
      // Merge source provenance
      const sources = existing.duplicateSourceRecords || [
        { sourceName: existing.sourceName || existing.provider, sourceUrl: existing.sourceUrl || existing.official_website_url }
      ];
      
      sources.push({
        sourceName: item.sourceName || item.provider,
        sourceUrl: item.sourceUrl || item.official_application_url || item.official_website_url
      });

      // Prefer official Level 1 data over aggregator
      if (item.source_reliability === 'LEVEL_1_OFFICIAL_GOVT' && existing.source_reliability !== 'LEVEL_1_OFFICIAL_GOVT') {
        canonicalMap.set(matchedKey, {
          ...item,
          canonicalScholarshipId: matchedKey,
          duplicateSourceRecords: sources
        });
      } else {
        canonicalMap.set(matchedKey, {
          ...existing,
          duplicateSourceRecords: sources
        });
      }
    } else {
      canonicalMap.set(canonicalKey, {
        ...item,
        canonicalScholarshipId: canonicalKey,
        duplicateSourceRecords: [
          { sourceName: item.sourceName || item.provider, sourceUrl: item.sourceUrl || item.official_application_url || item.official_website_url }
        ]
      });
    }
  });

  return Array.from(canonicalMap.values());
}
