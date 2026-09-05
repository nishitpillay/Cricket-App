import React, { useState } from 'react';
import { ScreenType, UserProfile } from '../../types';
import { playBeep, playCelebration } from '../../utils/audioFeedback';

export interface CricketLoopStep {
  step: number;
  id: string;
  name: string;
  shortAction: string;
  screen: ScreenType;
  icon: string;
  description: string;
  deliverable: string;
  status: 'completed' | 'current' | 'upcoming';
  metricSnippet?: string;
}

interface CoreCricketLoopStepperProps {
  currentUser?: UserProfile;
  onNavigate: (screen: ScreenType) => void;
  compact?: boolean;
}

export const CoreCricketLoopStepper: React.FC<CoreCricketLoopStepperProps> = ({
  currentUser,
  onNavigate,
  compact = false
}) => {
  const isCoach = currentUser?.role === 'coach';

  const [activeStepIndex, setActiveStepIndex] = useState<number>(2); // Default on Step 3 (Analyse) for rich demo state
  const [showComparisonModal, setShowComparisonModal] = useState<boolean>(false);

  const loopSteps: CricketLoopStep[] = [
    {
      step: 1,
      id: 'train-init',
      name: 'Train',
      shortAction: 'Start Net Session',
      screen: 'planner',
      icon: 'fitness_center',
      description: 'Warm-up deliveries, establish baseline rhythm & bay setup.',
      deliverable: '12 baseline warm-up deliveries bowled in Net Bay 1',
      status: activeStepIndex > 0 ? 'completed' : activeStepIndex === 0 ? 'current' : 'upcoming',
      metricSnippet: 'Bay 1 • Turf Pitch'
    },
    {
      step: 2,
      id: 'record',
      name: 'Record',
      shortAction: '120 FPS AI Capture',
      screen: 'record',
      icon: 'videocam',
      description: 'Capture high-speed footage with auto-delivery slice & pitch radar.',
      deliverable: 'Delivery #4 captured: 138.4 km/h • Good length corridor',
      status: activeStepIndex > 1 ? 'completed' : activeStepIndex === 1 ? 'current' : 'upcoming',
      metricSnippet: '138.4 km/h • 120 FPS'
    },
    {
      step: 3,
      id: 'analyse',
      name: 'Analyse',
      shortAction: 'Motion Lab Stepper',
      screen: 'video-analysis',
      icon: 'slow_motion_video',
      description: 'Slow-motion inspection of release angle, hip-shoulder separation & front leg brace.',
      deliverable: 'Elbow flex: 11.2° (Legal) • Release height: 2.14m • Seam angle: 18°',
      status: activeStepIndex > 2 ? 'completed' : activeStepIndex === 2 ? 'current' : 'upcoming',
      metricSnippet: 'Elbow 11.2° • Seam 18°'
    },
    {
      step: 4,
      id: 'feedback',
      name: 'Receive Feedback',
      shortAction: 'Coach Voice & Telestrator',
      screen: 'feedback',
      icon: 'record_voice_over',
      description: 'Review coach voice critique and annotated video frames on wrist collapse.',
      deliverable: 'Coach Lee: "Lock wrist upright at release to eliminate 4° wobble"',
      status: activeStepIndex > 3 ? 'completed' : activeStepIndex === 3 ? 'current' : 'upcoming',
      metricSnippet: 'Voice Note: 0:42s'
    },
    {
      step: 5,
      id: 'assign',
      name: 'Assign Drill',
      shortAction: 'Prescribe Vault Drill',
      screen: 'drills-vault',
      icon: 'assignment_turned_in',
      description: 'Prescribe targeted corrective drill from the Smart Drills Vault.',
      deliverable: 'Assigned: "High Elbow Upright Seam Extension" (3 sets × 5 reps)',
      status: activeStepIndex > 4 ? 'completed' : activeStepIndex === 4 ? 'current' : 'upcoming',
      metricSnippet: '3 Sets × 5 Reps'
    },
    {
      step: 6,
      id: 'train-again',
      name: 'Train Again',
      shortAction: 'Execute Correction',
      screen: 'drill-practice',
      icon: 'sports_cricket',
      description: 'Execute prescribed routine with live audio metronome & rep counter.',
      deliverable: '15/15 Target repetitions completed with corrected upright wrist',
      status: activeStepIndex > 5 ? 'completed' : activeStepIndex === 5 ? 'current' : 'upcoming',
      metricSnippet: '15 Reps Finished'
    },
    {
      step: 7,
      id: 'compare',
      name: 'Compare Improvement',
      shortAction: 'Before vs After Delta',
      screen: 'video-analysis',
      icon: 'compare',
      description: 'Side-by-side synchronized overlay highlighting measurable mechanical gain.',
      deliverable: '+3.8 km/h pace • +14% corridor accuracy • 0° wrist wobble',
      status: activeStepIndex >= 6 ? 'completed' : 'upcoming',
      metricSnippet: '+3.8 km/h • +14% Accuracy'
    }
  ];

  const currentStep = loopSteps[activeStepIndex];

  const handleStepClick = (index: number) => {
    playBeep(700, 0.04);
    setActiveStepIndex(index);
  };

  const handleLaunchStep = (step: CricketLoopStep) => {
    playCelebration();
    onNavigate(step.screen);
  };

  const handleNextStep = () => {
    playCelebration();
    if (activeStepIndex < loopSteps.length - 1) {
      setActiveStepIndex((prev) => prev + 1);
    } else {
      setActiveStepIndex(0); // Loop repeats
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Container Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#1b221a] via-[#161a17] to-[#121413] border border-[#c3f400]/30 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#c3f400]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c3f400]/20 border border-[#c3f400]/40 flex items-center justify-center text-[#c3f400] shrink-0 shadow-[0_0_12px_rgba(195,244,0,0.25)]">
              <span className="material-symbols-outlined text-[22px] animate-pulse">sync</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#c3f400] uppercase tracking-wider">
                  Core Cricket Mastery Loop
                </span>
                <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/30">
                  Step {activeStepIndex + 1} of 7
                </span>
              </div>
              <h2 className="font-headline font-black text-base sm:text-lg text-white">
                Train → Record → Analyse → Feedback → Assign → Train Again → Compare
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowComparisonModal(true)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
              title="View Delta Comparison"
            >
              <span className="material-symbols-outlined text-[16px] text-[#00d2ff]">compare_arrows</span>
              <span className="hidden sm:inline">Compare</span>
              <span>Delta</span>
            </button>
            <button
              onClick={handleNextStep}
              className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#d6ff1a] text-[#162000] text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <span>{activeStepIndex === 6 ? 'Restart Loop' : 'Next Step'}</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Horizontal Visual Step Flywheel */}
        <div className="py-3.5 relative z-10 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[620px] relative gap-2">
            {/* Connecting Track Line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-white/10 z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#c3f400] to-[#00d2ff] transition-all duration-500 z-0"
              style={{
                width: `${(activeStepIndex / (loopSteps.length - 1)) * 90}%`
              }}
            />

            {loopSteps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              const isDone = activeStepIndex > idx;

              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(idx)}
                  className={`relative z-10 flex flex-col items-center gap-1.5 group cursor-pointer transition-transform ${
                    isSelected ? 'scale-105' : 'hover:scale-100 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#c3f400] text-[#111800] ring-4 ring-[#c3f400]/30 shadow-[0_0_15px_#c3f400]'
                        : isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-[#202020] text-[#8e918f] border border-white/20'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold tracking-tight whitespace-nowrap text-center ${
                      isSelected ? 'text-[#c3f400]' : isDone ? 'text-emerald-400' : 'text-[#8e918f]'
                    }`}
                  >
                    {step.step}. {step.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Active Step Interactive Hero Panel */}
        <div className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5 max-w-xl">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c3f400] shrink-0">
              <span className="material-symbols-outlined text-[28px]">{currentStep.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#c3f400] uppercase tracking-wider">
                  Active Stage {currentStep.step} of 7: {currentStep.name}
                </span>
                {currentStep.metricSnippet && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00d2ff]/15 text-[#00d2ff] border border-[#00d2ff]/30">
                    {currentStep.metricSnippet}
                  </span>
                )}
              </div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-white mt-0.5">
                {currentStep.shortAction}
              </h3>
              <p className="text-xs text-[#c4c9ac] mt-1 leading-relaxed">
                {currentStep.description}
              </p>
              <div className="mt-2 text-[11px] text-[#8e918f] font-mono bg-white/5 p-2 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px]">verified</span>
                <span>{currentStep.deliverable}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={() => handleLaunchStep(currentStep)}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#c3f400] hover:bg-[#d6ff1a] text-[#111800] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">launch</span>
              <span>Launch {currentStep.name} Tool</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BEFORE VS AFTER DELTA IMPROVEMENT MODAL */}
      {/* ========================================================================= */}
      {showComparisonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#1e1e1e] border border-[#c3f400]/40 rounded-2xl p-5 shadow-2xl relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#c3f400]/15 flex items-center justify-center text-[#c3f400]">
                  <span className="material-symbols-outlined text-[20px]">compare</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base sm:text-lg text-white">
                    Step 7: Improvement Delta Comparison
                  </h3>
                  <p className="text-xs text-[#c4c9ac]">
                    Baseline vs. Post-Drill Delivery Mechanical Verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowComparisonModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Comparison Side-by-Side Visual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Baseline (Before) */}
              <div className="p-4 rounded-xl bg-[#141414] border border-red-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-400 uppercase">
                    Baseline (Session Start)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-300">
                    Delivery #2
                  </span>
                </div>
                <div className="h-32 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center text-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 to-transparent pointer-events-none" />
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-red-400 text-[28px]">report_problem</span>
                    <span className="text-xs font-bold text-white">Wobble Seam Release</span>
                    <span className="text-[11px] text-[#8e918f]">Wrist tilted 18° off-vertical</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Release Speed:</span>
                    <span className="text-white font-mono">134.6 km/h</span>
                  </div>
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Corridor Accuracy:</span>
                    <span className="text-white font-mono">68%</span>
                  </div>
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Elbow Flex Angle:</span>
                    <span className="text-white font-mono">14.2°</span>
                  </div>
                </div>
              </div>

              {/* Improved (After) */}
              <div className="p-4 rounded-xl bg-[#141414] border border-[#c3f400]/40 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#c3f400] uppercase">
                    Corrected (Post-Drill)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#c3f400]/15 text-[#c3f400]">
                    Delivery #16
                  </span>
                </div>
                <div className="h-32 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center text-center p-3 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#c3f400]/10 to-transparent pointer-events-none" />
                  <div className="flex flex-col items-center gap-1 z-10">
                    <span className="material-symbols-outlined text-[#c3f400] text-[28px]">check_circle</span>
                    <span className="text-xs font-bold text-white">Upright Seam Lock</span>
                    <span className="text-[11px] text-[#c3f400]">Wrist upright • Seam aligned</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Release Speed:</span>
                    <span className="text-[#c3f400] font-mono font-bold">138.4 km/h (+3.8)</span>
                  </div>
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Corridor Accuracy:</span>
                    <span className="text-[#c3f400] font-mono font-bold">82% (+14%)</span>
                  </div>
                  <div className="flex justify-between text-[#8e918f]">
                    <span>Elbow Flex Angle:</span>
                    <span className="text-[#c3f400] font-mono font-bold">11.2° (-3.0°)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Loop Completion Card */}
            <div className="p-3.5 rounded-xl bg-[#c3f400]/10 border border-[#c3f400]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#c3f400] text-[22px]">auto_awesome</span>
                <span className="text-white">
                  <strong>Mastery Loop Complete:</strong> Mechanical gain verified and saved to athlete history.
                </span>
              </div>
              <button
                onClick={() => {
                  setShowComparisonModal(false);
                  onNavigate('video-analysis');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-[#c3f400] text-[#111800] font-bold text-xs shrink-0 cursor-pointer"
              >
                Open Motion Lab
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
