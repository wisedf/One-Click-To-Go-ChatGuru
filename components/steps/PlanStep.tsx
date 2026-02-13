
import React from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { PLANS } from '../../constants';

export const PlanStep: React.FC = () => {
  const { nextStep, data, updateData } = useOnboarding();

  const THEME_COLORS: Record<string, { accent: string; accentLt: string }> = {
    blue: { accent: "#7BA3D4", accentLt: "#C8D9EE" },
    green: { accent: "#2DD4A0", accentLt: "#E8F8F0" },
    sand: { accent: "#C9B77D", accentLt: "#EDE5CC" },
  };

  return (
    <div className="py-4 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 font-sans">Escolha seu plano</h2>
      <p className="text-sm text-brand-textMuted mb-7">Apenas escolha — você não paga nada agora</p>

      {/* Trial Banner */}
      <div className="max-w-[560px] mx-auto mb-6 p-5 rounded-[18px] bg-gradient-to-br from-brand-greenLight to-[#d4f5e9] border-2 border-brand-green relative overflow-hidden text-left">
        <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-brand-green/10 blur-xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-[52px] h-[52px] rounded-2xl flex-shrink-0 bg-white shadow-[0_2px_12px_rgba(45,212,160,0.25)] flex items-center justify-center text-2xl">🎉</div>
          <div>
            <div className="text-[17px] font-extrabold text-brand-greenDark leading-tight">7 dias grátis para testar tudo</div>
            <div className="text-[13px] text-brand-textMuted mt-1 leading-snug">
              Teste o plano completo sem compromisso. <strong className="text-brand-greenDark">Nenhum pagamento será cobrado</strong> durante o período de teste.
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {[
            { icon: "🚫", text: "Sem cartão de crédito" },
            { icon: "🚫", text: "Sem dados de pagamento" },
            { icon: "✅", text: "Cancele quando quiser" },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] bg-white/70 text-[11px] font-semibold text-brand-greenDark">
              <span>{b.icon}</span>{b.text}
            </div>
          ))}
        </div>
      </div>

      {/* Info callout */}
      <div className="max-w-[560px] mx-auto mb-5 p-2.5 px-4 rounded-xl bg-brand-offWhite border-[1.5px] border-[#E2EDE7] flex items-center gap-2.5 text-left">
        <span className="text-base">ℹ️</span>
        <div className="text-xs text-brand-textMuted leading-relaxed">
          Escolha abaixo o plano que deseja utilizar <strong className="text-brand-greenDark">após o teste grátis</strong>. Você poderá trocar de plano a qualquer momento. A cobrança só acontece depois dos 7 dias, se decidir continuar.
        </div>
      </div>

      <div className="flex flex-wrap gap-3.5 justify-center max-w-[740px] mx-auto">
        {PLANS.map((plan) => {
          const theme = THEME_COLORS[plan.theme];
          const isSelected = data.plan === plan.id;
          
          return (
            <div 
              key={plan.id}
              id={`card-plan-${plan.id}`}
              onClick={() => updateData({ plan: plan.id })}
              className={`flex-1 min-w-[210px] max-w-[235px] p-5 rounded-[18px] cursor-pointer text-left transition-all duration-300 relative overflow-hidden
                ${isSelected ? '' : 'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)] border-2 border-[#E2EDE7]'}
              `}
              style={{ 
                backgroundColor: isSelected ? theme.accentLt : '#FFFFFF',
                borderColor: isSelected ? theme.accent : '#E2EDE7',
                borderWidth: isSelected ? '2.5px' : '2px',
                boxShadow: isSelected ? `0 4px 20px ${theme.accent}22` : undefined
              }}
            >
              {plan.highlight && (
                <div className="absolute top-3.5 -right-6 bg-brand-green text-white text-[9px] font-bold py-1 px-8 rotate-45">POPULAR</div>
              )}
              <div className="text-[13px] font-bold mb-2" style={{ color: theme.accent }}>{plan.name}</div>
              <div className="flex items-baseline gap-1 mb-1">
                 <span className="text-[12px] text-brand-textLight line-through mr-1">{plan.price}</span>
              </div>
              <div className="flex items-baseline gap-1 mb-1">
                 <span className="text-[26px] font-extrabold text-brand-greenDark font-sans">R$ 0</span>
                 <span className="text-xs text-brand-textLight">por 7 dias</span>
              </div>
              <div className="text-[10px] text-brand-textMuted mb-3.5">Depois {plan.price}{plan.period}</div>
              
              {plan.features.map((f, i) => (
                <div key={i} className="text-[13px] text-brand-textMuted mb-1.5 flex items-center gap-2">
                  <span className="text-[8px]" style={{ color: theme.accent }}>●</span> {f}
                </div>
              ))}
              
              <button 
                className={`w-full mt-3.5 py-2 px-4 rounded-[10px] text-[13px] font-semibold transition-colors
                  ${isSelected ? 'text-white' : 'bg-[#F0F5F2] text-brand-textMuted'}
                `}
                style={{ backgroundColor: isSelected ? theme.accent : undefined }}
              >
                {isSelected ? "✓ Selecionado" : "Testar grátis"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Button id="btn-plan-continue" onClick={nextStep} disabled={!data.plan} className={!data.plan ? "opacity-40" : ""}>
          Começar teste grátis →
        </Button>

        {/* Payment methods reassurance */}
        <div className="max-w-[420px] mx-auto mt-3 p-2.5 px-4 rounded-xl bg-brand-offWhite border border-[#E2EDE7]">
          <div className="text-[11px] text-brand-textLight mb-1.5 font-semibold">
            Quando decidir continuar, aceitos:
          </div>
          <div className="flex justify-center flex-wrap gap-3">
            {[
              { icon: "🏦", label: "Boleto bancário" },
              { icon: "⚡", label: "Pix" },
              { icon: "💳", label: "Cartão de crédito" },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-1 text-[11px] text-brand-textMuted">
                <span>{m.icon}</span><span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
