'use server';

import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';

// Importamos los Schemas que acabamos de crear
import { expenseSummarySchema, transactionListSchema, pieChartSchema } from '@/lib/ai/schemas';

// Importamos los Componentes Visuales (asegúrate de que las rutas sean correctas)
import { ExpenseSummaryCard } from '@/components/expense-summary-card';
import { TransactionDataGrid } from '@/components/transaction-data-grid';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Importamos los datos mock para que la IA los "lea"
import { MOCK_TRANSACTIONS, MOCK_BUDGETS } from '@/lib/mock-data';
import { UserProfile } from '@/types';

export async function getFinancialResponse(input: string, userProfile: UserProfile) {
  
  const SYSTEM_PROMPT = `
    Eres el motor visual de FinaFlow.
    
    TU OBJETIVO: Elegir la herramienta visual correcta para la pregunta del usuario.
    
    DATOS DEL USUARIO:
    - Perfil: ${userProfile.preferences.persona}
    - Transacciones: ${JSON.stringify(MOCK_TRANSACTIONS)}
    - Presupuestos: ${JSON.stringify(MOCK_BUDGETS)}

    INSTRUCCIONES DE FORMATO (CRÍTICO):
    1. DEBES llamar a una función ("tool call"). NO respondas con texto.
    2. Los parámetros deben ser un OBJETO JSON simple { ... }, NO un array [ ... ].
    3. Si el usuario pregunta "¿Cómo voy?", calcula si ha gastado mucho comparando el 'spent' vs 'limit' en los Presupuestos y genera una 'show_summary_card'.
  `;

  const result = await streamUI({
    model: openai('gpt-4o-mini'), 
    system: SYSTEM_PROMPT,
    prompt: input,
    temperature: 0, // Sin creatividad para evitar alucinaciones de formato
    
    // OBLIGATORIO: Forzamos a la IA a usar una herramienta. 
    // Si intenta hablar texto, esto bloqueará esa salida y la obligará a estructurarse.
    toolChoice: 'required', 

    // Si algo sale mal y genera texto, lo veremos en rojo para diferenciarlo del amarillo anterior
    text: ({ content, done }) => {
      if (done) return <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">Error: La IA generó texto en lugar de UI: {content}</div>;
      return <div>Generando interfaz...</div>;
    },
    
    tools: {
      show_summary_card: {
        description: 'Muestra tarjeta de resumen. Úsala para "¿Cómo voy?", "Resumen" o estado general.',
        inputSchema: expenseSummarySchema,
        generate: async function* (props) {
          // 1. Loading State
          yield (
            <div className="p-6 rounded-3xl border-2 border-gray-100 bg-white shadow-sm h-40 flex flex-col items-center justify-center gap-3">
               <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
               <p className="text-sm text-gray-400 font-medium animate-pulse">Analizando tus finanzas...</p>
            </div>
          );
          
          // 2. Corrección de errores "al vuelo"
          // Si la IA nos manda un array por error (ej: props[0]), intentamos arreglarlo.
          let finalProps = props;
          // @ts-ignore
          if (Array.isArray(props) && props.length > 0) {
             // @ts-ignore
             finalProps = props[0]; 
          }

          // Valores por defecto para evitar pantallas blancas
          const safeProps = {
            sentiment: finalProps.sentiment || 'warning',
            title: finalProps.title || 'Resumen del Mes',
            message: finalProps.message || 'Revisando tus movimientos...',
            totalAmount: finalProps.totalAmount
          };
          
          // 3. Render final
          return <ExpenseSummaryCard {...safeProps} />;
        },
      },
      
      show_transaction_list: {
        description: 'Muestra tabla de transacciones. Úsala para "Detalles", "Lista" o "Uber".',
        inputSchema: transactionListSchema,
        generate: async function* (props) {
          yield <div className="h-64 bg-gray-100 rounded-md animate-pulse" />;
          return <TransactionDataGrid transactions={props.transactions || []} />;
        },
      },

      show_category_chart: {
        description: 'Muestra gráfico. Úsala para "Distribución" o "Categorías".',
        inputSchema: pieChartSchema,
        generate: async function* (props) {
          yield <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />;
          return <CategoryPieChart {...props} />;
        }
      }
    },
  });

  return result.value;
}