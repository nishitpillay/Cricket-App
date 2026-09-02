import React, { useState } from 'react';
import { DrillItem, ScreenType } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface DrillDetailsScreenProps {
  drill: DrillItem;
  onBack: () => void;
  onStartPractice: () => void;
}

export const DrillDetailsScreen: React.FC<DrillDetailsScreenProps> = ({
  drill,
  onBack,
  onStartPractice
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const toggleStep = (num: number) => {
    playBeep(700, 0.08);
    setCompletedSteps((prev) =>
      prev.includes(num) ? prev.filter((s) => s !== num) : [...prev, num]
    );
  };

  return (
    <div className="flex flex-col w-full relative min-h-screen bg-[#131313] pb-32">
      {/* Hero Action Shot */}
      <div className="relative w-full aspect-video rounded-b-2xl overflow-hidden glass shadow-2xl border-b border-[#c3f400]/20 max-w-4xl mx-auto">
        <div
          className="w-full h-full bg-cover bg-center absolute inset-0 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${drill.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/30 to-transparent" />

        {/* Big Center Play Button */}
        <button
          onClick={() => {
            playBeep(880, 0.1);
            setIsVideoPlaying(!isVideoPlaying);
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#c3f400]/20 glass flex items-center justify-center border border-[#c3f400]/50 hover:bg-[#c3f400]/30 transition-all shadow-xl group cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[34px] text-[#c3f400] group-hover:scale-110 transition-transform"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {isVideoPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>

        {/* Badges on hero bottom */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-[#201f1f]/80 glass text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              {drill.duration}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#201f1f]/80 glass text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
              <span className="material-symbols-outlined text-[14px]">sports_cricket</span>
              {drill.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Header Title & Tag */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h1 className="font-headline font-extrabold text-2xl sm:text-3xl text-white max-w-[80%] leading-tight">
              {drill.title}
            </h1>
            <div className="px-3 py-1 rounded-full bg-[#ffb4ab]/15 glass text-xs font-headline font-bold text-[#ffb4ab] flex items-center gap-1 border border-[#ffb4ab]/30">
              <span className="material-symbols-outlined text-[14px]">fitness_center</span>
              {drill.level}
            </div>
          </div>
          <p className="text-sm sm:text-base text-[#c4c9ac] leading-relaxed">
            {drill.description}
          </p>
        </div>

        {/* Key Focus Areas (Metrics Cards) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {drill.focusAreas.map((focus, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#201f1f] glass border border-[#c3f400]/20 relative overflow-hidden group shadow-lg"
            >
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#c3f400]/5 rounded-full blur-xl group-hover:bg-[#c3f400]/15 transition-all" />
              <div className="flex flex-col gap-1 relative z-10">
                <span className="material-symbols-outlined text-[24px] text-[#c3f400] mb-1">
                  {focus.icon}
                </span>
                <span className="font-headline font-bold text-sm text-white">
                  {focus.title}
                </span>
                <span className="text-xs text-[#c4c9ac]">{focus.description}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h2 className="font-headline font-bold text-lg text-white">Step-by-Step Execution</h2>
            <span className="text-xs text-[#c4c9ac]">
              {completedSteps.length} of {drill.steps.length} completed
            </span>
          </div>

          <div className="flex flex-col relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-white/10 pl-1">
            {drill.steps.map((step) => {
              const isDone = completedSteps.includes(step.number);

              return (
                <div
                  key={step.number}
                  onClick={() => toggleStep(step.number)}
                  className="flex gap-4 py-2.5 relative z-10 cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg border transition-all ${
                      isDone
                        ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                        : 'bg-[#201f1f] text-[#c3f400] border-[#c3f400]/40 group-hover:border-[#c3f400]'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-[20px]">check</span>
                    ) : (
                      <span className="font-headline font-bold text-sm">{step.number}</span>
                    )}
                  </div>
                  <div className="flex flex-col pt-0.5 flex-1">
                    <h3 className={`font-headline font-bold text-sm transition-colors ${isDone ? 'text-[#c3f400] line-through' : 'text-white'}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#c4c9ac] mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coach's Tip Card */}
        <div className="p-4 rounded-2xl bg-[#201f1f] glass border border-[#ffdb3c]/25 relative shadow-xl overflow-hidden">
          <div className="absolute -top-3 -right-3 w-24 h-24 bg-[#ffdb3c]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex gap-3.5 items-start relative z-10">
            <img
              src={drill.coachAvatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzq34Ypjdvr1VtP6wNpRtOb-TGCQc0o_d_JZ7_jg7ro_hFhYcfUUJHoFsAWvJEzByZwWc09CwFFsLgNi1MY7Fu6qlg9M0EOe_ivDacQ6XuhMccufNLjQSgFbGs1970RsIYQ89EcM4IvVLSXevQys7hi9S8nHj_UB4aGBjsplLM-3izqbZ2-xHyS4APnovmfZspgZ9BnyxubJ8eunNlpxqFb3iRlJm6TIqnPM9Bj7cjrhFalxVxGq9'}
              alt={drill.coach}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#ffdb3c] shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-headline font-bold text-xs text-[#ffdb3c] uppercase tracking-wider">
                  Coach's Tip
                </span>
                <span className="material-symbols-outlined text-[16px] text-[#ffdb3c]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#e5e2e1] italic leading-relaxed">
                {drill.coachTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Sticky Action Button: Start Drill Timer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 max-w-4xl mx-auto bg-gradient-to-t from-[#131313] via-[#131313]/90 to-transparent pb-safe z-30 pointer-events-none">
        <button
          onClick={() => {
            playBeep(880, 0.15);
            onStartPractice();
          }}
          className="w-full py-4 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-base tracking-tight text-center pointer-events-auto hover:bg-[#abd600] active:scale-[0.98] transition-all shadow-[0_4px_24px_rgba(195,244,0,0.4)] relative overflow-hidden group cursor-pointer border border-[#c3f400]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[22px]">timer</span>
            Start Drill Timer
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </div>
  );
};
