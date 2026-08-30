// =============================================================================
// SCHOLAR AI — SCHOLARSHIP REGISTRY & REPOSITORY SERVICE
// Central access point for searching, filtering, indexing, and auditing
// verified scholarships across India.
// =============================================================================

import { MASTER_SCHOLARSHIP_REGISTRY, getScholarshipUrls } from '../data/scholarships/index.js';
import { MASTER_SOURCES_REGISTRY } from '../data/sources/index.js';
import { normalizeCourse } from './courseNormalizationService.js';
import { calculateDeadlineStatus } from '../engine/eligibilityEngine.js';

class ScholarshipRegistryService {
  constructor() {
    this.scholarships = [...MASTER_SCHOLARSHIP_REGISTRY];
    this.sources = [...MASTER_SOURCES_REGISTRY];
  }

  /**
   * Returns all active scholarships in the knowledge base.
   */
  getAllScholarships() {
    return this.scholarships;
  }

  /**
   * Finds a single scholarship by ID or canonical ID.
   */
  getScholarshipById(id) {
    if (!id) return null;
    return this.scholarships.find(s => s.id === id || s.canonicalScholarshipId === id) || null;
  }

  /**
   * Returns total indexed scholarship count.
   */
  getTotalIndexedCount() {
    return this.scholarships.length;
  }

  /**
   * Returns all verified sources.
   */
  getAllSources() {
    return this.sources;
  }

  /**
   * Performs multifaceted search and filtering across the entire knowledge base.
   */
  searchScholarships({
    query = '',
    sector = 'ALL',
    state = 'ALL',
    educationLevel = 'ALL',
    course = 'ALL',
    category = 'ALL',
    sortBy = 'BEST_MATCH',
    onlyActive = true
  } = {}) {
    let results = [...this.scholarships];

    // Filter active by deadline
    if (onlyActive) {
      results = results.filter(s => {
        const deadlineStatus = calculateDeadlineStatus(s.application_deadline, s.application_start);
        return deadlineStatus !== 'CLOSED' && deadlineStatus !== 'EXPIRED';
      });
    }

    // Sector Filter
    if (sector !== 'ALL') {
      results = results.filter(s => s.government_level === sector || s.provider_type === sector);
    }

    // State Domicile Filter
    if (state !== 'ALL' && state !== 'ALL_INDIA') {
      results = results.filter(s => s.state === 'ALL_INDIA' || s.state?.toLowerCase() === state.toLowerCase());
    }

    // Search Query matching
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(s => {
        const nameMatch = (s.name || '').toLowerCase().includes(q);
        const providerMatch = (s.provider || '').toLowerCase().includes(q);
        const descMatch = (s.description || '').toLowerCase().includes(q);
        const stateMatch = (s.state || '').toLowerCase().includes(q);
        const ministryMatch = (s.ministry_or_department || '').toLowerCase().includes(q);

        return nameMatch || providerMatch || descMatch || stateMatch || ministryMatch;
      });
    }

    // Sorting
    if (sortBy === 'AMOUNT') {
      results.sort((a, b) => (b.amount_max || b.amount_min || 0) - (a.amount_max || a.amount_min || 0));
    } else if (sortBy === 'DEADLINE') {
      results.sort((a, b) => new Date(a.application_deadline || '2099-12-31') - new Date(b.application_deadline || '2099-12-31'));
    }

    return results;
  }

  /**
   * Simulates real-time synchronization with an official scholarship portal source.
   */
  syncSource(sourceId) {
    const source = this.sources.find(s => s.id === sourceId);
    if (!source) return { success: false, message: 'Source not found' };

    const timestamp = new Date().toISOString();
    source.lastVerifiedAt = timestamp;
    source.lastSyncAt = timestamp;
    source.syncStatus = 'HEALTHY_SYNCED';

    return {
      success: true,
      sourceId,
      sourceName: source.name,
      lastSyncAt: timestamp,
      status: 'VERIFIED_ACTIVE',
      schemesFound: source.activeSchemesCount || 5
    };
  }
}

export const scholarshipRegistryService = new ScholarshipRegistryService();
