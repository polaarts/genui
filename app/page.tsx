'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardGrid } from '@/components/dashboard/dashboard-grid';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { WidgetWrapper } from '@/components/dashboard/widget-wrapper';

// Importar componentes de widgets existentes
import { ExpenseSummaryCard } from '@/components/expense-summary-card';
import { TransactionDataGrid } from '@/components/transaction-data-grid';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Importar datos mock para fallback
import { WidgetType } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, isLoading: configLoading } = useUserConfig();
  const { isRegenerating } = useDashboard(userProfile.dashboardConfig);
  
  // Nuevo: cargar datos del dashboard con AI
  const { dashboardData, isLoading: dataLoading, refresh } = useDashboardData(
    userProfile,
    userProfile.isOnboarded
  );

  // Redirect a onboarding si no ha completado el setup
  useEffect(() => {
    if (!configLoading && !userProfile.isOnboarded) {
      router.push('/onboarding');
    }
  }, [userProfile.isOnboarded, configLoading, router]);

  // Mostrar loading mientras carga la configuración o datos
  if (configLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {configLoading ? 'Cargando configuración...' : 'Generando tu dashboard personalizado...'}
          </p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está onboarded (mientras redirige)
  if (!userProfile.isOnboarded) {
    return null;
  }

  // Función helper para renderizar widgets según tipo CON DATOS DE AI
  const renderWidget = (widgetType: WidgetType) => {
    switch (widgetType) {
      case 'summary':
        const summaryData = dashboardData?.summary;
        if (!summaryData) return null;
        
        return (
          <WidgetWrapper title="Resumen Financiero" key="summary" onRefresh={refresh}>
            <ExpenseSummaryCard {...summaryData} />
          </WidgetWrapper>
        );

      case 'transactions':
        const transactionsData = dashboardData?.transactions;
        if (!transactionsData?.transactions) return null;
        
        return (
          <WidgetWrapper title="Transacciones Recientes" key="transactions" onRefresh={refresh}>
            <TransactionDataGrid transactions={transactionsData.transactions} />
          </WidgetWrapper>
        );

      case 'chart':
        const chartData = dashboardData?.chart;
        if (!chartData) return null;
        
        return (
          <WidgetWrapper title="Distribución de Gastos" key="chart" onRefresh={refresh}>
            <CategoryPieChart {...chartData} />
          </WidgetWrapper>
        );

      case 'budget':
        const budgetData = dashboardData?.budget;
        if (!budgetData?.budgets) return null;
        
        return (
          <WidgetWrapper title="Progreso de Presupuesto" key="budget" onRefresh={refresh}>
            <div className="space-y-4">
              {budgetData.budgets.map((budget) => {
                const isOverBudget = budget.percentage > 100;
                const isWarning = budget.percentage > 75 && !isOverBudget;

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
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </WidgetWrapper>
        );

      case 'alerts':
        const alertsData = dashboardData?.alerts;
        if (!alertsData?.alerts || alertsData.alerts.length === 0) return null;
        
        return (
          <WidgetWrapper title="Alertas" key="alerts" onRefresh={refresh}>
            <div className="space-y-3">
              {alertsData.alerts.map((alert) => {
                const colorMap = {
                  danger: 'red',
                  warning: 'amber',
                  info: 'emerald',
                };
                const color = colorMap[alert.severity];

                return (
                  <div key={alert.id} className={`p-3 bg-${color}-50 border border-${color}-200 rounded-xl`}>
                    <div className="flex items-start gap-2">
                      <span className={`text-${color}-600 text-xl`}>{alert.emoji}</span>
                      <div>
                        <h4 className={`font-semibold text-${color}-900 text-sm`}>
                          {alert.title}
                        </h4>
                        <p className={`text-${color}-700 text-xs mt-1`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
        {isRegenerating || dataLoading ? (
          <DashboardSkeleton config={userProfile.dashboardConfig} />
        ) : (
          <DashboardGrid layout={userProfile.dashboardConfig.layout}>
            {userProfile.dashboardConfig.activeWidgets.map(renderWidget)}
          </DashboardGrid>
        )}

        {/* Empty state si no hay widgets */}
        {userProfile.dashboardConfig.activeWidgets.length === 0 && !isRegenerating && !dataLoading && (
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