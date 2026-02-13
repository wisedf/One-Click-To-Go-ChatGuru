import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingData, OnboardingContextType, StepId } from '../types';
import { STEPS } from '../constants';

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
  const [currentStep, setStep] = useState<StepId>("welcome");
  const [data, setData] = useState<OnboardingData>(defaultData);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      setStep(STEPS[idx - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <OnboardingContext.Provider value={{ currentStep, data, setStep, updateData, nextStep, prevStep }}>
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
