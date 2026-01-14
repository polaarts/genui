'use client';

import { Settings, Sparkles, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';

export function DashboardHeader() {
  const router = useRouter();
  const { userProfile } = useUserConfig();
  
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="bg-white border-b sticky top-0 z-10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">
              FinaFlow
            </h1>
            <p className="text-xs text-gray-500">
              Hola, {userProfile.name.split(' ')[0]} 👋
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Última actualización */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{timeString}</span>
          </div>

          {/* Settings button */}
          <button
            onClick={() => router.push('/settings')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="hidden sm:inline text-sm font-medium text-gray-700">
              Configuración
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
