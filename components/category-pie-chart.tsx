'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6'];

interface ChartData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: ChartData[];
  title?: string;
}

// Custom legend component declarado fuera del render
const CustomLegend = ({ payload }: { payload?: Array<{ value: string; color: string; payload: { value: number } }> }) => {
  if (!payload) return null;
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mt-3">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-1.5">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400 text-[10px] font-medium">
            {entry.value}
          </span>
          <span className="text-slate-200 text-[10px] font-bold font-mono">
            ${entry.payload.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const cleanData = data.map(d => ({ ...d, value: Math.abs(d.value) }));
  const total = cleanData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full flex flex-col items-center">      
      <div className="h-56 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleanData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {cleanData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  strokeWidth={0} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number | undefined) => formatCurrency(value ?? 0, false)}
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderRadius: '8px', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                padding: '6px 10px',
                color: '#e2e8f0'
              }}
            />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom" 
              height={40}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total en el centro del donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-slate-500 text-[10px] font-medium mb-0.5">Total</div>
          <div className="text-white text-xl font-bold font-mono">
            ${total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}