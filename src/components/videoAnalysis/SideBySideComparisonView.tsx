import React, { useState, useEffect } from 'react';
import { ComparisonPair, CricketDiscipline, ScreenType } from '../../types';
import { mockComparisonPairs } from '../../data/videoDevelopmentData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface SideBySideComparisonViewProps {
  discipline: CricketDiscipline;
  onNavigate: (screen: ScreenType) => void;
  onSelectDrill?: (drillId: string) => void;
}

export const SideBySideComparisonView: React.FC<SideBySideComparisonViewProps> = ({
  discipline,
  onNavigate,
  onSelectDrill
}) => {
  const [selectedPairIndex, setSelectedPairIndex] = useState(0);
  const [isLinkedPlayback, setIsLinkedPlayback] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [syncTime, setSyncTime] = useState(1.8);
  const [frameOffset, setFrameOffset] = useState(0); // Offset in seconds between Clip A and Clip B
  const [playbackSpeed, setPlaybackSpeed] = useState(0.5);

  const totalDuration = 3.6;
  const filteredPairs = mockComparisonPairs.filter((p) => p.discipline === discipline);
  const activePair = filteredPairs[selectedPairIndex] || mockComparisonPairs[0];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSyncTime((prev) => {
        const next = prev + 0.05 * playbackSpeed;
        if (next >= totalDuration) return 0;
        return Number(next.toFixed(2));
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const clipBTime = Math.max(0, Math.min(totalDuration, Number((syncTime + frameOffset).toFixed(2))));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-3xl bg-[#1a1c1a] border border-white/10 shadow-2xl animate-fadeIn">
      {/* Top Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#242624] p-3.5 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-md bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-[10px] uppercase">
              Synchronized Dual-Player
            </span>
            <span className="text-xs text-[#c4c9ac] font-medium">Side-by-Side Biomechanical Diff</span>
          </div>
          <h2 className="font-headline font-bold text-base text-white">
            {activePair.title}
          </h2>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {mockComparisonPairs.map((pair, idx) => (
            <button
              key={pair.id}
              onClick={() => {
                setSelectedPairIndex(idx);
                playBeep(700, 0.04);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer whitespace-nowrap border ${
                activePair.id === pair.id
                  ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-sm'
                  : 'bg-black/30 text-[#c4c9ac] hover:text-white border-white/10'
              }`}
            >
              {pair.category === 'before_after' ? 'Before vs After' : 'Player vs Pro'}
            </button>
          ))}
        </div>
      </div>

      {/* Dual Video Screen Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Left Video: Clip A */}
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-black/60 border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-mono font-bold text-[10px]">
                {activePair.clipA.label}
              </span>
              <span className="font-bold text-white text-xs truncate max-w-[140px]">
                {activePair.clipA.title}
              </span>
            </div>
            <span className="text-[10px] text-[#c4c9ac] font-mono">{activePair.clipA.date}</span>
          </div>

          {/* Left Canvas Viewport */}
          <div className="relative aspect-video bg-[#0d1510] rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
            <svg className="w-full h-full" viewBox="0 0 400 225">
              {/* Pitch turf lines */}
              <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <rect x="180" y="0" width="40" height="225" fill="rgba(195,244,0,0.03)" />

              {/* Clip A Skeleton */}
              <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                <circle cx={195 + Math.sin(syncTime * 2) * 10} cy="65" r="10" fill="rgba(255,255,255,0.2)" />
                <line x1={195 + Math.sin(syncTime * 2) * 10} y1="75" x2="190" y2="125" />
                {/* Knee / Front leg flex */}
                <line x1="190" y1="125" x2="170" y2="180" />
                <line x1="190" y1="125" x2="220" y2="180" />
                {/* Arm Angle */}
                <line x1="190" y1="90" x2="225" y2="95" stroke="#ffb4ab" strokeWidth="3" />
                <line x1="225" y1="95" x2="220" y2="135" stroke="#ffb4ab" strokeWidth="3" />
              </g>

              {/* Angle Badge */}
              <rect x="15" y="15" width="130" height="24" rx="6" fill="#161e00" stroke="#ffb4ab" strokeWidth="1" />
              <text x="80" y="31" textAnchor="middle" fill="#ffb4ab" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {activePair.clipA.keyAngle}
              </text>
            </svg>

            {/* Time Stamp overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
              {syncTime.toFixed(2)}s (Frame {Math.round(syncTime * 60)})
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-[#c4c9ac] font-medium">{activePair.clipA.metricDetail}</span>
            <span className="font-mono text-xs font-bold text-white">{activePair.clipA.speedOrMetric}</span>
          </div>
        </div>

        {/* Right Video: Clip B */}
        <div className="flex flex-col gap-2 p-3 rounded-2xl bg-black/60 border border-[#c3f400]/40 relative overflow-hidden shadow-[0_0_15px_rgba(195,244,0,0.15)]">
          <div className="flex items-center justify-between text-xs pb-1 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#c3f400] text-[#161e00] font-mono font-extrabold text-[10px]">
                {activePair.clipB.label}
              </span>
              <span className="font-bold text-white text-xs truncate max-w-[140px]">
                {activePair.clipB.title}
              </span>
            </div>
            <span className="text-[10px] text-[#c3f400] font-mono font-bold">{activePair.clipB.date}</span>
          </div>

          {/* Right Canvas Viewport */}
          <div className="relative aspect-video bg-[#0d1a10] rounded-xl overflow-hidden flex items-center justify-center border border-[#c3f400]/20">
            <svg className="w-full h-full" viewBox="0 0 400 225">
              {/* Pitch turf lines */}
              <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <rect x="180" y="0" width="40" height="225" fill="rgba(195,244,0,0.08)" />

              {/* Clip B Skeleton (Lime #c3f400) */}
              <g stroke="#c3f400" strokeWidth="2.5" strokeLinecap="round">
                <circle cx={195 + Math.sin(clipBTime * 2) * 10} cy="65" r="10" fill="rgba(195,244,0,0.3)" />
                <line x1={195 + Math.sin(clipBTime * 2) * 10} y1="75" x2="190" y2="125" />
                {/* Knee / Front leg locked brace */}
                <line x1="190" y1="125" x2="170" y2="180" />
                <line x1="190" y1="125" x2="225" y2="180" stroke="#c3f400" strokeWidth="3.5" />
                {/* Arm Angle */}
                <line x1="190" y1="90" x2="230" y2="90" stroke="#c3f400" strokeWidth="3" />
                <line x1="230" y1="90" x2="225" y2="130" stroke="#c3f400" strokeWidth="3" />
              </g>

              {/* Angle Badge */}
              <rect x="15" y="15" width="130" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
              <text x="80" y="31" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                {activePair.clipB.keyAngle}
              </text>
            </svg>

            {/* Time Stamp overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[#c3f400] font-mono text-[10px]">
              {clipBTime.toFixed(2)}s (Frame {Math.round(clipBTime * 60)})
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-[#c4c9ac] font-medium">{activePair.clipB.metricDetail}</span>
            <span className="font-mono text-xs font-bold text-[#c3f400]">{activePair.clipB.speedOrMetric}</span>
          </div>
        </div>
      </div>

      {/* Synchronized Playback & Alignment Controller */}
      <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-black/50 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Play & Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playBeep(750, 0.04);
                setIsPlaying(!isPlaying);
              }}
              className="px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause Both' : 'Play Synchronized'}</span>
            </button>

            <button
              onClick={() => {
                setIsLinkedPlayback(!isLinkedPlayback);
                playBeep(650, 0.04);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer border ${
                isLinkedPlayback
                  ? 'bg-white/10 text-[#c3f400] border-[#c3f400]/40'
                  : 'bg-white/5 text-[#c4c9ac] border-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isLinkedPlayback ? 'link' : 'link_off'}
              </span>
              <span>{isLinkedPlayback ? 'Frame-Locked' : 'Independent'}</span>
            </button>
          </div>

          {/* Frame Offset Alignment Slider */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-[#c4c9ac] font-mono">Sync Alignment Offset:</span>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.02"
              value={frameOffset}
              onChange={(e) => setFrameOffset(Number(e.target.value))}
              className="w-24 accent-[#c3f400] h-1.5 bg-white/20 rounded cursor-pointer"
            />
            <span className="font-mono text-[#c3f400] text-[10px] w-12 text-right">
              {frameOffset >= 0 ? `+${frameOffset.toFixed(2)}s` : `${frameOffset.toFixed(2)}s`}
            </span>
          </div>
        </div>

        {/* Master Synchronized Seek Bar */}
        <input
          type="range"
          min="0"
          max={totalDuration}
          step="0.02"
          value={syncTime}
          onChange={(e) => setSyncTime(Number(e.target.value))}
          className="w-full accent-[#c3f400] h-2 bg-white/15 rounded-lg cursor-pointer"
        />
      </div>

      {/* Biomechanical Delta Insights & Recommended Drill */}
      <div className="p-4 rounded-2xl bg-[#162215] border border-[#c3f400]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c3f400] text-[18px]">trending_up</span>
            Biomechanical Delta Breakdown
          </h3>
          <span className="text-[10px] font-mono text-[#c3f400] font-bold">MEASURED PROGRESSION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {activePair.deltaInsights.map((insight, i) => (
            <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#c4c9ac] font-medium">{insight.metric}</span>
                <span
                  className={`font-mono text-xs font-extrabold ${
                    insight.isImprovement ? 'text-[#c3f400]' : 'text-amber-400'
                  }`}
                >
                  {insight.change}
                </span>
              </div>
              <p className="text-[11px] text-[#c4c9ac] leading-tight">
                {insight.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Recommended Drill CTA */}
        {activePair.recommendedDrillTitle && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mt-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">fitness_center</span>
              <div>
                <span className="text-[10px] text-[#c4c9ac] uppercase font-mono block">Recommended Corrective Drill:</span>
                <span className="text-xs font-bold text-white">{activePair.recommendedDrillTitle}</span>
              </div>
            </div>

            <button
              onClick={() => {
                playBallImpact();
                onNavigate('drills-vault');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center justify-center gap-1 cursor-pointer hover:bg-[#abd600] transition-colors"
            >
              <span>Launch Drill</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
