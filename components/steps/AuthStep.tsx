
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../context/OnboardingContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChatBubble } from '../ui/ChatBubble';
import { authSchema } from '../../validators/schemas';
import { onboardingService } from '../../services/onboardingService';
import { decodeJwt } from '../../utils/jwt';

// Declaração para TypeScript reconhecer o objeto global do Google
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
        };
      };
    };
  }
}

// Client ID fornecido
const GOOGLE_CLIENT_ID = "17693720794-mg7711lmf9ka1ovu6smtk7bg2aceoh8o.apps.googleusercontent.com"; 

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

  // Inicializa o botão do Google
  useEffect(() => {
    if (!mode && window.google) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
          cancel_on_tap_outside: false
        });

        const btnContainer = document.getElementById("google-btn-container");
        if (btnContainer) {
          window.google.accounts.id.renderButton(
            btnContainer,
            { 
              theme: "outline", 
              size: "large", 
              width: "100%", // Preenche o container
              text: "continue_with",
              logo_alignment: "left"
            }
          );
        }
      } catch (e) {
        console.error("Erro ao inicializar Google Auth", e);
      }
    }
  }, [mode]);

  const handleGoogleCallback = (response: any) => {
    const token = response.credential;
    if (token) {
      const user = decodeJwt(token);
      if (user) {
        setMode("google");
        updateData({ 
          authMethod: "google", 
          name: user.name, 
          email: user.email 
        });
        setCaptchaChecked(false); // Reset para validação extra se necessário
      }
    }
  };

  const handleCaptcha = () => {
    setCaptchaLoading(true);
    setTimeout(() => { setCaptchaLoading(false); setCaptchaChecked(true); }, 1200);
  };

  const validateForm = () => {
    const result = authSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(err => {
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
          {/* Container para o botão oficial do Google */}
          <div id="google-btn-container" className="h-[46px] w-full"></div>
          
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

          {/* Captcha Security Check for Google Auth */}
          <div className={`mb-5 p-3.5 rounded-xl border-2 bg-brand-offWhite flex items-center justify-between ${!captchaChecked ? 'border-[#E2EDE7]' : 'border-brand-green/50'}`}>
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

          <Button onClick={nextStep} disabled={!captchaChecked}>Continuar →</Button>
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
