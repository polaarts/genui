'use client';

import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface WidgetWrapperProps {
  title: string;
  children: React.ReactNode;
  onRefresh?: () => void | Promise<void>;
  action?: React.ReactNode;
}

export function WidgetWrapper({ 
  title, 
  children, 
  onRefresh,
  action 
}: WidgetWrapperProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        
        <div className="flex items-center gap-2">
          {action}
          
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Actualizar"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
