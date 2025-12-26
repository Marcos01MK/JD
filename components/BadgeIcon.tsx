import React from 'react';
import { Badge } from '../types';

interface BadgeIconProps {
  badge: Badge;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({ badge, size = 'md', showTooltip = true }) => {
  const isUrl = badge.icon.startsWith('http');
  
  const sizeClasses = {
    xs: 'w-4 h-4 text-[10px]',
    sm: 'w-5 h-5 text-xs',
    md: 'w-7 h-7 text-sm',
    lg: 'w-10 h-10 text-lg'
  };

  return (
    <div 
      className={`group relative flex items-center justify-center rounded-full border border-slate-700/50 overflow-hidden bg-slate-800 transition-all hover:scale-110 shadow-sm inline-flex align-middle shrink-0 ${sizeClasses[size]}`}
      title={showTooltip ? `${badge.name}: ${badge.description}` : ''}
    >
      {isUrl ? (
        <img src={badge.icon} alt={badge.name} className="w-full h-full object-cover" />
      ) : (
        <span role="img" aria-label={badge.name} className="flex items-center justify-center">{badge.icon}</span>
      )}
      
      {showTooltip && (
        <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 animate-bounce-short">
          <div className="bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-2xl whitespace-nowrap border border-slate-700 font-bold">
            <span style={{ color: badge.color }}>●</span> {badge.name}
          </div>
        </div>
      )}
    </div>
  );
};
