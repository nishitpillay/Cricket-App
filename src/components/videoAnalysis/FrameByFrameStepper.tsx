import React from 'react';
import { VideoKeyframe, CricketDiscipline } from '../../types';
import { playBeep } from '../../utils/audioFeedback';

interface FrameByFrameStepperProps {
  currentFrameTime: number;
  totalDuration: number;
  isPlaying: boolean;
  playbackSpeed: number;
  keyframes: VideoKeyframe[];
  activeKeyframeId: string;
  discipline: CricketDiscipline;
  onSeek: (time: number) => void;
  onStepFrame: (deltaSec: number) => void;
  onTogglePlay: () => void;
  onChangeSpeed: (speed: number) => void;
  onSelectKeyframe: (keyframe: VideoKeyframe) => void;
}

export const FrameByFrameStepper: React.FC<FrameByFrameStepperProps> = ({
  currentFrameTime,
  totalDuration,
  isPlaying,
  playbackSpeed,
  keyframes,
  activeKeyframeId,
  discipline,
  onSeek,
  onStepFrame,
  onTogglePlay,
  onChangeSpeed,
  onSelectKeyframe
}) => {
  const currentFrame = Math.round(currentFrameTime * 60);
  const totalFrames = Math.round(totalDuration * 60);

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#161f14] border border-[#c3f400]/30 shadow-xl">
      {/* Keyframe Milestone Strip (Discipline Tailored) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-headline font-bold text-white flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#c3f400] text-[16px]">bookmark_flag</span>
            Keyframe Milestones ({discipline.toUpperCase()})
          </span>
          <span className="text-[10px] font-mono text-[#c4c9ac]">
            CLICK MILESTONE TO SNAP FRAME
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {keyframes.map((kf, index) => {
            const isActive = activeKeyframeId === kf.id;
            return (
              <button
                key={kf.id}
                onClick={() => onSelectKeyframe(kf)}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between min-h-[58px] ${
                  isActive
                    ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.4)]'
                    : 'bg-black/40 text-[#c4c9ac] hover:text-white hover:bg-black/60 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] font-bold">
                    #{index + 1} ({kf.timestampSec.toFixed(1)}s)
                  </span>
                  {kf.status === 'optimal' ? (
                    <span className={`material-symbols-outlined text-[12px] ${isActive ? 'text-[#161e00]' : 'text-[#c3f400]'}`}>
                      check_circle
                    </span>
                  ) : (
                    <span className={`material-symbols-outlined text-[12px] ${isActive ? 'text-[#161e00]' : 'text-amber-400'}`}>
                      warning
                    </span>
                  )}
                </div>
                <span className="font-headline font-bold text-[11px] leading-tight line-clamp-1">
                  {kf.name.replace(/^\d+\.\s*/, '')}
                </span>
                <span className="font-mono text-[9px] opacity-80 truncate">
                  {kf.playerAngle || kf.optimalAngle}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Scrubber Slider */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] font-bold text-[11px]">
              FRAME {currentFrame} / {totalFrames}
            </span>
            <span className="text-white font-bold">{currentFrameTime.toFixed(2)}s</span>
          </div>
          <span className="text-[#8e918f] text-[10px]">TOTAL: {totalDuration.toFixed(1)}s (120 FPS HIGH SPEED)</span>
        </div>

        <input
          type="range"
          min="0"
          max={totalDuration}
          step="0.0166" // ~60fps step
          value={currentFrameTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full accent-[#c3f400] h-2.5 bg-black/50 rounded-lg cursor-pointer transition-all hover:h-3"
        />
      </div>

      {/* Frame Stepping & Variable Speed Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
        {/* Play & Precise Frame Stepper Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTogglePlay}
            className="w-10 h-10 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold hover:scale-105 transition-transform cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.5)]"
            title="Play / Pause (Spacebar)"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Stepper buttons */}
          <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => onStepFrame(-0.083)} // ~5 frames
              className="px-2 py-1.5 rounded-lg text-white hover:bg-white/10 text-xs font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              title="-5 Frames"
            >
              <span className="material-symbols-outlined text-[15px]">fast_rewind</span>
              <span>-5f</span>
            </button>
            <button
              onClick={() => onStepFrame(-0.0166)} // -1 frame
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#c3f400] text-xs font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              title="-1 Frame (Left Arrow)"
            >
              <span className="material-symbols-outlined text-[15px]">arrow_left</span>
              <span>-1f</span>
            </button>
            <div className="w-[1px] h-4 bg-white/20 mx-1" />
            <button
              onClick={() => onStepFrame(0.0166)} // +1 frame
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#c3f400] text-xs font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              title="+1 Frame (Right Arrow)"
            >
              <span>+1f</span>
              <span className="material-symbols-outlined text-[15px]">arrow_right</span>
            </button>
            <button
              onClick={() => onStepFrame(0.083)} // +5 frames
              className="px-2 py-1.5 rounded-lg text-white hover:bg-white/10 text-xs font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              title="+5 Frames"
            >
              <span>+5f</span>
              <span className="material-symbols-outlined text-[15px]">fast_forward</span>
            </button>
          </div>
        </div>

        {/* Slow-Motion Rate Selector */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono text-[#8e918f] px-1.5 hidden sm:inline">SLOW-MO:</span>
          {[0.1, 0.25, 0.5, 0.75, 1.0].map((rate) => (
            <button
              key={rate}
              onClick={() => {
                playBeep(650, 0.04);
                onChangeSpeed(rate);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                playbackSpeed === rate
                  ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              {rate === 0.1 ? '0.1x (Micro)' : `${rate}x`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
