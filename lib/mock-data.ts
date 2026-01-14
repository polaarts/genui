import { UserProfile, Transaction, Budget, PERSONA_WIDGETS, PERSONA_LAYOUTS } from '@/types';

//A. Perfiles de Usuario

export const USER_SOFIA: UserProfile = {
  id: 'u_relaxed_01',
  name: 'Sofía (Estudiante)',
  preferences: {
    persona: 'relaxed', // Ansioso/Minimalista
  },
  dashboardConfig: {
    activeWidgets: PERSONA_WIDGETS.relaxed,
    widgetOrder: PERSONA_WIDGETS.relaxed,
    layout: PERSONA_LAYOUTS.relaxed,
    defaultTimeRange: 'month',
    autoRefresh: false,
    refreshIntervalSeconds: 300
  },
  isOnboarded: true
};

export const USER_CARLOS: UserProfile = {
  id: 'u_auditor_02',
  name: 'Carlos (Contador)',
  preferences: {
    persona: 'auditor', // Auditor/Controlador
  },
  dashboardConfig: {
    activeWidgets: PERSONA_WIDGETS.auditor,
    widgetOrder: PERSONA_WIDGETS.auditor,
    layout: PERSONA_LAYOUTS.auditor,
    defaultTimeRange: 'quarter',
    autoRefresh: true,
    refreshIntervalSeconds: 60
  },
  isOnboarded: true
};

// B. Transacciones
const today = new Date();
const getDay = (offset: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - offset);
  return d.toISOString().split('T')[0];
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  // 1. El Ingreso (Sueldo)
  { id: 't1', date: getDay(2), merchant: 'Empresa Tech S.A.', amount: 2500, category: 'Income', status: 'completed', isRecurring: true },
  
  // 2. Patrón de Alerta: Muchos Ubers seguidos (Para probar detección de anomalías)
  { id: 't2', date: getDay(1), merchant: 'Uber Trip', amount: -15.50, category: 'Transport', status: 'completed' },
  { id: 't3', date: getDay(1), merchant: 'Uber Trip', amount: -12.20, category: 'Transport', status: 'completed' },
  { id: 't4', date: getDay(2), merchant: 'Uber Trip', amount: -28.00, category: 'Transport', status: 'completed' },
  
  // 3. Gasto Grande (Para probar "Budget Warning")
  { id: 't5', date: getDay(3), merchant: 'Apple Store', amount: -1200, category: 'Leisure', status: 'completed' },
  
  // 4. Gastos Hormiga (Coffee)
  { id: 't6', date: getDay(0), merchant: 'Starbucks', amount: -5.50, category: 'Food', status: 'pending' },
  { id: 't7', date: getDay(1), merchant: 'Starbucks', amount: -4.90, category: 'Food', status: 'completed', isRecurring: true },
];

// C. Presupuestos (Contexto para responder "¿Puedo comprar esto?")
export const MOCK_BUDGETS: Budget[] = [
  { category: 'Transport', limit: 200, spent: 150, currency: 'USD' }, // Al 75%
  { category: 'Food', limit: 400, spent: 120, currency: 'USD' },      // Al 30% (Bien)
  { category: 'Leisure', limit: 300, spent: 1250, currency: 'USD' },  // Excedido (Alerta Roja)
];