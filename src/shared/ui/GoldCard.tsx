
import React from 'react';

interface GoldCardProps {
  children: React.ReactNode;
  title?: string;
}

export const GoldCard: React.FC<GoldCardProps> = ({ children, title }) => {
  return (
    <div className="bg-[#F5F5DC] border border-[#C5A059] p-4 shadow-2xl rounded-sm">
      {title && (
        <h2 className="font-['Cormorant_Garamond'] text-3xl text-[#1a1a1a] mb-6 uppercase tracking-widest border-b border-[#C5A059]/30 pb-2 italic">
          {title}
        </h2>
      )}
      <div className="text-[#050505] font-serif leading-relaxed">
        {children}
      </div>
    </div>
  );
};
