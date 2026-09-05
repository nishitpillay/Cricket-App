import React, { useState } from 'react';
import { ScreenType, UserProfile, CricketDiscipline } from '../../types';
import { RecordScreen } from './RecordScreen';
import { VideoAnalysisTool } from '../videoAnalysis/VideoAnalysisTool';
import { SecureMediaVault } from '../videoAnalysis/SecureMediaVault';
import { SideBySideComparisonView } from '../videoAnalysis/SideBySideComparisonView';
import { playBeep } from '../../utils/audioFeedback';

export type VideoSubTab = 'record' | 'upload' | 'analysis' | 'comparison';

interface VideoHubScreenProps {
  currentUser?: UserProfile;
  initialSubTab?: VideoSubTab;
  onNavigate: (screen: ScreenType) => void;
}

export const VideoHubScreen: React.FC<VideoHubScreenProps> = ({
  currentUser,
  initialSubTab = 'record',
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<VideoSubTab>(initialSubTab);
  const [activeDiscipline, setActiveDiscipline] = useState<CricketDiscipline>('bowling');

  const subTabs = [
    { id: 'record', label: 'Record', icon: 'videocam', badge: '120-240 FPS' },
    { id: 'upload', label: 'Upload & Vault', icon: 'cloud_upload', badge: 'Auto-Sliced' },
    { id: 'analysis', label: 'Analysis', icon: 'slow_motion_video', badge: 'Telemetry' },
    { id: 'comparison', label: 'Comparison', icon: 'compare', badge: 'Dual Sync' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#12140e] text-white animate-fadeIn pb-24">
      {/* Top Unified Video Hub Segment Control */}
      <div className="sticky top-0 z-30 bg-[#181a14]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c3f400] text-black flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="material-symbols-outlined text-[20px]">slow_motion_video</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-headline font-black text-white tracking-tight flex items-center gap-2">
                <span>Video Studio</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase tracking-wider hidden sm:inline-block">
                  Unified Lab
                </span>
              </h1>
              <p className="text-[11px] text-[#c4c9ac]">
                Live capture, media vault, frame-by-frame biomechanics &amp; dual synchronization
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
                  setActiveSubTab(tab.id as VideoSubTab);
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
        {/* 1. RECORD SCREEN */}
        {activeSubTab === 'record' && (
          <RecordScreen
            currentUser={currentUser}
            onNavigate={(screen) => {
              if (screen === 'video-analysis') {
                setActiveSubTab('analysis');
              } else {
                onNavigate(screen);
              }
            }}
          />
        )}

        {/* 2. UPLOAD & MEDIA VAULT */}
        {activeSubTab === 'upload' && (
          <div className="flex flex-col gap-6">
            <SecureMediaVault />
          </div>
        )}

        {/* 3. FRAME-BY-FRAME ANALYSIS */}
        {activeSubTab === 'analysis' && (
          <VideoAnalysisTool
            onNavigate={onNavigate}
            initialDiscipline={activeDiscipline}
          />
        )}

        {/* 4. COMPARISON / DUAL SYNC */}
        {activeSubTab === 'comparison' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-[#181a14] p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="font-headline font-bold text-base text-white">Dual Video Synchronizer</h3>
                <p className="text-xs text-[#c4c9ac]">
                  Side-by-side synchronized scrubbing, baseline overlay, and delta telemetry comparison
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {(['bowling', 'batting', 'fielding'] as CricketDiscipline[]).map(d => (
                  <button
                    key={d}
                    onClick={() => {
                      playBeep(700, 0.04);
                      setActiveDiscipline(d);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      activeDiscipline === d
                        ? 'bg-[#c3f400] text-black shadow-sm'
                        : 'bg-white/5 text-[#c4c9ac] hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <SideBySideComparisonView
              discipline={activeDiscipline}
              onNavigate={onNavigate}
            />
          </div>
        )}
      </div>
    </div>
  );
};
