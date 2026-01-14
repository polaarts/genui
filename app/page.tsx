import { MOCK_TRANSACTIONS } from '@/lib/mock-data';
import { ExpenseSummaryCard } from '@/components/ExpenseSummaryCard';
import { TransactionDataGrid } from '@/components/TransactionDataGrid';
import { CategoryPieChart } from '@/components/CategoryPieChart';

export default function Home() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto py-10">
  
  {/* Caso 1: Usuario Relax */}
  <ExpenseSummaryCard 
    sentiment="healthy" 
    title="Resumen Semanal" 
    message="¡Todo bajo control! Estás gastando menos que la semana pasada." 
  />

  {/* Caso 2: Usuario Auditor */}
  <TransactionDataGrid transactions={MOCK_TRANSACTIONS} />

  {/* Caso 3: Visualización */}
  <CategoryPieChart data={[
    { name: 'Comida', value: 50000 }, 
    { name: 'Transporte', value: 20000 }
  ]} />

</div>
  )
}
