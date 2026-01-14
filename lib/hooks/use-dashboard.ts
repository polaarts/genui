'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardConfig } from '@/types';

interface GeneratedWidget {
  id: string;
  type: string;
  component: React.ReactNode;
}

export function useDashboard(config: DashboardConfig) {
  const [widgets, setWidgets] = useState<GeneratedWidget[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const prevConfigHash = useRef<string>('');

  useEffect(() => {
    // Calcular hash simple de la configuración
    const currentHash = JSON.stringify({
      widgets: config.activeWidgets.sort(),
      layout: config.layout,
      timeRange: config.defaultTimeRange,
    });

    // Solo regenerar si la configuración cambió
    if (currentHash !== prevConfigHash.current && prevConfigHash.current !== '') {
      setIsRegenerating(true);
      
      // Simular regeneración (será reemplazado por generateDashboard real en Fase 3)
      setTimeout(() => {
        setIsRegenerating(false);
        prevConfigHash.current = currentHash;
      }, 1500);
    } else if (prevConfigHash.current === '') {
      prevConfigHash.current = currentHash;
    }
  }, [config]);

  const regenerate = () => {
    setIsRegenerating(true);
    // Forzar regeneración
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1500);
  };

  return { 
    widgets, 
    isRegenerating, 
    regenerate 
  };
}
