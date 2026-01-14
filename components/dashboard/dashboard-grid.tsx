'use client';

import { DashboardConfig } from '@/types';

interface DashboardGridProps {
  layout: DashboardConfig['layout'];
  children: React.ReactNode;
}

export function DashboardGrid({ layout, children }: DashboardGridProps) {
  const gridClasses = {
    'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-6',
    'grid-3': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    'list': 'flex flex-col gap-6'
  };

  return (
    <div className={gridClasses[layout]}>
      {children}
    </div>
  );
}
