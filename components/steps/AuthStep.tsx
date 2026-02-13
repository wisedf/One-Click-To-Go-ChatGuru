
import React, { useState } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatBubble } from '../ui/ChatBubble';
import { authSchema } from '../../validators/schemas';
import { onboardingService } from '../../services/onboardingService';

export const AuthStep: React.FC = () => {
  const { nextStep, data, updateData } = useOnboarding();
  const [mode, setMode] = useState<'google' | 'email' | null>(null);
  const [emailStep, setEmailStep] = useState<'form' | 'verify'>('form');
  
  // Local form state
  const [formData, setFormData] = useState({
    name: data.name || "",
    email: data.email || "",
    password: "",
    confirmPwd: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  const handleCaptcha = () => {
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  const validateForm = () => {
    const result = authSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmitForm = async () => {
    if (!validateForm() || !captchaChecked) return;
    
    setIsSubmitting(true);
    try {
      // Integração via Service (RF-03)
      const check = await onboardingService.checkEmailExists(formData.email);
      if (check.ok && check.data?.exists) {
        setErrors({ email: "Este e-mail já está cadastrado. Faça login." });
        return;
      }

      await onboardingService.sendVerificationCode(formData.email);
      
      updateData({ 
        name: formData.name, 
        email: formData.email, 
        authMethod: "email" 
      });
      setEmailStep("verify");
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    setMode("google");
    updateData({ authMethod: "google", name: "Fabrício Silva", email: "fabricio@empresa.com.br" });
  };

  const handleVerifyCode = async (val: string) => {
    const cleanVal = val.replace(/[^a-zA-Z0-9]/g, "").substring(0, 5);
    setVerifyCode(cleanVal);
    
    if (cleanVal.length === 5) {
      setIsSubmitting(true);
      const res = await onboardingService.verifyCode(formData.email, cleanVal);
      setIsSubmitting(false);
      
      if (res.ok) {
        setTimeout(() => nextStep(), 500);
      } else {
        alert(res.message || "Código inválido");
        setVerifyCode("");
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro ao digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="text-center py-4 animate-fade-in">
      <h2 className="text-2xl font-bold text-brand-greenDark mb-1.5 font-sans">Crie sua conta</h2>
      <p className="text-sm text-brand-textMuted mb-7 text-center">Escolha como quer começar</p>

      {!mode && (
        <div className="flex flex-col gap-3 max-w-[380px] mx-auto">
          <Button variant="outline" onClick={handleGoogleAuth} className="flex items-center justify-center gap-2.5 py-3.5">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continuar com Google
          </Button>
          <div className="flex items-center gap-3 my-0.5">
            <div className="flex-1 h-px bg-[#E2EDE7]"></div>
            <span className="text-xs text-brand-textLight">ou</span>
            <div className="flex-1 h-px bg-[#E2EDE7]"></div>
          </div>
          <Button variant="outline" onClick={() => setMode("email")} className="py-3.5">✉️ Continuar com e-mail</Button>
        </div>
      )}

      {mode === "google" && (
        <div className="max-w-[380px] mx-auto animate-fade-in">
          <ChatBubble color="#E8F8F0" borderColor="#2DD4A0" className="max-w-full text-left mb-5">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-11 h-11 rounded-full bg-brand-greenDark flex items-center justify-center text-lg font-bold text-white">
                {(data.name || "U")[0]}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-brand-greenDark">{data.name}</div>
                <div className="text-[13px] text-brand-textMuted">{data.email}</div>
              </div>
            </div>
            <div className="text-xs text-brand-greenMid font-semibold">✓ Autenticado com Google</div>
          </ChatBubble>
          <Button onClick={nextStep}>Continuar →</Button>
        </div>
      )}

      {mode === "email" && emailStep === "form" && (
        <div className="max-w-[400px] mx-auto text-left animate-slide-up">
          <Input 
            label="Nome completo" 
            placeholder="Seu nome" 
            value={formData.name} 
            onChange={(e) => handleChange("name", e.target.value)} 
            error={errors.name}
          />
          <Input 
            label="E-mail" 
            placeholder="seu@email.com" 
            type="email" 
            value={formData.email} 
            onChange={(e) => handleChange("email", e.target.value)} 
            error={errors.email}
          />
          <Input 
            label="Senha" 
            placeholder="Mínimo 8 caracteres" 
            type="password" 
            value={formData.password} 
            onChange={(e) => handleChange("password", e.target.value)} 
            error={errors.password}
          />
          <Input 
            label="Confirmar senha" 
            placeholder="Repita a senha" 
            type="password" 
            value={formData.confirmPwd} 
            onChange={(e) => handleChange("confirmPwd", e.target.value)}
            error={errors.confirmPwd}
          />

          {/* Captcha */}
          <div className={`mt-4 p-3.5 rounded-xl border-2 bg-brand-offWhite flex items-center justify-between ${!captchaChecked && errors.name ? 'border-red-200' : 'border-[#E2EDE7]'}`}>
            <div className="flex items-center gap-3">
              <div 
                onClick={!captchaChecked ? handleCaptcha : undefined} 
                className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-300
                  ${captchaChecked ? 'bg-brand-green border-brand-green cursor-default' : 'bg-white border-2 border-[#C5D0CA] cursor-pointer'}
                `}
              >
                 {captchaLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-[#C5D0CA] border-t-brand-green rounded-full animate-spin" />
                ) : captchaChecked ? (
                  <span className="text-white text-sm font-bold">✓</span>
                ) : null}
              </div>
              <span className="text-[13px] text-brand-text">Não sou um robô</span>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-brand-textLight">reCAPTCHA</div>
            </div>
          </div>

          <Button 
            onClick={handleSubmitForm} 
            disabled={isSubmitting} 
            className="w-full mt-4"
          >
            {isSubmitting ? "Processando..." : "Criar conta →"}
          </Button>
        </div>
      )}

      {mode === "email" && emailStep === "verify" && (
        <div className="max-w-[420px] mx-auto animate-fade-in">
          <div className="p-7 rounded-[18px] bg-white border-2 border-[#E2EDE7] shadow-sm text-center">
            <div className="text-4xl mb-3">📧</div>
            <div className="text-lg font-bold text-brand-greenDark mb-1.5">Confirme seu e-mail</div>
            <div className="text-[13px] text-brand-textMuted mb-1">Enviamos um código de 5 dígitos para:</div>
            <div className="text-sm font-bold text-brand-greenDark mb-5">{data.email}</div>

            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-12 h-14 rounded-xl border-[2.5px] flex items-center justify-center text-xl font-bold text-brand-greenDark font-sans transition-all
                  ${verifyCode[i] ? 'border-brand-green bg-brand-greenLight' : 'border-[#E2EDE7] bg-white'}
                `}>
                  {verifyCode[i] || ""}
                </div>
              ))}
            </div>
            <input
              value={verifyCode}
              onChange={(e) => handleVerifyCode(e.target.value)}
              placeholder="Ex: A3K9F"
              maxLength={5}
              className="w-full p-2.5 text-base text-center tracking-[4px] uppercase border-2 border-[#E2EDE7] rounded-[10px] outline-none font-semibold text-brand-greenDark focus:border-brand-green"
              autoFocus
              disabled={isSubmitting}
            />
            {isSubmitting && <div className="mt-2.5 text-[13px] text-brand-greenMid font-semibold animate-fade-in">Verificando...</div>}
            
            <div className="mt-5 pt-4 border-t border-[#EEF3F0]">
              <button className="bg-transparent border-none cursor-pointer text-brand-pastelBlue text-[13px] font-semibold underline hover:text-brand-pastelBlue/80">
                🔄 Reenviar código
              </button>
            </div>
            
            <div className="mt-4 p-3.5 rounded-xl bg-[#FFF8E1] border-2 border-[#FFD54F] text-left flex items-start gap-2.5">
               <span className="text-[22px] flex-shrink-0 -mt-0.5">⚠️</span>
               <div>
                  <div className="text-[13px] font-bold text-[#8D6E00] mb-1">Não recebeu o código?</div>
                  <div className="text-[13px] text-[#A68400] leading-snug">
                    <strong>Verifique sua caixa de SPAM ou Lixo Eletrônico.</strong>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
