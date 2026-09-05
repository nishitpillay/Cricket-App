import React, { useState } from 'react';
import { ScreenType, UserProfile, DrillItem } from '../../types';
import { mockDrills } from '../../data/mockData';
import { SmartDrillsVault } from '../drills/SmartDrillsVault';
import { TrainingPlanner } from '../planner/TrainingPlanner';
import { DrillPracticeScreen } from './DrillPracticeScreen';
import { ScenarioTraining } from '../tactics/ScenarioTraining';
import { TacticalMasterclasses } from '../tactics/TacticalMasterclasses';
import { DigitalChalkboard } from '../chalkboard/DigitalChalkboard';
import { playBeep } from '../../utils/audioFeedback';

export type TrainSubTab = 'drills' | 'planner' | 'practice' | 'scenarios';

interface TrainHubScreenProps {
  currentUser?: UserProfile;
  initialSubTab?: TrainSubTab;
  selectedDrill?: DrillItem;
  onSelectDrill?: (drill: DrillItem) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const TrainHubScreen: React.FC<TrainHubScreenProps> = ({
  currentUser,
  initialSubTab = 'drills',
  selectedDrill: propSelectedDrill,
  onSelectDrill,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<TrainSubTab>(initialSubTab);
  const [activeScenarioMode, setActiveScenarioMode] = useState<'scenarios' | 'masterclasses' | 'chalkboard'>('scenarios');
  const [currentDrill, setCurrentDrill] = useState<DrillItem>(propSelectedDrill || mockDrills[0]);

  const handleSelectDrillInternal = (drill: DrillItem) => {
    setCurrentDrill(drill);
    if (onSelectDrill) onSelectDrill(drill);
  };

  const handleStartPractice = (drill: DrillItem) => {
    setCurrentDrill(drill);
    if (onSelectDrill) onSelectDrill(drill);
    setActiveSubTab('practice');
  };

  const subTabs = [
    { id: 'drills', label: 'Drills', icon: 'fitness_center', count: mockDrills.length },
    { id: 'planner', label: 'Training Plan', icon: 'calendar_month', count: 'Active' },
    { id: 'practice', label: 'Practice Sessions', icon: 'play_circle', count: currentDrill.title.split(' ')[0] },
    { id: 'scenarios', label: 'Scenario Training', icon: 'psychology', count: 'Match IQ' }
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#12140e] text-white animate-fadeIn pb-24">
      {/* Top Header & Unified Hub Segment Control */}
      <div className="sticky top-0 z-30 bg-[#181a14]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#c3f400] text-black flex items-center justify-center font-bold shadow-md shrink-0">
              <span className="material-symbols-outlined text-[20px]">fitness_center</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-headline font-black text-white tracking-tight flex items-center gap-2">
                <span>Training Hub</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase tracking-wider hidden sm:inline-block">
                  All-In-One Hub
                </span>
              </h1>
              <p className="text-[11px] text-[#c4c9ac]">
                Drills catalog, weekly planners, live practice reps &amp; tactical match scenarios
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
                  setActiveSubTab(tab.id as TrainSubTab);
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

        {/* Optional Secondary Tab for Scenario Sub-Modes */}
        {activeSubTab === 'scenarios' && (
          <div className="max-w-7xl mx-auto flex items-center gap-2 pt-2.5 mt-1 border-t border-white/5">
            <span className="text-[11px] text-[#c4c9ac] font-medium">Scenario Mode:</span>
            {[
              { id: 'scenarios', label: 'Match Scenarios', icon: 'psychology' },
              { id: 'masterclasses', label: 'Masterclasses', icon: 'school' },
              { id: 'chalkboard', label: 'Digital Chalkboard', icon: 'gesture' }
            ].map(subMode => (
              <button
                key={subMode.id}
                onClick={() => {
                  playBeep(700, 0.04);
                  setActiveScenarioMode(subMode.id as any);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  activeScenarioMode === subMode.id
                    ? 'bg-white/20 text-[#c3f400] border border-[#c3f400]/40'
                    : 'bg-white/5 text-[#c4c9ac] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{subMode.icon}</span>
                <span>{subMode.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content View Switcher */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* 1. DRILLS VAULT */}
        {activeSubTab === 'drills' && (
          <SmartDrillsVault
            onNavigate={onNavigate}
            onSelectDrill={(drill) => {
              handleSelectDrillInternal(drill);
              handleStartPractice(drill);
            }}
          />
        )}

        {/* 2. TRAINING PLANNER */}
        {activeSubTab === 'planner' && (
          <TrainingPlanner onNavigate={onNavigate} />
        )}

        {/* 3. PRACTICE SESSIONS */}
        {activeSubTab === 'practice' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-[#181a14] p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#c3f400]">play_circle</span>
                <span className="text-xs font-bold text-white">Active Drill: {currentDrill.title}</span>
              </div>
              <button
                onClick={() => setActiveSubTab('drills')}
                className="text-xs text-[#c3f400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                <span>Change Drill</span>
              </button>
            </div>

            <DrillPracticeScreen
              drill={currentDrill}
              onBack={() => setActiveSubTab('drills')}
              onFinish={() => {
                playBeep(900, 0.08);
                onNavigate('progress');
              }}
            />
          </div>
        )}

        {/* 4. SCENARIO TRAINING */}
        {activeSubTab === 'scenarios' && (
          <>
            {activeScenarioMode === 'scenarios' && (
              <ScenarioTraining
                onNavigate={onNavigate}
                onOpenChalkboard={() => setActiveScenarioMode('chalkboard')}
              />
            )}

            {activeScenarioMode === 'masterclasses' && (
              <TacticalMasterclasses
                onNavigate={onNavigate}
                onOpenScenario={() => setActiveScenarioMode('scenarios')}
              />
            )}

            {activeScenarioMode === 'chalkboard' && (
              <DigitalChalkboard onNavigate={onNavigate} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
