'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

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
  
  // Construimos un Prompt de Sistema dinámico basado en el perfil
  const SYSTEM_PROMPT = `
    Eres Financial, un asistente financiero experto.
    
    PERFIL DEL USUARIO:
    - Nombre: ${userProfile.name}
    - Rol: ${userProfile.preferences.persona} (Si es 'auditor', prefiere tablas y datos duros. Si es 'relaxed', prefiere resúmenes y lenguaje simple).
    - Tono: ${userProfile.preferences.uiConfig.tone}
    
    DATOS ACTUALES (Contexto para responder):
    - Transacciones: ${JSON.stringify(MOCK_TRANSACTIONS)}
    - Presupuestos: ${JSON.stringify(MOCK_BUDGETS)}
    
    TU OBJETIVO:
    Analiza la pregunta del usuario y decide qué componente visual (Herramienta) representa mejor la respuesta.
    NO inventes datos financieros. Usa estrictamente los JSON proporcionados arriba para llenar los componentes.
  `;

  const result = await streamUI({
    model: openai('gpt-4o-mini'), // Usamos mini para velocidad en el MVP
    system: SYSTEM_PROMPT,
    prompt: input,
    text: ({ content, done }) => {
      // Si la IA decide hablar texto plano en lugar de usar UI
      if (done) return <div className="p-4 text-gray-600">{content}</div>;
      return <div className="p-4 text-gray-400 animate-pulse">Generando respuesta...</div>;
    },
    tools: {
      // Herramienta 1: Resumen (Para usuarios Relax o alertas generales)
      show_summary_card: {
        description: 'Muestra una tarjeta de resumen con sentimiento (bueno/malo). Úsalo para preguntas generales como "¿Cómo voy?" o alertas.',
        parameters: expenseSummarySchema,
        generate: async function* (props) {
          yield <div className="animate-pulse h-32 bg-gray-100 rounded-3xl" />; // Loading state
          return <ExpenseSummaryCard {...props} />;
        },
      },
      
      // Herramienta 2: Grilla (Para usuarios Auditor o detalles específicos)
      show_transaction_list: {
        description: 'Muestra una tabla detallada de transacciones. Úsalo cuando el usuario pida ver gastos específicos, historial o detalles.',
        parameters: transactionListSchema,
        generate: async function* (props) {
          yield <div className="animate-pulse h-64 bg-gray-100 rounded-md" />;
          return <TransactionDataGrid transactions={props.transactions} />;
        },
      },

      // Herramienta 3: Gráfico (Para visualizar distribución)
      show_category_chart: {
        description: 'Muestra un gráfico de pastel. Úsalo para preguntas sobre "dónde se fue mi dinero" o distribución de gastos.',
        parameters: pieChartSchema,
        generate: async function* (props) {
          yield <div className="animate-pulse h-64 bg-gray-100 rounded-xl" />;
          return <CategoryPieChart {...props} />;
        }
      }
    },
  });

  return result.value;
}