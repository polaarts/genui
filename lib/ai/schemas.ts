import { z } from 'zod';

// --- Schemas existentes para componentes individuales ---

// --- Schema para Componente A: ExpenseSummaryCard ---
export const expenseSummarySchema = z.object({
  sentiment: z.enum(['healthy', 'warning', 'danger'])
    .describe('El sentimiento general del estado financiero. Healthy=Verde, Warning=Amarillo, Danger=Rojo.'),
  title: z.string()
    .describe('Un título corto y directo, ej: "Presupuesto excedido" o "Ahorro estable".'),
  message: z.string()
    .describe('Un mensaje explicativo de 1 o 2 frases. Adapta el tono al perfil del usuario.'),
  totalAmount: z.number()
    .describe('El monto total asociado al resumen (ej. total gastado).'),
});

// --- Schema auxiliar para las transacciones dentro de la grilla ---
const transactionSchema = z.object({
  id: z.string(),
  date: z.string(),
  merchant: z.string(),
  amount: z.number(),
  category: z.enum(['Housing', 'Food', 'Transport', 'Leisure', 'Income', 'Savings', 'Health']),
  status: z.enum(['pending', 'completed']),
});

// --- Schema para Componente B: TransactionDataGrid ---
export const transactionListSchema = z.object({
  transactions: z.array(transactionSchema)
    .describe('La lista de transacciones FILTRADAS que se deben mostrar. No inventes datos, usa los del contexto.'),
});

// --- Schema para Componente C: CategoryPieChart (Extra) ---
export const pieChartSchema = z.object({
  title: z.string().describe('Título del gráfico'),
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })).describe('Datos para el gráfico. Los valores negativos deben convertirse a positivos visualmente.'),
});

// --- Schemas NUEVOS para Dashboard completo ---

// Schema para widget de presupuesto
export const budgetWidgetSchema = z.object({
  budgets: z.array(z.object({
    category: z.string(),
    spent: z.number(),
    limit: z.number(),
    percentage: z.number().describe('Porcentaje gastado del límite (0-100+)'),
  })),
});

// Schema para widget de alertas
export const alertsWidgetSchema = z.object({
  alerts: z.array(z.object({
    id: z.string(),
    severity: z.enum(['danger', 'warning', 'info']),
    emoji: z.string().describe('Un emoji relevante para la alerta'),
    title: z.string().describe('Título corto de la alerta'),
    message: z.string().describe('Descripción de la alerta'),
  })),
});

// Schema principal del dashboard - TODOS los widgets son requeridos para OpenAI strict mode
// El frontend filtra qué widgets mostrar según la configuración del usuario
export const dashboardOutputSchema = z.object({
  summary: expenseSummarySchema
    .describe('Datos para el widget de resumen financiero'),
  
  transactions: transactionListSchema
    .describe('Datos para el widget de transacciones. Filtrar y ordenar apropiadamente'),
  
  chart: pieChartSchema
    .describe('Datos para el gráfico de distribución de gastos por categoría'),
  
  budget: budgetWidgetSchema
    .describe('Datos para el widget de progreso de presupuesto. Calcular porcentajes'),
  
  alerts: alertsWidgetSchema
    .describe('Alertas y notificaciones basadas en anomalías detectadas'),
});

export type DashboardOutput = z.infer<typeof dashboardOutputSchema>;
