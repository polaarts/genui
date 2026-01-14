# GenUI - AI Copilot Instructions

## Project Overview
GenUI is a **Next.js 16 financial dashboard** that uses **Vercel AI SDK RSC (React Server Components)** to stream React components as AI responses. The AI doesn't return text—it returns **fully rendered UI components** based on user queries.

**Core Architecture**: AI-powered UI generation via `streamUI()` + Server Actions + Tool Calling pattern.

## Critical Architectural Patterns

### 1. AI Response Pattern: UI as Output (NOT Text)
- **Primary file**: [app/actions.tsx](app/actions.tsx)
- Server Action `getFinancialResponse()` uses `streamUI()` with `toolChoice: 'required'`
- AI MUST call a tool (never return plain text)
- Each tool returns React components: `ExpenseSummaryCard`, `TransactionDataGrid`, `CategoryPieChart`
- Loading states use generator functions (`async function*`) to yield spinners before final UI

**Example flow**:
```tsx
// User asks: "¿Cómo voy?" → AI calls show_summary_card tool → Returns ExpenseSummaryCard component
tools: {
  show_summary_card: {
    parameters: expenseSummarySchema, // Zod schema defines AI output structure
    generate: async function* (props) {
      yield <LoadingSpinner />; // Step 1: Show loading
      return <ExpenseSummaryCard {...props} />; // Step 2: Show final UI
    }
  }
}
```

### 2. Schema-Driven Development
- **All AI outputs are validated via Zod schemas** in [lib/ai/schemas.ts](lib/ai/schemas.ts)
- Schemas include `.describe()` hints that guide the AI's behavior
- Example: `sentiment: z.enum(['healthy', 'warning', 'danger']).describe('Healthy=Verde, Warning=Amarillo')`
- **Always use existing schemas** when modifying tools—don't freeform parameters

### 3. User Persona System
- Two user profiles: `USER_SOFIA` (relaxed/student) and `USER_CARLOS` (auditor/accountant) in [lib/mock-data.ts](lib/mock-data.ts)
- Persona affects:
  - UI density (`compact` vs `comfortable`)
  - Decimal precision (`showDecimals`)
  - Message tone (`empathetic` vs `technical`)
- **Pass `currentUser` profile to Server Actions** to adapt AI responses

### 4. Error Recovery Pattern
In [app/actions.tsx](app/actions.tsx#L74-L77), props from AI are validated with defensive checks:
```tsx
// Handle AI returning arrays by mistake
if (Array.isArray(props) && props.length > 0) {
  finalProps = props[0];
}
// Provide safe defaults to prevent white screens
const safeProps = { sentiment: finalProps.sentiment || 'warning', ... };
```

## Development Commands
- `npm run dev` - Start dev server (http://localhost:3000)
- `npm run build` - Production build
- `npm run lint` - ESLint check

## Component Guidelines

### Adding New AI Tools
1. Define Zod schema in [lib/ai/schemas.ts](lib/ai/schemas.ts)
2. Create React component in `components/`
3. Register tool in [app/actions.tsx](app/actions.tsx) `tools` object
4. Add `.describe()` hints to guide AI when to use it
5. Include loading state via generator pattern

### Styling Conventions
- Uses **Tailwind CSS v4** with shadcn/ui components (config: [components.json](components.json))
- Design system: rounded-3xl cards, subtle shadows, sentiment-based colors
- Icons from `lucide-react`
- **Never use inline styles**—use Tailwind utility classes

### Data Flow
```
User Input → Server Action (getFinancialResponse) 
  → OpenAI GPT-4o-mini with MOCK_TRANSACTIONS context
  → Tool Call (validated by Zod)
  → React Component Stream
  → Client State Update (messages array)
```

## Key Files to Reference
- [app/actions.tsx](app/actions.tsx) - AI orchestration & tool definitions
- [lib/ai/schemas.ts](lib/ai/schemas.ts) - Zod schemas for all AI outputs
- [lib/mock-data.ts](lib/mock-data.ts) - User profiles & transaction data
- [app/page.tsx](app/page.tsx) - Chat UI with persona switcher

## Common Pitfalls
1. **Don't allow AI text responses**: Always use `toolChoice: 'required'` in streamUI
2. **Schema mismatches**: AI tool parameters MUST match Zod schema structure
3. **Missing loading states**: Use generator functions to show spinners during compute
4. **Ignoring persona context**: Always inject `userProfile` into system prompts

## Testing User Flows
Use quick action pills in [app/page.tsx](app/page.tsx#L185-L197) to test:
- "📊 Resumen mensual" → Tests `show_summary_card` tool
- "🚗 Detalle transporte" → Tests `show_transaction_list` with filtering
- "🍩 Distribución gastos" → Tests `show_category_chart`

Switch between Sofía/Carlos modes to verify persona-aware responses.
