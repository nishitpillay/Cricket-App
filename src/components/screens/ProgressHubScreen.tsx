import React, { useState } from 'react';
import { ScreenType, UserProfile, DrillItem } from '../../types';
import { StatsScreen } from './StatsScreen';
import { PlayerDevelopmentPlanView } from '../pdp/PlayerDevelopmentPlanView';
import { FeedbackScreen } from './FeedbackScreen';
import { playBeep } from '../../utils/audioFeedback';

export type ProgressSubTab = 'goals' | 'statistics' | 'coach_feedback' | 'development_history';

interface ProgressHubScreenProps {
  currentUser?: UserProfile;
  initialSubTab?: ProgressSubTab;
  selectedDrill?: DrillItem;
  onNavigate: (screen: ScreenType) => void;
}

export const ProgressHubScreen: React.FC<ProgressHubScreenProps> = ({
  currentUser,
  initialSubTab = 'goals',
  selectedDrill,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ProgressSubTab>(initialSubTab);

  const subTabs = [
    { id: 'goals', label: 'Goals', icon: 'flag', badge: 'Active Milestones' },
    { id: 'statistics', label: 'Statistics', icon: 'radar', badge: 'Radar & Maps' },
    { id: 'coach_feedback', label: 'Coach Feedback', icon: 'record_voice_over', badge: 'Voice & Notes' },
    { id: 'development_history', label: 'Development History', icon: 'verified', badge: 'Before / After' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#12140e] text-white animate-fadeIn pb-24">
      {/* Top Unified Progress Hub Segment Control */}
      <div className="sticky top-0 z-30 bg-[#181a14]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c3f400] text-black flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-headline font-black text-white tracking-tight flex items-center gap-2">
                <span>Player Progress Hub</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase tracking-wider hidden sm:inline-block">
                  Unified Growth
                </span>
              </h1>
              <p className="text-[11px] text-[#c4c9ac]">
                Active goals, performance stats, coach voice notes &amp; verified development history
              </p>
            </div>
          </div>

          {/* Sub-Tab Navigation Bar */}
          <div className="flex items-center gap-1.5 bg-[#20241d] p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
            {subTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  playBeep(750, 0.04);
                  setActiveSubTab(tab.id as ProgressSubTab);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeSubTab === tab.id
                    ? 'bg-[#c3f400] text-black shadow-md'
                    : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content View Switcher */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* 1. GOALS & MILESTONES (PDP Goals View) */}
        {activeSubTab === 'goals' && (
          <PlayerDevelopmentPlanView
            currentUser={currentUser || ({} as any)}
            onNavigate={onNavigate}
          />
        )}

        {/* 2. STATISTICS & PERFORMANCE RADAR */}
        {activeSubTab === 'statistics' && (
          <StatsScreen
            currentUser={currentUser}
            onNavigate={onNavigate}
          />
        )}

        {/* 3. COACH FEEDBACK & AUDIO VOICE MEMOS */}
        {activeSubTab === 'coach_feedback' && (
          <FeedbackScreen
            currentUser={currentUser}
            drill={selectedDrill}
            onNavigate={onNavigate}
          />
        )}

        {/* 4. DEVELOPMENT HISTORY & BEFORE/AFTER EVIDENCE */}
        {activeSubTab === 'development_history' && (
          <PlayerDevelopmentPlanView
            currentUser={currentUser || ({} as any)}
            onNavigate={onNavigate}
          />
        )}
      </div>
    </div>
  );
};
