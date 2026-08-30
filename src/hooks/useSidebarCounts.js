// =============================================================================
// SCHOLAR AI — SIDEBAR COUNTS HOOK
// Connects sidebar badges dynamically to live Supabase state with realtime sync.
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { dashboardCountsService } from '../services/dashboardCountsService.js';
import { useStudentProfile } from '../context/StudentProfileContext.jsx';

export function useSidebarCounts() {
  const { currentUser, scholarships, bookmarks, savedApplications } = useStudentProfile();
  const [counts, setCounts] = useState({
    scholarshipCount: null,
    sourceCount: null,
    unreadNotificationCount: null,
    savedCount: null,
    applicationsCount: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCounts = useCallback(async () => {
    try {
      setError(null);
      const data = await dashboardCountsService.getAllCounts(currentUser?.id);
      
      // Ensure scholarship count stays perfectly consistent with current loaded scholarships in context
      if (scholarships && scholarships.length > 0 && !data.scholarshipCount) {
        data.scholarshipCount = scholarships.length;
      }
      
      // Reflect live client context if updated
      if (Array.isArray(bookmarks)) {
        data.savedCount = bookmarks.length;
      }
      if (Array.isArray(savedApplications)) {
        data.applicationsCount = savedApplications.length;
      }

      setCounts(data);
    } catch (err) {
      console.error('[useSidebarCounts] Error fetching live counts:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, scholarships, bookmarks, savedApplications]);

  useEffect(() => {
    let isMounted = true;

    fetchCounts();

    // Subscribe to real-time database changes
    const unsubscribe = dashboardCountsService.subscribeToRealtimeCounts(
      currentUser?.id,
      (updatedCounts) => {
        if (isMounted) {
          setCounts(prev => ({
            ...prev,
            ...updatedCounts
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchCounts, currentUser?.id]);

  return {
    scholarshipCount: counts.scholarshipCount,
    sourceCount: counts.sourceCount,
    unreadNotificationCount: counts.unreadNotificationCount,
    savedCount: counts.savedCount,
    applicationsCount: counts.applicationsCount,
    loading,
    error,
    refreshCounts: fetchCounts
  };
}
