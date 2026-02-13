
export type StepId = 
  | "welcome" 
  | "auth" 
  | "verify" 
  | "plan" 
  | "niche" 
  | "channel" 
  | "connect" 
  | "chatbot" 
  | "cockpit" 
  | "live";

export interface StepConfig {
  id: StepId;
  label: string;
  icon: string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight: boolean;
  theme: 'blue' | 'green' | 'sand';
}

export interface Niche {
  id: string;
  icon: string;
  name: string;
  desc: string;
}

export interface NicheConfig {
  tags: string[];
  queues: string[];
  auto_msgs: string;
}

export interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  companyName: string | null;
  plan: string | null;
  niche: string | null;
  authMethod: 'google' | 'email' | null;
  greetingMsg: string | null;
  channel: 'web' | 'waba' | 'both' | null;
  hasWebNumber: boolean;
}

export interface OnboardingContextType {
  currentStep: StepId;
  data: OnboardingData;
  setStep: (step: StepId) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
}
