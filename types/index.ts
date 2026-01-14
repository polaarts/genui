// 1. El Contexto del Usuario
// Tipos de usuario basados en arquetipos psicológicos
export type UserPersona = 'relaxed' | 'auditor' | 'spender';

// Mapeo de personas a nombres descriptivos
export const PERSONA_LABELS = {
  relaxed: 'Ansioso / Minimalista',
  auditor: 'Auditor / Controlador', 
  spender: 'Estratega / Orientado a Metas',
} as const;

// Widgets predefinidos por perfil (NO personalizables)
export const PERSONA_WIDGETS: Record<UserPersona, WidgetType[]> = {
  relaxed: ['summary', 'chart', 'alerts'], // Solo lo esencial, sin tablas abrumadoras
  auditor: ['summary', 'transactions', 'chart', 'budget', 'alerts'], // TODO
  spender: ['summary', 'budget', 'alerts'], // Enfocado en metas y progreso
};

// Layouts predefinidos por perfil
export const PERSONA_LAYOUTS: Record<UserPersona, 'grid-2' | 'grid-3' | 'list'> = {
  relaxed: 'grid-2', // Espacioso y cómodo
  auditor: 'grid-3', // Denso, máxima información
  spender: 'list',   // Vertical, tipo "timeline de progreso"
};

// Simplificado: Solo perfil importa
export interface UserPreferences {
  persona: UserPersona;
  // Eliminadas: uiConfig ya no se usa, todo se deriva del persona
}

// 1.1 Configuración del Dashboard
export type WidgetType = 'summary' | 'transactions' | 'chart' | 'budget' | 'alerts';

export interface DashboardConfig {
  activeWidgets: WidgetType[]; // Ahora se auto-asignan según persona
  widgetOrder: string[];
  layout: 'grid-2' | 'grid-3' | 'list'; // Ahora se auto-asigna según persona
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