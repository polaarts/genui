'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Glass Panel Component - Light Theme
const GlassPanel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-xl rounded-xl text-gray-900 ${className}`}>
    {children}
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, isLoading: configLoading } = useUserConfig();
  
  // Cargar datos del dashboard con AI
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
  if (configLoading) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            Cargando configuración...
          </p>
        </div>
      </div>
    );
  }

  // No mostrar nada si no está onboarded (mientras redirige)
  if (!userProfile.isOnboarded) {
    return null;
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl" />
      </div>

      {/* Main Grid Layout */}
      <main className="relative grid grid-cols-12 grid-rows-6 gap-3 p-3 h-full">
        
        {/* Header Row - Financial Summary Bar */}
        <GlassPanel className="col-span-12 row-span-1 p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">FinaFlow</h1>
              <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                userProfile.preferences.persona === 'relaxed' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                  : userProfile.preferences.persona === 'auditor'
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-purple-100 text-purple-700 border border-purple-300'
              }`}>
                {userProfile.preferences.persona === 'relaxed' && '🌿 Relaxed'}
                {userProfile.preferences.persona === 'auditor' && '📊 Auditor'}
                {userProfile.preferences.persona === 'spender' && '🎯 Estratega'}
              </div>
            </div>

            {/* KPI Metrics - Inline Style */}
            {!dataLoading && dashboardData?.summary && (
              <div className="flex items-center gap-6 ml-8">
                <div className="flex items-center gap-2 pr-6 border-r border-gray-300">
                  <span className="text-gray-600 text-sm">Total:</span>
                  <span className="font-mono text-xl font-bold text-gray-900">
                    ${dashboardData.summary.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 pr-6 border-r border-gray-300">
                  <span className={`text-3xl`}>{
                    dashboardData.summary.sentiment === 'healthy' ? '💚' :
                    dashboardData.summary.sentiment === 'warning' ? '⚠️' : '🔴'
                  }</span>
                  <span className="text-gray-800 text-sm">{dashboardData.summary.title}</span>
                </div>
                <div className="text-gray-600 text-sm max-w-md truncate">
                  {dashboardData.summary.message}
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={refresh}
            disabled={dataLoading}
            className="px-4 py-2 bg-gray-900/10 hover:bg-gray-900/20 rounded-lg transition-colors text-gray-700 hover:text-gray-900 text-sm font-medium disabled:opacity-50"
          >
            ↻ Refresh
          </button>
        </GlassPanel>

        {/* Sidebar - Budget & Charts */}
        <GlassPanel className="col-span-3 row-span-5 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <h3 className="text-gray-700 font-medium tracking-tight text-sm uppercase">Control Panel</h3>
          
          {dataLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 text-sm">Loading...</div>
            </div>
          ) : (
            <>
              {/* Budget Section */}
              {dashboardData?.budget && (
                <div className="space-y-3">
                  <h4 className="text-gray-600 text-xs font-semibold">PRESUPUESTOS</h4>
                  {dashboardData.budget.budgets.slice(0, 4).map((budget) => {
                    const isOverBudget = budget.percentage > 100;
                    const isWarning = budget.percentage > 75 && !isOverBudget;
                    
                    return (
                      <div key={budget.category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 text-xs">{budget.category}</span>
                          <span className={`font-mono text-xs font-bold ${
                            isOverBudget ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            ${budget.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isOverBudget ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          />
                        </div>
                        {isOverBudget && (
                          <div className="text-xs text-rose-400 font-mono">
                            +{Math.round(budget.percentage - 100)}% over
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chart Section */}
              {dashboardData?.chart && (
                <div className="mt-4">
                  <h4 className="text-gray-600 text-xs font-semibold mb-2">DISTRIBUCIÓN</h4>
                  <div className="bg-gray-100/50 rounded-lg p-2">
                    <CategoryPieChart data={dashboardData.chart.data} />
                  </div>
                </div>
              )}

              {/* Alerts Section */}
              {dashboardData?.alerts && dashboardData.alerts.alerts.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-gray-600 text-xs font-semibold mb-2">ALERTAS</h4>
                  <div className="space-y-2">
                    {dashboardData.alerts.alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className={`p-2 rounded-lg border ${
                        alert.severity === 'danger' ? 'bg-rose-500/10 border-rose-500/30' :
                        alert.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                        'bg-emerald-500/10 border-emerald-500/30'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{alert.emoji}</span>
                          <div>
                            <div className="text-gray-800 text-xs font-medium">{alert.title}</div>
                            <div className="text-gray-600 text-xs mt-0.5">{alert.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </GlassPanel>

        {/* Main Area - Transactions Table */}
        <GlassPanel className="col-span-9 row-span-5 flex flex-col overflow-hidden">
          {/* Table Header - Sticky */}
          <div className="bg-gray-100/60 backdrop-blur-xl px-4 py-3 border-b border-gray-300 flex items-center justify-between">
            <h3 className="text-gray-700 font-medium tracking-tight text-sm uppercase">Transaction Ledger</h3>
            <div className="text-gray-500 text-xs font-mono">
              {!dataLoading && dashboardData?.transactions 
                ? `${dashboardData.transactions.transactions.length} records`
                : 'Loading...'}
            </div>
          </div>

          {/* Table Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            {dataLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 text-sm">Loading transactions...</div>
              </div>
            ) : dashboardData?.transactions ? (
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Merchant</th>
                    <th className="text-left py-2 font-medium">Category</th>
                    <th className="text-right py-2 font-medium">Amount</th>
                    <th className="text-center py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.transactions.transactions.map((transaction, idx) => (
                    <tr 
                      key={idx}
                      className="border-b border-gray-200 hover:bg-gray-100/50 transition-colors h-10"
                    >
                      <td className="text-gray-600 text-xs font-mono">
                        {new Date(transaction.date).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'short',
                          year: '2-digit'
                        })}
                      </td>
                      <td className="text-gray-800 text-sm font-medium">{transaction.merchant}</td>
                      <td>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-200 text-gray-700">
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`text-right font-mono text-sm font-bold ${
                        transaction.amount < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500 text-sm">No transactions available</div>
              </div>
            )}
          </div>
        </GlassPanel>

      </main>
    </div>
  );
}
