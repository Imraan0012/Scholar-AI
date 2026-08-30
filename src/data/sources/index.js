// =============================================================================
// SCHOLAR AI — MASTER SCHOLARSHIP SOURCES REGISTRY
// Unifies National Government, 28 States, 8 UTs, Corporate Trusts, and Universities.
// =============================================================================

import { NATIONAL_SCHOLARSHIP_SOURCES } from './nationalSourcesRegistry.js';
import { ALL_INDIA_STATE_UT_SOURCES } from './stateSourcesRegistry.js';
import { CORPORATE_TRUST_SOURCES } from './corporateSourcesRegistry.js';
import { INSTITUTION_SCHOLARSHIP_SOURCES } from './institutionSourcesRegistry.js';

export const MASTER_SOURCES_REGISTRY = [
  ...NATIONAL_SCHOLARSHIP_SOURCES,
  ...ALL_INDIA_STATE_UT_SOURCES,
  ...CORPORATE_TRUST_SOURCES,
  ...INSTITUTION_SCHOLARSHIP_SOURCES
];

export const getSourcesByCategory = (category) => {
  if (!category || category === 'ALL') return MASTER_SOURCES_REGISTRY;
  return MASTER_SOURCES_REGISTRY.filter(s => s.category === category || s.providerType === category);
};

export const getSourcesByState = (stateName) => {
  if (!stateName || stateName === 'ALL_INDIA') return MASTER_SOURCES_REGISTRY;
  return MASTER_SOURCES_REGISTRY.filter(
    s => s.stateName?.toLowerCase() === stateName.toLowerCase() || s.state?.toLowerCase() === stateName.toLowerCase()
  );
};

export const getSourceById = (sourceId) => {
  return MASTER_SOURCES_REGISTRY.find(s => s.id === sourceId) || null;
};
