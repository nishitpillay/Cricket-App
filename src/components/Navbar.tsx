import React from 'react';
import { ScreenType } from '../types';

interface NavbarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { id: ScreenType; label: string; icon: string; aliases?: ScreenType[] }[] = [
    { id: 'home', label: 'HOME', icon: 'home' },
    {
      id: 'video-analysis',
      label: 'MOTION LAB',
      icon: 'slow_motion_video',
      aliases: ['record', 'video-analysis']
    },
    {
      id: 'drills-vault',
      label: 'VAULT',
      icon: 'fitness_center',
      aliases: ['drills', 'drills-vault', 'drill-details', 'drill-practice']
    },
    {
      id: 'scenarios',
      label: 'TACTICS',
      icon: 'psychology',
      aliases: ['scenarios', 'masterclasses', 'chalkboard', 'planner']
    },
    {
      id: 'stats',
      label: 'WAGON/STATS',
      icon: 'radar',
      aliases: ['stats']
    },
    {
      id: 'academy',
      label: 'ACADEMY',
      icon: 'school',
      aliases: ['academy', 'feedback']
    }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 glass pb-safe border-t border-[#c3f400]/15 backdrop-blur-2xl">
      <div className="h-16 max-w-xl mx-auto flex justify-around items-center px-1">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.aliases && item.aliases.includes(currentScreen));

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-14 sm:w-16 py-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#c3f400] font-bold scale-105'
                  : 'text-[#c4c9ac] hover:text-[#e5e2e1]'
              }`}
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[22px] transition-transform duration-200"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400"
                  }}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#c3f400] shadow-[0_0_8px_#c3f400]" />
                )}
              </div>
              <span className="text-[9px] tracking-wider uppercase leading-none font-medium whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
