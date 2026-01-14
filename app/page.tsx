'use client';

import { useState } from 'react';
import { Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';

// Importamos la Server Action y los datos Mock
import { getFinancialResponse } from './actions';
import { USER_SOFIA, USER_CARLOS } from '@/lib/mock-data';
import { UserProfile } from '@/types';

// Definimos la estructura de un mensaje en el chat
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode; // ¡Ojo! Aquí guardamos Nodos de React, no solo texto
}

export default function Home() {
  // Estado 1: El perfil activo (empezamos con Sofía)
  const [currentUser, setCurrentUser] = useState<UserProfile>(USER_SOFIA);
  
  // Estado 2: El historial de la conversación
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Estado 3: Input del usuario
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función principal: Enviar mensaje a la IA
  const handleSubmit = async (e?: React.FormEvent, manualInput?: string) => {
    e?.preventDefault();
    const query = manualInput || inputValue;
    if (!query.trim()) return;

    // 1. Añadimos el mensaje del usuario a la UI inmediatamente
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. LLAMADA AL SERVIDOR (La Magia)
      // Le pasamos la pregunta Y el perfil completo para que la IA se adapte
      const responseComponent = await getFinancialResponse(query, currentUser);

      // 3. Añadimos la respuesta (que es un Componente React) al historial
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseComponent,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      // Manejo básico de errores visual
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: <div className="text-red-500">Error al conectar con FinaFlow AI.</div>
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* HEADER & SELECTOR DE PERFIL */}
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">FinaFlow <span className="text-gray-400 font-normal">AI</span></h1>
        </div>

        {/* Switch de Usuario (Simulación de Login) */}
        <div className="flex bg-gray-100 p-1 rounded-full text-sm font-medium">
          <button
            onClick={() => setCurrentUser(USER_SOFIA)}
            className={`px-4 py-1.5 rounded-full transition-all ${
              currentUser.id === USER_SOFIA.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modo Sofía (Relax)
          </button>
          <button
            onClick={() => setCurrentUser(USER_CARLOS)}
            className={`px-4 py-1.5 rounded-full transition-all ${
              currentUser.id === USER_CARLOS.id 
                ? 'bg-white text-indigo-700 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modo Carlos (Auditor)
          </button>
        </div>
      </header>

      {/* ÁREA DE CHAT (MAIN FEED) */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 space-y-8 pb-32">
        {messages.length === 0 ? (
          // Estado Vacío (Empty State)
          <div className="text-center py-20 opacity-60">
            <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-semibold text-gray-700">Hola, {currentUser.name.split(' ')[0]}</h2>
            <p className="text-gray-500">Pregunta sobre tus gastos y adaptaré la interfaz para ti.</p>
          </div>
        ) : (
          // Lista de Mensajes
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar IA */}
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              )}

              {/* Contenido del Mensaje */}
              <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-800 text-white px-4 py-2 rounded-2xl rounded-tr-none' : 'w-full'}`}>
                {msg.content}
              </div>

              {/* Avatar Usuario */}
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))
        )}
        
        {/* Indicador de Carga */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm w-full max-w-sm">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animation-delay-400"></div>
              </div>
              <span className="text-xs text-gray-400 mt-2 block">
                {currentUser.preferences.persona === 'auditor' ? 'Calculando métricas...' : 'Analizando tus gastos...'}
              </span>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER: INPUT AREA */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t p-4 pb-8">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Sugestiones Rápidas (Pills) */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={(e) => handleSubmit(e, "¿Cómo voy este mes?")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors"
            >
              📊 Resumen mensual
            </button>
            <button 
              onClick={(e) => handleSubmit(e, "Muéstrame el detalle de mis gastos en transporte")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors"
            >
              🚗 Detalle transporte
            </button>
            <button 
              onClick={(e) => handleSubmit(e, "¿En qué categoría gasté más?")}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-600 whitespace-nowrap transition-colors"
            >
              🍩 Distribución gastos
            </button>
            {messages.length > 0 && (
               <button 
               onClick={() => setMessages([])}
               className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-full text-xs font-medium text-red-600 whitespace-nowrap transition-colors flex items-center gap-1"
             >
               <Trash2 className="w-3 h-3"/> Limpiar chat
             </button>
            )}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Pregunta algo como ${currentUser.preferences.persona === 'relaxed' ? '"¿Puedo comprar pizza?"' : '"Desviación presupuestaria"'}`}
              className="flex-1 bg-gray-100 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-black text-white p-3 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}