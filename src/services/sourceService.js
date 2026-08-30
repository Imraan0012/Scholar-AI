// =============================================================================
// SCHOLAR AI — SCHOLARSHIP SOURCES SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import { MASTER_SOURCES_REGISTRY } from '../data/sources/index.js';

export const sourceService = {
  async getSourceCount() {
    try {
      const data = await apiClient.get('/sources/count');
      if (data && typeof data.count === 'number') {
        return data.count;
      }
    } catch (err) {
      console.warn('[SourceService] Backend count error:', err.message);
    }
    return MASTER_SOURCES_REGISTRY.length;
  },

  async getSources({ category = 'ALL' } = {}) {
    try {
      const data = await apiClient.get('/sources');
      if (Array.isArray(data)) {
        let list = data;
        if (category !== 'ALL') {
          list = list.filter(s => s.category === category || s.providerType === category);
        }
        return { sources: list, fromBackend: true };
      }
    } catch (err) {
      console.warn('[SourceService] Backend getSources error:', err.message);
    }

    let list = [...MASTER_SOURCES_REGISTRY];
    if (category !== 'ALL') {
      list = list.filter(s => s.category === category || s.providerType === category);
    }
    return { sources: list, fromBackend: false };
  },

  subscribeToSourceChanges(onChange) {
    if (!isSupabaseConfigured || typeof onChange !== 'function') {
      return () => {};
    }
    try {
      const channel = supabase
        .channel('public:scholarship_sources_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scholarship_sources' }, onChange)
        .subscribe();
      return () => supabase.removeChannel(channel);
    } catch (err) {
      return () => {};
    }
  }
};
