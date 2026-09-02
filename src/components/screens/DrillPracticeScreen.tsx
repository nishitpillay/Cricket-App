import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DrillItem, ScreenType } from '../../types';
import { playBeep, playCricketWhistle } from '../../utils/audioFeedback';

interface DrillPracticeScreenProps {
  drill: DrillItem;
  onBack: () => void;
  onFinish: () => void;
}

export const DrillPracticeScreen: React.FC<DrillPracticeScreenProps> = ({
  drill,
  onBack,
  onFinish
}) => {
  // Timer counting down from 14:40 (880s)
  const [secondsRemaining, setSecondsRemaining] = useState(880);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSet, setCurrentSet] = useState(2);
  const [totalSets] = useState(3);
  const [currentRep, setCurrentRep] = useState(8);
  const [headStability, setHeadStability] = useState(94);
  const [balanceTransfer, setBalanceTransfer] = useState(88);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Live timer interval
  useEffect(() => {
    if (isPaused || showCompletionModal) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerCompletion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, showCompletionModal]);

  // Minor realistic telemetry fluctuations
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setHeadStability((prev) => Math.min(99, Math.max(90, prev + (Math.random() > 0.5 ? 1 : -1))));
      setBalanceTransfer((prev) => Math.min(96, Math.max(84, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextRep = () => {
    playBeep(900, 0.1);
    if (currentRep < 10) {
      setCurrentRep((r) => r + 1);
    } else {
      if (currentSet < totalSets) {
        setCurrentSet((s) => s + 1);
        setCurrentRep(1);
      } else {
        triggerCompletion();
      }
    }
  };

  const triggerCompletion = () => {
    playCricketWhistle();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#c3f400', '#ffdb3c', '#ffffff']
    });
    setShowCompletionModal(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-56px)] min-h-[640px] overflow-hidden bg-[#131313] flex flex-col justify-between select-none">
      {/* Live Camera Feed Backdrop (Simulated Action Shot with Skeleton tracking) */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaELjMkCcjAJ6As3qfYQIrSsKs0XyIXLXzEHfIxpCmW75T70fuOdFbfdpPS5q5Hn0hZVApNJvHwwdlOsFCFe0tgjZiXuGKatFnD1EVyW70FcvvpyNrd3AxdQkTHf3pqk_-6nm9HfhoTrbqdckbLOdcG1wQf7xbu1GJYCtY4ZfY4sQDdGbpCQ8vKC6z-2haJqNGGSEVPU-CntdYKiZmB4m0lCrUqt_AmcE-JNR0yWtp0Hiy8QQ55xz_')`
        }}
      >
        {/* Dark Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#131313]/90 via-[#131313]/30 to-[#131313]/95" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col w-full h-full p-4 sm:p-6 justify-between max-w-lg mx-auto">
        {/* Top HUD: Recording status + Live Gauges */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="glass px-3 py-1.5 rounded-full border border-[#c3f400]/20 flex items-center gap-2 shadow-lg backdrop-blur-md bg-[#201f1f]/70">
              <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-[#ffb4ab] animate-pulse'}`} />
              <span className="font-headline font-bold text-white uppercase tracking-wider text-[10px]">
                {isPaused ? 'Paused' : 'Recording'}
              </span>
            </div>

            {/* Live HUD Stats */}
            <div className="flex gap-2">
              <div className="glass px-3 py-1.5 rounded-xl border border-[#c3f400]/30 bg-[#201f1f]/50 flex flex-col items-end backdrop-blur-md">
                <span className="text-[#c4c9ac] text-[9px] uppercase font-bold tracking-wider">
                  Head Stability
                </span>
                <span className="font-headline font-extrabold text-sm text-[#c3f400] drop-shadow-[0_0_8px_rgba(195,244,0,0.6)]">
                  {headStability}%
                </span>
              </div>
              <div className="glass px-3 py-1.5 rounded-xl border border-[#c3f400]/30 bg-[#201f1f]/50 flex flex-col items-end backdrop-blur-md">
                <span className="text-[#c4c9ac] text-[9px] uppercase font-bold tracking-wider">
                  Balance Transfer
                </span>
                <span className="font-headline font-extrabold text-sm text-[#c3f400] drop-shadow-[0_0_8px_rgba(195,244,0,0.6)]">
                  {balanceTransfer}%
                </span>
              </div>
            </div>
          </div>

          {/* Main Timer and Title */}
          <div className="flex flex-col items-center mt-1">
            <span
              id="drill-timer"
              className="font-headline font-extrabold text-4xl sm:text-5xl text-[#c3f400] drop-shadow-[0_0_20px_rgba(195,244,0,0.7)] font-mono tracking-tighter cursor-pointer"
              onClick={handleNextRep}
              title="Click to advance rep"
            >
              {formatTime(secondsRemaining)}
            </span>
            <h1 className="font-headline font-bold text-lg sm:text-xl text-white mt-0.5 text-center">
              {drill.title}
            </h1>
            <p className="text-xs text-[#c4c9ac] mt-0.5 text-center font-medium">
              Set {currentSet} of {totalSets} • Rep {currentRep}
            </p>
          </div>

          {/* Set Progress Bar */}
          <div className="w-full mt-1">
            <div className="w-full h-2 bg-[#353534] rounded-full overflow-hidden border border-white/5 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-[#abd600] to-[#c3f400] rounded-full shadow-[0_0_10px_rgba(195,244,0,0.6)] transition-all duration-700 ease-in-out relative"
                style={{ width: `${((currentSet - 1) * 10 + currentRep) * 3.33}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center Space: AI Focus Reticle Box with Scanning Laser */}
        <div
          onClick={handleNextRep}
          title="Tap to log complete rep"
          className="flex-1 flex items-center justify-center my-2 cursor-pointer group"
        >
          <div className="w-48 sm:w-56 h-60 sm:h-72 border-2 border-[#c3f400]/30 rounded-2xl relative transition-all group-hover:border-[#c3f400]/70 group-hover:scale-105">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-3 border-l-3 border-[#c3f400] -mt-1 -ml-1 rounded-tl" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-3 border-r-3 border-[#c3f400] -mt-1 -mr-1 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-3 border-l-3 border-[#c3f400] -mb-1 -ml-1 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-3 border-r-3 border-[#c3f400] -mb-1 -mr-1 rounded-br" />

            {/* Scanning Line Animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.9)] animate-scanline" />

            {/* Tap prompt */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold text-[#c3f400] border border-[#c3f400]/30 whitespace-nowrap opacity-75 group-hover:opacity-100">
              Tap frame for +1 Rep
            </div>
          </div>
        </div>

        {/* Bottom Controls & Voice Coach Cue */}
        <div className="flex flex-col gap-4 pb-4">
          {/* Coach Cue Pill */}
          <div className="glass p-3.5 rounded-2xl border border-[#ffdb3c]/30 bg-[#201f1f]/85 flex items-start gap-3 backdrop-blur-xl shadow-xl relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-24 h-24 bg-[#ffdb3c]/15 blur-2xl rounded-full" />
            <div className="w-9 h-9 rounded-full bg-[#ffdb3c]/15 flex items-center justify-center shrink-0 border border-[#ffdb3c]/30 z-10">
              <span className="material-symbols-outlined text-[#ffdb3c] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                record_voice_over
              </span>
            </div>
            <div className="flex flex-col z-10">
              <span className="font-headline font-bold text-[#ffdb3c] uppercase tracking-wider text-[10px] mb-0.5">
                Coach's Cue
              </span>
              <p className="text-xs sm:text-sm text-white leading-snug">
                "{drill.coachTip.replace(/^"|"$/g, '') || 'Keep your head completely still through the point of contact. Watch the ball onto the bat.'}"
              </p>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                playBeep(600, 0.1);
                setIsPaused(!isPaused);
              }}
              className="flex-1 glass py-3.5 rounded-xl border border-[#c3f400]/40 bg-[#131313]/40 text-[#c3f400] font-headline font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg backdrop-blur-md cursor-pointer hover:bg-[#c3f400]/10"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPaused ? 'play_arrow' : 'pause'}
              </span>
              {isPaused ? 'Resume' : 'Pause'}
            </button>

            <button
              onClick={triggerCompletion}
              className="flex-1 bg-[#c3f400] text-[#161e00] py-3.5 rounded-xl font-headline font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(195,244,0,0.4)] transition-all active:scale-95 cursor-pointer hover:bg-[#abd600] border border-[#c3f400]"
            >
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                stop_circle
              </span>
              Finish
            </button>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
          <div className="w-full max-w-sm bg-[#201f1f] border border-[#c3f400]/40 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-[#c3f400]/20 border-2 border-[#c3f400] flex items-center justify-center mx-auto mb-3 text-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.4)]">
              <span className="material-symbols-outlined text-[36px]">emoji_events</span>
            </div>
            <h3 className="font-headline font-extrabold text-2xl text-white mb-1">
              Drill Completed!
            </h3>
            <p className="text-xs text-[#c4c9ac] mb-4">
              Mastery score logged to your player performance index.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-[#c4c9ac] block">HEAD STABILITY</span>
                <span className="font-headline font-extrabold text-xl text-[#c3f400]">{headStability}%</span>
              </div>
              <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <span className="text-[10px] text-[#c4c9ac] block">BALANCE SCORE</span>
                <span className="font-headline font-extrabold text-xl text-[#ffdb3c]">{balanceTransfer}%</span>
              </div>
            </div>

            <button
              onClick={onFinish}
              className="w-full py-3.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-sm shadow-[0_0_15px_rgba(195,244,0,0.3)] hover:bg-[#abd600] transition-colors"
            >
              View Coach Analysis & Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
