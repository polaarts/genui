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
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 text-xs font-medium">
            {entry.value}
          </span>
          <span className="text-gray-900 text-xs font-bold font-mono">
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
      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleanData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px', 
                border: '1px solid rgba(0, 0, 0, 0.1)', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '8px 12px',
                color: '#111'
              }}
            />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom" 
              height={50}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total en el centro del donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className="text-gray-500 text-xs font-medium mb-0.5">Total</div>
          <div className="text-gray-900 text-2xl font-bold font-mono">
            ${total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}