import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../../types';
import { VisualRulesWidget } from '../academy/VisualRulesWidget';
import { JargonWidget } from '../academy/JargonWidget';
import { BasicDrillsWidget } from '../academy/BasicDrillsWidget';
import { GearGuideWidget } from '../academy/GearGuideWidget';
import { playBeep } from '../../utils/audioFeedback';

interface AcademyScreenProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  initialTab?: 'rules' | 'jargon' | 'fundamentals' | 'gear';
}

type AcademyTab = 'rules' | 'jargon' | 'fundamentals' | 'gear';

export const AcademyScreen: React.FC<AcademyScreenProps> = ({
  currentUser,
  onNavigate,
  initialTab = 'rules'
}) => {
  const [activeTab, setActiveTab] = useState<AcademyTab>(initialTab);

  const tabs = [
    {
      id: 'rules' as AcademyTab,
      label: 'Rule Breakdowns',
      icon: 'gavel',
      badge: 'LBW & DLS',
      desc: 'Animated explanations of complex rules'
    },
    {
      id: 'jargon' as AcademyTab,
      label: 'Jargon Translator',
      icon: 'translate',
      badge: '360° Radar',
      desc: 'Decode cricket terms & field coordinates'
    },
    {
      id: 'fundamentals' as AcademyTab,
      label: 'Basic Drills',
      icon: 'school',
      badge: 'Video & Pose',
      desc: 'Fundamental mechanics & still head tutorials'
    },
    {
      id: 'gear' as AcademyTab,
      label: 'Gear Guides',
      icon: 'shield',
      badge: 'Sizer & Safety',
      desc: 'Bat sizing calculator & BS 7928 helmets'
    }
  ];

  const handleTabClick = (tabId: AcademyTab) => {
    playBeep(700, 0.05);
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen pt-20 pb-28 px-4 max-w-7xl mx-auto flex flex-col gap-6">
      {/* Academy Header Banner */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1c260f] via-[#141a0b] to-[#1e1e1e] border border-[#c3f400]/30 shadow-2xl overflow-hidden flex flex-col justify-between">
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#c3f400]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#c3f400] text-[#161e00] tracking-wider uppercase shadow-md">
                PITCHPRECISION ACADEMY
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">Cricket Knowledge & Mechanics Hub</span>
            </div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-white tracking-tight">
              Master the Rules, Terms, Mechanics & Gear
            </h1>
            <p className="text-xs sm:text-sm text-[#c4c9ac] mt-1.5 max-w-2xl leading-relaxed">
              Explore interactive Hawk-Eye rule simulators, decode field terminology with a 360° radar, master head-stillness fundamentals, and calculate your custom gear specs.
            </p>
          </div>

          <button
            onClick={() => {
              playBeep(850, 0.08);
              onNavigate('record');
            }}
            className="self-start sm:self-center px-4 py-3 rounded-2xl bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-headline font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            <span>Live Practice HUD</span>
          </button>
        </div>

        {/* 4 Feature Module Navigation Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 relative z-10">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.25)] scale-[1.02]'
                    : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-white/30 text-white hover:bg-black/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#161e00] text-[#c3f400]' : 'bg-white/10 text-[#c3f400]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      isActive ? 'bg-[#161e00]/20 text-[#161e00]' : 'bg-white/10 text-[#c4c9ac]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-xs sm:text-sm leading-tight">
                    {tab.label}
                  </h3>
                  <p
                    className={`text-[10px] mt-0.5 line-clamp-1 ${
                      isActive ? 'text-[#161e00]/80 font-medium' : 'text-[#c4c9ac]'
                    }`}
                  >
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Content Rendering */}
      <div className="animate-fadeIn">
        {activeTab === 'rules' && <VisualRulesWidget />}
        {activeTab === 'jargon' && <JargonWidget />}
        {activeTab === 'fundamentals' && <BasicDrillsWidget onNavigate={onNavigate} />}
        {activeTab === 'gear' && <GearGuideWidget />}
      </div>
    </div>
  );
};
