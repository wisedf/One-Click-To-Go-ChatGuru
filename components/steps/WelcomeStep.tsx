import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { ChatBubble } from '../ui/ChatBubble';

export const WelcomeStep: React.FC = () => {
  const { nextStep } = useOnboarding();

  const benefits = [
    { text: "Crie sua conta em 1 clique", sub: "Google ou e-mail", color: "#E8F8F0", border: "#2DD4A0", align: "left" as const },
    { text: "Escolha plano + nicho", sub: "Já pré-configuramos tudo", color: "#C8D9EE", border: "#7BA3D4", align: "right" as const },
    { text: "Conecte WhatsApp + chatbot", sub: "QR code e pronto", color: "#EDE5CC", border: "#C9B77D", align: "left" as const },
    { text: "Atenda seu 1º cliente ao vivo!", sub: "Na plataforma real", color: "#E8F8F0", border: "#2DD4A0", align: "right" as const },
  ];

  return (
    <div className="text-center py-3 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-greenLight text-brand-greenDark text-xs font-semibold mb-5">
        <span className="text-sm">⚡</span> One Click to Go
      </div>
      <h1 className="text-3xl font-bold text-brand-greenDark mb-2 leading-tight font-sans">
        Uma boa conversa<br /><span className="text-brand-green">começa aqui</span>
      </h1>
      <p className="text-[15px] text-brand-textMuted max-w-[400px] mx-auto mb-7 leading-relaxed">
        Em poucos minutos você terá o ChatGuru funcionando. Sem espera, sem complicação.
      </p>
      
      <div className="flex flex-col gap-2.5 max-w-[360px] mx-auto items-stretch">
        {benefits.map((item, i) => (
          <div 
            key={i} 
            className={`flex ${item.align === 'left' ? 'justify-start' : 'justify-end'} animate-slide-up`}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <ChatBubble align={item.align} color={item.color} borderColor={item.border}>
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-6 h-6 rounded-full flex-shrink-0 text-white flex items-center justify-center text-[11px] font-bold"
                  style={{ backgroundColor: item.border }}
                >
                  {i + 1}
                </span>
                <div>
                  <span className="text-sm text-brand-text font-medium block">{item.text}</span>
                  <span className="text-[11px] text-brand-textLight">{item.sub}</span>
                </div>
              </div>
            </ChatBubble>
          </div>
        ))}
      </div>

      <Button onClick={nextStep}>Começar agora →</Button>
      <p className="text-xs text-brand-textLight mt-2.5">Leva menos de 5 minutos · Sem cartão de crédito</p>
    </div>
  );
};
