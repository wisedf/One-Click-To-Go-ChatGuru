import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full text-left mb-3">
      {label && (
        <label className="block text-xs font-semibold text-brand-textMuted mb-1.5 font-sans">
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          className={`w-full px-3.5 py-3 text-sm text-brand-greenDark bg-white border-2 rounded-[10px] outline-none transition-colors duration-200 font-sans placeholder-[#B5C4BC]
            ${error ? 'border-red-400' : 'border-[#E2EDE7] focus:border-brand-green focus:shadow-[0_0_0_3px_rgba(45,212,160,0.2)]'}
            ${className}`}
          {...props} 
        />
        {/* Slot for icons if needed later */}
      </div>
      {error && <div className="text-[11px] text-red-500 mt-1">{error}</div>}
    </div>
  );
};
