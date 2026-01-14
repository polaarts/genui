import { z } from 'zod';

// --- Schema para Componente A: ExpenseSummaryCard ---
export const expenseSummarySchema = z.object({
  sentiment: z.enum(['healthy', 'warning', 'danger'])
    .describe('El sentimiento general del estado financiero. Healthy=Verde, Warning=Amarillo, Danger=Rojo.'),
  title: z.string()
    .describe('Un título corto y directo, ej: "Presupuesto excedido" o "Ahorro estable".'),
  message: z.string()
    .describe('Un mensaje explicativo de 1 o 2 frases. Adapta el tono al perfil del usuario.'),
  totalAmount: z.number().optional()
    .describe('Si es relevante, el monto total asociado al resumen (ej. total gastado).'),
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
  title: z.string().optional(),
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })).describe('Datos para el gráfico. Los valores negativos deben convertirse a positivos visualmente.'),
});