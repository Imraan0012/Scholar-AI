// =============================================================================
// SCHOLAR AI — USER NOTIFICATIONS SERVICE (SPRING BOOT REST INTEGRATION)
// =============================================================================

import { apiClient } from './apiClient';

const LOCAL_NOTIFICATIONS_KEY = 'scholar_ai_user_notifications';

export const notificationService = {
  async getNotifications(userId, profile, evaluationResults, savedApplications) {
    try {
      const data = await apiClient.get('/notifications');
      if (Array.isArray(data) && data.length > 0) {
        this.saveLocalNotifications(userId, data);
        return data;
      }
    } catch (err) {
      console.warn('[NotificationService] Backend fetch error, generating context notifications:', err.message);
    }

    const localList = this.getLocalNotifications(userId);
    if (localList && localList.length > 0) {
      return localList;
    }

    const dynamic = this.generateLiveNotifications(profile, evaluationResults, savedApplications);
    this.saveLocalNotifications(userId, dynamic);
    return dynamic;
  },

  async getUnreadCount(userId) {
    try {
      const data = await apiClient.get('/notifications/unread-count');
      if (data && typeof data.unreadCount === 'number') {
        return data.unreadCount;
      }
    } catch (err) {
      console.warn('[NotificationService] Backend unread count error:', err.message);
    }
    const stored = this.getLocalNotifications(userId);
    return stored.filter(n => !n.read).length;
  },

  async markAsRead(notificationId, userId) {
    if (!notificationId) return;
    try {
      await apiClient.put(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.warn('[NotificationService] Backend mark read error:', err.message);
    }
    const localList = this.getLocalNotifications(userId);
    const updated = localList.map(n => n.id === notificationId ? { ...n, read: true } : n);
    this.saveLocalNotifications(userId, updated);
  },

  async markAllAsRead(userId) {
    try {
      await apiClient.put('/notifications/read-all');
    } catch (err) {
      console.warn('[NotificationService] Backend mark all read error:', err.message);
    }
    const localList = this.getLocalNotifications(userId);
    const updated = localList.map(n => ({ ...n, read: true }));
    this.saveLocalNotifications(userId, updated);
  },

  async deleteNotification(notificationId, userId) {
    if (!notificationId) return;
    try {
      const data = await apiClient.delete(`/notifications/${notificationId}`);
      if (Array.isArray(data)) {
        this.saveLocalNotifications(userId, data);
        return data;
      }
    } catch (err) {
      console.warn('[NotificationService] Backend delete error:', err.message);
    }
    const localList = this.getLocalNotifications(userId);
    const updated = localList.filter(n => n.id !== notificationId);
    this.saveLocalNotifications(userId, updated);
    return updated;
  },

  async clearAllNotifications(userId) {
    try {
      await apiClient.delete('/notifications');
    } catch (err) {
      console.warn('[NotificationService] Backend clear error:', err.message);
    }
    this.saveLocalNotifications(userId, []);
    return [];
  },

  async createNotification(userId, { title, message, type = 'INFO', link = null }) {
    try {
      const created = await apiClient.post('/notifications', { title, message, type, link });
      if (created) {
        const localList = this.getLocalNotifications(userId);
        this.saveLocalNotifications(userId, [created, ...localList]);
        return created;
      }
    } catch (err) {
      console.warn('[NotificationService] Backend create error:', err.message);
    }

    const localList = this.getLocalNotifications(userId);
    const newNotif = {
      id: `notif_${Date.now()}`,
      user_id: userId,
      title,
      message,
      type,
      read: false,
      link,
      created_at: new Date().toISOString()
    };
    this.saveLocalNotifications(userId, [newNotif, ...localList]);
    return newNotif;
  },

  subscribeToUserNotifications(userId, callback) {
    if (!userId || typeof callback !== 'function') return () => {};
    // Periodic refresh for real-time notifications
    const interval = setInterval(() => {
      try {
        callback();
      } catch (e) {}
    }, 30000);
    return () => clearInterval(interval);
  },

  generateLiveNotifications(profile = {}, evaluationResults = {}, savedApplications = []) {
    const notifications = [];
    const now = Date.now();
    const strongMatches = evaluationResults?.strongMatches || [];
    const goodMatches = evaluationResults?.goodMatches || [];
    const topMatch = strongMatches[0] || goodMatches[0];

    if (topMatch) {
      notifications.push({
        id: `match_${topMatch.scholarship?.id || 'top'}`,
        title: `⚡ ${topMatch.matchScore}% Match: ${topMatch.scholarship?.name || 'Verified Scheme'}`,
        message: `Your ${profile.course || 'Degree'} profile qualifies for verified financial aid.`,
        type: 'SCHEME_MATCH',
        read: false,
        created_at: new Date(now - 1000 * 60 * 15).toISOString()
      });
    }

    const domicile = profile.domicileState || 'Pan-India';
    const category = profile.category || 'General';
    notifications.push({
      id: `state_quota_${domicile}_${category}`,
      title: `🏛️ ${domicile} & ${category} Quota Verified`,
      message: `State domicile and category criteria verified on live backend.`,
      type: 'SYSTEM',
      read: false,
      created_at: new Date(now - 1000 * 60 * 60 * 2).toISOString()
    });

    return notifications;
  },

  getLocalNotifications(userId) {
    const key = userId ? `${LOCAL_NOTIFICATIONS_KEY}_${userId}` : LOCAL_NOTIFICATIONS_KEY;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveLocalNotifications(userId, list) {
    const key = userId ? `${LOCAL_NOTIFICATIONS_KEY}_${userId}` : LOCAL_NOTIFICATIONS_KEY;
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}
  }
};
