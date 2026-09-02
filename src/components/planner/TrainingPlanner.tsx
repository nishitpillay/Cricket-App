import React, { useState, useEffect } from 'react';
import { TrainingPlan, TrainingPlanBlock, ScreenType } from '../../types';
import { mockTrainingPlans } from '../../data/tacticsAndPlannerData';
import { playBeep, playBallImpact, playCelebration } from '../../utils/audioFeedback';

interface TrainingPlannerProps {
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drillId: string) => void;
}

export const TrainingPlanner: React.FC<TrainingPlannerProps> = ({ onNavigate }) => {
  const [plans] = useState<TrainingPlan[]>(mockTrainingPlans);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan>(mockTrainingPlans[0]);

  // Custom session generator state
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<30 | 45 | 60 | 90>(30);
  const [customSkill, setCustomSkill] = useState<'Batting' | 'Fast Bowling' | 'Spin Bowling' | 'Fielding & Reflexes' | 'All-Rounder Match Prep'>('Batting');
  const [customIntensity, setCustomIntensity] = useState<'Medium' | 'High' | 'Elite'>('High');

  // Active Session Runner state
  const [isRunningSession, setIsRunningSession] = useState<boolean>(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number>(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300); // 5 min
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  const activeBlock: TrainingPlanBlock | undefined = selectedPlan.blocks[activeBlockIndex];

  // Live Timer
  useEffect(() => {
    if (!isRunningSession || isTimerPaused) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          playCelebration();
          // Move to next block or complete
          if (activeBlockIndex < selectedPlan.blocks.length - 1) {
            setActiveBlockIndex((idx) => idx + 1);
            const nextBlock = selectedPlan.blocks[activeBlockIndex + 1];
            return nextBlock ? nextBlock.durationMinutes * 60 : 300;
          } else {
            setIsRunningSession(false);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunningSession, isTimerPaused, activeBlockIndex, selectedPlan]);

  const handleStartSession = () => {
    playBallImpact();
    setActiveBlockIndex(0);
    const firstBlock = selectedPlan.blocks[0];
    setSecondsRemaining(firstBlock ? firstBlock.durationMinutes * 60 : 300);
    setIsRunningSession(true);
    setIsTimerPaused(false);
  };

  const handleGenerateCustomPlan = () => {
    playBeep(750, 0.08);
    // Build dynamic custom plan
    const generated: TrainingPlan = {
      id: `custom-plan-${Date.now()}`,
      title: `${customDuration}-Min Custom ${customSkill} Protocol`,
      targetDurationMinutes: customDuration,
      skillFocus: customSkill,
      intensity: customIntensity,
      summary: `Tailored high-efficiency session specifically targeting ${customSkill} with ${customIntensity.toLowerCase()} intensity intervals.`,
      blocks: [
        {
          id: 'cb1',
          durationMinutes: Math.round(customDuration * 0.15),
          phaseName: 'Dynamic Warm-up',
          activityTitle: `${customSkill} Stance & Kinetic Warm-up`,
          description: 'Dynamic activation, joint mobility, and shadow biomechanical reps.',
          equipment: ['Cones', 'Stretching Band'],
          intensity: 'Low',
          icon: 'fitness_center'
        },
        {
          id: 'cb2',
          durationMinutes: Math.round(customDuration * 0.35),
          phaseName: 'Biomechanics Focus',
          activityTitle: `${customSkill} Technical Isolation Drill`,
          description: 'High-repetition technical grooving with slow-motion checkpoint verification.',
          equipment: ['Cricket Balls', 'Target Markers'],
          intensity: customIntensity === 'Elite' ? 'High' : 'Medium',
          icon: 'straighten'
        },
        {
          id: 'cb3',
          durationMinutes: Math.round(customDuration * 0.35),
          phaseName: 'Match Pressure Scenario',
          activityTitle: 'Match Simulation & Pressure Target Challenge',
          description: 'Executing under match conditions with target zones and run scoring/wicket penalties.',
          equipment: ['Full Match Kit', 'Phone Tracking'],
          intensity: customIntensity === 'Elite' ? 'Max' : 'High',
          icon: 'sports_cricket'
        },
        {
          id: 'cb4',
          durationMinutes: Math.max(3, Math.round(customDuration * 0.15)),
          phaseName: 'Cool Down & Recovery',
          activityTitle: 'Deceleration & Telemetry Log Review',
          description: 'Static stretching and recording session notes in the app vault.',
          equipment: ['None'],
          intensity: 'Low',
          icon: 'self_improvement'
        }
      ]
    };

    setSelectedPlan(generated);
    setIsCustomMode(false);
  };

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c260f] via-[#161f0d] to-[#202020] p-6 rounded-3xl border border-[#c3f400]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-[10px] uppercase tracking-wider">
              On-The-Fly Generator
            </span>
            <span className="text-xs text-[#ffdb3c] font-bold">30 & 60 Min Templates</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">
            Smart Practice Planner
          </h1>
          <p className="text-sm text-[#c4c9ac] mt-1 max-w-xl">
            Quick-select pre-built training agendas or generate a tailored practice protocol on the fly right at the nets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playBeep(650, 0.05);
              setIsCustomMode(!isCustomMode);
            }}
            className={`px-4 py-2.5 rounded-xl font-headline font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              isCustomMode
                ? 'bg-[#ffdb3c] text-[#161e00]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>{isCustomMode ? 'View Templates' : 'Custom Builder'}</span>
          </button>
        </div>
      </div>

      {/* Custom Session Builder Modal/Drawer */}
      {isCustomMode && (
        <div className="p-5 rounded-3xl bg-[#201f1f] border border-[#ffdb3c]/40 glass shadow-2xl animate-fadeIn flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffdb3c] text-[20px]">auto_fix_high</span>
              Generate Custom Ground Practice Protocol
            </h3>
            <span className="text-[10px] font-mono text-[#c3f400] font-bold">INSTANT AI AGENDAS</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Duration Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c4c9ac]">Target Session Time</label>
              <div className="grid grid-cols-4 gap-1">
                {([30, 45, 60, 90] as const).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setCustomDuration(dur)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customDuration === dur
                        ? 'bg-[#c3f400] text-[#161e00]'
                        : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                    }`}
                  >
                    {dur}m
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c4c9ac]">Core Skill Focus</label>
              <select
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value as any)}
                className="w-full py-2 px-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:border-[#c3f400] outline-none"
              >
                <option value="Batting">Batting & Power Hitting</option>
                <option value="Fast Bowling">Fast Bowling & Seam</option>
                <option value="Spin Bowling">Spin Bowling & Variations</option>
                <option value="Fielding & Reflexes">Slip Fielding & Agility</option>
                <option value="All-Rounder Match Prep">All-Rounder Match Prep</option>
              </select>
            </div>

            {/* Intensity Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c4c9ac]">Training Intensity</label>
              <div className="grid grid-cols-3 gap-1">
                {(['Medium', 'High', 'Elite'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setCustomIntensity(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      customIntensity === lvl
                        ? 'bg-[#ffdb3c] text-[#161e00]'
                        : 'bg-black/30 text-[#c4c9ac] hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGenerateCustomPlan}
              className="px-6 py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Generate Practice Agenda</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Select Preset Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => {
                playBeep(650, 0.04);
                setSelectedPlan(plan);
                setIsRunningSession(false);
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-[#1c260f] border-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.25)]'
                  : 'bg-[#201f1f] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-mono font-bold text-[10px]">
                    {plan.targetDurationMinutes} MINUTES
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      plan.intensity === 'Elite'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}
                  >
                    {plan.intensity}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-base text-white mb-1">
                  {plan.title}
                </h3>
                <p className="text-xs text-[#c4c9ac] leading-relaxed line-clamp-2">
                  {plan.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#c4c9ac]">
                <span>{plan.blocks.length} Practice Blocks</span>
                <span className="font-bold text-[#c3f400] flex items-center gap-1">
                  {isSelected ? 'Selected' : 'Select'}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Session Plan Detail & Interactive Live Runner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#201f1f] border border-white/10 glass shadow-2xl flex flex-col gap-6">
        {/* Top Header of Selected Plan */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#c3f400] font-bold">
                {selectedPlan.targetDurationMinutes} MINUTE PROTOCOL
              </span>
              <span className="text-xs text-[#c4c9ac]">• {selectedPlan.skillFocus}</span>
            </div>
            <h2 className="font-headline font-extrabold text-xl text-white">
              {selectedPlan.title}
            </h2>
          </div>

          {/* Start Session Button / Live Clock */}
          {!isRunningSession ? (
            <button
              onClick={handleStartSession}
              className="px-6 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm hover:bg-[#abd600] transition-transform hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.5)] flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              <span>Launch Timed Practice</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 bg-black/60 p-2.5 px-4 rounded-2xl border border-[#c3f400]/40">
              <div className="text-right">
                <span className="text-[9px] font-mono text-[#c4c9ac] block">BLOCK COUNTDOWN</span>
                <span className="font-mono font-black text-2xl text-[#c3f400]">
                  {formatTime(secondsRemaining)}
                </span>
              </div>

              <button
                onClick={() => {
                  playBeep(650, 0.04);
                  setIsTimerPaused(!isTimerPaused);
                }}
                className="w-10 h-10 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isTimerPaused ? 'play_arrow' : 'pause'}
                </span>
              </button>

              <button
                onClick={() => {
                  playBeep(650, 0.04);
                  if (activeBlockIndex < selectedPlan.blocks.length - 1) {
                    setActiveBlockIndex(activeBlockIndex + 1);
                    const nextB = selectedPlan.blocks[activeBlockIndex + 1];
                    setSecondsRemaining(nextB ? nextB.durationMinutes * 60 : 300);
                  } else {
                    setIsRunningSession(false);
                  }
                }}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer"
                title="Skip to next block"
              >
                <span className="material-symbols-outlined text-[20px]">skip_next</span>
              </button>
            </div>
          )}
        </div>

        {/* Practice Blocks Breakdown */}
        <div className="flex flex-col gap-3">
          <h3 className="font-headline font-bold text-sm text-white flex items-center justify-between">
            <span>Session Timeline ({selectedPlan.blocks.length} Phases)</span>
            <span className="text-xs text-[#c4c9ac]">Sequential Flow</span>
          </h3>

          <div className="flex flex-col gap-3">
            {selectedPlan.blocks.map((block, idx) => {
              const isActive = isRunningSession && activeBlockIndex === idx;
              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-[#1c260f] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.3)] ring-1 ring-[#c3f400]'
                      : 'bg-black/30 border-white/5'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                        isActive
                          ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_#c3f400]'
                          : 'bg-white/5 text-[#c4c9ac]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{block.icon}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider">
                          Phase {idx + 1}: {block.phaseName}
                        </span>
                        <span className="text-[10px] font-mono text-white/60">
                          ({block.durationMinutes} mins)
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-white">
                        {block.activityTitle}
                      </h4>
                      <p className="text-xs text-[#c4c9ac] mt-0.5">
                        {block.description}
                      </p>
                    </div>
                  </div>

                  {/* Gear & Equipment Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {block.equipment.map((eq, eqIdx) => (
                      <span
                        key={eqIdx}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[#c4c9ac] text-[10px] border border-white/5"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
