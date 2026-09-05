import React, { useState } from 'react';
import {
  UserProfile,
  ScreenType,
  PlayerDevelopmentPlan,
  ActiveGoal,
  CoachObservation,
  AssignedDrillPlan,
  PDPItemCategory
} from '../../types';
import { mockPlayerDevelopmentPlans } from '../../data/playerDevelopmentPlanData';
import { PDPGoalModal } from './PDPGoalModal';
import { PDPObservationModal } from './PDPObservationModal';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

interface PlayerDevelopmentPlanViewProps {
  currentUser: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drillId: string) => void;
}

type TabType = 'all' | 'strengths_growth' | 'goals_drills' | 'coach_feedback' | 'evidence_videos';

export const PlayerDevelopmentPlanView: React.FC<PlayerDevelopmentPlanViewProps> = ({
  currentUser,
  onNavigate,
  onSelectDrill
}) => {
  // Available plans map
  const [plans, setPlans] = useState<Record<string, PlayerDevelopmentPlan>>(mockPlayerDevelopmentPlans);
  
  // Select active player (default to matching current user or first in mock)
  const defaultPlayerId = plans[currentUser.id] ? currentUser.id : 'usr-devang';
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(defaultPlayerId);
  
  const currentPlan = plans[selectedPlayerId] || plans['usr-devang'];

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isObsModalOpen, setIsObsModalOpen] = useState(false);

  // Handle adding goal
  const handleAddGoal = (newGoal: ActiveGoal) => {
    setPlans(prev => {
      const p = prev[selectedPlayerId];
      if (!p) return prev;
      return {
        ...prev,
        [selectedPlayerId]: {
          ...p,
          activeGoals: [newGoal, ...p.activeGoals]
        }
      };
    });
  };

  // Handle adding observation
  const handleAddObservation = (newObs: CoachObservation) => {
    setPlans(prev => {
      const p = prev[selectedPlayerId];
      if (!p) return prev;
      return {
        ...prev,
        [selectedPlayerId]: {
          ...p,
          coachObservations: [newObs, ...p.coachObservations]
        }
      };
    });
  };

  // Toggle milestone completion
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    playBeep(880, 0.05);
    setPlans(prev => {
      const p = prev[selectedPlayerId];
      if (!p) return prev;
      const updatedGoals = p.activeGoals.map(g => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map(m => {
          if (m.id === milestoneId) return { ...m, completed: !m.completed };
          return m;
        });
        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const newPct = Math.round((completedCount / (updatedMilestones.length || 1)) * 100);
        return {
          ...g,
          milestones: updatedMilestones,
          progressPct: newPct,
          status: newPct === 100 ? ('ACHIEVED' as const) : g.status
        };
      });
      return {
        ...prev,
        [selectedPlayerId]: { ...p, activeGoals: updatedGoals }
      };
    });
  };

  // Complete a drill session (+1)
  const handleIncrementDrillSession = (drillPlanId: string) => {
    playBeep(920, 0.06);
    setPlans(prev => {
      const p = prev[selectedPlayerId];
      if (!p) return prev;
      const updatedDrills = p.assignedDrills.map(d => {
        if (d.id !== drillPlanId) return d;
        const newCompleted = Math.min(d.targetSessions, d.completedSessions + 1);
        const isDone = newCompleted >= d.targetSessions;
        if (isDone) playCelebration();
        return {
          ...d,
          completedSessions: newCompleted,
          status: isDone ? ('COMPLETED' as const) : ('IN_PROGRESS' as const),
          lastCompletedDate: 'Today'
        };
      });
      return {
        ...prev,
        [selectedPlayerId]: { ...p, assignedDrills: updatedDrills }
      };
    });
  };

  // Simulated Voice Note Playback
  const handlePlayVoiceNote = (obsId: string) => {
    if (isPlayingAudioId === obsId) {
      setIsPlayingAudioId(null);
      playBeep(450, 0.05);
    } else {
      setIsPlayingAudioId(obsId);
      playBeep(1050, 0.08);
      setTimeout(() => {
        setIsPlayingAudioId(null);
      }, 4000);
    }
  };

  // Discipline badge color helper
  const getCategoryBadgeClass = (category: PDPItemCategory) => {
    switch (category) {
      case 'batting':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'bowling':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'fielding':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
      case 'fitness':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'biomechanics':
        return 'bg-[#c3f400]/15 text-[#c3f400] border-[#c3f400]/30';
      case 'mental':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 text-white pb-20">
      {/* ========================================================================= */}
      {/* 1. TOP BAR & PLAYER SELECTOR SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#181a15] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              playBeep(600, 0.05);
              onNavigate('work');
            }}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#c4c9ac] hover:text-white transition-colors cursor-pointer shrink-0"
            title="Return to Hub"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <img
            src={currentPlan.playerAvatar}
            alt={currentPlan.playerName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#c3f400]/40 shadow-md"
          />

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-headline font-black text-xl sm:text-2xl text-white tracking-tight">
                {currentPlan.playerName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30 uppercase tracking-wider">
                Active PDP
              </span>
            </div>
            <p className="text-xs text-[#c4c9ac] mt-0.5">
              {currentPlan.playerRoleTitle} • <span className="text-white/80">{currentPlan.planCycle}</span>
            </p>
          </div>
        </div>

        {/* Player Roster Selector & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[#20241d] p-1.5 rounded-2xl border border-white/10">
            <span className="text-[11px] text-[#c4c9ac] font-medium px-2">Player:</span>
            {Object.values(plans).map(p => (
              <button
                key={p.playerId}
                onClick={() => {
                  playBeep(700, 0.05);
                  setSelectedPlayerId(p.playerId);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPlayerId === p.playerId
                    ? 'bg-[#c3f400] text-black shadow-md'
                    : 'text-[#c4c9ac] hover:text-white hover:bg-white/5'
                }`}
              >
                {p.playerName.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playCelebration();
              window.print();
            }}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            title="Export / Print Development Plan"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span className="hidden sm:inline">Export PDP</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE SUMMARY & COACH IN CHARGE BANNER */}
      {/* ========================================================================= */}
      <div className="bg-[#1c1f1a] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#c3f400] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">psychology</span>
            <span>Diagnostic Executive Brief</span>
          </div>
          <p className="text-xs sm:text-sm text-[#e2e4d9] leading-relaxed">
            {currentPlan.executiveSummary}
          </p>
          <div className="flex items-center gap-4 mt-4 text-[11px] text-[#c4c9ac] flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-[#c3f400]">verified</span>
              <span>Last Review: <strong className="text-white">{currentPlan.lastReviewDate}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-amber-400">schedule</span>
              <span>Next Review: <strong className="text-white">{currentPlan.nextScheduledReview}</strong></span>
            </div>
          </div>
        </div>

        <div className="bg-[#12140f] p-4 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
          <img
            src={currentPlan.coachAvatar}
            alt="Coach"
            className="w-11 h-11 rounded-xl object-cover border border-[#c3f400]/40"
          />
          <div>
            <div className="text-[10px] text-[#c4c9ac] uppercase tracking-wider font-semibold">Supervising Mentor</div>
            <div className="text-xs font-bold text-white max-w-[200px] leading-snug">{currentPlan.coachInCharge}</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS & QUICK FILTERS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Modules', icon: 'dashboard' },
            { id: 'strengths_growth', label: 'Strengths & Growth Areas', icon: 'tune' },
            { id: 'goals_drills', label: 'Active Goals & Drills', icon: 'target' },
            { id: 'coach_feedback', label: 'Coach Observations & Audio', icon: 'record_voice_over' },
            { id: 'evidence_videos', label: 'Progress Evidence & Telemetry', icon: 'biotech' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playBeep(750, 0.04);
                setActiveTab(tab.id as TabType);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#c3f400] text-black shadow-md'
                  : 'bg-white/5 text-[#c4c9ac] hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playBeep(800, 0.05);
              setIsGoalModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#c3f400]/15 hover:bg-[#c3f400]/25 text-[#c3f400] text-xs font-bold flex items-center gap-1 border border-[#c3f400]/30 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Add Goal</span>
          </button>
          <button
            onClick={() => {
              playBeep(800, 0.05);
              setIsObsModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1 border border-white/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">mic</span>
            <span>+ Log Observation</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTENT SECTIONS */}
      {/* ========================================================================= */}

      {/* SECTION A: EVIDENCE BEFORE & AFTER (THE KILLER DIFFERENTIATOR) */}
      {(activeTab === 'all' || activeTab === 'evidence_videos') && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-white">
                  Tangible Progress Evidence &amp; Telemetry Transformations
                </h2>
                <p className="text-xs text-[#c4c9ac]">
                  Concrete baseline-to-current before/after comparisons certified by high-performance staff
                </p>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold hidden sm:inline">
              {currentPlan.progressEvidence.filter(e => e.status === 'VERIFIED').length} / {currentPlan.progressEvidence.length} Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentPlan.progressEvidence.map(evidence => (
              <div
                key={evidence.id}
                className="bg-[#181a15] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-md relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(evidence.category)}`}>
                    {evidence.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span>{evidence.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-sm text-white mb-3">
                    {evidence.metricTitle}
                  </h3>

                  {/* Before / After Comparison Matrix */}
                  <div className="grid grid-cols-2 gap-2 bg-[#20241d] p-3 rounded-xl border border-white/5 mb-3">
                    <div className="border-r border-white/10 pr-2">
                      <div className="text-[10px] text-[#c4c9ac] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                        <span>Baseline ({evidence.baselineState.date})</span>
                      </div>
                      <div className="text-xs font-bold text-rose-300 mt-1">
                        {evidence.baselineState.value}
                      </div>
                      <p className="text-[10px] text-[#c4c9ac] mt-1 line-clamp-2">
                        {evidence.baselineState.description}
                      </p>
                    </div>

                    <div className="pl-2">
                      <div className="text-[10px] text-[#c4c9ac] font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
                        <span>Current ({evidence.currentState.date})</span>
                      </div>
                      <div className="text-xs font-bold text-[#c3f400] mt-1">
                        {evidence.currentState.value}
                      </div>
                      <p className="text-[10px] text-[#c4c9ac] mt-1 line-clamp-2">
                        {evidence.currentState.description}
                      </p>
                    </div>
                  </div>

                  {/* Delta improvement chip */}
                  <div className="px-3 py-2 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/25 text-xs text-[#c3f400] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    <span>{evidence.deltaImprovement}</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex flex-col gap-1 text-[11px] text-[#c4c9ac]">
                  <p className="italic text-[#e2e4d9] text-[11px]">
                    "{evidence.coachVerdict}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#c4c9ac] mt-1 font-mono">
                    <span>Signed: {evidence.coachSignature}</span>
                    <span>{evidence.signOffDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION B: STRENGTHS & DEVELOPMENT AREAS */}
      {(activeTab === 'all' || activeTab === 'strengths_growth') && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Core Technical Strengths */}
          <div className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 text-[#c3f400] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-white">
                  Validated Core Strengths
                </h2>
                <p className="text-xs text-[#c4c9ac]">Biomechanical &amp; match-winning capabilities</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {currentPlan.strengths.map(strength => (
                <div
                  key={strength.id}
                  className="bg-[#20241d] border border-white/5 rounded-2xl p-4 flex flex-col gap-2 hover:border-[#c3f400]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#c3f400]">
                        {strength.icon || 'star'}
                      </span>
                      <h3 className="font-headline font-bold text-sm text-white">
                        {strength.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(strength.category)}`}>
                      {strength.category}
                    </span>
                  </div>

                  <p className="text-xs text-[#c4c9ac] leading-relaxed">
                    {strength.description}
                  </p>

                  <div className="bg-[#12140f] px-3 py-2 rounded-xl border border-white/5 text-[11px] text-[#c3f400] font-mono flex items-center justify-between">
                    <span>Evidence: <strong>{strength.evidenceMetric}</strong></span>
                    {strength.videoMilestoneRef && (
                      <button
                        onClick={() => {
                          playBeep(850, 0.05);
                          onNavigate('video-analysis');
                        }}
                        className="text-[10px] text-white hover:text-[#c3f400] underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[12px]">videocam</span>
                        <span>Inspect Clip</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-[#c4c9ac] italic">
                    {strength.coachEndorsement}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Priority Development Areas */}
          <div className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">build</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-white">
                  Targeted Development Areas
                </h2>
                <p className="text-xs text-[#c4c9ac]">Root causes, flaws, and technical benchmarks</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {currentPlan.developmentAreas.map(dev => (
                <div
                  key={dev.id}
                  className="bg-[#20241d] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5 hover:border-amber-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {dev.priority} PRIORITY
                      </span>
                      <h3 className="font-headline font-bold text-sm text-white">
                        {dev.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(dev.category)}`}>
                      {dev.category}
                    </span>
                  </div>

                  <div className="text-xs text-rose-300/90 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20 flex flex-col gap-1">
                    <div><strong>Observed Flaw:</strong> {dev.currentFlaw}</div>
                    <div className="text-[#c4c9ac]"><strong>Root Cause:</strong> {dev.rootCause}</div>
                  </div>

                  <div className="text-xs text-emerald-300 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/20">
                    <strong>Biomechanical Target:</strong> {dev.biomechanicalTarget}
                  </div>

                  {/* Progress bar */}
                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between text-[11px] text-[#c4c9ac]">
                      <span>Remediation Progress</span>
                      <strong className="text-white">{dev.progressPct}%</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-[#c3f400] rounded-full transition-all duration-500"
                        style={{ width: `${dev.progressPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION C: ACTIVE GOALS & ASSIGNED DRILLS */}
      {(activeTab === 'all' || activeTab === 'goals_drills') && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Active Developmental Goals */}
          <div className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">flag</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base text-white">Active Goals</h2>
                  <p className="text-xs text-[#c4c9ac]">Measurable milestones &amp; deadlines</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playBeep(800, 0.05);
                  setIsGoalModalOpen(true);
                }}
                className="text-xs text-[#c3f400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Add Goal</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {currentPlan.activeGoals.map(goal => (
                <div
                  key={goal.id}
                  className="bg-[#20241d] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-headline font-bold text-sm text-white">
                      {goal.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      goal.status === 'ACHIEVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30'
                    }`}>
                      {goal.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-[#12140f] p-2.5 rounded-xl border border-white/5 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-[#c4c9ac]">Baseline</div>
                      <div className="text-white font-medium text-[11px] truncate">{goal.baselineValue}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#c4c9ac]">Current</div>
                      <div className="text-[#c3f400] font-bold text-[11px] truncate">{goal.currentValue}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#c4c9ac]">Target</div>
                      <div className="text-emerald-300 font-bold text-[11px] truncate">{goal.targetValue}</div>
                    </div>
                  </div>

                  {/* Milestones checklist */}
                  <div className="flex flex-col gap-1.5 mt-1">
                    <div className="text-[11px] font-semibold text-[#c4c9ac]">Milestone Checklist:</div>
                    {goal.milestones.map(m => (
                      <button
                        key={m.id}
                        onClick={() => handleToggleMilestone(goal.id, m.id)}
                        className={`flex items-center gap-2 text-left p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          m.completed ? 'bg-emerald-950/30 text-emerald-300' : 'bg-white/5 text-[#c4c9ac] hover:text-white'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                          {m.completed ? 'check_box' : 'check_box_outline_blank'}
                        </span>
                        <span className={`flex-1 ${m.completed ? 'line-through text-emerald-400' : ''}`}>
                          {m.title}
                        </span>
                        <span className="text-[10px] text-[#c4c9ac] font-mono">{m.targetDate}</span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-[#c4c9ac] italic bg-[#12140f] p-2 rounded-xl">
                    Coach note: {goal.coachNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Assigned Drills Prescription */}
          <div className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">sports</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-base text-white">Assigned Drill Protocols</h2>
                  <p className="text-xs text-[#c4c9ac]">Weekly prescription &amp; session execution</p>
                </div>
              </div>
              <button
                onClick={() => {
                  playBeep(750, 0.05);
                  onNavigate('drills-vault');
                }}
                className="text-xs text-[#c3f400] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Drills Vault</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {currentPlan.assignedDrills.map(drill => (
                <div
                  key={drill.id}
                  className="bg-[#20241d] border border-white/5 rounded-2xl p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-headline font-bold text-sm text-white">
                        {drill.drillTitle}
                      </h3>
                      <p className="text-[11px] text-[#c3f400] font-medium">{drill.focusArea}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      drill.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {drill.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#e2e4d9] bg-[#12140f] p-2.5 rounded-xl border border-white/5 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-purple-400">calendar_month</span>
                      <span><strong>Schedule:</strong> {drill.weeklyPrescription}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px] text-purple-400">fitness_center</span>
                      <span><strong>Sets/Reps:</strong> {drill.setsReps}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#c4c9ac] italic">
                    "{drill.coachInstructions}"
                  </p>

                  {/* Session tracking button */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs text-[#c4c9ac]">
                      Sessions: <strong className="text-white">{drill.completedSessions} / {drill.targetSessions}</strong>
                    </span>
                    <button
                      onClick={() => handleIncrementDrillSession(drill.id)}
                      disabled={drill.status === 'COMPLETED'}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        drill.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-[#c3f400] hover:bg-[#b0dc00] text-black shadow-md'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {drill.status === 'COMPLETED' ? 'check' : 'add'}
                      </span>
                      <span>{drill.status === 'COMPLETED' ? 'Prescription Complete' : '+1 Session Done'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION D: COACH OBSERVATIONS & AUDIO LOGS */}
      {(activeTab === 'all' || activeTab === 'coach_feedback') && (
        <section className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-5 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">record_voice_over</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-white">
                  Coach Observations &amp; High-Performance Feedback
                </h2>
                <p className="text-xs text-[#c4c9ac]">
                  Direct technical diagnostics, praise points, and recorded coach voice memos
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playBeep(800, 0.05);
                setIsObsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add_comment</span>
              <span>+ Log Coach Observation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPlan.coachObservations.map(obs => (
              <div
                key={obs.id}
                className="bg-[#20241d] border border-white/5 rounded-2xl p-5 flex flex-col justify-between gap-3 hover:border-white/20 transition-all shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={obs.coachAvatar}
                      alt={obs.coachName}
                      className="w-10 h-10 rounded-xl object-cover border border-[#c3f400]/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs font-bold text-white">{obs.coachName}</strong>
                        {obs.verifiedBadge && (
                          <span className="material-symbols-outlined text-[14px] text-[#c3f400]" title="Verified High-Performance Coach">
                            verified
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#c4c9ac]">{obs.coachRole} • {obs.date}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${getCategoryBadgeClass(obs.primaryDiscipline)}`}>
                    {obs.primaryDiscipline}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <p className="text-[#e2e4d9] leading-relaxed">
                    {obs.technicalDiagnostic}
                  </p>

                  <div className="bg-emerald-950/30 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-emerald-400 shrink-0">thumb_up</span>
                    <div><strong>Praise:</strong> {obs.praisePoint}</div>
                  </div>

                  <div className="bg-amber-950/30 border border-amber-500/20 p-2.5 rounded-xl text-amber-300 flex items-start gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-400 shrink-0">bolt</span>
                    <div><strong>Action Cue:</strong> {obs.correctiveAction}</div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                  {obs.linkedKeyframe && (
                    <span className="text-[11px] text-[#c3f400] font-mono flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">movie</span>
                      <span>{obs.linkedKeyframe}</span>
                    </span>
                  )}

                  {obs.audioVoiceNoteUrl && (
                    <button
                      onClick={() => handlePlayVoiceNote(obs.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudioId === obs.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isPlayingAudioId === obs.id ? 'pause' : 'play_arrow'}
                      </span>
                      <span>{isPlayingAudioId === obs.id ? 'Playing Voice Note...' : `Play Audio (${obs.audioDurationSec || 30}s)`}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION E: RECENT VIDEOS & BIOMECHANICAL CLIPS */}
      {(activeTab === 'all' || activeTab === 'evidence_videos') && (
        <section className="bg-[#181a15] border border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">videocam</span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-base text-white">Recent Biomechanical Video Captures</h2>
                <p className="text-xs text-[#c4c9ac]">120-240 FPS telemetry feeds &amp; keyframe analysis</p>
              </div>
            </div>

            <button
              onClick={() => {
                playBeep(750, 0.05);
                onNavigate('video-analysis');
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Launch Video Analysis Lab</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentPlan.recentVideos.map(video => (
              <div
                key={video.id}
                className="bg-[#20241d] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#c3f400]/40 transition-all shadow-md"
              >
                <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/80 text-white border border-white/10 backdrop-blur-sm">
                    {video.fps} FPS • {video.duration}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#c3f400] text-black font-mono shadow-sm">
                    {video.keyMetricBadge}
                  </div>
                </div>

                <div className="p-3.5 flex flex-col gap-2 text-xs">
                  <h3 className="font-headline font-bold text-xs text-white leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-[#c4c9ac] line-clamp-2">
                    {video.biomechanicalNote}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-1">
                    <span className="text-[10px] text-[#c4c9ac] font-mono">{video.date}</span>
                    <button
                      onClick={() => {
                        playBeep(850, 0.05);
                        onNavigate('video-analysis');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#c3f400]/20 hover:bg-[#c3f400] text-[#c3f400] hover:text-black font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      <span>Analyze</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALS */}
      {/* ========================================================================= */}
      <PDPGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />

      <PDPObservationModal
        isOpen={isObsModalOpen}
        onClose={() => setIsObsModalOpen(false)}
        onAddObservation={handleAddObservation}
        defaultCoachName="Ryan Harris"
      />
    </div>
  );
};
