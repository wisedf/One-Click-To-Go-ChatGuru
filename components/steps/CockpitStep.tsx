
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { ChatBubble } from '../ui/ChatBubble';

export const CockpitStep: React.FC = () => {
  const { nextStep, data } = useOnboarding();
  // Simulate checking off steps
  const [state, setState] = useState({ account: true, verified: true, plan: true, niche: true, number: true, chatbot: true });
  
  const steps = [
    { key: "account", label: "Conta criada", icon: "👤" },
    { key: "verified", label: "E-mail e telefone verificados", icon: "✅" },
    { key: "plan", label: "Plano ativado", icon: "💳" },
    { key: "niche", label: "Nicho configurado", icon: "⚙️" },
    { key: "number", label: "WhatsApp conectado", icon: "📱" },
    { key: "chatbot", label: "Chatbot de boas-vindas ativo", icon: "🤖" },
  ];

  const pct = Math.round((Object.values(state).filter(Boolean).length / steps.length) * 100);

  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 text-center">Painel de Ativação</h2>
      <p className="text-sm text-brand-textMuted mb-7 text-center">Acompanhe seu progresso</p>

      <div className="max-w-[500px] mx-auto">
        <div className="text-center mb-6">
          <div className="relative inline-block w-[110px] h-[110px]">
             <svg width="110" height="110" viewBox="0 0 110 110" className="transform -rotate-90">
               <circle cx="55" cy="55" r="48" fill="none" stroke="#E2EDE7" strokeWidth="7" />
               <circle 
                cx="55" cy="55" r="48" fill="none" stroke="#2DD4A0" strokeWidth="7" strokeLinecap="round" 
                strokeDasharray={`${2 * Math.PI * 48}`} 
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`} 
                className="transition-all duration-1000 ease-out"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <div className="text-2xl font-bold text-brand-greenDark">{pct}%</div>
               <div className="text-[10px] text-brand-textLight">Pronto</div>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {steps.map((step) => (
            <div key={step.key} className="flex items-center gap-3 p-3 rounded-[14px] bg-brand-greenLight border-[1.5px] border-[#d1ede0]">
              <span className="text-lg w-7 text-center">{step.icon}</span>
              <span className="flex-1 text-[13px] text-brand-textLight line-through">{step.label}</span>
              <span className="text-xs text-brand-green font-bold">✓</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-3.5 p-4 rounded-2xl bg-brand-pastelBlueLt border-[1.5px] border-brand-pastelBlue animate-slide-up">
           <div className="w-10 h-10 rounded-xl flex-shrink-0 bg-white flex items-center justify-center text-xl shadow-sm">📧</div>
           <div>
              <div className="text-sm font-bold text-brand-greenDark mb-1">Tutorial completo enviado!</div>
              <div className="text-[13px] text-brand-textMuted leading-relaxed">
                Enviamos para <strong className="text-brand-greenDark">{data.email}</strong> um guia completo da plataforma.
              </div>
           </div>
        </div>

        <div className="text-center mt-4">
           <ChatBubble className="max-w-full text-center">
             <div className="text-xl mb-1.5">🎯</div>
             <div className="text-sm font-bold text-brand-greenDark">Hora de ver o ChatGuru em ação!</div>
             <div className="text-[13px] text-brand-textMuted my-2">
               Um cliente simulado já está entrando em contato. Vamos?
             </div>
             <Button id="btn-cockpit-start-live" onClick={nextStep} variant="primary" className="mt-0 py-3 px-7 text-sm">💬 Atender meu primeiro cliente →</Button>
           </ChatBubble>
        </div>
      </div>
    </div>
  );
};
