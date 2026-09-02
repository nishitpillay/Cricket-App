import React, { useState } from 'react';
import { ScenarioItem, ScenarioChoice, ScreenType } from '../../types';
import { mockScenarios } from '../../data/tacticsAndPlannerData';
import { playBeep, playBallImpact, playCelebration } from '../../utils/audioFeedback';

interface ScenarioTrainingProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenChalkboard?: () => void;
}

export const ScenarioTraining: React.FC<ScenarioTrainingProps> = ({
  onNavigate,
  onOpenChalkboard
}) => {
  const [scenarios] = useState<ScenarioItem[]>(mockScenarios);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<ScenarioChoice | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [scenarioScores, setScenarioScores] = useState<Record<string, number>>({});

  const currentScenario = scenarios[currentScenarioIndex];

  const handleSelectOption = (choice: ScenarioChoice) => {
    playBeep(700, 0.05);
    setSelectedChoice(choice);
    setShowResult(false);
  };

  const handleRunSimulation = () => {
    if (!selectedChoice) return;
    playBallImpact();
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      setShowResult(true);

      if (selectedChoice.isOptimal) {
        playCelebration();
      } else {
        playBeep(450, 0.15);
      }

      setScenarioScores((prev) => ({
        ...prev,
        [currentScenario.id]: selectedChoice.scoreImpact
      }));
    }, 1200);
  };

  const handleNextScenario = () => {
    playBeep(650, 0.05);
    setSelectedChoice(null);
    setShowResult(false);
    setCurrentScenarioIndex((prev) => (prev + 1) % scenarios.length);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Top Scenario Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#201f1f] p-4 sm:p-5 rounded-2xl border border-white/10 glass shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#ffdb3c]/20 text-[#ffdb3c] font-headline font-bold text-[10px] uppercase tracking-wider">
              Tactical Simulator
            </span>
            <span className="text-xs text-[#c4c9ac] font-medium">
              Scenario {currentScenarioIndex + 1} of {scenarios.length}
            </span>
          </div>
          <h1 className="font-headline font-extrabold text-xl sm:text-2xl text-white">
            {currentScenario.title}
          </h1>
        </div>

        {/* Scenario Stepper Pills */}
        <div className="flex items-center gap-2">
          {scenarios.map((scen, idx) => {
            const isDone = scenarioScores[scen.id] !== undefined;
            const isCurrent = idx === currentScenarioIndex;
            return (
              <button
                key={scen.id}
                onClick={() => {
                  playBeep(600, 0.04);
                  setCurrentScenarioIndex(idx);
                  setSelectedChoice(null);
                  setShowResult(false);
                }}
                className={`w-9 h-9 rounded-xl font-headline font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_12px_rgba(195,244,0,0.5)] scale-105'
                    : isDone
                    ? 'bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40'
                    : 'bg-black/40 text-[#c4c9ac] border border-white/5 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Match Context & Target Batsman Scouting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Match State Card */}
        <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
              Match Context
            </span>
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">scoreboard</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {currentScenario.matchContext.requiredRuns && (
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-[10px] text-[#c4c9ac] block">NEED</span>
                <span className="font-headline font-bold text-white text-base">
                  {currentScenario.matchContext.requiredRuns} Runs
                </span>
              </div>
            )}
            {currentScenario.matchContext.oversRemaining && (
              <div className="p-2 rounded-lg bg-black/30">
                <span className="text-[10px] text-[#c4c9ac] block">OVERS</span>
                <span className="font-headline font-bold text-white text-base">
                  {currentScenario.matchContext.oversRemaining} Over
                </span>
              </div>
            )}
          </div>

          <div className="p-2.5 rounded-lg bg-black/20 text-[11px] text-[#c4c9ac]">
            <span className="text-white font-bold block mb-0.5">Pitch Condition:</span>
            {currentScenario.matchContext.pitchCondition}
          </div>
        </div>

        {/* Batsman Scouting Dossier */}
        <div className="md:col-span-2 p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse" />
              <h3 className="font-headline font-bold text-sm text-white">
                Opponent Scouting Dossier: {currentScenario.targetBatsman.name}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-0.5 rounded">
              STRIKER
            </span>
          </div>

          <p className="text-xs text-[#c4c9ac]">
            {currentScenario.targetBatsman.style}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] font-bold text-[#c3f400] uppercase block mb-1">
                KEY DANGER ZONES:
              </span>
              <ul className="list-disc list-inside text-[#e5e2e1] text-[11px] space-y-0.5">
                {currentScenario.targetBatsman.strengths.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] font-bold text-[#ffdb3c] uppercase block mb-1">
                DISMISSAL WEAKNESSES:
              </span>
              <ul className="list-disc list-inside text-[#e5e2e1] text-[11px] space-y-0.5">
                {currentScenario.targetBatsman.weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem Statement */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1c260f] border border-[#c3f400]/40 shadow-xl flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold shrink-0">
          <span className="material-symbols-outlined text-[24px]">quiz</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider block">
            TACTICAL DECISION REQUIRED
          </span>
          <p className="text-sm font-medium text-white mt-1 leading-relaxed">
            {currentScenario.problemStatement}
          </p>
        </div>
      </div>

      {/* Tactical Options List */}
      <div className="flex flex-col gap-3">
        <h3 className="font-headline font-bold text-base text-white flex items-center justify-between">
          <span>Choose Your Execution Strategy:</span>
          {onOpenChalkboard && (
            <button
              onClick={onOpenChalkboard}
              className="text-xs text-[#c3f400] hover:underline flex items-center gap-1 font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">draw</span>
              <span>Draw on Digital Chalkboard</span>
            </button>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentScenario.choices.map((choice) => {
            const isSelected = selectedChoice?.id === choice.id;
            return (
              <div
                key={choice.id}
                onClick={() => handleSelectOption(choice)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#c3f400]/15 border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.25)] scale-[1.02]'
                    : 'bg-[#201f1f] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        choice.riskReward === 'Safe'
                          ? 'bg-blue-500/20 text-blue-300'
                          : choice.riskReward === 'Aggressive'
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-purple-500/20 text-purple-300'
                      }`}
                    >
                      {choice.riskReward}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-[#c3f400]">
                      {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>

                  <h4 className="font-headline font-bold text-sm text-white mb-1">
                    {choice.title}
                  </h4>
                  <p className="text-xs text-[#c4c9ac] leading-relaxed">
                    {choice.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] flex flex-col gap-1">
                  <div className="text-[#9cf0ff]">
                    <span className="font-bold">Delivery:</span> {choice.deliveryType}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulate Ball Execution Button */}
      {selectedChoice && !showResult && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-8 py-4 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm hover:bg-[#abd600] transition-all cursor-pointer shadow-[0_0_25px_rgba(195,244,0,0.5)] flex items-center gap-2 hover:scale-105"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isSimulating ? 'sync' : 'sports_cricket'}
            </span>
            <span>{isSimulating ? 'Simulating Ball Flight & Batsman Reaction...' : 'Execute Tactical Delivery'}</span>
          </button>
        </div>
      )}

      {/* Simulation Result & Coach Verdict Card */}
      {showResult && selectedChoice && (
        <div
          className={`p-5 sm:p-6 rounded-3xl border shadow-2xl animate-fadeIn flex flex-col gap-4 ${
            selectedChoice.isOptimal
              ? 'bg-gradient-to-br from-[#1c260f] to-[#121a0a] border-[#c3f400]'
              : 'bg-gradient-to-br from-[#2a1a1a] to-[#191111] border-[#ffb4ab]/40'
          }`}
        >
          {/* Top Result Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  selectedChoice.isOptimal
                    ? 'bg-[#c3f400] text-[#161e00]'
                    : 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                }`}
              >
                {selectedChoice.isOptimal ? 'OPTIMAL MASTERCLASS CALL' : 'SUB-OPTIMAL TACTICAL ERROR'}
              </span>
              <h3 className="font-headline font-black text-xl sm:text-2xl text-white mt-1">
                {selectedChoice.simulatedOutcome.result}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-[#c4c9ac] block">TACTICAL ACCURACY</span>
                <span
                  className={`font-headline font-black text-2xl ${
                    selectedChoice.isOptimal ? 'text-[#c3f400]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {selectedChoice.scoreImpact} / 100
                </span>
              </div>
            </div>
          </div>

          {/* Outcome Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#c4c9ac] block mb-1">Simulated Runs Conceded/Scored:</span>
              <span className="font-headline font-extrabold text-lg text-white">
                {selectedChoice.simulatedOutcome.runsConcededOrScored} Runs
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5">
              <span className="text-[#c4c9ac] block mb-1">Wicket Probability:</span>
              <span className="font-headline font-extrabold text-lg text-[#ffdb3c]">
                {selectedChoice.simulatedOutcome.wicketChance}
              </span>
            </div>
          </div>

          {/* Coach Analysis Rationale */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#c3f400] text-[24px] shrink-0 mt-0.5">
              psychology
            </span>
            <div>
              <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider block">
                COACH VERDICT & LESSON
              </span>
              <p className="text-xs text-white leading-relaxed mt-1">
                {selectedChoice.coachVerdict}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextScenario}
              className="px-6 py-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <span>Next Scenario</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
