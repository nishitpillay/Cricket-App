import React from 'react';
import { ScreenType } from '../../types';

interface WorkScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const WorkScreen: React.FC<WorkScreenProps> = ({ onNavigate }) => {
  const tools = [
    { id: 'video-analysis', label: 'Motion Lab', icon: 'slow_motion_video', color: 'text-blue-400' },
    { id: 'record', label: 'Live Record', icon: 'videocam', color: 'text-red-400' },
    { id: 'drills-vault', label: 'Drills Vault', icon: 'fitness_center', color: 'text-emerald-400' },
    { id: 'scenarios', label: 'Tactics & Scenarios', icon: 'psychology', color: 'text-purple-400' },
    { id: 'stats', label: 'Stats & Wagon', icon: 'radar', color: 'text-amber-400' },
    { id: 'planner', label: 'Training Planner', icon: 'calendar_month', color: 'text-[#c3f400]' },
    { id: 'venues', label: 'Grounds & Nets Map', icon: 'stadium', color: 'text-cyan-400' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 w-full">
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-headline font-bold text-white mb-1">Workspace Dashboard</h2>
        <p className="text-[#c4c9ac] text-xs sm:text-sm">Access your core performance tools and analytics.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id as ScreenType)}
            className="flex flex-col items-center justify-center p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all cursor-pointer group"
          >
            <span className={`material-symbols-outlined text-[36px] mb-3 transition-transform group-hover:scale-110 ${tool.color}`}>
              {tool.icon}
            </span>
            <span className="text-white text-xs font-bold tracking-wider uppercase text-center">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
