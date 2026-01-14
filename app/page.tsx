'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { WidgetWrapper } from '@/components/dashboard/widget-wrapper';

// Importar componentes de widgets existentes
import { ExpenseSummaryCard } from '@/components/expense-summary-card';
import { TransactionDataGrid } from '@/components/transaction-data-grid';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Importar datos mock
import { MOCK_TRANSACTIONS, MOCK_BUDGETS } from '@/lib/mock-data';
import { WidgetType } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, isLoading: configLoading } = useUserConfig();
  const { isRegenerating } = useDashboard(userProfile.dashboardConfig);

  // Redirect a onboarding si no ha completado el setup
  useEffect(() => {
    if (!configLoading && !userProfile.isOnboarded) {
      router.push('/onboarding');
    }
  }, [userProfile.isOnboarded, configLoading, router]);

  // Mostrar loading mientras carga la configuración
  if (configLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está onboarded (mientras redirige)
  if (!userProfile.isOnboarded) {
    return null;
  }

  // Función helper para renderizar widgets según tipo
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case 'summary':
        return (
          <WidgetWrapper title="Resumen Financiero" key="summary">
            <ExpenseSummaryCard
              sentiment="warning"
              title="Estado del Mes"
              message="Has gastado $1,265 de tu presupuesto de $900 en Ocio"
              totalAmount={1265}
            />
          </WidgetWrapper>
        );

      case 'transactions':
        return (
          <WidgetWrapper title="Transacciones Recientes" key="transactions">
            <TransactionDataGrid transactions={MOCK_TRANSACTIONS.slice(0, 5)} />
          </WidgetWrapper>
        );

      case 'chart':
        const chartData = [
          { name: 'Comida', value: 120 },
          { name: 'Transporte', value: 150 },
          { name: 'Ocio', value: 1250 },
          { name: 'Salud', value: 80 },
        ];
        return (
          <WidgetWrapper title="Distribución de Gastos" key="chart">
            <CategoryPieChart title="Por Categoría" data={chartData} />
          </WidgetWrapper>
        );

      case 'budget':
        return (
          <WidgetWrapper title="Progreso de Presupuesto" key="budget">
            <div className="space-y-4">
              {MOCK_BUDGETS.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                const isOverBudget = percentage > 100;
                const isWarning = percentage > 75 && !isOverBudget;

                return (
                  <div key={budget.category}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {budget.category}
                      </span>
                      <span className={`text-sm font-semibold ${
                        isOverBudget ? 'text-red-600' : 
                        isWarning ? 'text-amber-600' : 
                        'text-emerald-600'
                      }`}>
                        ${budget.spent} / ${budget.limit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${
                          isOverBudget ? 'bg-red-500' : 
                          isWarning ? 'bg-amber-500' : 
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </WidgetWrapper>
        );

      case 'alerts':
        return (
          <WidgetWrapper title="Alertas" key="alerts">
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 text-xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-900 text-sm">
                      Presupuesto excedido
                    </h4>
                    <p className="text-red-700 text-xs mt-1">
                      Has superado tu presupuesto de Ocio en $950
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-amber-600 text-xl">💡</span>
                  <div>
                    <h4 className="font-semibold text-amber-900 text-sm">
                      Patrón detectado
                    </h4>
                    <p className="text-amber-700 text-xs mt-1">
                      3 gastos en Uber en los últimos 2 días
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-600 text-xl">✓</span>
                  <div>
                    <h4 className="font-semibold text-emerald-900 text-sm">
                      Buen progreso
                    </h4>
                    <p className="text-emerald-700 text-xs mt-1">
                      Solo has usado el 30% de tu presupuesto de Comida
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </WidgetWrapper>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Mensaje de bienvenida */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Tu Dashboard Financiero
          </h2>
          <p className="text-gray-600 mt-1">
            Vista personalizada según tus preferencias
          </p>
        </div>

        {/* Widgets Grid */}
        {isRegenerating ? (
          <DashboardSkeleton config={userProfile.dashboardConfig} />
        ) : (
          <DashboardGrid layout={userProfile.dashboardConfig.layout}>
            {userProfile.dashboardConfig.activeWidgets.map(renderWidget)}
          </DashboardGrid>
        )}

        {/* Empty state si no hay widgets */}
        {userProfile.dashboardConfig.activeWidgets.length === 0 && !isRegenerating && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay widgets activos
            </h3>
            <p className="text-gray-500 mb-6">
              Configura tu dashboard para ver información
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir a Configuración
            </button>
          </div>
        )}
      </main>
    </div>
  );
}