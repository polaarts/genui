'use client';

import { useState } from 'react';
import { UserProfile, UserPersona, WidgetType } from '@/types';
import { WidgetSelector } from './widget-selector';
import { LayoutPicker } from './layout-picker';
import { Save, User } from 'lucide-react';

interface SettingsFormProps {
  initialProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const PERSONAS = [
  { value: 'relaxed' as UserPersona, label: 'Relajado', emoji: '😌', description: 'Vista simple y amigable' },
  { value: 'auditor' as UserPersona, label: 'Auditor', emoji: '🔍', description: 'Máximo detalle técnico' },
  { value: 'spender' as UserPersona, label: 'Gastador', emoji: '💸', description: 'Alertas y control' },
];

export function SettingsForm({ initialProfile, onSave }: SettingsFormProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular guardado async
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave(profile);
    
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Perfil */}
      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Tu Perfil
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Usuario
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PERSONAS.map((persona) => (
                <button
                  key={persona.value}
                  type="button"
                  onClick={() => setProfile({
                    ...profile,
                    preferences: { ...profile.preferences, persona: persona.value }
                  })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    profile.preferences.persona === persona.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{persona.emoji}</div>
                  <div className={`font-semibold text-sm ${
                    profile.preferences.persona === persona.value ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {persona.label}
                  </div>
                  <div className={`text-xs mt-1 ${
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

      {/* Sección 2: Preferencias de UI */}
      <section>
        <h2 className="text-xl font-bold mb-4">Preferencias de Visualización</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold">Densidad</h4>
              <p className="text-sm text-gray-600">Espaciado de elementos</p>
            </div>
            <select
              value={profile.preferences.uiConfig.density}
              onChange={(e) => setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  uiConfig: {
                    ...profile.preferences.uiConfig,
                    density: e.target.value as 'compact' | 'comfortable'
                  }
                }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="comfortable">Cómodo</option>
              <option value="compact">Compacto</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold">Mostrar Decimales</h4>
              <p className="text-sm text-gray-600">Precisión en montos</p>
            </div>
            <button
              type="button"
              onClick={() => setProfile({
                ...profile,
                preferences: {
                  ...profile.preferences,
                  uiConfig: {
                    ...profile.preferences.uiConfig,
                    showDecimals: !profile.preferences.uiConfig.showDecimals
                  }
                }
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                profile.preferences.uiConfig.showDecimals ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                profile.preferences.uiConfig.showDecimals ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </section>

      {/* Sección 3: Widgets */}
      <section>
        <h2 className="text-xl font-bold mb-4">Widgets Activos</h2>
        <WidgetSelector
          selectedWidgets={profile.dashboardConfig.activeWidgets}
          onChange={(widgets) => setProfile({
            ...profile,
            dashboardConfig: { ...profile.dashboardConfig, activeWidgets: widgets }
          })}
        />
      </section>

      {/* Sección 4: Layout */}
      <section>
        <h2 className="text-xl font-bold mb-4">Diseño del Dashboard</h2>
        <LayoutPicker
          value={profile.dashboardConfig.layout}
          onChange={(layout) => setProfile({
            ...profile,
            dashboardConfig: { ...profile.dashboardConfig, layout }
          })}
        />
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
