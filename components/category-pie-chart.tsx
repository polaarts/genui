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

export function CategoryPieChart({ data, title = "Distribución de Gastos" }: CategoryPieChartProps) {
  const cleanData = data.map(d => ({ ...d, value: Math.abs(d.value) }));

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4 w-full text-left">
        {title}
      </h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={cleanData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {cleanData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number | undefined) => formatCurrency(value ?? 0, false)}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}