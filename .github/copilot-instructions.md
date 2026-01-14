# GenUI - AI Copilot Instructions

## Project Overview
GenUI es un **dashboard financiero SaaS con Next.js 16** que usa **Vercel AI SDK RSC** para generar interfaces dinámicas basadas en la configuración del usuario. La IA no devuelve texto—devuelve **componentes React renderizados** que conforman el dashboard personalizado.

**Arquitectura Core**: Dashboard adaptativo via `streamUI()` + Server Actions + Configuración de Usuario + Tool Calling.

---

## Arquitectura del Dashboard (NO es un Chat)

### Flujo Principal
```
Usuario nuevo → Onboarding (Configuración inicial)
                      ↓
              Guardar preferencias en estado/storage
                      ↓
Usuario existente → Cargar configuración → Generar Dashboard
                      ↓
              Cambio de configuración detectado
                      ↓
              Skeleton/Loading Animation
                      ↓
              AI regenera componentes que hacen "match"
                      ↓
              Dashboard actualizado
```

### Componentes del Sistema

1. **Página de Configuración** (`app/settings/page.tsx`)
   - Formulario de preferencias del usuario
   - Se muestra en onboarding (primer ingreso) o accesible desde header
   - Guarda: `persona`, `density`, `showDecimals`, `tone`, `visualTheme`, `widgetsActivos`

2. **Dashboard Principal** (`app/page.tsx`)
   - NO es un chat, es una grilla de widgets
   - Los widgets se generan según la configuración del usuario
   - Detecta cambios de configuración y regenera solo widgets afectados

3. **Sistema de Widgets** (componentes modulares)
   - `ExpenseSummaryCard` - Resumen financiero
   - `TransactionDataGrid` - Tabla de transacciones
   - `CategoryPieChart` - Distribución por categorías
   - Cada widget tiene su skeleton de loading

---

## Patrones Críticos

### 1. Configuración como Driver de UI
```tsx
// La configuración del usuario determina QUÉ widgets mostrar y CÓMO
interface DashboardConfig {
  widgets: ('summary' | 'transactions' | 'chart' | 'budget')[];
  layout: 'grid' | 'list';
  refreshInterval?: number;
}

// El AI recibe esta config y genera los componentes correspondientes
const dashboard = await generateDashboard(userConfig, financialData);
```

### 2. Detección de Cambios y Regeneración
```tsx
// Cuando cambia la configuración, mostrar skeletons y regenerar
useEffect(() => {
  setIsRegenerating(true);
  regenerateDashboard(newConfig)
    .finally(() => setIsRegenerating(false));
}, [configHash]); // Hash de configuración para detectar cambios
```

### 3. Skeleton Loading por Widget
```tsx
// Cada widget tiene su propio skeleton mientras se genera
{isLoading ? (
  <DashboardSkeleton layout={config.layout} widgetCount={config.widgets.length} />
) : (
  <DashboardGrid widgets={generatedWidgets} />
)}
```

### 4. AI Tool Pattern (Actualizado para Dashboard)
```tsx
tools: {
  generate_dashboard_widget: {
    parameters: dashboardWidgetSchema,
    generate: async function* ({ widgetType, data, config }) {
      yield <WidgetSkeleton type={widgetType} />;
      
      switch(widgetType) {
        case 'summary': return <ExpenseSummaryCard {...data} config={config} />;
        case 'chart': return <CategoryPieChart {...data} config={config} />;
        // ... más widgets
      }
    }
  }
}
```

---

## Schema-Driven Development
- **Todos los outputs de AI validados via Zod** en [lib/ai/schemas.ts](lib/ai/schemas.ts)
- Schemas incluyen `.describe()` para guiar el comportamiento de la IA
- **Siempre usar schemas existentes** al modificar tools

### Schemas Clave a Crear/Extender
```tsx
// lib/ai/schemas.ts
export const dashboardConfigSchema = z.object({
  widgets: z.array(z.enum(['summary', 'transactions', 'chart', 'budget'])),
  layout: z.enum(['grid', 'list']),
  density: z.enum(['compact', 'comfortable']),
  // ...
});

export const widgetPropsSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('summary'), ...expenseSummarySchema.shape }),
  z.object({ type: z.literal('chart'), ...pieChartSchema.shape }),
  // ...
]);
```

---

## Sistema de Configuración de Usuario

### Parámetros de Configuración (existentes en types/)
```tsx
interface UserPreferences {
  persona: 'relaxed' | 'auditor' | 'spender';
  uiConfig: {
    density: 'compact' | 'comfortable';
    showDecimals: boolean;
    tone: 'empathetic' | 'technical' | 'urgent';
    visualTheme: 'minimal' | 'data-heavy';
  };
}
```

### Parámetros Nuevos a Agregar
```tsx
interface DashboardPreferences {
  activeWidgets: WidgetType[];      // Qué widgets mostrar
  widgetOrder: string[];            // Orden de widgets
  defaultTimeRange: 'week' | 'month' | 'quarter';
  autoRefresh: boolean;
  refreshInterval: number;          // En segundos
}
```

---

## Estructura de Archivos

```
app/
├── page.tsx                 # Dashboard principal (NO chat)
├── settings/
│   └── page.tsx            # Página de configuración
├── onboarding/
│   └── page.tsx            # Flujo de primer ingreso
├── actions.tsx             # Server Actions para AI
└── layout.tsx              # Layout con detección de config

components/
├── dashboard/
│   ├── dashboard-grid.tsx  # Contenedor de widgets
│   ├── dashboard-skeleton.tsx
│   └── widget-wrapper.tsx  # HOC para cada widget
├── widgets/
│   ├── expense-summary-card.tsx
│   ├── transaction-data-grid.tsx
│   └── category-pie-chart.tsx
├── settings/
│   ├── settings-form.tsx
│   └── widget-selector.tsx
└── ui/                     # shadcn components

lib/
├── ai/
│   ├── schemas.ts          # Zod schemas
│   └── prompts.ts          # System prompts
├── hooks/
│   ├── use-config.ts       # Hook para configuración
│   └── use-dashboard.ts    # Hook para estado del dashboard
└── mock-data.ts
```

---

## Comandos de Desarrollo
- `npm run dev` - Servidor de desarrollo (http://localhost:3000)
- `npm run build` - Build de producción
- `npm run lint` - ESLint check

## Convenciones de Estilo
- **Tailwind CSS v4** con shadcn/ui (config: [components.json](components.json))
- Design system: `rounded-3xl`, sombras sutiles, colores por sentimiento
- Iconos de `lucide-react`
- **Nunca usar inline styles**—solo clases de Tailwind
- Skeletons: usar `animate-pulse` con formas que coincidan con el widget final

---

## Flujo de Testing

1. **Onboarding**: Verificar que usuario nuevo ve página de configuración
2. **Dashboard Load**: Verificar que config genera widgets correctos
3. **Config Change**: Cambiar preferencia → Ver skeleton → Ver widget actualizado
4. **Persona Switch**: Cambiar entre Sofía/Carlos → Dashboard se adapta

---

## Pitfalls Comunes
1. **No permitir respuestas de texto de AI**: Siempre `toolChoice: 'required'`
2. **Regenerar todo el dashboard**: Solo regenerar widgets afectados por el cambio
3. **Olvidar skeletons**: Cada widget DEBE tener su estado de loading
4. **Config no persistida**: Usar localStorage o estado global para persistir
5. **No detectar cambios**: Usar hash de configuración para comparar cambios
