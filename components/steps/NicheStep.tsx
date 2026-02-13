import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { ChatBubble } from '../ui/ChatBubble';
import { NICHES, NICHE_CONFIGS } from '../../constants';

export const NicheStep: React.FC = () => {
  const { nextStep, data, updateData } = useOnboarding();
  const cfg = data.niche ? NICHE_CONFIGS[data.niche] : null;

  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 font-sans text-center">Qual é o seu nicho?</h2>
      <p className="text-sm text-brand-textMuted mb-7 text-center">Vamos deixar tudo pronto para você — automações, filas e mensagens</p>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(145px,1fr))] gap-2.5 max-w-[640px] mx-auto mb-5">
        {NICHES.map((n) => {
          const isSelected = data.niche === n.id;
          return (
            <div 
              key={n.id} 
              onClick={() => updateData({ niche: n.id })}
              className={`p-4 rounded-[14px] cursor-pointer text-center transition-all duration-200
                ${isSelected ? 'bg-brand-greenLight border-[2.5px] border-brand-green' : 'bg-white border-2 border-[#E2EDE7] hover:border-brand-greenLight'}
              `}
            >
              <div className="text-[28px] mb-1.5">{n.icon}</div>
              <div className="text-[13px] font-semibold text-brand-greenDark">{n.name}</div>
              <div className="text-[11px] text-brand-textLight leading-tight mt-1">{n.desc}</div>
            </div>
          );
        })}
      </div>

      {cfg && (
        <div className="max-w-[500px] mx-auto animate-slide-up">
          <ChatBubble className="max-w-full">
            <div className="text-[13px] font-bold text-brand-greenDark mb-1.5">⚡ Configuração automática ativada!</div>
            <div className="text-xs text-brand-textMuted mb-3.5">Isso já estaria funcionando se você conectasse agora:</div>
            
            <div className="mb-3">
              <span className="text-[11px] text-brand-textLight uppercase tracking-wider font-semibold">Etiquetas</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {cfg.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-[#F0F5F2] text-brand-textMuted font-sans">{t}</span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <span className="text-[11px] text-brand-textLight uppercase tracking-wider font-semibold">Filas de atendimento</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {cfg.queues.map((q) => (
                  <span key={q} className="text-xs px-3 py-1 rounded-full bg-brand-pastelBlueLt text-brand-pastelBlue font-sans">{q}</span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-brand-textLight uppercase tracking-wider font-semibold">Mensagem automática</span>
              <div className="mt-1.5 p-2.5 rounded-xl bg-white text-[13px] text-brand-textMuted italic border-l-[3px] border-brand-green">
                "{cfg.auto_msgs}"
              </div>
            </div>
          </ChatBubble>
        </div>
      )}

      <div className="text-center">
        <Button onClick={nextStep} disabled={!data.niche}>Aplicar e conectar WhatsApp →</Button>
      </div>
    </div>
  );
};
