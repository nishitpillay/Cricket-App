import React from 'react';
import { VideoProgressEntry, CricketDiscipline, ScreenType } from '../../types';
import { mockVideoProgressTimeline } from '../../data/videoDevelopmentData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface ProgressOverTimeReelProps {
  discipline: CricketDiscipline;
  onSelectClipToAnalyze: (clipId: string) => void;
  onLaunchComparison: (discipline: CricketDiscipline) => void;
  onNavigate: (screen: ScreenType) => void;
}

export const ProgressOverTimeReel: React.FC<ProgressOverTimeReelProps> = ({
  discipline,
  onSelectClipToAnalyze,
  onLaunchComparison,
  onNavigate
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-3xl bg-[#1a1c1a] border border-white/10 shadow-2xl animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#1c2e17] via-[#162214] to-[#202020] p-4 rounded-2xl border border-[#c3f400]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-headline font-bold text-[10px] uppercase tracking-wider">
              Video Progression Reel
            </span>
            <span className="text-xs text-[#c4c9ac] font-medium">8-Week Biomechanical Audit</span>
          </div>
          <h2 className="font-headline font-extrabold text-lg text-white">
            Measured Video Development Over Time
          </h2>
          <p className="text-xs text-[#c4c9ac] mt-0.5">
            Every recorded session is indexed with frame-level telemetry to verify long-term technical growth.
          </p>
        </div>

        <button
          onClick={() => {
            playBallImpact();
            onLaunchComparison(discipline);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:bg-[#abd600] transition-colors shadow-md shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
          <span>Launch Side-by-Side Diff</span>
        </button>
      </div>

      {/* Progression Metric Highlights Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
          <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Peak Release Speed</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-extrabold text-lg text-white">142.4 kph</span>
            <span className="font-mono text-xs font-bold text-[#c3f400]">+6.2 kph</span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">vs 136.2 baseline</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
          <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Front Knee Lockout</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-extrabold text-lg text-white">172.4°</span>
            <span className="font-mono text-xs font-bold text-[#c3f400]">+28.4°</span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">Zero knee collapse</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
          <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Head Stability Index</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-extrabold text-lg text-white">96.2%</span>
            <span className="font-mono text-xs font-bold text-[#9cf0ff]">+12.2%</span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">Level eye plane</span>
        </div>

        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
          <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Coach Mastery Score</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-headline font-extrabold text-lg text-white">9.4 / 10</span>
            <span className="font-mono text-xs font-bold text-[#c3f400]">+2.2</span>
          </div>
          <span className="text-[10px] text-[#c4c9ac]">High performance tier</span>
        </div>
      </div>

      {/* Chronological Video Timeline Cards */}
      <div className="flex flex-col gap-3">
        <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[#c3f400] text-[18px]">history</span>
          Historical Video Session Timeline
        </h3>

        <div className="flex flex-col gap-2.5">
          {mockVideoProgressTimeline.map((entry, index) => (
            <div
              key={entry.id}
              className="p-3.5 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              {/* Left Thumbnail & Info */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${entry.thumbnailBg} border border-white/15 flex flex-col items-center justify-center shrink-0 text-[#c3f400] relative overflow-hidden`}
                >
                  <span className="material-symbols-outlined text-[24px]">slow_motion_video</span>
                  <span className="text-[9px] font-mono font-bold text-white bg-black/60 px-1 rounded absolute bottom-1">
                    {entry.clipDuration}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[#c3f400] font-mono font-bold text-[10px]">
                      {entry.weekLabel}
                    </span>
                    <span className="text-xs text-[#c4c9ac] font-medium">{entry.date}</span>
                  </div>

                  <h4 className="font-headline font-bold text-sm text-white leading-tight">
                    {entry.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-black/40 text-white font-mono font-bold border border-white/5">
                      {entry.speedOrPace}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[#c3f400] font-mono font-bold border border-[#c3f400]/20">
                      {entry.primaryMetric}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 text-[#c4c9ac]">
                      {entry.keyframeMilestone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action & Rating */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-[10px] text-[#c4c9ac]">Coach Grade:</span>
                  <span className="font-headline font-bold text-[#c3f400] bg-[#c3f400]/10 px-2 py-0.5 rounded-lg border border-[#c3f400]/20">
                    {entry.coachRating} ★
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playBeep(750, 0.04);
                      onSelectClipToAnalyze(entry.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Analyze in Lab</span>
                    <span className="material-symbols-outlined text-[14px]">play_arrow</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
