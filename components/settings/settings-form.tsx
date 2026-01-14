'use client';

import { useState } from 'react';
import { UserProfile, UserPersona, PERSONA_LABELS, PERSONA_WIDGETS, PERSONA_LAYOUTS } from '@/types';
import { Save, User } from 'lucide-react';

interface SettingsFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const PERSONAS = [
  { 
    value: 'relaxed' as UserPersona, 
    emoji: '🌿', 
    label: 'Ansioso / Minimalista',
    description: 'Prefiero no ver muchos números. Quiero saber si "voy bien" o no.' 
  },
  { 
    value: 'auditor' as UserPersona, 
    emoji: '📊', 
    label: 'Auditor / Controlador',
    description: 'Necesito ver TODO el detalle. Los números exactos me dan control.' 
  },
  { 
    value: 'spender' as UserPersona, 
    emoji: '🎯', 
    label: 'Estratega / Orientado a Metas',
    description: 'Me importa más cómo me acerco a mis objetivos que el pasado.' 
  },
];

export function SettingsForm({ initialProfile, onSave }: SettingsFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Auto-asignar widgets y layout según el persona
    const updatedProfile = {
      ...profile,
      dashboardConfig: {
        ...profile.dashboardConfig,
        activeWidgets: PERSONA_WIDGETS[profile.preferences.persona],
        layout: PERSONA_LAYOUTS[profile.preferences.persona],
      }
    };
    
    // Simular guardado async
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(updatedProfile);
    
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Perfil Psicológico */}
      <section>
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <User className="w-5 h-5" />
          ¿Cómo te relacionas con el dinero?
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Esto cambiará completamente cómo se muestra tu información financiera
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tu Arquetipo Financiero
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.value}
                  type="button"
                  onClick={() => setProfile({
                    ...profile,
                    preferences: { persona: persona.value }
                  })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    profile.preferences.persona === persona.value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{persona.emoji}</div>
                  <div className={`font-bold text-sm mb-1 ${
                    profile.preferences.persona === persona.value ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {persona.label}
                  </div>
                  <div className={`text-xs ${
                    profile.preferences.persona === persona.value ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {persona.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Información sobre widgets automáticos */}
      <section className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          🧪 Tu dashboard se adapta automáticamente
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Según tu arquetipo, mostraremos diferentes widgets y layouts:
        </p>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Ansioso:</strong> Solo resumen visual, gráficos y alertas positivas</li>
          <li><strong>Auditor:</strong> Todos los widgets con máximo detalle</li>
          <li><strong>Estratega:</strong> Enfoque en metas, presupuesto y alertas de logros</li>
        </ul>
      </section>

      {/* Botón de Guardar */}
      <div className="sticky bottom-0 pt-6 pb-4 bg-white border-t">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </form>
  );
}
