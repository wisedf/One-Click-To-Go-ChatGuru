
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';

export const VerifyStep: React.FC = () => {
  const { nextStep, data, updateData } = useOnboarding();
  const [phone, setPhone] = useState(data.phone || "");
  const [company, setCompany] = useState(data.companyName || "");
  const [agreed, setAgreed] = useState(false);
  const isGoogle = data.authMethod === "google";

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "").substring(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`;
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    updateData({ phone: formatted });
  };

  const phoneDigits = phone.replace(/\D/g, "");
  
  // Validation Rules:
  // 1. Phone must have at least 10 digits (DDD + Number)
  // 2. Company name must be longer than 3 characters AND max 300
  // 3. Consent checkbox must be checked
  const canContinue = phoneDigits.length >= 10 && company.trim().length > 3 && company.length <= 300 && agreed;

  return (
    <div className="py-4 animate-fade-in">
      <div className="max-w-[440px] mx-auto">
        {/* Success Card */}
        <div className="text-center p-6 pb-5 rounded-[20px] mb-5 bg-gradient-to-br from-brand-greenLight to-[#d4f5e9] border-2 border-brand-green">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-lg font-bold text-brand-greenDark mb-1">Conta criada com sucesso!</div>
          <div className="text-[13px] text-brand-textMuted mb-4">Seus dados já estão verificados e seguros.</div>
          
          <div className="flex items-center gap-3 p-3.5 rounded-[14px] bg-white/85 text-left">
            <div className="w-11 h-11 rounded-full bg-brand-greenDark flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {(data.name || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-brand-greenDark truncate">{data.name || "—"}</div>
              <div className="text-xs text-brand-textMuted truncate">{data.email || "—"}</div>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border-[1.5px] border-brand-green flex-shrink-0">
               <span className="text-[11px] font-semibold text-brand-greenMid">Verificado</span>
               <span className="text-[11px] text-brand-green">✓</span>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="p-5 rounded-[18px] bg-white border-2 border-[#E2EDE7] animate-slide-up flex flex-col gap-4">
           
           {/* Company Name Input */}
           <div>
             <div className="flex items-start gap-3 mb-2">
               <div className="w-9 h-9 rounded-lg bg-brand-pastelBlueLt flex items-center justify-center text-base flex-shrink-0">🏢</div>
               <div>
                 <div className="text-[14px] font-bold text-brand-greenDark">Nome da empresa <span className="text-red-400">*</span></div>
                 <div className="text-[12px] text-brand-textMuted leading-tight">Como seus clientes conhecerão sua conta.</div>
               </div>
             </div>
             <input
              value={company}
              onChange={(e) => { setCompany(e.target.value); updateData({ companyName: e.target.value }); }}
              placeholder="Ex: Minha Loja, Consultório Dr..."
              maxLength={300}
              className="w-full py-3 px-4 text-sm font-medium rounded-xl outline-none transition-colors border-2 border-[#E2EDE7] focus:border-brand-greenMid"
             />
             <div className="flex justify-between items-center mt-1 ml-1">
               {company.length > 0 && company.length <= 3 && (
                 <div className="text-[10px] text-red-400">O nome deve ter mais de 3 caracteres.</div>
               )}
               <div className={`text-[10px] ml-auto ${company.length >= 300 ? 'text-red-400 font-bold' : 'text-gray-300'}`}>
                 {company.length}/300
               </div>
             </div>
           </div>

           <hr className="border-[#EEF3F0]" />

           {/* Phone Input - UPDATED */}
           <div>
             <div className="flex items-start gap-3 mb-2">
               <div className="w-9 h-9 rounded-lg bg-brand-greenLight flex items-center justify-center text-base flex-shrink-0">📱</div>
               <div>
                 <div className="text-[14px] font-bold text-brand-greenDark">WhatsApp para Contato <span className="text-red-400">*</span></div>
                 <div className="text-[12px] text-brand-textMuted leading-tight text-justify">
                   Usaremos este número <strong>somente</strong> caso sua conexão caia ou precisarmos falar com você sobre sua conta.
                 </div>
               </div>
             </div>

             <div className="relative">
               <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                 <span className="text-sm">🇧🇷</span>
                 <span className="text-[13px] font-medium text-brand-textMuted">+55</span>
                 <span className="text-[#E2EDE7]">|</span>
               </div>
               <input
                value={phone}
                onChange={handlePhone}
                placeholder="(83) 99999-9999"
                type="tel"
                className={`w-full py-3 pr-4 pl-[82px] text-base font-medium rounded-xl outline-none transition-colors
                  ${phoneDigits.length >= 10 ? 'border-2 border-brand-green' : 'border-2 border-[#E2EDE7] focus:border-brand-greenMid'}
                `}
               />
               {phoneDigits.length >= 10 && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base text-brand-green">✓</span>}
             </div>
           </div>

           {/* Consent - Mandatory */}
           <div 
            onClick={() => setAgreed(!agreed)}
            className={`flex items-start gap-2.5 p-2.5 rounded-[10px] cursor-pointer border-[1.5px] transition-all group
              ${agreed ? 'bg-brand-greenLight border-brand-green' : 'bg-brand-offWhite border-[#E2EDE7] hover:border-brand-greenMid'}
            `}
           >
             <div className={`w-5 h-5 rounded-[5px] flex-shrink-0 mt-px border-2 flex items-center justify-center transition-colors
               ${agreed ? 'border-brand-green bg-brand-green' : 'border-[#C5D0CA] bg-white group-hover:border-brand-greenMid'}
             `}>
               {agreed && <span className="text-white text-xs font-bold">✓</span>}
             </div>
             <span className="text-xs text-brand-textMuted leading-snug select-none">
               Aceito receber notificações importantes via WhatsApp sobre o status da minha conta. <span className="text-red-400 font-bold">*</span>
             </span>
           </div>
        </div>

        <div className="text-center mt-6">
          <Button onClick={nextStep} disabled={!canContinue} className="w-full max-w-[440px]">
            Continuar para escolher o plano →
          </Button>
        </div>
      </div>
    </div>
  );
};
