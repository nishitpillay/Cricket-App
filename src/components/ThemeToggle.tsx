import React from 'react';
import { ThemeMode } from '../utils/themeManager';
import { playBeep } from '../utils/audioFeedback';

interface ThemeToggleProps {
  theme: ThemeMode;
  onToggle: (newTheme: ThemeMode) => void;
  variant?: 'pill' | 'compact';
  className?: string;
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  theme,
  onToggle,
  variant = 'pill',
  className = '',
  id
}) => {
  const isDay = theme === 'day';

  const handleToggle = (targetTheme?: ThemeMode) => {
    playBeep(isDay ? 520 : 680, 0.05);
    const next = targetTheme !== undefined ? targetTheme : (isDay ? 'night' : 'day');
    onToggle(next);
  };

  if (variant === 'compact') {
    return (
      <button
        id={id || 'day-night-toggle-compact'}
        onClick={() => handleToggle()}
        type="button"
        title={isDay ? 'Switch to Night Mode (Dark)' : 'Switch to Day Mode (Light)'}
        aria-label={isDay ? 'Switch to Night Mode' : 'Switch to Day Mode'}
        className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 active:scale-95 cursor-pointer ${
          isDay
            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 shadow-sm'
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
        } ${className}`}
      >
        <span
          className="material-symbols-outlined text-[20px] transition-transform duration-300 transform"
          style={{ transform: isDay ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {isDay ? 'light_mode' : 'dark_mode'}
        </span>
        <span className="sr-only">
          {isDay ? 'Day Mode Active (Click for Night)' : 'Night Mode Active (Click for Day)'}
        </span>
      </button>
    );
  }

  // Segmented Pill Variant (Perfect for Home Screen top-right)
  return (
    <div
      id={id || 'day-night-toggle-pill'}
      role="radiogroup"
      aria-label="Day and Night mode toggle"
      className={`inline-flex items-center p-1 rounded-full border transition-all duration-300 shadow-sm ${
        isDay
          ? 'bg-slate-200/90 border-slate-300/80 text-slate-700'
          : 'bg-[#1e1d1d] border-white/10 text-[#c4c9ac]'
      } ${className}`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={isDay}
        onClick={() => {
          if (!isDay) handleToggle('day');
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
          isDay
            ? 'bg-white text-amber-950 font-bold shadow-md ring-1 ring-black/5'
            : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
        }`}
      >
        <span className={`material-symbols-outlined text-[16px] ${isDay ? 'text-amber-500 fill-1' : ''}`}>
          light_mode
        </span>
        <span>Day</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={!isDay}
        onClick={() => {
          if (isDay) handleToggle('night');
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
          !isDay
            ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_12px_rgba(195,244,0,0.35)]'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300/50'
        }`}
      >
        <span className={`material-symbols-outlined text-[16px] ${!isDay ? 'text-[#161e00]' : ''}`}>
          dark_mode
        </span>
        <span>Night</span>
      </button>
    </div>
  );
};
