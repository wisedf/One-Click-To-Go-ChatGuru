import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <img 
      src="https://chatguru.com.br/wp-content/themes/chatguru-3/assets/img/logo.svg" 
      alt="ChatGuru" 
      style={{ height: size }}
      className="object-contain"
    />
  );
};
