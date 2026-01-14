import { Transaction } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';

interface TransactionDataGridProps {
  transactions: Transaction[];
}

export function TransactionDataGrid({ transactions }: TransactionDataGridProps) {
  return (
    <div className="w-full border rounded-md overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-200">
                <div className="flex items-center gap-1">Fecha <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3 text-right cursor-pointer hover:bg-slate-200">
                <div className="flex items-center justify-end gap-1">Monto <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="px-4 py-3 text-center">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-2 text-slate-500 font-mono">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 font-medium text-slate-800">
                  {tx.merchant}
                </td>
                <td className="px-4 py-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] border border-slate-200 uppercase tracking-wider">
                    {tx.category}
                  </span>
                </td>
                <td className={cn(
                  "px-4 py-2 text-right font-mono font-bold",
                  tx.amount < 0 ? "text-red-600" : "text-green-600"
                )}>
                  {formatCurrency(tx.amount, true)}
                </td>
                <td className="px-4 py-2 text-center">
                   <span className={cn("w-2 h-2 rounded-full inline-block", 
                     tx.status === 'completed' ? 'bg-green-400' : 'bg-amber-400'
                   )} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 border-t border-slate-200">
             <tr>
               <td colSpan={5} className="px-4 py-2 text-right text-slate-400 italic">
                 Mostrando {transactions.length} registros. IDs de traza verificados.
               </td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}