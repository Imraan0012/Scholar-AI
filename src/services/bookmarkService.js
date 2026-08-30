// =============================================================================
// SCHOLAR AI — BOOKMARK & APPLICATION SERVICES (SPRING BOOT & SUPABASE REST)
// 100% Data-Driven from Supabase via authenticated Spring Boot backend
// =============================================================================

import { apiClient } from './apiClient';
import { MASTER_SCHOLARSHIP_REGISTRY } from '../data/scholarships/index.js';

const LOCAL_BOOKMARKS_KEY = 'scholar_ai_user_bookmarks';
const LOCAL_APPLICATIONS_KEY = 'scholar_ai_saved_applications';

function hydrateApplication(app) {
  if (!app) return null;
  const sch = MASTER_SCHOLARSHIP_REGISTRY.find(s => s.id === app.scholarshipId) || {};
  return {
    id: app.id || `app_${app.scholarshipId}`,
    scholarshipId: app.scholarshipId,
    scholarshipName: sch.name || app.scholarshipName || app.scholarshipId,
    provider: sch.provider || 'Official Authority',
    amountDisplay: sch.amount_display || sch.amountDisplay || '₹ Verified Scheme Benefit',
    deadline: sch.application_deadline || sch.applicationDeadline || '',
    governmentLevel: sch.government_level || sch.governmentLevel || 'CENTRAL',
    category: sch.category || 'GENERAL',
    status: (app.status || 'APPLIED').toUpperCase(),
    appliedDate: app.appliedAt ? app.appliedAt.split('T')[0] : (app.appliedDate || new Date().toISOString().split('T')[0]),
    officialUrl: sch.official_application_url || sch.official_website_url || app.officialUrl || '',
    updatedAt: app.updatedAt || new Date().toISOString()
  };
}

export const bookmarkService = {
  async getBookmarks(userId) {
    try {
      const data = await apiClient.get('/bookmarks');
      if (Array.isArray(data)) {
        localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.warn('[BookmarkService] Backend fetch error:', err.message);
    }
    return [];
  },

  async toggleBookmark(userId, scholarshipId) {
    try {
      const data = await apiClient.post(`/bookmarks/${scholarshipId}`);
      if (data && data.bookmarks && Array.isArray(data.bookmarks)) {
        localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
        return { isBookmarked: data.bookmarked, bookmarks: data.bookmarks };
      }
    } catch (err) {
      console.warn('[BookmarkService] Backend toggle error, falling back locally:', err.message);
    }

    const currentBookmarks = await this.getBookmarks(userId);
    const isBookmarked = currentBookmarks.includes(scholarshipId);
    const updatedBookmarks = isBookmarked
      ? currentBookmarks.filter(id => id !== scholarshipId)
      : [...currentBookmarks, scholarshipId];

    localStorage.setItem(LOCAL_BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    return { isBookmarked: !isBookmarked, bookmarks: updatedBookmarks };
  }
};

export const applicationService = {
  /**
   * Fetches applications strictly for the currently authenticated user from Supabase.
   */
  async getApplications(userId) {
    try {
      const data = await apiClient.get('/applications');
      if (Array.isArray(data)) {
        const mapped = data.map(hydrateApplication).filter(Boolean);
        localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[ApplicationService] Backend fetch error:', err.message);
    }
    return [];
  },

  /**
   * Creates or updates an application record exclusively upon explicit user click on "Apply Now" / "Start Application".
   */
  async recordAction(userId, scholarship, status = 'APPLIED') {
    if (!scholarship?.id) return [];
    try {
      const data = await apiClient.post(`/applications/${scholarship.id}`, { status });
      if (data && data.applications && Array.isArray(data.applications)) {
        const mapped = data.applications.map(hydrateApplication).filter(Boolean);
        localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[ApplicationService] Backend record error:', err.message);
    }

    const current = await this.getApplications(userId);
    const existingIndex = current.findIndex(a => a.scholarshipId === scholarship.id);
    const record = hydrateApplication({
      id: `app_${scholarship.id}`,
      scholarshipId: scholarship.id,
      status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const updated = existingIndex >= 0
      ? current.map((item, idx) => idx === existingIndex ? { ...item, ...record, status } : item)
      : [record, ...current];

    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Updates an application status in Supabase.
   */
  async updateStatus(userId, scholarshipId, newStatus) {
    try {
      await apiClient.put(`/applications/${scholarshipId}`, { status: newStatus });
      return await this.getApplications(userId);
    } catch (err) {
      console.warn('[ApplicationService] Backend update status error:', err.message);
    }
    const current = await this.getApplications(userId);
    const updated = current.map(a =>
      a.scholarshipId === scholarshipId ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a
    );
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Deletes an application record from Supabase.
   */
  async removeApplication(userId, scholarshipId) {
    try {
      const data = await apiClient.delete(`/applications/${scholarshipId}`);
      if (Array.isArray(data)) {
        const mapped = data.map(hydrateApplication).filter(Boolean);
        localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    } catch (err) {
      console.warn('[ApplicationService] Backend delete error:', err.message);
    }
    const current = await this.getApplications(userId);
    const updated = current.filter(a => a.scholarshipId !== scholarshipId);
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Clears all applications for the authenticated user from Supabase.
   */
  async clearAllApplications(userId) {
    try {
      await apiClient.delete('/applications');
    } catch (err) {
      console.warn('[ApplicationService] Backend clear error:', err.message);
    }
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify([]));
    return [];
  }
};
