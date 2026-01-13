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

export interface UserProfile {
  id: string;
  name: string;
  preferences: UserPreferences;
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