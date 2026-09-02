import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'sm', showText = false }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeMap[size]} rounded-lg bg-[#201f1f] border border-[#c3f400]/40 flex items-center justify-center p-1.5 relative overflow-hidden shadow-[0_0_12px_rgba(195,244,0,0.2)] group`}>
        {/* Glowing bat and waveform SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#c3f400] transition-transform duration-300 group-hover:scale-105" fill="none">
          {/* Outer Rounded Frame */}
          <rect x="10" y="10" width="80" height="80" rx="14" stroke="#c3f400" strokeWidth="6" className="opacity-90" />
          {/* Angled Bat */}
          <path d="M68 22 L76 30 L42 74 L30 74 L30 62 Z" fill="#ffffff" />
          <path d="M72 18 L80 26 L76 30 L68 22 Z" fill="#c3f400" stroke="#c3f400" strokeWidth="2" />
          {/* Pulse ECG Line */}
          <path d="M10 50 L32 50 L38 32 L46 68 L54 44 L60 56 L72 56 L88 50" stroke="#c3f400" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          {/* Cricket Ball */}
          <circle cx="76" cy="62" r="7" fill="#c3f400" />
          <path d="M72 62 Q76 58 80 62" stroke="#131313" strokeWidth="1.5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-headline font-extrabold text-sm tracking-tight text-white uppercase leading-none">
            Pitch <span className="text-[#c3f400]">Precision</span>
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#c4c9ac] font-medium leading-tight">
            Pulse Analytics
          </span>
        </div>
      )}
    </div>
  );
};
