import React from 'react';
import { useApp } from '../../context/AppContext';
import { MascotAvatar } from './MascotAvatar';

interface MascotHelpButtonProps {
  compact?: boolean;
  className?: string;
  initialStep?: number;
}

export const MascotHelpButton: React.FC<MascotHelpButtonProps> = ({
  compact = false,
  className = '',
  initialStep = 0,
}) => {
  const { openMascotTour } = useApp();

  return (
    <button
      type="button"
      onClick={() => openMascotTour(initialStep)}
      className={`relative group flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-orange-500/40 bg-gradient-to-r from-orange-950/40 to-slate-900/80 hover:from-orange-900/50 hover:to-slate-850 hover:border-orange-500/70 transition shadow-sm shadow-orange-950/30 cursor-pointer active:scale-95 shrink-0 ${className}`}
      title="راهنمای هوشمند برنامه (ممد)"
    >
      <MascotAvatar size="xs" showBadge={false} />

      {!compact && (
        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-bold text-orange-300 group-hover:text-orange-200 block leading-tight">
            راهنمای ممد
          </span>
          <span className="text-[9px] text-slate-400 block leading-none">
            ممد مربی شما
          </span>
        </div>
      )}

      {/* Pulsing indicator dot */}
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-orange-500 ring-2 ring-slate-900 animate-pulse" />
    </button>
  );
};
