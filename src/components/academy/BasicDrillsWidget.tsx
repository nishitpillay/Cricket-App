import React, { useState } from 'react';
import { mockBasicDrills, BasicDrillGuide } from '../../data/academyData';
import { ScreenType } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface BasicDrillsWidgetProps {
  onNavigate: (screen: ScreenType) => void;
}

export const BasicDrillsWidget: React.FC<BasicDrillsWidgetProps> = ({ onNavigate }) => {
  const [selectedDrill, setSelectedDrill] = useState<BasicDrillGuide>(mockBasicDrills[0]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isPlayingSim, setIsPlayingSim] = useState<boolean>(false);

  const handleSelectDrill = (drill: BasicDrillGuide) => {
    playBeep(700, 0.05);
    setSelectedDrill(drill);
    setActiveStepIndex(0);
    setIsPlayingSim(false);
  };

  const handleNextStep = () => {
    if (activeStepIndex < selectedDrill.stepByStep.length - 1) {
      playBeep(800, 0.06);
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      playBeep(600, 0.06);
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const currentStep = selectedDrill.stepByStep[activeStepIndex];

  return (
    <div className="flex flex-col gap-6">
      {/* Drills Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mockBasicDrills.map((drill) => {
          const isSelected = selectedDrill.id === drill.id;
          return (
            <button
              key={drill.id}
              onClick={() => handleSelectDrill(drill)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#c3f400]/15 border-[#c3f400] text-white shadow-[0_0_15px_rgba(195,244,0,0.15)]'
                  : 'bg-[#202020] border-white/10 hover:border-white/20 text-white/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/10 text-[#c3f400] uppercase">
                  {drill.targetArea}
                </span>
                <span className="text-[10px] text-[#c4c9ac]">{drill.duration}</span>
              </div>
              <h4 className="font-headline font-bold text-xs sm:text-sm line-clamp-2 leading-tight">
                {drill.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Focus Tutorial Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visual Video & AI Skeleton Simulation Player (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-3xl bg-black/60 border border-white/10 overflow-hidden flex flex-col justify-between p-4 shadow-2xl">
            {/* Background Simulated Video Image */}
            <img
              src={selectedDrill.videoPoster}
              alt={selectedDrill.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              referrerPolicy="no-referrer"
            />
            {/* Video Tint Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />

            {/* Simulated Live Pose Tracking Overlay / Laser Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 250">
              {/* Head crosshair */}
              <circle cx="200" cy="80" r="18" fill="none" stroke="#c3f400" strokeWidth="2.5" />
              <line x1="200" y1="50" x2="200" y2="110" stroke="#c3f400" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="170" y1="80" x2="230" y2="80" stroke="#c3f400" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Spine line */}
              <line x1="200" y1="98" x2="200" y2="170" stroke="#34d399" strokeWidth="2.5" />

              {/* High lead elbow angle */}
              <line x1="200" y1="110" x2="245" y2="135" stroke="#c3f400" strokeWidth="3" />
              <line x1="245" y1="135" x2="230" y2="190" stroke="#c3f400" strokeWidth="3" />
              <circle cx="245" cy="135" r="5" fill="#ffdb3c" />

              {/* Text label */}
              <text x="255" y="140" fill="#c3f400" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                HIGH ELBOW: 92°
              </text>
              <text x="210" y="70" fill="#ffffff" fontSize="10" fontFamily="sans-serif">
                STILL HEAD: 0.2° DEVIATION
              </text>
            </svg>

            {/* Video Top Controls */}
            <div className="flex items-center justify-between relative z-10">
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Fundamental Mechanics Tutorial
              </span>
              <span className="text-xs font-mono text-white/80 bg-black/50 px-2 py-0.5 rounded-md">
                Step {activeStepIndex + 1} of {selectedDrill.stepByStep.length}
              </span>
            </div>

            {/* Interactive Step Highlight Overlay */}
            <div className="relative z-10 bg-black/70 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#c3f400]">
                  Step {currentStep.stepNumber}: {currentStep.title}
                </span>
                <span className="text-[9px] text-[#c4c9ac] font-mono">
                  Visual Cue: {currentStep.visualCue}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1">{currentStep.instructions}</p>
            </div>

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between relative z-10 pt-2 border-t border-white/10">
              <button
                onClick={handlePrevStep}
                disabled={activeStepIndex === 0}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Previous
              </button>

              {/* Progress Dots */}
              <div className="flex items-center gap-1.5">
                {selectedDrill.stepByStep.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStepIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === activeStepIndex ? 'w-6 bg-[#c3f400]' : 'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNextStep}
                disabled={activeStepIndex === selectedDrill.stepByStep.length - 1}
                className="px-3 py-1.5 rounded-xl bg-[#c3f400] hover:bg-[#abd600] disabled:opacity-30 text-[#161e00] text-xs font-bold transition-all flex items-center gap-1"
              >
                Next
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Action Trigger: Practice with Live AI Camera HUD */}
          <div className="p-4 rounded-3xl bg-[#202020] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="font-headline font-bold text-sm text-white">
                Test This Drill With AI Tracking
              </h4>
              <p className="text-xs text-[#c4c9ac]">
                Launch our skeleton tracker to measure head stillness in real time.
              </p>
            </div>
            <button
              onClick={() => {
                playBeep(880, 0.08);
                onNavigate('record');
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#c3f400] hover:bg-[#abd600] text-[#161e00] font-headline font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[18px]">videocam</span>
              <span>Launch Live Camera HUD</span>
            </button>
          </div>
        </div>

        {/* Drill Mechanics Breakdown & Checkpoints (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Overview & Coach Cue Card */}
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10 shadow-lg">
            <h3 className="font-headline font-black text-lg text-white mb-2">
              {selectedDrill.title}
            </h3>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">{selectedDrill.overview}</p>

            <div className="mt-4 p-3 rounded-2xl bg-[#ffdb3c]/10 border border-[#ffdb3c]/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffdb3c] block mb-1">
                Coach Carter's Golden Cue:
              </span>
              <p className="text-xs text-white/95 italic font-medium">{selectedDrill.coachCue}</p>
            </div>
          </div>

          {/* Key Checkpoints Checklist */}
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-[#c3f400] mb-3">
              Biomechanical Checkpoints
            </h4>
            <ul className="space-y-2.5">
              {selectedDrill.keyCheckpoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                  <span className="material-symbols-outlined text-[#c3f400] text-[16px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Faults vs Fixes */}
          <div className="p-5 rounded-3xl bg-[#202020] border border-white/10">
            <h4 className="font-headline font-bold text-xs uppercase tracking-wider text-red-400 mb-3">
              Amateur Faults & Instant Fixes
            </h4>
            <div className="space-y-3">
              {selectedDrill.commonFaults.map((cf, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 mb-1">
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    <span>Fault: {cf.fault}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#c3f400]">
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    <span>Fix: {cf.fix}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
