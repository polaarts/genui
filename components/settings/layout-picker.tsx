'use client';

import { LayoutGrid, List, Grid3x3 } from 'lucide-react';

type LayoutType = 'grid-2' | 'grid-3' | 'list';

interface LayoutPickerProps {
  value: LayoutType;
  onChange: (layout: LayoutType) => void;
}

const LAYOUTS = [
  {
    type: 'grid-2' as LayoutType,
    label: 'Grilla 2 Columnas',
    icon: LayoutGrid,
    description: 'Vista equilibrada'
  },
  {
    type: 'grid-3' as LayoutType,
    label: 'Grilla 3 Columnas',
    icon: Grid3x3,
    description: 'Máxima densidad'
  },
  {
    type: 'list' as LayoutType,
    label: 'Lista Vertical',
    icon: List,
    description: 'Vista compacta'
  }
];

export function LayoutPicker({ value, onChange }: LayoutPickerProps) {
  const handleLayoutChange = (layout: LayoutType, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(layout);
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {LAYOUTS.map((layout) => {
        const Icon = layout.icon;
        const isSelected = value === layout.type;
        
        return (
          <button
            key={layout.type}
            type="button"
            onClick={(e) => handleLayoutChange(layout.type, e)}
            className={`p-4 rounded-2xl border-2 transition-all text-center ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <Icon className={`w-8 h-8 mx-auto mb-2 ${
              isSelected ? 'text-blue-600' : 'text-gray-400'
            }`} />
            <h4 className={`font-semibold text-sm ${
              isSelected ? 'text-blue-900' : 'text-gray-900'
            }`}>
              {layout.label}
            </h4>
            <p className={`text-xs mt-1 ${
              isSelected ? 'text-blue-700' : 'text-gray-500'
            }`}>
              {layout.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
