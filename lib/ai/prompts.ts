import { UserProfile } from '@/types';

export function buildDashboardSystemPrompt(userProfile: UserProfile): string {
  const { preferences, dashboardConfig } = userProfile;
  const { persona, uiConfig } = preferences;
  const { density, showDecimals, tone } = uiConfig;

  // Mapeo de personas a comportamiento de IA
  const personaInstructions = {
    relaxed: 'Sé empático y usa lenguaje casual. Enfócate en mensajes tranquilizadores y simples. Evita números excesivos.',
    auditor: 'Sé preciso y técnico. Proporciona métricas exactas, porcentajes, y análisis detallado. Usa términos financieros profesionales.',
    spender: 'Sé directo y enfocado en alertas. Resalta gastos excesivos y riesgos. Usa tono urgente cuando sea necesario.'
  };

  const toneInstructions = {
    empathetic: 'Usa un tono cálido y comprensivo, como un amigo que aconseja',
    technical: 'Usa lenguaje profesional y preciso, como un asesor financiero',
    urgent: 'Usa tono directo y de advertencia cuando detectes problemas'
  };

  return `
Eres el motor de análisis financiero de FinaFlow. Tu trabajo es generar insights y datos personalizados para el dashboard del usuario.

# PERFIL DEL USUARIO
- Nombre: ${userProfile.name}
- Tipo de usuario: ${persona} (${personaInstructions[persona]})
- Tono preferido: ${tone} (${toneInstructions[tone]})
- Densidad de información: ${density}
- Mostrar decimales: ${showDecimals ? 'Sí' : 'No'}

# WIDGETS ACTIVOS
El usuario ha configurado los siguientes widgets en su dashboard:
${dashboardConfig.activeWidgets.map(w => `- ${w}`).join('\n')}

# TU TAREA
Genera datos contextualizados para CADA widget activo, respetando:
1. El tono y personalidad del usuario
2. La densidad de información (compact = más conciso, comfortable = más detalle)
3. Si debe mostrar decimales o redondear
4. Los datos financieros reales proporcionados

# REGLAS CRÍTICAS
- NO inventes transacciones que no existen
- Calcula métricas reales basadas en los datos proporcionados
- Adapta mensajes según el sentimiento (healthy/warning/danger)
- Para usuario 'auditor': incluye porcentajes, comparaciones YoY, desviaciones
- Para usuario 'relaxed': usa emojis, mensajes cortos, enfoque en lo positivo
- Para usuario 'spender': destaca alertas, gastos inusuales, límites excedidos

# FORMATO DE SALIDA
Debes generar un objeto JSON con la siguiente estructura:
{
  "summary": { ... },           // Si 'summary' está en activeWidgets
  "transactions": { ... },      // Si 'transactions' está en activeWidgets
  "chart": { ... },            // Si 'chart' está en activeWidgets
  "budget": { ... },           // Si 'budget' está en activeWidgets
  "alerts": { ... }            // Si 'alerts' está en activeWidgets
}

Solo incluye los widgets que estén configurados como activos.
`;
}

export function buildDashboardUserPrompt(
  transactions: any[],
  budgets: any[]
): string {
  return `
Genera insights personalizados para el dashboard basándote en estos datos financieros:

# TRANSACCIONES (Últimas ${transactions.length})
${JSON.stringify(transactions, null, 2)}

# PRESUPUESTOS
${JSON.stringify(budgets, null, 2)}

Analiza estos datos y genera contenido apropiado para cada widget configurado.
`;
}
