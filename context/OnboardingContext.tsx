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
  const [currentStep, setStepState] = useState<StepId>("welcome");
  const [data, setData] = useState<OnboardingData>(defaultData);

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
    setData(defaultData);
    setStepState("welcome");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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