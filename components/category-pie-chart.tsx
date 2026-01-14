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
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-gray-700">
            {entry.value}
          </span>
          <span className="text-sm font-bold text-gray-900">
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
      <div className="h-100 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleanData}
              cx="50%"
              cy="45%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={3}
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
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                padding: '12px 16px'
              }}
            />
            <Legend 
              content={<CustomLegend />}
              verticalAlign="bottom" 
              height={60}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Total en el centro del donut */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[75%] text-center">
          <div className="text-gray-500 text-sm font-medium mb-1">Total Gastos</div>
          <div className="text-3xl font-bold text-gray-900">
            ${total.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}