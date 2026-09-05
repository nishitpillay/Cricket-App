import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface WorkScreenProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onOpenGuardianPortal?: () => void;
}

type WorkspaceCategory = 'all' | 'player' | 'coach' | 'parent' | 'admin';

export const WorkScreen: React.FC<WorkScreenProps> = ({ currentUser, onNavigate, onOpenGuardianPortal }) => {
  const [activeTab, setActiveTab] = useState<WorkspaceCategory>('all');

  const tools = [
    // Player Journey Tools
    {
      id: 'record',
      label: 'Live AI Camera',
      category: 'player',
      journeyBadge: 'Player',
      icon: 'videocam',
      color: 'text-[#c3f400]',
      desc: 'Real-time pitch map, release trajectory & ball speed'
    },
    {
      id: 'video-analysis',
      label: 'Motion Lab & Biomechanics',
      category: 'player',
      journeyBadge: 'Player / Coach',
      icon: 'slow_motion_video',
      color: 'text-blue-400',
      desc: 'Slow-motion stepper, joint angle calibration & side-by-side'
    },
    {
      id: 'drills-vault',
      label: 'Smart Drills Vault',
      category: 'player',
      journeyBadge: 'Player',
      icon: 'fitness_center',
      color: 'text-emerald-400',
      desc: 'Categorized practice routines for pace, seam & spin'
    },
    {
      id: 'stats',
      label: 'Stats & Wagon Wheel',
      category: 'player',
      journeyBadge: 'Player',
      icon: 'radar',
      color: 'text-amber-400',
      desc: 'Bowling heatmaps, pitch lengths & batting wagon wheels'
    },

    // Coach Journey Tools
    {
      id: 'feedback',
      label: 'Coach Feedback & Audio',
      category: 'coach',
      journeyBadge: 'Coach',
      icon: 'mic',
      color: 'text-cyan-400',
      desc: 'Record voice feedback notes, review logs & dispatch drills'
    },
    {
      id: 'chalkboard',
      label: 'Tactics Chalkboard',
      category: 'coach',
      journeyBadge: 'Coach',
      icon: 'gesture',
      color: 'text-yellow-400',
      desc: 'Interactive field placement board & set-piece designer'
    },
    {
      id: 'planner',
      label: 'Training Planner & Schedule',
      category: 'coach',
      journeyBadge: 'Coach / Player',
      icon: 'calendar_month',
      color: 'text-teal-400',
      desc: 'Weekly squad calendar, session dispatch & load tracking'
    },
    {
      id: 'masterclasses',
      label: 'Tactical Masterclasses',
      category: 'coach',
      journeyBadge: 'Coach / Player',
      icon: 'school',
      color: 'text-indigo-400',
      desc: 'Pro insights from Brett Lee, Ashwin & elite directors'
    },

    // Parent Journey Tools
    {
      id: 'guardian-portal',
      label: 'Guardian Safety Portal',
      category: 'parent',
      journeyBadge: 'Parent',
      icon: 'family_restroom',
      color: 'text-green-400',
      desc: 'Supervision settings, verified consent & coach CC logs',
      action: () => onOpenGuardianPortal?.()
    },
    {
      id: 'scenarios',
      label: 'Scenario Match Practice',
      category: 'parent',
      journeyBadge: 'Parent / Player',
      icon: 'psychology',
      color: 'text-pink-400',
      desc: 'Match-pressure decision making & situational IQ drills'
    },

    // Admin Journey Tools
    {
      id: 'profiles',
      label: 'Roster & User Directory',
      category: 'admin',
      journeyBadge: 'Admin',
      icon: 'badge',
      color: 'text-purple-400',
      desc: 'Senior, Junior, Premiere rosters & coach allocations'
    },
    {
      id: 'privacy-governance',
      label: 'Safeguarding & Governance',
      category: 'admin',
      journeyBadge: 'Admin',
      icon: 'shield',
      color: 'text-red-400',
      desc: 'Junior data guardrails, DBS compliance & audit logs'
    },
    {
      id: 'cloud-infrastructure',
      label: 'Security & Cloud Infra',
      category: 'admin',
      journeyBadge: 'Admin',
      icon: 'cloud_sync',
      color: 'text-orange-400',
      desc: 'MASVS validation, KMS key versions & hardware keystore'
    }
  ];

  const filteredTools = activeTab === 'all' ? tools : tools.filter((t) => t.category === activeTab);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5 w-full pb-28">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-headline font-black text-white tracking-tight">
            Workspace Dashboard
          </h2>
          <p className="text-[#c4c9ac] text-xs sm:text-sm">
            Core performance suites aligned across all 4 primary user journeys.
          </p>
        </div>

        {/* Journey Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          {(
            [
              { id: 'all', label: 'All Tools' },
              { id: 'player', label: 'Player' },
              { id: 'coach', label: 'Coach' },
              { id: 'parent', label: 'Parent' },
              { id: 'admin', label: 'Admin' }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playBeep(650, 0.03);
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#c3f400] text-[#111800] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              playBeep(750, 0.04);
              if (tool.action) {
                tool.action();
              } else {
                onNavigate(tool.id as ScreenType);
              }
            }}
            className="flex flex-col text-left p-4 bg-[#181818] hover:bg-[#202020] border border-white/10 hover:border-white/20 rounded-2xl transition-all cursor-pointer group shadow-md relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className={`material-symbols-outlined text-[26px] ${tool.color}`}>
                  {tool.icon}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-white/5 text-[#c4c9ac] uppercase">
                {tool.journeyBadge}
              </span>
            </div>
            <h3 className="text-white text-sm font-headline font-bold group-hover:text-[#c3f400] transition-colors">
              {tool.label}
            </h3>
            <p className="text-xs text-[#8e918f] mt-1 line-clamp-2">
              {tool.desc}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-[#c4c9ac] group-hover:text-white transition-colors">
              <span>Launch</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

