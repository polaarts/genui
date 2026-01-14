'use client';

import { useState, useMemo, useCallback } from 'react';
import { DashboardConfig } from '@/types';

/**
 * Hook simplificado para detectar cambios en la configuración del dashboard
 * El estado de regeneración se usa para mostrar skeletons durante transiciones
 */
export function useDashboard(config: DashboardConfig) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Crear un hash estable de la configuración
  const configHash = useMemo(() => {
    return JSON.stringify({
      widgets: [...config.activeWidgets].sort(),
      layout: config.layout,
      timeRange: config.defaultTimeRange,
    });
  }, [config.activeWidgets, config.layout, config.defaultTimeRange]);

  const regenerate = useCallback(() => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
    }, 800);
  }, []);

  return { 
    isRegenerating, 
    regenerate,
    configHash,
  };
}
