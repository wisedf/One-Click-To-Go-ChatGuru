
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { OnboardingData, OnboardingContextType, StepId } from '../types';
import { STEPS } from '../constants';

const STORAGE_KEY = 'chatguru_onboarding_state';

const defaultData: OnboardingData = {
  name: "",
  email: "",
  phone: "",
  companyName: null,
  plan: null,
  niche: null,
  authMethod: null,
  greetingMsg: null,
  channel: null,
  hasWebNumber: false
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setStepState] = useState<StepId>("welcome");
  const [data, setData] = useState<OnboardingData>(defaultData);
  const [isRestored, setIsRestored] = useState(false);

  // RF-04: Retomada do onboarding
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.data) setData(parsed.data);
        if (parsed.step) setStepState(parsed.step);
      } catch (e) {
        console.error("Erro ao restaurar estado", e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsRestored(true);
  }, []);

  // Persistência automática
  useEffect(() => {
    if (isRestored) {
      // Não salvar dados sensíveis em produção (RNF-04), aqui salvamos simplificado para demo
      const safeData = { ...data }; 
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: safeData,
        step: currentStep
      }));
    }
  }, [data, currentStep, isRestored]);

  const setStep = (step: StepId) => {
    setStepState(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].id);
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      setStep(STEPS[idx - 1].id);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(defaultData);
    setStepState("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isRestored) return null; // Evita flash de conteúdo antes de restaurar

  return (
    <OnboardingContext.Provider value={{ currentStep, data, setStep, updateData, nextStep, prevStep, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
