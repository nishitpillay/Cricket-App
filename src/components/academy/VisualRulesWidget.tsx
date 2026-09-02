import React, { useState } from 'react';
import { mockRules, RuleBreakdown } from '../../data/academyData';
import { playBeep } from '../../utils/audioFeedback';

export const VisualRulesWidget: React.FC = () => {
  const [selectedRule, setSelectedRule] = useState<string>('rule-lbw');

  // LBW Simulator State
  const [pitching, setPitching] = useState<'inline' | 'outside-off' | 'outside-leg'>('inline');
  const [impact, setImpact] = useState<'inline' | 'outside-off'>('inline');
  const [shotOffered, setShotOffered] = useState<boolean>(true);
  const [wickets, setWickets] = useState<'hitting' | 'missing' | 'umpires-call'>('hitting');

  // Powerplay Format & Phase State
  const [format, setFormat] = useState<'t20' | 'odi'>('t20');
  const [odiPhase, setOdiPhase] = useState<'p1' | 'p2' | 'p3'>('p1');
  const [t20Phase, setT20Phase] = useState<'powerplay' | 'death'>('powerplay');

  // DLS Calculator State
  const [firstInningsScore, setFirstInningsScore] = useState<number>(275);
  const [oversLost, setOversLost] = useState<number>(15);
  const [wicketsLostAtBreak, setWicketsLostAtBreak] = useState<number>(2);

  // Compute LBW Decision
  const calculateLBWDecision = () => {
    // Condition 1: Pitching
    if (pitching === 'outside-leg') {
      return {
        verdict: 'NOT OUT',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        reason: 'Pitched Outside Leg: Law 36 dictates that a ball pitching outside the leg-stump line can NEVER result in an LBW dismissal.',
        stepFailed: 'Pitching'
      };
    }

    // Condition 2: Impact
    if (impact === 'outside-off' && shotOffered) {
      return {
        verdict: 'NOT OUT',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        reason: 'Impact Outside Off with Shot Played: Because the batter offered a genuine stroke, impact outside the off-stump line protects them from LBW.',
        stepFailed: 'Impact'
      };
    }

    // Condition 3: Wickets
    if (wickets === 'missing') {
      return {
        verdict: 'NOT OUT',
        color: 'text-red-400',
        bg: 'bg-red-500/10 border-red-500/30',
        reason: 'Wickets Missing: Ball tracking confirms the delivery would have passed over or wide of the stumps.',
        stepFailed: 'Wickets'
      };
    }

    if (wickets === 'umpires-call') {
      return {
        verdict: "UMPIRE'S CALL",
        color: 'text-[#ffdb3c]',
        bg: 'bg-[#ffdb3c]/10 border-[#ffdb3c]/30',
        reason: "Umpire's Call: Less than 50% of the ball was hitting the outer margin of the stump. The on-field umpire's original decision stands.",
        stepFailed: 'Marginal'
      };
    }

    return {
      verdict: 'OUT (LBW)',
      color: 'text-[#c3f400]',
      bg: 'bg-[#c3f400]/10 border-[#c3f400]/40',
      reason: 'Out LBW! All 3 criteria met: Valid pitch line, valid impact point, and trajectory hitting the stumps.',
      stepFailed: 'None'
    };
  };

  const lbwDecision = calculateLBWDecision();

  // DLS Revised Target Calculation (Simplified Standard Model)
  const calculateDLSTarget = () => {
    const resourceRemaining = Math.max(10, 100 - oversLost * 1.8 - wicketsLostAtBreak * 5.5);
    const revisedTarget = Math.round(firstInningsScore * (resourceRemaining / 100)) + 1;
    const parScore = Math.max(0, revisedTarget - 1);
    return { revisedTarget, parScore, resourceRemaining: Math.round(resourceRemaining) };
  };

  const dlsResult = calculateDLSTarget();

  return (
    <div className="flex flex-col gap-6">
      {/* Rule Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {mockRules.map((rule) => {
          const isSelected = selectedRule === rule.id;
          return (
            <button
              key={rule.id}
              onClick={() => {
                playBeep(700, 0.05);
                setSelectedRule(rule.id);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-headline font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {rule.title.split('(')[0].trim()}
            </button>
          );
        })}
      </div>

      {/* Selected Rule Details */}
      {selectedRule === 'rule-lbw' && (
        <div className="flex flex-col gap-5">
          {/* Header Description */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 uppercase">
                MCC Law 36
              </span>
              <span className="text-xs text-[#c4c9ac] font-mono">Interactive Hawk-Eye Simulator</span>
            </div>
            <h3 className="font-headline font-extrabold text-xl text-white">
              Leg Before Wicket (LBW) Decision Tree
            </h3>
            <p className="text-xs sm:text-sm text-[#c4c9ac] mt-1">
              Adjust the 3 stages of ball trajectory below to see how the umpire and DRS evaluate LBW appeals in real time.
            </p>
          </div>

          {/* Interactive LBW Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Visual Pitch Map Canvas / Representation (5 cols) */}
            <div className="lg:col-span-6 p-5 rounded-3xl bg-[#181818] border border-white/10 flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
                  Hawk-Eye DRS Trajectory
                </span>
                <span className="text-[10px] text-[#c4c9ac] font-mono">22 Yards Pitch Line</span>
              </div>

              {/* Graphic Pitch Surface */}
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#1c2e1b] via-[#243d22] to-[#1a2919] border border-white/10 overflow-hidden flex flex-col justify-between p-3">
                {/* Visual Crease Lines */}
                <div className="w-full flex justify-between items-center text-[9px] text-[#c4c9ac] border-b border-white/20 pb-1">
                  <span>Bowler's Crease</span>
                  <span>Good Length</span>
                  <span>Popping Crease</span>
                </div>

                {/* Stumps Visualization at Bottom */}
                <div className="relative w-full flex-1 flex items-center justify-center my-2">
                  {/* Pitch Corridor Zones */}
                  <div className="absolute inset-0 grid grid-cols-3 border-x border-white/15">
                    <div className={`border-r border-dashed border-white/15 flex items-end justify-center pb-2 text-[9px] font-bold ${pitching === 'outside-off' ? 'bg-[#c3f400]/15 text-[#c3f400]' : 'text-white/40'}`}>
                      Outside Off
                    </div>
                    <div className={`border-r border-dashed border-white/15 flex items-end justify-center pb-2 text-[9px] font-bold ${pitching === 'inline' ? 'bg-[#c3f400]/20 text-[#c3f400]' : 'text-white/40'}`}>
                      In-Line Stumps
                    </div>
                    <div className={`flex items-end justify-center pb-2 text-[9px] font-bold ${pitching === 'outside-leg' ? 'bg-red-500/20 text-red-400' : 'text-white/40'}`}>
                      Outside Leg
                    </div>
                  </div>

                  {/* Simulated Ball Trajectory Arc */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200">
                    {/* Trajectory path */}
                    <path
                      d={
                        pitching === 'outside-off'
                          ? 'M 150 10 Q 90 90 90 140 T 130 185'
                          : pitching === 'outside-leg'
                          ? 'M 150 10 Q 210 90 220 140 T 200 185'
                          : 'M 150 10 Q 150 90 150 140 T 150 185'
                      }
                      fill="none"
                      stroke={lbwDecision.verdict.startsWith('OUT') ? '#c3f400' : '#ff4d4d'}
                      strokeWidth="3.5"
                      strokeDasharray="4 2"
                    />
                    {/* Pitching Point Circle */}
                    <circle
                      cx={pitching === 'outside-off' ? 90 : pitching === 'outside-leg' ? 220 : 150}
                      cy="90"
                      r="7"
                      fill="#ffffff"
                      stroke="#c3f400"
                      strokeWidth="2"
                    />
                    {/* Impact Point Circle */}
                    <circle
                      cx={impact === 'outside-off' ? 100 : 150}
                      cy="140"
                      r="8"
                      fill={impact === 'outside-off' && shotOffered ? '#ff4d4d' : '#c3f400'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Stumps + Bails Icon */}
                <div className="w-full flex items-center justify-center gap-1.5 py-1 bg-black/40 rounded-xl border border-white/10">
                  <div className="w-1.5 h-6 bg-[#ffdb3c] rounded-t-sm" />
                  <div className="w-1.5 h-6 bg-[#ffdb3c] rounded-t-sm" />
                  <div className="w-1.5 h-6 bg-[#ffdb3c] rounded-t-sm" />
                  <span className="text-[10px] text-white font-bold ml-2">Wickets Base</span>
                </div>
              </div>

              {/* Dynamic Live Verdict Box */}
              <div className={`p-4 rounded-2xl border ${lbwDecision.bg} mt-4`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4c9ac]">
                    Official Verdict
                  </span>
                  <span className={`font-headline font-black text-lg ${lbwDecision.color}`}>
                    {lbwDecision.verdict}
                  </span>
                </div>
                <p className="text-xs text-white/90 leading-relaxed">{lbwDecision.reason}</p>
              </div>
            </div>

            {/* Interactive Condition Controls (7 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-3">
              {/* Condition 1: Pitching */}
              <div className="p-4 rounded-2xl bg-[#202020] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-xs flex items-center justify-center font-bold">1</span>
                    Pitching Line
                  </span>
                  <span className="text-[10px] text-[#c4c9ac]">Must not pitch outside leg</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPitching('outside-off')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      pitching === 'outside-off'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Outside Off
                  </button>
                  <button
                    onClick={() => setPitching('inline')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      pitching === 'inline'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    In-Line (Valid)
                  </button>
                  <button
                    onClick={() => setPitching('outside-leg')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      pitching === 'outside-leg'
                        ? 'bg-red-500 text-white border-red-500 shadow-md'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Outside Leg (Not Out)
                  </button>
                </div>
              </div>

              {/* Condition 2: Impact & Shot Offered */}
              <div className="p-4 rounded-2xl bg-[#202020] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-xs flex items-center justify-center font-bold">2</span>
                    Impact Point & Shot Offered
                  </span>
                  <span className="text-[10px] text-[#c4c9ac]">Pad Strike Location</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <button
                    onClick={() => setImpact('inline')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      impact === 'inline'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    In-Line with Stumps
                  </button>
                  <button
                    onClick={() => setImpact('outside-off')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      impact === 'outside-off'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Outside Off-Stump
                  </button>
                </div>

                {/* Shot Offered Toggle */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs text-white">Was a genuine stroke offered?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShotOffered(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        shotOffered ? 'bg-[#c3f400] text-[#161e00]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setShotOffered(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !shotOffered ? 'bg-[#c3f400] text-[#161e00]' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      No (Pad Play)
                    </button>
                  </div>
                </div>
              </div>

              {/* Condition 3: Wickets Hitting */}
              <div className="p-4 rounded-2xl bg-[#202020] border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-headline font-bold text-sm text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#c3f400]/20 text-[#c3f400] text-xs flex items-center justify-center font-bold">3</span>
                    Wicket Trajectory (Stumps)
                  </span>
                  <span className="text-[10px] text-[#c4c9ac]">Predicted Path</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setWickets('hitting')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      wickets === 'hitting'
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Hitting Stumps
                  </button>
                  <button
                    onClick={() => setWickets('umpires-call')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      wickets === 'umpires-call'
                        ? 'bg-[#ffdb3c] text-[#161e00] border-[#ffdb3c]'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Umpire's Call
                  </button>
                  <button
                    onClick={() => setWickets('missing')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      wickets === 'missing'
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                    }`}
                  >
                    Missing Stumps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Rule: Powerplays */}
      {selectedRule === 'rule-powerplays' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 uppercase">
                ICC Playing Condition 28.1
              </span>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
                <button
                  onClick={() => setFormat('t20')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    format === 't20' ? 'bg-[#c3f400] text-[#161e00]' : 'text-white/70'
                  }`}
                >
                  T20
                </button>
                <button
                  onClick={() => setFormat('odi')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    format === 'odi' ? 'bg-[#c3f400] text-[#161e00]' : 'text-white/70'
                  }`}
                >
                  50-Over ODI
                </button>
              </div>
            </div>
            <h3 className="font-headline font-extrabold text-xl text-white">
              {format === 't20' ? 'T20 Fielding Restrictions' : 'ODI 3-Phase Powerplay System'}
            </h3>
            <p className="text-xs sm:text-sm text-[#c4c9ac] mt-1">
              Fielders inside the 30-yard inner circle vs stationed at the boundary rope.
            </p>
          </div>

          {/* Powerplay Phase Switcher */}
          {format === 't20' ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setT20Phase('powerplay')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  t20Phase === 'powerplay'
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-md'
                    : 'bg-[#202020] border-white/10 text-white/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  Overs 1 to 6
                </span>
                <h4 className="font-headline font-bold text-sm text-white">Mandatory Powerplay</h4>
                <p className="text-xs text-[#c4c9ac] mt-1">Max 2 fielders outside 30-yard circle</p>
              </button>
              <button
                onClick={() => setT20Phase('death')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  t20Phase === 'death'
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-md'
                    : 'bg-[#202020] border-white/10 text-white/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  Overs 7 to 20
                </span>
                <h4 className="font-headline font-bold text-sm text-white">Non-Powerplay / Death</h4>
                <p className="text-xs text-[#c4c9ac] mt-1">Max 5 fielders outside 30-yard circle</p>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setOdiPhase('p1')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  odiPhase === 'p1'
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-md'
                    : 'bg-[#202020] border-white/10 text-white/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  P1 (Overs 1-10)
                </span>
                <h4 className="font-headline font-bold text-xs sm:text-sm text-white">Mandatory</h4>
                <p className="text-[10px] text-[#c4c9ac] mt-0.5">Max 2 outside ring</p>
              </button>
              <button
                onClick={() => setOdiPhase('p2')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  odiPhase === 'p2'
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-md'
                    : 'bg-[#202020] border-white/10 text-white/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  P2 (Overs 11-40)
                </span>
                <h4 className="font-headline font-bold text-xs sm:text-sm text-white">Middle Overs</h4>
                <p className="text-[10px] text-[#c4c9ac] mt-0.5">Max 4 outside ring</p>
              </button>
              <button
                onClick={() => setOdiPhase('p3')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  odiPhase === 'p3'
                    ? 'bg-[#c3f400]/10 border-[#c3f400] text-white shadow-md'
                    : 'bg-[#202020] border-white/10 text-white/70'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  P3 (Overs 41-50)
                </span>
                <h4 className="font-headline font-bold text-xs sm:text-sm text-white">Death Overs</h4>
                <p className="text-[10px] text-[#c4c9ac] mt-0.5">Max 5 outside ring</p>
              </button>
            </div>
          )}

          {/* Visual Ground Radar Map */}
          <div className="p-6 rounded-3xl bg-[#181818] border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-[#112416] border-2 border-dashed border-white/30 flex items-center justify-center shadow-2xl">
              {/* Outer Boundary Rope Label */}
              <span className="absolute top-2 text-[9px] font-mono text-white/50 tracking-wider">
                BOUNDARY ROPE
              </span>

              {/* 30-Yard Inner Circle */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-[#c3f400] bg-[#1a3821]/60 flex items-center justify-center relative">
                <span className="text-[9px] font-bold text-[#c3f400] uppercase tracking-wider absolute top-2">
                  30-Yard Circle
                </span>

                {/* Pitch Strip in Center */}
                <div className="w-5 h-16 bg-[#d1a86c] rounded-sm flex flex-col justify-between py-1 items-center shadow-md">
                  <div className="w-3 h-0.5 bg-white" />
                  <div className="w-3 h-0.5 bg-white" />
                </div>
              </div>

              {/* Outside Fielders Indicators */}
              <div className="absolute top-8 left-12 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center text-[9px] font-bold text-[#161e00] shadow-lg animate-bounce">
                1
              </div>
              <div className="absolute top-8 right-12 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center text-[9px] font-bold text-[#161e00] shadow-lg animate-bounce">
                2
              </div>
              {(format === 'odi' && odiPhase !== 'p1') || (format === 't20' && t20Phase === 'death') ? (
                <>
                  <div className="absolute bottom-8 left-12 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center text-[9px] font-bold text-[#161e00] shadow-lg">
                    3
                  </div>
                  <div className="absolute bottom-8 right-12 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center text-[9px] font-bold text-[#161e00] shadow-lg">
                    4
                  </div>
                </>
              ) : null}
              {(format === 'odi' && odiPhase === 'p3') || (format === 't20' && t20Phase === 'death') ? (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#c3f400] flex items-center justify-center text-[9px] font-bold text-[#161e00] shadow-lg">
                  5
                </div>
              ) : null}
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-[#c4c9ac]">
                Fielders outside circle permitted:{' '}
                <strong className="text-[#c3f400] text-sm">
                  {format === 't20'
                    ? t20Phase === 'powerplay'
                      ? '2 Fielders'
                      : '5 Fielders'
                    : odiPhase === 'p1'
                    ? '2 Fielders'
                    : odiPhase === 'p2'
                    ? '4 Fielders'
                    : '5 Fielders'}
                </strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Selected Rule: DLS Method */}
      {selectedRule === 'rule-dls' && (
        <div className="flex flex-col gap-5">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 uppercase">
                ICC Mathematical Model
              </span>
              <span className="text-xs text-[#c4c9ac] font-mono">Resource Loss Algorithm</span>
            </div>
            <h3 className="font-headline font-extrabold text-xl text-white">
              Duckworth-Lewis-Stern (DLS) Par Score Simulator
            </h3>
            <p className="text-xs sm:text-sm text-[#c4c9ac] mt-1">
              Simulate rain-delayed match revisions by tuning 1st innings total, overs lost to weather, and wickets in hand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Input Controls */}
            <div className="p-5 rounded-3xl bg-[#202020] border border-white/10 flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-white">Team 1 Score (50 Overs):</label>
                  <span className="font-headline font-black text-sm text-[#c3f400]">
                    {firstInningsScore} Runs
                  </span>
                </div>
                <input
                  type="range"
                  min={120}
                  max={420}
                  step={5}
                  value={firstInningsScore}
                  onChange={(e) => setFirstInningsScore(Number(e.target.value))}
                  className="w-full accent-[#c3f400] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-white">Overs Lost to Rain Delay:</label>
                  <span className="font-headline font-black text-sm text-[#c3f400]">
                    {oversLost} Overs Lost ({50 - oversLost} Overs Match)
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={30}
                  step={1}
                  value={oversLost}
                  onChange={(e) => setOversLost(Number(e.target.value))}
                  className="w-full accent-[#c3f400] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-white">Team 2 Wickets Lost at Break:</label>
                  <span className="font-headline font-black text-sm text-[#c3f400]">
                    {wicketsLostAtBreak} Wickets Down
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWicketsLostAtBreak(w)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        wicketsLostAtBreak === w
                          ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {w} Wkts
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated DLS Result Card */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1c260f] to-[#12170a] border border-[#c3f400]/40 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider">
                    DLS Revised Target
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c3f400] text-[#161e00]">
                    {50 - oversLost} OVERS
                  </span>
                </div>

                <div className="my-4">
                  <span className="text-xs text-[#c4c9ac]">Required to Win:</span>
                  <div className="font-headline font-black text-4xl text-white mt-0.5">
                    {dlsResult.revisedTarget}{' '}
                    <span className="text-lg font-bold text-[#c3f400]">Runs</span>
                  </div>
                  <p className="text-xs text-[#c4c9ac] mt-1">
                    Par score at interruption: <strong className="text-white">{dlsResult.parScore} runs</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#c4c9ac]">Calculated Team Resource:</span>
                  <span className="font-bold text-[#c3f400]">{dlsResult.resourceRemaining}%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c3f400] rounded-full transition-all duration-300"
                    style={{ width: `${dlsResult.resourceRemaining}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Rule: Short Ball & Free Hit */}
      {selectedRule === 'rule-short-ball' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#ffdb3c]/20 text-[#ffdb3c] border border-[#ffdb3c]/30 uppercase">
              Law 41 (Dangerous Play)
            </span>
            <h4 className="font-headline font-bold text-lg text-white mt-2">Bouncer Height Regulations</h4>
            <ul className="mt-3 space-y-2.5 text-xs text-[#c4c9ac]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">check_circle</span>
                <span><strong>T20 Cricket:</strong> 1 bouncer above shoulder allowed per over. 2nd called No Ball.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">check_circle</span>
                <span><strong>ODIs & Tests:</strong> 2 bouncers above shoulder allowed per over.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-red-400 text-[16px] shrink-0">cancel</span>
                <span><strong>Over Head Height:</strong> Immediate Wide ball (cannot be a legal bouncer).</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 uppercase">
              Law 21 (No Ball)
            </span>
            <h4 className="font-headline font-bold text-lg text-white mt-2">Free Hit Exemptions</h4>
            <ul className="mt-3 space-y-2.5 text-xs text-[#c4c9ac]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">verified</span>
                <span><strong>Allowed Dismissals on Free Hit:</strong> Run Out, Obstructing the Field, and Hit Ball Twice ONLY.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">verified</span>
                <span><strong>Immune to:</strong> Bowled, Caught, LBW, Stumped, and Hit Wicket.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0">verified</span>
                <span><strong>Field Setup Lock:</strong> Field settings cannot be adjusted unless batters crossed on previous ball.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
