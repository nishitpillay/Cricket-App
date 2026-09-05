import React, { useState } from 'react';
import { ScreenType, CricketDiscipline, UserProfile } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';

interface VideoCentricPlayerSpotlightProps {
  user: UserProfile;
  onNavigate: (screen: ScreenType) => void;
}

export const VideoCentricPlayerSpotlight: React.FC<VideoCentricPlayerSpotlightProps> = ({
  user,
  onNavigate
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<CricketDiscipline>('bowling');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(0.5);
  const [currentFrame, setCurrentFrame] = useState(108);

  const disciplineData = {
    bowling: {
      title: '142.4 km/h Outswing Release (120 FPS)',
      date: 'Today • Turf Bay 1',
      metric: '172.4° Front Knee Brace',
      metricDelta: '+6.2 km/h Pace Surge',
      coachNote: 'Coach Ryan Harris: "Front leg brace is now international standard. Keep wrist cocked 22° at release."',
      keyframeLabel: 'Frame 108 (Fulcrum Lockout)',
      svgType: 'bowling'
    },
    batting: {
      title: 'Cover Drive Head-Over-Ball Calibration',
      date: 'Yesterday • Turf Bay 3',
      metric: '92.4° High Lead Elbow',
      metricDelta: '+14% Corridor Precision',
      coachNote: 'Coach Justin Langer: "Visor aligned directly over point of contact. Perfect weight transfer."',
      keyframeLabel: 'Frame 126 (Sweet Spot Impact)',
      svgType: 'batting'
    },
    fielding: {
      title: '1st Slip Low Diving Reaction Catch',
      date: 'Aug 28 • Slip Cradle',
      metric: '0.24s Split Reaction',
      metricDelta: '-0.08s Quicker First Step',
      coachNote: 'Coach Jonty Rhodes: "Soft hands cushion eliminated rebound. Elite lateral reach."',
      keyframeLabel: 'Frame 78 (Airborne Extension)',
      svgType: 'fielding'
    }
  };

  const current = disciplineData[activeDiscipline];

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-b from-[#182615] via-[#121c10] to-[#1a1e19] border border-[#c3f400]/40 shadow-2xl flex flex-col gap-4 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(195,244,0,0.4)]">
            <span className="material-symbols-outlined text-[24px]">videocam</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#c3f400]/20 text-[#c3f400] font-headline font-extrabold text-[10px] uppercase">
                Video-First Development
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">Latest High-Speed Capture</span>
            </div>
            <h2 className="font-headline font-extrabold text-base sm:text-lg text-white">
              {current.title}
            </h2>
          </div>
        </div>

        {/* Discipline Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {(['bowling', 'batting', 'fielding'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                setActiveDiscipline(d);
                playBeep(700, 0.04);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-headline font-bold capitalize transition-all cursor-pointer ${
                activeDiscipline === d
                  ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                  : 'text-[#c4c9ac] hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Center Video Card Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Video Stage (7 cols) */}
        <div className="md:col-span-7 relative aspect-video bg-[#0a0f0d] rounded-2xl overflow-hidden border border-white/10 shadow-lg flex flex-col justify-between">
          {/* Turf & Skeleton Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f381f_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />

          {/* SVG Biomechanics render */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 400 225">
              <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.15)" />
              {activeDiscipline === 'bowling' && (
                <g stroke="#c3f400" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="200" cy="60" r="10" fill="rgba(195,244,0,0.2)" />
                  <line x1="200" y1="70" x2="195" y2="120" />
                  <line x1="195" y1="120" x2="175" y2="180" />
                  <line x1="195" y1="120" x2="225" y2="180" stroke="#c3f400" strokeWidth="3.5" />
                  <line x1="195" y1="85" x2="230" y2="45" stroke="#c3f400" strokeWidth="3" />
                  {/* Badge */}
                  <rect x="235" y="35" width="85" height="20" rx="4" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                  <text x="277" y="49" textAnchor="middle" fill="#c3f400" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    172.4° BRACE
                  </text>
                </g>
              )}
              {activeDiscipline === 'batting' && (
                <g stroke="#c3f400" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="200" cy="65" r="10" fill="rgba(195,244,0,0.2)" />
                  <line x1="200" y1="75" x2="195" y2="125" />
                  <line x1="195" y1="90" x2="230" y2="92" stroke="#c3f400" strokeWidth="3" />
                  <line x1="230" y1="92" x2="225" y2="135" stroke="#c3f400" strokeWidth="3" />
                  <line x1="225" y1="135" x2="205" y2="180" stroke="#ffffff" strokeWidth="5" />
                  <rect x="240" y="82" width="85" height="20" rx="4" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                  <text x="282" y="96" textAnchor="middle" fill="#c3f400" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    ELBOW 92.4°
                  </text>
                </g>
              )}
              {activeDiscipline === 'fielding' && (
                <g stroke="#c3f400" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="205" cy="100" r="9" fill="rgba(195,244,0,0.2)" />
                  <line x1="205" y1="109" x2="215" y2="145" />
                  <line x1="215" y1="145" x2="255" y2="175" stroke="#c3f400" strokeWidth="3" />
                  <line x1="210" y1="120" x2="260" y2="165" stroke="#c3f400" strokeWidth="3" />
                  <rect x="220" y="65" width="85" height="20" rx="4" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                  <text x="262" y="79" textAnchor="middle" fill="#c3f400" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    REACTION 0.24s
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Top Status */}
          <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent text-xs font-mono">
            <span className="flex items-center gap-1.5 text-white font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping" />
              120 FPS SLOW MOTION ({playbackSpeed}x)
            </span>
            <span className="px-2 py-0.5 rounded bg-black/60 text-[#c3f400] text-[10px]">
              {current.keyframeLabel}
            </span>
          </div>

          {/* Bottom Player Bar */}
          <div className="relative z-10 flex items-center justify-between p-3 bg-gradient-to-t from-black/90 to-transparent">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playBeep(750, 0.04);
                  setIsPlaying(!isPlaying);
                }}
                className="w-8 h-8 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => {
                  playBeep(650, 0.03);
                  setCurrentFrame((f) => Math.max(1, f - 5));
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs font-mono font-bold"
              >
                -5f
              </button>
              <button
                onClick={() => {
                  playBeep(700, 0.03);
                  setCurrentFrame((f) => f + 5);
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer text-xs font-mono font-bold"
              >
                +5f
              </button>
            </div>

            <button
              onClick={() => {
                playBallImpact();
                onNavigate('video-analysis');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#161e00] text-xs font-headline font-bold flex items-center gap-1 cursor-pointer hover:bg-[#abd600] transition-colors"
            >
              <span>Open Motion Lab</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </button>
          </div>
        </div>

        {/* Right Telemetry & Coach Critique Cards (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between gap-3">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Primary Metric</span>
              <span className="font-headline font-extrabold text-sm text-white mt-0.5">
                {current.metric}
              </span>
              <span className="text-[10px] text-[#c3f400] font-mono font-bold mt-0.5">
                {current.metricDelta}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 flex flex-col">
              <span className="text-[10px] font-mono text-[#c4c9ac] uppercase">Session Date</span>
              <span className="font-headline font-extrabold text-sm text-white mt-0.5">
                {current.date}
              </span>
              <span className="text-[10px] text-[#9cf0ff] font-mono font-bold mt-0.5">
                Auto-Synced Clip
              </span>
            </div>
          </div>

          {/* Coach Feedback Bubble */}
          <div className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#ffdb3c] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">record_voice_over</span>
                COACH PINNED CRITIQUE
              </span>
              <span className="text-[10px] text-[#c4c9ac] font-mono">18s Voice Note</span>
            </div>
            <p className="text-xs text-white leading-relaxed italic">
              {current.coachNote}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                playBeep(700, 0.04);
                onNavigate('video-analysis');
              }}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-headline font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
              <span>Side-by-Side</span>
            </button>

            <button
              onClick={() => {
                playBallImpact();
                onNavigate('record');
              }}
              className="py-2.5 px-3 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-[#abd600] cursor-pointer transition-colors shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">videocam</span>
              <span>Record Next Ball</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
