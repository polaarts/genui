'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { WidgetSelector } from '@/components/settings/widget-selector';
import { LayoutPicker } from '@/components/settings/layout-picker';
import { ArrowRight, Sparkles } from 'lucide-react';
import { UserPersona, WidgetType } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { userProfile, updateProfile } = useUserConfig();
  const [step, setStep] = useState(1);
  
  const [name, setName] = useState(userProfile.name || '');
  const [persona, setPersona] = useState<UserPersona>(userProfile.preferences.persona);
  const [selectedWidgets, setSelectedWidgets] = useState<WidgetType[]>(
    userProfile.dashboardConfig.activeWidgets
  );
  const [layout, setLayout] = useState(userProfile.dashboardConfig.layout);

  const PERSONAS = [
    { 
      value: 'relaxed' as UserPersona, 
      label: 'Relajado', 
      emoji: '😌', 
      description: 'Quiero una vista simple, sin mucho detalle. Solo lo esencial.' 
    },
    { 
      value: 'auditor' as UserPersona, 
      label: 'Auditor', 
      emoji: '🔍', 
      description: 'Necesito ver todos los números con precisión y detalle técnico.' 
    },
    { 
      value: 'spender' as UserPersona, 
      label: 'Gastador', 
      emoji: '💸', 
      description: 'Ayúdame a controlar mis gastos con alertas y recordatorios.' 
    },
  ];

  const handleComplete = () => {
    updateProfile({
      name,
      preferences: {
        ...userProfile.preferences,
        persona,
      },
      dashboardConfig: {
        ...userProfile.dashboardConfig,
        activeWidgets: selectedWidgets,
        widgetOrder: selectedWidgets,
        layout,
      },
      isOnboarded: true,
    });
    
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 flex items-center justify-center p-6 relative">
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 text-blue-400 px-4 py-2 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">FinaFlow</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Bienvenido!
          </h1>
          <p className="text-gray-600">
            Configuremos tu dashboard financiero en {step === 1 ? '3' : step === 2 ? '2' : '1'} paso{step === 3 ? '' : 's'} más
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-blue-500' : 'bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Content Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-8">
          {/* Step 1: Persona */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">¿Cómo te llamas?</h2>
                <p className="text-slate-400">Personalicemos tu experiencia</p>
              </div>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg text-white placeholder:text-slate-500"
                autoFocus
              />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">¿Cómo te gusta ver tu información?</h3>
                <div className="space-y-3">
                  {PERSONAS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPersona(p.value)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        persona === p.value
                          ? 'border-blue-500 bg-blue-500/10 backdrop-blur-sm shadow-lg'
                          : 'border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{p.emoji}</span>
                        <div>
                          <h4 className={`font-semibold ${
                            persona === p.value ? 'text-blue-400' : 'text-white'
                          }`}>
                            {p.label}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            persona === p.value ? 'text-blue-300' : 'text-slate-400'
                          }`}>
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!name.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Widgets */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">¿Qué quieres ver en tu dashboard?</h2>
                <p className="text-slate-400">Selecciona los widgets que más te interesan</p>
              </div>

              <WidgetSelector
                selectedWidgets={selectedWidgets}
                onChange={setSelectedWidgets}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all shadow-lg"
                >
                  Atrás
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedWidgets.length === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Layout */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Personaliza tu vista</h2>
                <p className="text-slate-400">¿Cómo quieres organizar tu dashboard?</p>
              </div>

              <LayoutPicker value={layout} onChange={setLayout} />

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-white/10 bg-white/5 backdrop-blur-sm text-slate-300 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all shadow-lg"
                >
                  Atrás
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Completar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Skip (solo en step 1) */}
        {step === 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
            >
              Omitir configuración
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
