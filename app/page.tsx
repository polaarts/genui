'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { useDashboard } from '@/lib/hooks/use-dashboard';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
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
        
        // Hero Component con fondo semántico y tipografía grande
        const bgColorMap = {
          healthy: 'bg-emerald-50 border-emerald-200',
          warning: 'bg-amber-50 border-amber-200',
          danger: 'bg-red-50 border-red-200',
        };
        const textColorMap = {
          healthy: 'text-emerald-900',
          warning: 'text-amber-900',
          danger: 'text-red-900',
        };
        const iconMap = {
          healthy: '✅',
          warning: '⚠️',
          danger: '🚨',
        };
        
        return (
          <div 
            key="summary" 
            className={`${bgColorMap[summaryData.sentiment]} border-2 rounded-3xl p-8 shadow-xl transition-all hover:shadow-2xl`}
          >
            <div className="flex items-start gap-6">
              <div className="text-6xl">{iconMap[summaryData.sentiment]}</div>
              <div className="flex-1">
                <h3 className={`text-3xl font-bold ${textColorMap[summaryData.sentiment]} mb-3`}>
                  {summaryData.title}
                </h3>
                <p className={`text-xl ${textColorMap[summaryData.sentiment]} leading-relaxed mb-4`}>
                  {summaryData.message}
                </p>
                {summaryData.totalAmount && (
                  <div className={`text-5xl font-bold ${textColorMap[summaryData.sentiment]} mt-4`}>
                    ${summaryData.totalAmount.toLocaleString()}
                  </div>
                )}
              </div>
              <button 
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-white/50"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        );

      case 'transactions':
        const transactionsData = dashboardData?.transactions;
        if (!transactionsData?.transactions) return null;
        
        // Mostrar solo primeras 5 transacciones
        const displayedTransactions = transactionsData.transactions.slice(0, 5);
        const hasMore = transactionsData.transactions.length > 5;
        
        return (
          <div key="transactions" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Transacciones Recientes</h3>
              <button 
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {displayedTransactions.map((transaction, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-base mb-1">
                      {transaction.merchant}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{new Date(transaction.date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            {hasMore && (
              <button className="w-full mt-6 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors">
                Ver historial completo ({transactionsData.transactions.length} transacciones)
              </button>
            )}
          </div>
        );

      case 'chart':
        const chartData = dashboardData?.chart;
        if (!chartData) return null;
        
        return (
          <div key="chart" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Distribución de Gastos</h3>
              <button 
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <CategoryPieChart {...chartData} />
          </div>
        );

      case 'budget':
        const budgetData = dashboardData?.budget;
        if (!budgetData?.budgets) return null;
        
        return (
          <div key="budget" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Progreso de Presupuesto</h3>
              <button 
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="space-y-6">
              {budgetData.budgets.map((budget) => {
                const isOverBudget = budget.percentage > 100;
                const isWarning = budget.percentage > 75 && !isOverBudget;
                const overage = isOverBudget ? budget.spent - budget.limit : 0;

                return (
                  <div key={budget.category} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-800">
                        {budget.category}
                      </span>
                      <div className="text-right">
                        <span className={`text-base font-bold ${
                          isOverBudget ? 'text-red-600' : 
                          isWarning ? 'text-amber-600' : 
                          'text-emerald-600'
                        }`}>
                          Gastado: ${budget.spent.toLocaleString()}
                        </span>
                        <div className="text-sm text-gray-500">
                          Límite: ${budget.limit.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de progreso mejorada */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all ${
                            isOverBudget ? 'bg-red-500' : 
                            isWarning ? 'bg-amber-500' : 
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                        />
                      </div>
                      
                      {/* Indicador de sobregiro */}
                      {isOverBudget && (
                        <div className="mt-2 flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                          <span className="text-lg">💥</span>
                          <span className="text-sm font-semibold">
                            Excedido en ${overage.toLocaleString()} (+{Math.round(budget.percentage - 100)}%)
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Porcentaje */}
                    <div className={`text-sm font-medium text-right ${
                      isOverBudget ? 'text-red-600' : 
                      isWarning ? 'text-amber-600' : 
                      'text-emerald-600'
                    }`}>
                      {budget.percentage.toFixed(1)}% utilizado
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'alerts':
        const alertsData = dashboardData?.alerts;
        if (!alertsData?.alerts || alertsData.alerts.length === 0) return null;
        
        return (
          <div key="alerts" className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Alertas</h3>
              <button 
                onClick={refresh}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-50"
                title="Actualizar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {alertsData.alerts.map((alert) => {
                const colorMap = {
                  danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', subtext: 'text-red-700' },
                  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', subtext: 'text-amber-700' },
                  info: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', subtext: 'text-emerald-700' },
                };
                const colors = colorMap[alert.severity];

                return (
                  <div key={alert.id} className={`p-5 ${colors.bg} border ${colors.border} rounded-2xl`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{alert.emoji}</span>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${colors.text} text-base mb-1`}>
                          {alert.title}
                        </h4>
                        <p className={`${colors.subtext} text-sm`}>
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <DashboardHeader />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Header con Badge de Perfil */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-4xl font-bold text-gray-900">
              Hola, {userProfile.name}
            </h2>
            {/* Badge de Modo/Perfil */}
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
              userProfile.preferences.persona === 'relaxed' 
                ? 'bg-emerald-100 text-emerald-800' 
                : userProfile.preferences.persona === 'auditor'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {userProfile.preferences.persona === 'relaxed' && '🌿 Modo Relaxed'}
              {userProfile.preferences.persona === 'auditor' && '📊 Modo Auditor'}
              {userProfile.preferences.persona === 'spender' && '🎯 Modo Estratega'}
            </div>
          </div>
          <p className="text-gray-600 text-lg">
            Dashboard personalizado según tu perfil psicológico
          </p>
        </div>

        {/* Feed de Widgets (Columna Única) */}
        {isRegenerating || dataLoading ? (
          <DashboardSkeleton config={userProfile.dashboardConfig} />
        ) : (
          <div className="space-y-10">
            {userProfile.dashboardConfig.activeWidgets.map(renderWidget)}
          </div>
        )}

        {/* Empty state si no hay widgets */}
        {userProfile.dashboardConfig.activeWidgets.length === 0 && !isRegenerating && !dataLoading && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay widgets activos
            </h3>
            <p className="text-gray-500 mb-6">
              Configura tu dashboard para ver información
            </p>
            <button
              onClick={() => router.push('/settings')}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all hover:shadow-lg"
            >
              Ir a Configuración
            </button>
          </div>
        )}
      </main>
    </div>
  );
}