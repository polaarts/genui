'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { useDashboardData } from '@/lib/hooks/use-dashboard-data';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Glass Panel Component - Dark Terminal
const GlassPanel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-xl text-slate-200 ${className}`}>
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
      <div className="h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">
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
    <div className="h-screen w-screen overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 relative">
      {/* Removed ambient orbs for cleaner terminal look */}

      {/* Main Grid Layout */}
      <main className="relative grid grid-cols-12 grid-rows-6 gap-3 p-3 h-full">
        
        {/* Header Row - Financial Summary Bar */}
        <GlassPanel className="col-span-12 row-span-1 h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white tracking-tight">FinaFlow</h1>
              <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                userProfile.preferences.persona === 'relaxed' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' 
                  : userProfile.preferences.persona === 'auditor'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/50'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/50'
              }`}>
                {userProfile.preferences.persona === 'relaxed' && '🌿 Relaxed'}
                {userProfile.preferences.persona === 'auditor' && '📊 Auditor'}
                {userProfile.preferences.persona === 'spender' && '🎯 Estratega'}
              </div>
            </div>

            {/* KPI Metrics - Inline Style */}
            {!dataLoading && dashboardData?.summary && (
              <div className="flex items-center gap-4 ml-6">
                <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                  <span className="text-slate-400 text-xs">Total:</span>
                  <span className="font-mono text-xl font-bold text-white tracking-tight">
                    ${dashboardData.summary.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                  <span className="text-base">{
                    dashboardData.summary.sentiment === 'healthy' ? '💚' :
                    dashboardData.summary.sentiment === 'warning' ? '⚠️' : '🔴'
                  }</span>
                  <span className="font-medium">{dashboardData.summary.title}</span>
                </div>
                <div className="text-slate-400 text-xs max-w-md truncate">
                  {dashboardData.summary.message}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push('/settings')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5"
              title="Configuración"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </button>
            <button 
              onClick={refresh}
              disabled={dataLoading}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-medium disabled:opacity-50"
              title="Actualizar dashboard"
            >
              ↻ Refresh
            </button>
          </div>
        </GlassPanel>

        {/* Sidebar - Budget & Charts */}
        <GlassPanel className="col-span-3 row-span-5 p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          <h3 className="text-slate-400 font-medium tracking-tight text-[10px] uppercase">Control Panel</h3>
          
          {dataLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-slate-500 text-xs">Loading...</div>
            </div>
          ) : (
            <>
              {/* Budget Section */}
              {dashboardData?.budget && (
                <div className="space-y-2">
                  <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">Presupuestos</h4>
                  {dashboardData.budget.budgets.slice(0, 4).map((budget) => {
                    const isOverBudget = budget.percentage > 100;
                    const isWarning = budget.percentage > 75 && !isOverBudget;
                    
                    return (
                      <div key={budget.category} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-xs">{budget.category}</span>
                          <span className={`font-mono text-[10px] font-bold ${
                            isOverBudget ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            ${budget.spent.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-white/5 rounded-sm h-3 overflow-hidden">
                            <div
                              className={`h-3 rounded-sm transition-all ${
                                isOverBudget ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                            />
                          </div>
                          {isOverBudget && (
                            <span className="text-[10px] text-rose-400 font-mono whitespace-nowrap">
                              +{Math.round(budget.percentage - 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Chart Section */}
              {dashboardData?.chart && (
                <div className="mt-3">
                  <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Distribución</h4>
                  <div className="bg-white/5 rounded-lg p-2">
                    <CategoryPieChart data={dashboardData.chart.data} />
                  </div>
                </div>
              )}

              {/* Alerts Section */}
              {dashboardData?.alerts && dashboardData.alerts.alerts.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-2">Alertas</h4>
                  <div className="space-y-2">
                    {dashboardData.alerts.alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className={`p-2 rounded-lg border ${
                        alert.severity === 'danger' ? 'bg-rose-500/10 border-rose-500/50' :
                        alert.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/50' :
                        'bg-emerald-500/10 border-emerald-500/50'
                      }`}>
                        <div className="flex items-start gap-2">
                          <span className="text-sm">{alert.emoji}</span>
                          <div>
                            <div className="text-slate-200 text-[10px] font-medium">{alert.title}</div>
                            <div className="text-slate-400 text-[10px] mt-0.5">{alert.message}</div>
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
          <div className="bg-slate-900/60 backdrop-blur-xl px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-slate-300 font-medium tracking-tight text-xs uppercase">Transaction Ledger</h3>
            <div className="text-slate-500 text-[10px] font-mono">
              {!dataLoading && dashboardData?.transactions 
                ? `${dashboardData.transactions.transactions.length} records`
                : 'Loading...'}
            </div>
          </div>

          {/* Table Content - Scrollable */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            {dataLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-500 text-xs">Loading transactions...</div>
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
                      className="border-b border-white/5 hover:bg-white/5 transition-colors even:bg-white/[0.03]"
                    >
                      <td className="py-2 text-slate-400 text-xs font-mono">
                        {new Date(transaction.date).toLocaleDateString('es-ES', { 
                          day: '2-digit', 
                          month: 'short',
                          year: '2-digit'
                        })}
                      </td>
                      <td className="py-2 text-slate-200 text-xs">{transaction.merchant}</td>
                      <td className="py-2">
                        <span className="inline-flex items-center px-2 h-5 rounded text-[10px] bg-white/5 text-slate-400 border border-white/10">
                          {transaction.category}
                        </span>
                      </td>
                      <td className={`py-2 text-right font-mono text-xs font-bold ${
                        transaction.amount < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td className="py-2 text-center">
                        <span className={`inline-flex items-center px-2 h-5 rounded-full text-[10px] border ${
                          transaction.status === 'completed' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/50'
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
                <div className="text-slate-500 text-xs">No transactions available</div>
              </div>
            )}
          </div>
        </GlassPanel>

      </main>
    </div>
  );
}
