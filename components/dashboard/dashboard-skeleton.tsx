'use client';

import { DashboardConfig, WidgetType } from '@/types';

interface DashboardSkeletonProps {
  config: DashboardConfig;
}

const WIDGET_HEIGHTS = {
  'summary': 'h-48',
  'transactions': 'h-96',
  'chart': 'h-80',
  'budget': 'h-72',
  'alerts': 'h-64',
};

function WidgetSkeleton({ type }: { type: WidgetType }) {
  const heightClass = WIDGET_HEIGHTS[type] || 'h-64';
  
  return (
    <div className={`bg-white rounded-3xl border shadow-sm p-6 ${heightClass} animate-pulse`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
      </div>
      
      {/* Additional elements for different widget types */}
      {type === 'chart' && (
        <div className="mt-6 flex items-end justify-around gap-2">
          {[60, 80, 45, 90, 70].map((height, i) => (
            <div 
              key={i} 
              className="bg-gray-200 rounded-t w-full" 
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      )}
      
      {type === 'transactions' && (
        <div className="mt-6 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardSkeleton({ config }: DashboardSkeletonProps) {
  const gridClasses = {
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    'list': 'flex flex-col gap-6'
  };

  return (
    <div className={gridClasses[config.layout]}>
      {config.activeWidgets.map((widget) => (
        <WidgetSkeleton key={widget} type={widget} />
      ))}
    </div>
  );
}
