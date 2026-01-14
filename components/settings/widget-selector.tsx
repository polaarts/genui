'use client';

import { WidgetType } from '@/types';
import { CheckCircle, Circle } from 'lucide-react';

interface WidgetSelectorProps {
  selectedWidgets: WidgetType[];
  onChange: (widgets: WidgetType[]) => void;
}

const AVAILABLE_WIDGETS = [
  { 
    type: 'summary' as WidgetType, 
    label: 'Resumen Financiero',
    description: 'Vista general de tu situación financiera'
  },
  { 
    type: 'transactions' as WidgetType, 
    label: 'Lista de Transacciones',
    description: 'Tabla detallada de movimientos'
  },
  { 
    type: 'chart' as WidgetType, 
    label: 'Gráfico de Categorías',
    description: 'Distribución visual de gastos'
  },
  { 
    type: 'budget' as WidgetType, 
    label: 'Progreso de Presupuesto',
    description: 'Barras de progreso por categoría'
  },
  { 
    type: 'alerts' as WidgetType, 
    label: 'Alertas y Anomalías',
    description: 'Notificaciones de gastos inusuales'
  },
];

export function WidgetSelector({ selectedWidgets, onChange }: WidgetSelectorProps) {
  const toggleWidget = (widget: WidgetType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedWidgets.includes(widget)) {
      onChange(selectedWidgets.filter(w => w !== widget));
    } else {
      onChange([...selectedWidgets, widget]);
    }
  };

  return (
    <div className="space-y-3">
      {AVAILABLE_WIDGETS.map((widget) => {
        const isSelected = selectedWidgets.includes(widget.type);
        
        return (
          <button
            key={widget.type}
            type="button"
            onClick={(e) => toggleWidget(widget.type, e)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
              isSelected 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSelected ? (
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                  {widget.label}
                </h4>
                <p className={`text-sm mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                  {widget.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
