// =============================================================================
// SCHOLAR AI — CENTRALIZED DASHBOARD COUNTS SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient.js';
import { sourceService } from './sourceService.js';
import { notificationService } from './notificationService.js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export const dashboardCountsService = {
  async getSummary(userId) {
    try {
      const data = await apiClient.get('/dashboard/summary');
      if (data) {
        return data;
      }
    } catch (err) {
      console.warn('[DashboardCountsService] Backend getSummary error:', err.message);
    }
    return null;
  },

  async getScholarshipCount() {
    try {
      const data = await apiClient.get('/scholarships/count');
      if (data && typeof data.count === 'number') {
        return data.count;
      }
    } catch (e) {}
    return 0;
  },

  async getSourceCount() {
    return await sourceService.getSourceCount();
  },

  async getUnreadNotificationCount(userId) {
    return await notificationService.getUnreadCount(userId);
  },

  async getAllCounts(userId) {
    if (userId) {
      const summary = await this.getSummary(userId);
      if (summary) {
        return {
          scholarshipCount: summary.totalCount,
          sourceCount: await this.getSourceCount(),
          unreadNotificationCount: summary.unreadNotifications,
          savedCount: summary.savedScholarships,
          applicationsCount: summary.activeApplications,
          eligibleCount: summary.eligibleCount,
          possibleCount: summary.possibleCount,
          notEligibleCount: summary.notEligibleCount,
          profileCompletion: summary.profileCompletion
        };
      }
    }

    const [scholarshipCount, sourceCount, unreadNotificationCount] = await Promise.all([
      this.getScholarshipCount(),
      this.getSourceCount(),
      this.getUnreadNotificationCount(userId)
    ]);

    return {
      scholarshipCount,
      sourceCount,
      unreadNotificationCount,
      savedCount: 0,
      applicationsCount: 0
    };
  },

  subscribeToRealtimeCounts(userId, onCountsChanged) {
    if (!isSupabaseConfigured || typeof onCountsChanged !== 'function') {
      return () => {};
    }

    const unsubSources = sourceService.subscribeToSourceChanges(async () => {
      const counts = await this.getAllCounts(userId);
      onCountsChanged(counts);
    });

    return () => {
      unsubSources();
    };
  }
};
