// 1. El Contexto del Usuario
export type UserPersona = 'relaxed' | 'auditor' | 'spender';

export interface UserPreferences {
  persona: UserPersona;
  uiConfig: {
    density: 'compact' | 'comfortable';
    showDecimals: boolean;
    tone: 'empathetic' | 'technical' | 'urgent';
    visualTheme: 'minimal' | 'data-heavy';
  };
}

// 1.1 Configuración del Dashboard
export type WidgetType = 'summary' | 'transactions' | 'chart' | 'budget' | 'alerts';

export interface DashboardConfig {
  activeWidgets: WidgetType[];
  widgetOrder: string[];
  layout: 'grid-2' | 'grid-3' | 'list';
  defaultTimeRange: 'week' | 'month' | 'quarter' | 'year';
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: UserPreferences;
  dashboardConfig: DashboardConfig;
  isOnboarded: boolean;
}

// 2. Datos Financieros
export type Category = 'Housing' | 'Food' | 'Transport' | 'Leisure' | 'Income' | 'Savings' | 'Health';

export interface Transaction {
  id: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  merchant: string;
  amount: number; // Positivo = Ingreso, Negativo = Gasto
  category: Category;
  status: 'pending' | 'completed';
  isRecurring?: boolean;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
  currency: string;
}