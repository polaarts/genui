'use server';

import { streamUI } from '@ai-sdk/rsc';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';

// Importamos los Schemas que acabamos de crear
import { 
  expenseSummarySchema, 
  transactionListSchema, 
  pieChartSchema,
  dashboardOutputSchema,
  type DashboardOutput 
} from '@/lib/ai/schemas';

// Importamos los prompts
import { buildDashboardSystemPrompt, buildDashboardUserPrompt } from '@/lib/ai/prompts';

// Importamos los Componentes Visuales (asegúrate de que las rutas sean correctas)
import { ExpenseSummaryCard } from '@/components/expense-summary-card';
import { TransactionDataGrid } from '@/components/transaction-data-grid';
import { CategoryPieChart } from '@/components/category-pie-chart';

// Importamos los datos mock para que la IA los "lea"
import { MOCK_TRANSACTIONS, MOCK_BUDGETS } from '@/lib/mock-data';
import { UserProfile } from '@/types';

/**
 * NUEVA Server Action: Genera dashboard completo basado en configuración del usuario
 * Esta función reemplaza el enfoque de chat por generación estructurada de dashboard
 */
export async function generateDashboard(userProfile: UserProfile): Promise<DashboardOutput> {
  try {
    console.log('[generateDashboard] Starting generation for user:', userProfile.name);
    console.log('[generateDashboard] Active widgets:', userProfile.dashboardConfig.activeWidgets);
    
    const systemPrompt = buildDashboardSystemPrompt(userProfile);
    const userPrompt = buildDashboardUserPrompt(MOCK_TRANSACTIONS, MOCK_BUDGETS);

    console.log('[generateDashboard] Calling OpenAI API...');
    
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: userPrompt,
      schema: dashboardOutputSchema,
      temperature: 0.3, // Un poco de creatividad para insights interesantes
    });

    console.log('[generateDashboard] Success! Generated data:', Object.keys(result.object));
    
    return result.object;
  } catch (error) {
    console.error('[generateDashboard] ERROR:', error);
    console.error('[generateDashboard] Error details:', JSON.stringify(error, null, 2));
    
    // Fallback: retornar datos mock basados en widgets activos
    const fallback: DashboardOutput = {};
    
    if (userProfile.dashboardConfig.activeWidgets.includes('summary')) {
      fallback.summary = {
        sentiment: 'warning',
        title: 'Error al generar análisis',
        message: 'Ocurrió un error al conectar con el servicio de análisis. Mostrando datos de ejemplo.',
        totalAmount: 1265,
      };
    }
    
    if (userProfile.dashboardConfig.activeWidgets.includes('transactions')) {
      fallback.transactions = {
        transactions: MOCK_TRANSACTIONS.slice(0, 5).map(t => ({
          id: t.id,
          date: t.date,
          merchant: t.merchant,
          amount: t.amount,
          category: t.category as any,
          status: t.status as any,
        })),
      };
    }
    
    if (userProfile.dashboardConfig.activeWidgets.includes('chart')) {
      fallback.chart = {
        title: 'Distribución por Categoría',
        data: [
          { name: 'Comida', value: 120 },
          { name: 'Transporte', value: 150 },
          { name: 'Ocio', value: 1250 },
          { name: 'Salud', value: 80 },
        ],
      };
    }
    
    if (userProfile.dashboardConfig.activeWidgets.includes('budget')) {
      fallback.budget = {
        budgets: MOCK_BUDGETS.map(b => ({
          category: b.category,
          spent: b.spent,
          limit: b.limit,
          percentage: (b.spent / b.limit) * 100,
        })),
      };
    }
    
    if (userProfile.dashboardConfig.activeWidgets.includes('alerts')) {
      fallback.alerts = {
        alerts: [
          {
            id: '1',
            severity: 'danger' as const,
            emoji: '⚠️',
            title: 'Presupuesto excedido',
            message: 'Has superado tu presupuesto de Ocio en $950',
          },
          {
            id: '2',
            severity: 'warning' as const,
            emoji: '💡',
            title: 'Patrón detectado',
            message: '3 gastos en Uber en los últimos 2 días',
          },
        ],
      };
    }
    
    return fallback;
  }
}

/**
 * Server Action LEGACY: Mantener para referencia o casos especiales
 * Esta es la función original de chat
 */
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
          if (Array.isArray(props) && props.length > 0) {
             finalProps = props[0] as typeof props;
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