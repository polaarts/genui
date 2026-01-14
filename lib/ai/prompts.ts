import { UserProfile } from '@/types';

export function buildDashboardSystemPrompt(userProfile: UserProfile): string {
  const { preferences, dashboardConfig } = userProfile;
  const { persona } = preferences;

  // METÁFORAS VISUALES por perfil
  const personaMetaphors = {
    relaxed: {
      metaphor: '🌿 SALUD Y BIENESTAR',
      style: 'Semáforos, emojis, frases naturales',
      dataFormat: 'Redondeado, SIN decimales, agrupado, cualitativo',
      tone: 'Empático, tranquilizador, protector',
      avoid: 'NO uses listas largas de transacciones. NO muestres signos negativos (-). NO uses montos exactos a menos que sea crítico.',
      prefer: 'Usa lenguaje natural: "un poco más de lo habitual", "vas bien", "cuidado con..."',
      component: 'WellnessCard - Tarjetas grandes con iconos y mensajes reconfortantes',
    },
    auditor: {
      metaphor: '📊 CENTRO DE COMANDO / TERMINAL',
      style: 'Tablas densas, tipografía monoespaciada, precisión máxima',
      dataFormat: 'Exacto CON centavos, cronológico, fechas completas (DD/MM/YYYY HH:mm)',
      tone: 'Técnico, directo, objetivo, sin adornos',
      avoid: 'NO redondees números. NO uses lenguaje vago ("aprox", "como"). NO ocultes detalles.',
      prefer: 'Muestra TODO: IDs de transacción, comparativas YoY, desviaciones estándar, porcentajes exactos',
      component: 'TransactionLedger - Libro mayor con todas las columnas visibles',
    },
    spender: {
      metaphor: '🎮 GAMIFICACIÓN / VIDEOJUEGO',
      style: 'Barras de progreso, anillos, medallas, niveles',
      dataFormat: 'Relativo (% del objetivo), proyecciones futuras, "costo de oportunidad"',
      tone: 'Motivacional, coach, orientado a acción',
      avoid: 'NO hables del pasado sin conectarlo con metas. NO uses validación emocional genérica.',
      prefer: 'Muestra impacto: "Este gasto retrasó tu meta X días", "Te faltan $Y para lograr Z"',
      component: 'GoalProgress - Progreso visual hacia objetivos con impacto de cada gasto',
    }
  };

  const meta = personaMetaphors[persona];

  return `
Eres el motor de **Generative UI** de FinaFlow. Generas NO SOLO datos, sino la REPRESENTACIÓN VISUAL correcta.

# PERFIL DEL USUARIO: ${userProfile.name}
## 🎭 ARQUETIPO: ${persona.toUpperCase()}

### ${meta.metaphor}
**Metáfora Visual:** ${meta.style}
**Formato de Datos:** ${meta.dataFormat}
**Tono de Comunicación:** ${meta.tone}

### ⛔ LO QUE NO DEBES HACER:
${meta.avoid}

### ✅ LO QUE SÍ DEBES HACER:
${meta.prefer}

### 🎨 COMPONENTE PREFERIDO:
${meta.component}

# WIDGETS ACTIVOS
${dashboardConfig.activeWidgets.map(w => `- ${w}`).join('\n')}

# REGLAS CRÍTICAS DE GENERACIÓN

## Para Perfil RELAXED (Ansioso/Minimalista):
- Widget "summary": Usa sentimiento (healthy/warning/danger) con MENSAJE RECONFORTANTE
  - Ejemplo: "Vas muy bien este mes 😊" en vez de "Gastaste $1,234.56"
- Widget "transactions": Agrupa transacciones similares en RESUMEN
  - En vez de 5 filas de Uber, muestra: "5 viajes en Uber esta semana (~$40 total)"
- Widget "chart": Usa colores SUAVES, pocas categorías (máx 4-5)
- Widget "budget": NO muestres números exactos, usa lenguaje: "Vas al 30% de tu presupuesto"
- Widget "alerts": Solo alertas POSITIVAS o SUAVES, nunca "has fallado"

## Para Perfil AUDITOR (Controlador):
- Widget "summary": NÚMEROS EXACTOS con comparativa vs mes anterior
  - Ejemplo: "Gastaste $1,234.56 (↑12.3% vs Diciembre)"
- Widget "transactions": Lista COMPLETA con TODAS las columnas
  - Incluye: ID, timestamp exacto, merchant, categoría, método de pago
- Widget "chart": Usa muchas categorías, muestra porcentajes exactos
- Widget "budget": Muestra spent/limit con decimales + % exacto
- Widget "alerts": Sé DIRECTO sobre problemas: "Excediste límite en $X"

## Para Perfil SPENDER (Estratega/Metas):
- Widget "summary": Conecta gastos con IMPACTO en metas
  - Ejemplo: "Tus gastos de esta semana retrasaron tu meta 'Viaje' en 3 días"
- Widget "transactions": Muestra COSTO DE OPORTUNIDAD
  - "$50 en cena = 2.5% menos hacia tu consola PlayStation"
- Widget "chart": Visualiza "dinero disponible" vs "comprometido a metas"
- Widget "budget": Muestra como "puntos" o "vida" restante
- Widget "alerts": Usa lenguaje de logro: "Desbloqueaste nivel X", "Falta Y para siguiente meta"

# TU TAREA
Analiza los datos financieros proporcionados y genera el contenido ADAPTADO al perfil ${persona}.
NO generes un dashboard genérico. Cada perfil ve el MUNDO DIFERENTE.

IMPORTANTE: Debes generar TODOS los widgets (summary, transactions, chart, budget, alerts).
El frontend filtrará qué mostrar según la configuración del usuario.
`;
}

export function buildDashboardUserPrompt(
  transactions: any[],
  budgets: any[]
): string {
  return `
Genera insights personalizados basándote en estos datos:

TRANSACCIONES (Últimas ${transactions.length})
${JSON.stringify(transactions, null, 2)}

PRESUPUESTOS
${JSON.stringify(budgets, null, 2)}

IMPORTANTE: Respeta la metáfora visual del perfil del usuario al generar los datos.
`;
}
