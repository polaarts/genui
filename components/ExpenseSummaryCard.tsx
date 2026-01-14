'use client';

import { TrendingDown, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Sentiment = 'healthy' | 'warning' | 'danger';

interface ExpenseSummaryCardProps {
  sentiment: Sentiment;
  title: string;
  message: string;
  totalAmount?: number;
}

const STYLES = {
  healthy: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle,
    accent: 'bg-emerald-100',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: AlertTriangle,
    accent: 'bg-amber-100',
  },
  danger: {
    bg: 'bg-rose-50 border-rose-200',
    text: 'text-rose-800',
    icon: TrendingUp,
    accent: 'bg-rose-100',
  },
};

export function ExpenseSummaryCard({ sentiment, title, message, totalAmount }: ExpenseSummaryCardProps) {
  const style = STYLES[sentiment];
  const Icon = style.icon;

  return (
    <div className={cn("p-6 rounded-3xl border-2 shadow-sm transition-all", style.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className={cn("text-lg font-bold opacity-80", style.text)}>{title}</h3>
          <p className={cn("mt-2 text-2xl font-black tracking-tight", style.text)}>
            {message}
          </p>
          {totalAmount && (
            <p className="mt-4 text-sm font-medium opacity-70">
              Total aprox: <span className="text-lg">{Math.round(totalAmount)} CLP</span>
            </p>
          )}
        </div>
        <div className={cn("p-4 rounded-full", style.accent)}>
          <Icon className={cn("w-8 h-8", style.text)} />
        </div>
      </div>
    </div>
  );
}