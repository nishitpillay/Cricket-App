import React, { useState } from 'react';
import { TacticalMasterclass, ScreenType } from '../../types';
import { mockMasterclasses } from '../../data/tacticsAndPlannerData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface TacticalMasterclassesProps {
  onNavigate: (screen: ScreenType) => void;
  onOpenScenario?: () => void;
}

export const TacticalMasterclasses: React.FC<TacticalMasterclassesProps> = ({
  onNavigate,
  onOpenScenario
}) => {
  const [masterclasses] = useState<TacticalMasterclass[]>(mockMasterclasses);
  const [selectedClass, setSelectedClass] = useState<TacticalMasterclass>(mockMasterclasses[0]);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(35); // 35%

  const handleSelectClass = (cls: TacticalMasterclass) => {
    playBeep(700, 0.05);
    setSelectedClass(cls);
    setActiveChapterIndex(0);
    setIsVideoPlaying(false);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c260f] via-[#161f0d] to-[#202020] p-6 rounded-3xl border border-[#c3f400]/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-bold text-[10px] uppercase tracking-wider">
              Pro Elite Strategy
            </span>
            <span className="text-xs text-[#ffdb3c] font-bold">Match Awareness Masterclasses</span>
          </div>
          <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">
            Tactical Masterclasses
          </h1>
          <p className="text-sm text-[#c4c9ac] mt-1 max-w-xl">
            In-depth strategy breakdowns by international legends covering death bowling geometry, captaincy field chess, and turning pitch setups.
          </p>
        </div>

        {onOpenScenario && (
          <button
            onClick={onOpenScenario}
            className="px-5 py-3 rounded-2xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(195,244,0,0.3)] shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">psychology</span>
            <span>Test in Match Scenarios</span>
          </button>
        )}
      </div>

      {/* Main Masterclass Interactive Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Video & Tactical Board */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Simulated Video Player Stage */}
          <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl group flex flex-col justify-between">
            <img
              src={selectedClass.videoThumbnail}
              alt={selectedClass.title}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                isVideoPlaying ? 'scale-105 filter brightness-75' : 'brightness-90'
              }`}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* Top Coach Badge */}
            <div className="relative z-10 flex items-center justify-between p-4">
              <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <img
                  src={selectedClass.coachAvatar}
                  alt={selectedClass.coach}
                  className="w-7 h-7 rounded-full object-cover border border-[#c3f400]"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">
                    {selectedClass.coach}
                  </span>
                  <span className="text-[9px] text-[#c4c9ac] font-medium block">
                    {selectedClass.coachRole}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-mono text-xs font-bold border border-[#c3f400]/30 backdrop-blur-md">
                {selectedClass.duration}
              </span>
            </div>

            {/* Center Play Button if paused */}
            {!isVideoPlaying && (
              <div className="relative z-10 flex items-center justify-center">
                <button
                  onClick={() => {
                    playBallImpact();
                    setIsVideoPlaying(true);
                  }}
                  className="w-16 h-16 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold shadow-[0_0_30px_rgba(195,244,0,0.6)] hover:scale-110 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[36px]">play_arrow</span>
                </button>
              </div>
            )}

            {/* Bottom Floating Bar */}
            <div className="relative z-10 p-4 flex flex-col gap-2 bg-gradient-to-t from-black/95 to-transparent">
              <div className="flex justify-between items-center text-xs">
                <span className="font-headline font-bold text-white truncate max-w-[80%]">
                  {selectedClass.chapters[activeChapterIndex]?.title}
                </span>
                <span className="font-mono text-[10px] text-[#c3f400]">
                  {selectedClass.chapters[activeChapterIndex]?.timestamp}
                </span>
              </div>

              {/* Progress Slider */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#c3f400] h-full rounded-full transition-all duration-300"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    playBeep(650, 0.04);
                    setIsVideoPlaying(!isVideoPlaying);
                  }}
                  className="text-xs font-bold text-white flex items-center gap-1 hover:text-[#c3f400]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isVideoPlaying ? 'pause' : 'play_arrow'}
                  </span>
                  <span>{isVideoPlaying ? 'Pause Video' : 'Resume Masterclass'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#c4c9ac] font-mono">1080p 60FPS PRO HUD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Tactics Grid */}
          <div className="p-5 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-4">
            <h3 className="font-headline font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px]">lightbulb</span>
              Elite Tactical Principles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedClass.keyTactics.map((tactic, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-1.5 hover:border-[#c3f400]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#c3f400]/10 text-[#c3f400] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[18px]">{tactic.icon}</span>
                  </div>
                  <h4 className="font-headline font-bold text-xs text-white mt-1">
                    {tactic.title}
                  </h4>
                  <p className="text-[11px] text-[#c4c9ac] leading-relaxed">
                    {tactic.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Coach Gold Rule Banner */}
            <div className="p-3.5 rounded-xl bg-[#1c260f] border border-[#c3f400]/30 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#c3f400] text-[20px] shrink-0 mt-0.5">
                format_quote
              </span>
              <div>
                <span className="text-[10px] font-bold text-[#c3f400] uppercase tracking-wider block">
                  COACH WHITEBOARD SUMMARY
                </span>
                <p className="text-xs text-white italic mt-0.5">
                  "{selectedClass.whiteboardTakeaway}"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Chapter Timeline & Class Library */}
        <div className="flex flex-col gap-4">
          {/* Chapters Navigation */}
          <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
            <h3 className="font-headline font-bold text-sm text-white flex items-center justify-between">
              <span>Class Chapters ({selectedClass.chapters.length})</span>
              <span className="text-[10px] text-[#c4c9ac] font-mono">TIMESTAMPS</span>
            </h3>

            <div className="flex flex-col gap-2">
              {selectedClass.chapters.map((ch, idx) => {
                const isActive = activeChapterIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      playBeep(650, 0.04);
                      setActiveChapterIndex(idx);
                      setVideoProgress(idx * 30 + 15);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isActive
                        ? 'bg-[#c3f400]/15 border-[#c3f400] text-white shadow-sm'
                        : 'bg-black/20 border-white/5 text-[#c4c9ac] hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#c3f400] block mb-0.5">
                        {ch.timestamp}
                      </span>
                      <h4 className="font-headline font-bold text-xs text-white leading-snug">
                        {ch.title}
                      </h4>
                      <p className="text-[11px] text-[#c4c9ac] mt-1 line-clamp-2">
                        {ch.summary}
                      </p>
                    </div>

                    {isActive && (
                      <span className="material-symbols-outlined text-[#c3f400] text-[18px] shrink-0 mt-1">
                        play_circle
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Masterclass Library Switcher */}
          <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
            <h3 className="font-headline font-bold text-sm text-white">
              All Masterclasses
            </h3>

            <div className="flex flex-col gap-2.5">
              {masterclasses.map((cls) => {
                const isSelected = selectedClass.id === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => handleSelectClass(cls)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#c3f400]/10 border-[#c3f400]'
                        : 'bg-black/30 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={cls.videoThumbnail}
                      alt={cls.title}
                      className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#c3f400] block">
                        {cls.badge}
                      </span>
                      <h4 className="font-headline font-bold text-xs text-white truncate">
                        {cls.title}
                      </h4>
                      <span className="text-[10px] text-[#c4c9ac]">{cls.coach}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
