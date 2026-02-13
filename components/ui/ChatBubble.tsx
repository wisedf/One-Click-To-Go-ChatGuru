import React, { ReactNode } from 'react';

interface ChatBubbleProps {
  children: ReactNode;
  align?: 'left' | 'right';
  color?: string;
  borderColor?: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  children, 
  align = 'left', 
  color = '#E8F8F0', 
  borderColor = '#2DD4A0',
  className = ''
}) => {
  const roundedStyle = align === 'left' ? 'rounded-[4px_18px_18px_18px]' : 'rounded-[18px_4px_18px_18px]';
  const borderStyle = align === 'left' ? `border-l-[3px]` : `border-r-[3px]`;
  const alignSelf = align === 'left' ? 'self-start' : 'self-end';

  return (
    <div 
      className={`p-[14px_18px] max-w-[340px] relative ${roundedStyle} ${borderStyle} ${alignSelf} ${className}`}
      style={{ backgroundColor: color, borderColor: borderColor }}
    >
      {children}
    </div>
  );
};
