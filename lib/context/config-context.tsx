'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DashboardConfig } from '@/types';
import { USER_SOFIA } from '@/lib/mock-data';

interface ConfigContextType {
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateDashboardConfig: (config: Partial<DashboardConfig>) => void;
  isLoading: boolean;
  configHash: string;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'genui_user_config';

// Función para calcular hash de configuración (detectar cambios)
function hashConfig(config: DashboardConfig): string {
  return JSON.stringify({
    widgets: config.activeWidgets.sort(),
    layout: config.layout,
    timeRange: config.defaultTimeRange,
  });
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(USER_SOFIA);
  const [isLoading, setIsLoading] = useState(true);
  const [configHash, setConfigHash] = useState('');

  // Cargar configuración desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        setUserProfile(parsed);
        setConfigHash(hashConfig(parsed.dashboardConfig));
      } else {
        // Primera vez: usar perfil por defecto pero marcarlo como no onboarded
        setUserProfile({ ...USER_SOFIA, isOnboarded: false });
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar en localStorage cuando cambie el perfil
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      setConfigHash(hashConfig(userProfile.dashboardConfig));
    }
  }, [userProfile, isLoading]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const updateDashboardConfig = (configUpdates: Partial<DashboardConfig>) => {
    setUserProfile(prev => ({
      ...prev,
      dashboardConfig: { ...prev.dashboardConfig, ...configUpdates }
    }));
  };

  return (
    <ConfigContext.Provider 
      value={{ 
        userProfile, 
        updateProfile, 
        updateDashboardConfig,
        isLoading, 
        configHash 
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useUserConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useUserConfig must be used within ConfigProvider');
  }
  return context;
}
