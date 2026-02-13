import React from 'react';
import { STEPS } from '../constants';
import { useOnboarding } from '../context/OnboardingContext';

export const ProgressBar: React.FC = () => {
  const { currentStep } = useOnboarding();
  const idx = STEPS.findIndex((s) => s.id === currentStep);
  const pct = (idx / (STEPS.length - 1)) * 100;

  return (
    <div className="px-6 mb-1">
      <div className="flex justify-between mb-2.5">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div 
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300
              ${i < idx ? 'bg-brand-green border-transparent text-white' : ''}
              ${i === idx ? 'bg-white border-[2.5px] border-brand-green text-brand-green shadow-[0_0_0_4px_rgba(232,248,240,1)]' : ''}
              ${i > idx ? 'bg-brand-offWhite border-2 border-[#dce8e2] text-brand-textLight' : ''}
              `}
            >
              {i < idx ? "✓" : step.icon}
            </div>
            <span 
              className={`text-[9px] mt-1 hidden sm:block ${i === idx ? 'font-semibold text-brand-text' : 'font-normal text-brand-textLight'}`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="h-1 bg-[#E2EDE7] rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-greenMid to-brand-green rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
};
