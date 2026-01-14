'use client';

import { useState, useEffect } from 'react';
// import { generateDashboard } from '@/app/actions';
import { generateDashboardMock } from '@/app/actions-mock'; // TEMPORAL: usando mock
import { UserProfile } from '@/types';
import { DashboardOutput } from '@/lib/ai/schemas';

export function useDashboardData(userProfile: UserProfile, shouldGenerate: boolean = true) {
  const [dashboardData, setDashboardData] = useState<DashboardOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shouldGenerate) {
      setIsLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        console.log('[useDashboardData] Starting load for user:', userProfile.name);
        setIsLoading(true);
        setError(null);
        
        // const data = await generateDashboard(userProfile);
        const data = await generateDashboardMock(userProfile); // TEMPORAL: usando mock
        console.log('[useDashboardData] Data received:', data);
        setDashboardData(data);
      } catch (err) {
        console.error('[useDashboardData] Error loading dashboard:', err);
        console.error('[useDashboardData] Error stack:', err instanceof Error ? err.stack : 'No stack');
        setError('No se pudo cargar el dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.id, userProfile.dashboardConfig.activeWidgets.join(','), shouldGenerate]);

  const refresh = async () => {
    try {
      setIsLoading(true);
      // const data = await generateDashboard(userProfile);
      const data = await generateDashboardMock(userProfile); // TEMPORAL: usando mock
      setDashboardData(data);
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
      setError('No se pudo actualizar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dashboardData,
    isLoading,
    error,
    refresh,
  };
}
