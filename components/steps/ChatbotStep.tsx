
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';

export const ChatbotStep: React.FC = () => {
  const { nextStep, data, updateData } = useOnboarding();
  const [selected, setSelected] = useState<'simple'|'greeting'|'custom'|null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [activated, setActivated] = useState(false);

  const companyName = data.companyName || (data.name ? data.name.split(" ")[0] + "'s" : "Minha Empresa");
  const agentName = data.name ? data.name.split(" ")[0] : "Atendente";

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "bom dia" : h < 18 ? "boa tarde" : "boa noite";
  };

  const options = [
    { id: "simple", label: "Saudação direta", preview: `Olá, bem-vindo(a) à ${companyName}! Meu nome é ${agentName}, em que posso te ajudar?`, icon: "👋" },
    { id: "greeting", label: "Saudação com horário", preview: `Olá, ${getGreeting()}! Bem-vindo(a) à ${companyName}! Meu nome é ${agentName}, em que posso te ajudar?`, icon: "🕐", badge: "Dinâmico" },
    { id: "custom", label: "Escrever minha mensagem", preview: null, icon: "✏️" },
  ];

  const getSelectedMessage = () => {
    if (selected === "custom") return customMsg;
    return options.find(o => o.id === selected)?.preview || "";
  };

  const handleActivate = () => {
    const msg = getSelectedMessage();
    if (!msg) return;
    updateData({ greetingMsg: msg });
    setActivated(true);
    setTimeout(() => nextStep(), 1500);
  };

  return (
    <div className="py-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 text-center">Sua primeira automação</h2>
      <p className="text-sm text-brand-textMuted mb-7 text-center">Configure uma mensagem de boas-vindas automática.</p>

      <div className="max-w-[500px] mx-auto">
        <div className="flex flex-col gap-2.5 mb-5">
          {options.map((opt) => {
            const isSelected = selected === opt.id;
            return (
              <div 
                key={opt.id} 
                id={`card-chatbot-${opt.id}`}
                onClick={() => setSelected(opt.id as any)} 
                className={`p-4 rounded-2xl cursor-pointer transition-all duration-200
                  ${isSelected ? 'bg-brand-greenLight border-[2.5px] border-brand-green shadow-sm' : 'bg-white border-2 border-[#E2EDE7]'}
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[22px]">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-brand-greenDark">{opt.label}</span>
                      {opt.badge && <span className="text-[10px] px-2 py-0.5 rounded-[10px] bg-brand-pastelBlueLt text-brand-pastelBlue font-semibold">{opt.badge}</span>}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                     ${isSelected ? 'border-brand-green bg-brand-green' : 'border-[#D5DED9] bg-transparent'}
                  `}>
                    {isSelected && <span className="text-white text-[11px] font-bold">✓</span>}
                  </div>
                </div>
                
                {isSelected && (opt.id !== 'custom' ? (
                  <div className="mt-2 ml-9 p-3 rounded-[4px_14px_14px_14px] bg-white border-[1.5px] border-[#E2EDE7] border-l-[3px] border-l-brand-green animate-slide-up">
                    <div className="text-[10px] text-brand-green font-semibold mb-1">🤖 ChatGuru Bot</div>
                    <div className="text-[13px] text-brand-text leading-snug">{opt.preview}</div>
                  </div>
                ) : (
                  <div className="mt-2 ml-9 animate-slide-up">
                    <textarea 
                      id="input-chatbot-custom"
                      value={customMsg}
                      onChange={(e) => setCustomMsg(e.target.value)}
                      placeholder={`Ex: Olá! Que bom ter você aqui na ${companyName}.`}
                      className="w-full h-20 p-3 text-[13px] text-brand-greenDark bg-white border-2 border-[#E2EDE7] rounded-xl outline-none resize-none focus:border-brand-green"
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {!activated ? (
          <div className="text-center">
            <Button id="btn-chatbot-activate" onClick={handleActivate} disabled={!selected || (selected === 'custom' && !customMsg.trim())}>
              🤖 Ativar chatbot de boas-vindas →
            </Button>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-brand-greenLight border-2 border-brand-green">
              <span className="text-2xl">✅</span>
              <div className="text-left">
                <div className="text-sm font-bold text-brand-greenDark">Chatbot ativado com sucesso!</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
