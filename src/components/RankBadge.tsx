import React from 'react';

export type RankType = 'FOUNDER' | 'HEIR' | 'POSTULANT';

interface RankBadgeProps {
  rank: RankType;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, className = '' }) => {
  const getRankStyle = () => {
    switch (rank) {
      case 'FOUNDER':
        return 'bg-gradient-to-r from-[#D4AF37] via-[#FFF3BA] to-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.6)] animate-shimmer-bg bg-[length:200%_auto]';
      case 'HEIR':
        return 'bg-gradient-to-r from-[#B0B0B0] via-[#E8E8E8] to-[#B0B0B0] text-black shadow-[0_0_10px_rgba(176,176,176,0.4)] animate-shimmer-bg bg-[length:200%_auto]';
      case 'POSTULANT':
        return 'bg-[#8C7853] text-[#EFEBE4] border border-[#A69370] opacity-90';
      default:
        return 'bg-stone-500 text-white';
    }
  };

  const getRankLabel = () => {
    switch (rank) {
       case 'FOUNDER': return 'Fundador';
       case 'HEIR': return 'Heredero';
       case 'POSTULANT': return 'Postulante';
       default: return 'Miembro';
    }
  }

  return (
    <span 
      className={`inline-block px-3 py-1 text-[8px] tracking-[0.4em] uppercase font-bold rounded-sm ${getRankStyle()} ${className}`}
    >
      {getRankLabel()}
    </span>
  );
};
