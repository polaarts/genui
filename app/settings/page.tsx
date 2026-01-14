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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al Dashboard
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
          <p className="text-gray-600 mt-2">
            Personaliza tu experiencia en FinaFlow
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-sm border p-8">
          <SettingsForm 
            initialProfile={userProfile}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
