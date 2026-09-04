import React, { useState } from 'react';
import { AutoSlicedDeliveryClip } from '../../types';
import { mockAutoSlicedClips } from '../../data/autoSlicerPlaylistData';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface AutoSlicerLiveTrayProps {
  isRecording: boolean;
  onOpenPlaylistModal: () => void;
  onSelectClip?: (clip: AutoSlicedDeliveryClip) => void;
}

export const AutoSlicerLiveTray: React.FC<AutoSlicerLiveTrayProps> = ({
  isRecording,
  onOpenPlaylistModal,
  onSelectClip,
}) => {
  const [slicedClips, setSlicedClips] = useState<AutoSlicedDeliveryClip[]>(() =>
    mockAutoSlicedClips.slice(0, 4)
  );
  const [lastSlicedToast, setLastSlicedToast] = useState<{
    ballNumber: number;
    speed: number;
    outcome: string;
    duration: number;
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Trigger a simulated auto-sliced delivery
  const handleSimulateAutoSlice = () => {
    playBallImpact();
    const nextBallNum = slicedClips.length + 1;
    const randomSpeed = parseFloat((138 + Math.random() * 8).toFixed(1));
    const randomDuration = parseFloat((4.2 + Math.random() * 0.8).toFixed(1));
    const outcomes = ['Dot', 'Wicket', 'Play and Miss', 'Single'] as const;
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    const newClip: AutoSlicedDeliveryClip = {
      id: `auto-clip-${Date.now()}`,
      ballNumber: nextBallNum,
      overNumber: `2.${(nextBallNum % 6) + 1}`,
      sessionTitle: "Lord's Elite Fast Bowling Nets",
      timestamp: 'Just now',
      durationSeconds: randomDuration,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
      videoSimUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      triggerMethod: 'DUAL_VISION_AUDIO_FUSION',
      detectionConfidencePct: 98.7,
      isBookmarked: outcome === 'Wicket',
      tags: ['Auto-Sliced', `${randomSpeed} km/h`, outcome],
      delivery: {
        ...mockAutoSlicedClips[0].delivery,
        id: `del-${Date.now()}`,
        ballNumber: nextBallNum,
        speedKmh: randomSpeed,
        outcome: outcome as any,
      },
    };

    setSlicedClips((prev) => [newClip, ...prev]);
    setLastSlicedToast({
      ballNumber: nextBallNum,
      speed: randomSpeed,
      outcome,
      duration: randomDuration,
    });

    setTimeout(() => {
      setLastSlicedToast(null);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-2 w-full select-none z-30">
      {/* 1. Live Sliced Notification Banner */}
      {lastSlicedToast && (
        <div className="mx-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#161e00] border-2 border-[#c3f400] text-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.4)] animate-bounce backdrop-blur-md">
          <span className="material-symbols-outlined text-[20px] text-[#c3f400]">auto_videocam</span>
          <div className="flex items-center gap-2 text-xs font-headline font-bold">
            <span>⚡ Ball #{lastSlicedToast.ballNumber} Auto-Sliced!</span>
            <span className="text-white font-mono">{lastSlicedToast.speed} km/h</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400]">
              {lastSlicedToast.duration}s
            </span>
          </div>
        </div>
      )}

      {/* 2. Slicer Status & Controls Bar */}
      <div className="glass rounded-2xl p-2.5 sm:p-3 border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                isRecording ? 'bg-[#c3f400] animate-ping' : 'bg-green-400'
              }`}
            />
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wide text-white">
              {isRecording ? 'AUTO-SLICER BUFFERING' : 'AUTO-SLICER ARMED'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#c4c9ac]">
            <span>Pre-Roll: 1.5s</span>
            <span>•</span>
            <span>Acoustic Trigger: -16dB</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Quick Simulation Trigger Button */}
          <button
            onClick={handleSimulateAutoSlice}
            title="Simulate ball delivery detection"
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-bold text-white flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px] text-[#c3f400]">smart_toy</span>
            <span>Simulate Delivery Slice</span>
          </button>

          {/* Toggle Reel Tray */}
          <button
            onClick={() => {
              playBeep(650, 0.03);
              setIsExpanded(!isExpanded);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-[#c4c9ac] hover:text-white flex items-center gap-1 cursor-pointer transition"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_more' : 'expand_less'}
            </span>
            <span>{slicedClips.length} Clips</span>
          </button>

          {/* Open Full Playlist Feed */}
          <button
            onClick={() => {
              playBeep(750, 0.05);
              onOpenPlaylistModal();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-black text-xs flex items-center gap-1 shadow-[0_0_12px_rgba(195,244,0,0.3)] hover:brightness-110 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">video_library</span>
            <span>Playlist Feed</span>
          </button>
        </div>
      </div>

      {/* 3. Horizontal Reel Tray of Recent Slices */}
      {isExpanded && (
        <div className="glass rounded-2xl p-3 border border-white/15 bg-black/75 backdrop-blur-md animate-fadeIn flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#c4c9ac] px-1">
            <span className="font-bold uppercase tracking-wider text-white">
              Recent Auto-Sliced Deliveries ({slicedClips.length})
            </span>
            <span>Tap clip to inspect telemetry & slow-mo</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {slicedClips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => {
                  playBeep(700, 0.04);
                  if (onSelectClip) {
                    onSelectClip(clip);
                  } else {
                    onOpenPlaylistModal();
                  }
                }}
                className="group relative flex-shrink-0 w-32 aspect-video rounded-xl bg-black/60 border border-white/15 hover:border-[#c3f400] overflow-hidden cursor-pointer transition-all shadow-md hover:scale-105"
              >
                <img
                  src={clip.thumbnailUrl}
                  alt={`Ball #${clip.ballNumber}`}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                <div className="absolute top-1 left-1.5 text-[9px] font-mono font-bold bg-black/80 px-1 py-0.5 rounded text-white border border-white/10">
                  #{clip.ballNumber}
                </div>

                <div className="absolute top-1 right-1.5 text-[9px] font-mono font-bold text-[#c3f400]">
                  {clip.durationSeconds}s
                </div>

                <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-[#c3f400] font-headline">{clip.delivery.speedKmh}k</span>
                  <span
                    className={`text-[8px] px-1 rounded ${
                      clip.delivery.outcome === 'Wicket'
                        ? 'bg-red-500/30 text-red-300'
                        : 'bg-white/10 text-white/80'
                    }`}
                  >
                    {clip.delivery.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
