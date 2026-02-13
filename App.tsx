import React from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { ProgressBar } from './components/ProgressBar';
import { Logo } from './components/Logo';
import { WelcomeStep } from './components/steps/WelcomeStep';
import { AuthStep } from './components/steps/AuthStep';
import { VerifyStep } from './components/steps/VerifyStep';
import { PlanStep } from './components/steps/PlanStep';
import { NicheStep } from './components/steps/NicheStep';
import { ChannelConnectStep } from './components/steps/ChannelConnectStep';
import { ChatbotStep } from './components/steps/ChatbotStep';
import { CockpitStep } from './components/steps/CockpitStep';
import { LiveStep } from './components/steps/LiveStep';

const WizardContent: React.FC = () => {
  const { currentStep, prevStep, data } = useOnboarding();
  const isLive = currentStep === "live";
  const showBack = currentStep !== "welcome" && !isLive;

  const renderStep = () => {
    switch (currentStep) {
      case "welcome": return <WelcomeStep />;
      case "auth": return <AuthStep />;
      case "verify": return <VerifyStep />;
      case "plan": return <PlanStep />;
      case "niche": return <NicheStep />;
      case "channel": // Fallthrough
      case "connect": return <ChannelConnectStep />;
      case "chatbot": return <ChatbotStep />;
      case "cockpit": return <CockpitStep />;
      case "live": return <LiveStep />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen font-sans text-brand-text overflow-auto ${isLive ? 'bg-white' : 'bg-brand-offWhite'}`}>
      {!isLive && (
        <div className="px-6 py-3.5 bg-white border-b-[1.5px] border-[#E2EDE7] flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3.5">
            <Logo size={34} />
            <span className="hidden sm:inline-block text-[10px] px-2.5 py-0.5 rounded-full bg-brand-greenLight text-brand-greenDark font-semibold tracking-wide">
              ONE CLICK TO GO
            </span>
          </div>
          {data.name && currentStep !== "welcome" && (
            <div className="text-[13px] text-brand-textMuted font-medium truncate max-w-[120px] sm:max-w-none">{data.name}</div>
          )}
        </div>
      )}

      {!isLive && currentStep !== "welcome" && (
        <div className="pt-4 pb-2 bg-white border-b border-[#EEF3F0]">
          <ProgressBar />
        </div>
      )}

      <div className={isLive ? "" : "max-w-[800px] mx-auto px-5 py-3 pb-10"}>
        {/* Main Content Area */}
        
        {/* Prominent Back Button */}
        {showBack && (
          <div className="mb-2">
            <button 
              onClick={prevStep}
              className="group flex items-center gap-1.5 text-xs font-semibold text-brand-textMuted hover:text-brand-greenDark transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100 w-fit"
            >
              <span className="text-sm transition-transform group-hover:-translate-x-0.5">←</span> Voltar
            </button>
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <OnboardingProvider>
      <WizardContent />
    </OnboardingProvider>
  );
};

export default App;
