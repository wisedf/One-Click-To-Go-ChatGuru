
import React, { Suspense, lazy } from 'react';
import { OnboardingProvider, useOnboarding } from './context/OnboardingContext';
import { ProgressBar } from './components/ProgressBar';
import { Logo } from './components/Logo';

// Lazy loading das etapas para reduzir bundle inicial (RNF-02)
const WelcomeStep = lazy(() => import('./components/steps/WelcomeStep').then(module => ({ default: module.WelcomeStep })));
const AuthStep = lazy(() => import('./components/steps/AuthStep').then(module => ({ default: module.AuthStep })));
const VerifyStep = lazy(() => import('./components/steps/VerifyStep').then(module => ({ default: module.VerifyStep })));
const PlanStep = lazy(() => import('./components/steps/PlanStep').then(module => ({ default: module.PlanStep })));
const NicheStep = lazy(() => import('./components/steps/NicheStep').then(module => ({ default: module.NicheStep })));
const ChannelConnectStep = lazy(() => import('./components/steps/ChannelConnectStep').then(module => ({ default: module.ChannelConnectStep })));
const ChatbotStep = lazy(() => import('./components/steps/ChatbotStep').then(module => ({ default: module.ChatbotStep })));
const CockpitStep = lazy(() => import('./components/steps/CockpitStep').then(module => ({ default: module.CockpitStep })));
const LiveStep = lazy(() => import('./components/steps/LiveStep').then(module => ({ default: module.LiveStep })));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="w-8 h-8 border-4 border-brand-greenLight border-t-brand-green rounded-full animate-spin"></div>
  </div>
);

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

        <Suspense fallback={<LoadingSpinner />}>
          {renderStep()}
        </Suspense>
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
