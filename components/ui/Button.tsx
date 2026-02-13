import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'small';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = "font-sans transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "mt-6 px-9 py-3.5 text-[15px] font-semibold text-white bg-gradient-to-br from-brand-greenMid to-brand-green rounded-xl shadow-lg shadow-brand-green/30 hover:brightness-105 active:translate-y-0",
    outline: "px-5 py-3 text-sm font-semibold text-brand-greenDark bg-white border-2 border-[#E2EDE7] rounded-xl hover:bg-gray-50",
    ghost: "bg-transparent text-xs text-brand-textLight hover:text-brand-greenMid underline",
    small: "px-4 py-2 text-[13px] font-semibold rounded-[10px]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props} 
    />
  );
};
