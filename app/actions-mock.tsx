'use server';

import { DashboardOutput } from '@/lib/ai/schemas';
import { MOCK_TRANSACTIONS, MOCK_BUDGETS } from '@/lib/mock-data';
import { UserProfile } from '@/types';

/**
 * Versión MOCK de generateDashboard para testing sin API
 */
export async function generateDashboardMock(userProfile: UserProfile): Promise<DashboardOutput> {
  console.log('[generateDashboardMock] Generating mock data for:', userProfile.name);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const result: DashboardOutput = {};
  
  if (userProfile.dashboardConfig.activeWidgets.includes('summary')) {
    result.summary = {
      sentiment: 'warning',
      title: 'Estado Financiero del Mes',
      message: `${userProfile.name.split(' ')[0]}, has gastado $1,265 de tu presupuesto de $900 en Ocio este mes.`,
      totalAmount: 1265,
    };
  }
  
  if (userProfile.dashboardConfig.activeWidgets.includes('transactions')) {
    result.transactions = {
      transactions: MOCK_TRANSACTIONS.slice(0, 5).map(t => ({
        id: t.id,
        date: t.date,
        merchant: t.merchant,
        amount: t.amount,
        category: t.category as any,
        status: t.status as any,
      })),
    };
  }
  
  if (userProfile.dashboardConfig.activeWidgets.includes('chart')) {
    result.chart = {
      title: 'Distribución por Categoría',
      data: [
        { name: 'Comida', value: 320 },
        { name: 'Transporte', value: 450 },
        { name: 'Ocio', value: 1265 },
        { name: 'Salud', value: 180 },
        { name: 'Vivienda', value: 850 },
      ],
    };
  }
  
  if (userProfile.dashboardConfig.activeWidgets.includes('budget')) {
    result.budget = {
      budgets: MOCK_BUDGETS.map(b => ({
        category: b.category,
        spent: b.spent,
        limit: b.limit,
        percentage: Math.round((b.spent / b.limit) * 100),
      })),
    };
  }
  
  if (userProfile.dashboardConfig.activeWidgets.includes('alerts')) {
    result.alerts = {
      alerts: [
        {
          id: '1',
          severity: 'danger' as const,
          emoji: '⚠️',
          title: 'Presupuesto excedido',
          message: 'Has superado tu presupuesto de Ocio en $365',
        },
        {
          id: '2',
          severity: 'warning' as const,
          emoji: '💡',
          title: 'Gasto frecuente detectado',
          message: '5 transacciones en restaurantes esta semana',
        },
        {
          id: '3',
          severity: 'info' as const,
          emoji: '✓',
          title: 'Ahorro en progreso',
          message: 'Llevas 40% menos gasto en Transporte vs mes pasado',
        },
      ],
    };
  }
  
  console.log('[generateDashboardMock] Generated widgets:', Object.keys(result));
  
  return result;
}
