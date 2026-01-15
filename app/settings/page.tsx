'use client';

import { useRouter } from 'next/navigation';
import { useUserConfig } from '@/lib/context/config-context';
import { SettingsForm } from '@/components/settings/settings-form';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const { userProfile, updateProfile } = useUserConfig();

  const handleSave = (updatedProfile: UserProfile) => {
    updateProfile(updatedProfile);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 relative">
      
      <div className="relative max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-lg rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 mb-4 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-white">Configuración</h1>
          <p className="text-slate-400 mt-2">
            Personaliza tu experiencia en FinaFlow
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-xl rounded-3xl p-8">
          <SettingsForm 
            initialProfile={userProfile}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
