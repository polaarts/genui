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
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <Icon className={`w-8 h-8 mx-auto mb-2 ${
              isSelected ? 'text-blue-400' : 'text-slate-500'
            }`} />
            <h4 className={`font-semibold text-sm ${
              isSelected ? 'text-blue-400' : 'text-white'
            }`}>
              {layout.label}
            </h4>
            <p className={`text-xs mt-1 ${
              isSelected ? 'text-blue-300' : 'text-slate-400'
            }`}>
              {layout.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
