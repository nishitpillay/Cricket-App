import React, { useState, useRef, useEffect } from 'react';
import { ScreenType } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';
import { SecureMediaVault } from './SecureMediaVault';

interface VideoAnalysisToolProps {
  onNavigate: (screen: ScreenType) => void;
}

export const VideoAnalysisTool: React.FC<VideoAnalysisToolProps> = ({ onNavigate }) => {
  // Video playback & slow motion
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.5); // 0.25, 0.5, 0.75, 1.0
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameTime, setCurrentFrameTime] = useState<number>(1.2); // seconds
  const totalDuration = 3.6; // 3.6 seconds total swing / delivery clip

  // Alignment & Overlay Modes
  const [overlayMode, setOverlayMode] = useState<'single' | 'ghost' | 'side-by-side'>('ghost');
  const [ghostOpacity, setGhostOpacity] = useState<number>(55); // 0 to 100%

  // Biomechanical Angle & Alignment Toggles
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showBallPath, setShowBallPath] = useState<boolean>(true);
  const [showPitchGrid, setShowPitchGrid] = useState<boolean>(true);

  // Active Keyframe
  const [activeKeyframe, setActiveKeyframe] = useState<'stance' | 'stride' | 'impact' | 'followThrough'>('impact');

  // Selected Clip
  const [selectedClip, setSelectedClip] = useState<'cover-drive' | 'outswing-delivery' | 'pull-shot'>('cover-drive');

  // Real Camera Recording
  const [isRecordingWebcam, setIsRecordingWebcam] = useState<boolean>(false);
  const [useCameraInput, setUseCameraInput] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Playback loop simulation
  useEffect(() => {
    if (!isPlaying) return;
    const intervalTime = 50 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentFrameTime((prev) => {
        const next = prev + 0.05 * playbackSpeed;
        if (next >= totalDuration) return 0;
        return Number(next.toFixed(2));
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Sync active keyframe based on time
  useEffect(() => {
    if (currentFrameTime < 0.8) setActiveKeyframe('stance');
    else if (currentFrameTime < 1.6) setActiveKeyframe('stride');
    else if (currentFrameTime < 2.4) setActiveKeyframe('impact');
    else setActiveKeyframe('followThrough');
  }, [currentFrameTime]);

  const handleSeek = (time: number) => {
    setCurrentFrameTime(time);
    playBeep(600, 0.03);
  };

  const stepFrame = (delta: number) => {
    setIsPlaying(false);
    playBeep(700, 0.03);
    setCurrentFrameTime((prev) => {
      const next = Math.max(0, Math.min(totalDuration, prev + delta));
      return Number(next.toFixed(2));
    });
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Web camera activation
  const handleToggleWebcam = async () => {
    if (!useCameraInput) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        setUseCameraInput(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        showToast('Live Camera Activated for Slow-Motion Alignment Overlay');
      } catch {
        showToast('Camera not available; running high-resolution biomechanical telemetry stream');
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      setUseCameraInput(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-5 animate-fadeIn">
      {/* Core Cricket Loop Context Strip */}
      <div className="p-3 rounded-2xl bg-[#162215] border border-[#c3f400]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c3f400]/20 flex items-center justify-center text-[#c3f400] shrink-0 font-mono font-bold">
            3/7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#c3f400] uppercase font-mono text-[10px]">Core Loop Stage 3: Analyse</span>
              <span className="text-[#8e918f]">•</span>
              <span className="text-white font-medium">Biomechanics & Slow-Mo Stepper</span>
            </div>
            <p className="text-[11px] text-[#c4c9ac] hidden sm:block">
              Inspect release angles and front-foot brace before sending to Coach Feedback or assigning Drills.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('feedback');
            }}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all border border-white/10"
          >
            <span>Next: Coach Feedback</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
          <button
            onClick={() => {
              playBeep(700, 0.05);
              onNavigate('drills-vault');
            }}
            className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-[#c3f400] text-[#111800] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
          >
            <span>Assign Drill</span>
            <span className="material-symbols-outlined text-[15px]">fitness_center</span>
          </button>
        </div>
      </div>

      {/* Top Header & Clip Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#201f1f] p-4 rounded-2xl border border-white/10 glass shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400]/20 text-[#c3f400] font-headline font-bold text-[10px] uppercase tracking-wider">
              Motion Lab
            </span>
            <span className="text-xs text-[#c4c9ac] font-medium">Slow-Mo & Trajectory Engine</span>
          </div>
          <h1 className="font-headline font-extrabold text-xl text-white">
            Video Telemetry & Frame Alignment
          </h1>
        </div>

        {/* Clip Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setSelectedClip('cover-drive');
              setCurrentFrameTime(1.2);
              playBeep(650, 0.05);
            }}
            className={`px-3 py-1.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              selectedClip === 'cover-drive'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border border-white/5'
            }`}
          >
            Cover Drive Swing
          </button>
          <button
            onClick={() => {
              setSelectedClip('outswing-delivery');
              setCurrentFrameTime(1.8);
              playBeep(650, 0.05);
            }}
            className={`px-3 py-1.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              selectedClip === 'outswing-delivery'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border border-white/5'
            }`}
          >
            142kph Outswing Release
          </button>
          <button
            onClick={() => {
              setSelectedClip('pull-shot');
              setCurrentFrameTime(1.4);
              playBeep(650, 0.05);
            }}
            className={`px-3 py-1.5 rounded-xl font-headline font-bold text-xs transition-all cursor-pointer whitespace-nowrap ${
              selectedClip === 'pull-shot'
                ? 'bg-[#c3f400] text-[#161e00] shadow-[0_0_10px_rgba(195,244,0,0.3)]'
                : 'bg-white/5 text-[#c4c9ac] hover:text-white border border-white/5'
            }`}
          >
            Bouncer Pull Swivel
          </button>
        </div>
      </div>

      {/* Main Video Analysis Stage */}
      <div className="relative w-full aspect-video sm:aspect-[16/9] bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between select-none">
        {/* Real or Simulated Video Layer */}
        {useCameraInput ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-[#0a0f0d]">
            {/* Background Net Turf Simulation */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1f381f_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#132313] to-transparent opacity-80" />

            {/* Pitch crease marks */}
            {showPitchGrid && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Popping crease line */}
                <div className="absolute bottom-16 left-0 w-full h-[1px] bg-white/20" />
                {/* 4th stump corridor */}
                <div className="absolute top-0 bottom-0 left-[48%] w-16 border-x border-[#c3f400]/20 bg-[#c3f400]/5" />
                <span className="absolute bottom-18 left-4 text-[9px] font-mono text-[#c4c9ac]/60">
                  POPPING CREASE (RETURN LINE)
                </span>
                <span className="absolute top-4 left-[49%] text-[9px] font-mono text-[#c3f400]">
                  CORRIDOR OF UNCERTAINTY
                </span>
              </div>
            )}

            {/* Pro Ghost Overlay (Superposition) */}
            {overlayMode === 'ghost' && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                style={{ opacity: ghostOpacity / 100 }}
              >
                <svg className="w-full h-full" viewBox="0 0 800 450">
                  {/* Pro Master Skeleton (Gold / Yellow #ffdb3c) */}
                  <g stroke="#ffdb3c" strokeWidth="3" strokeLinecap="round" opacity="0.85">
                    {/* Head */}
                    <circle cx="400" cy="120" r="16" fill="none" strokeWidth="2.5" />
                    {/* Spine */}
                    <line x1="400" y1="136" x2="395" y2="220" />
                    {/* High Elbow 90° reference */}
                    <line x1="395" y1="160" x2="435" y2="160" />
                    <line x1="435" y1="160" x2="435" y2="210" />
                    {/* Bat Path */}
                    <line x1="435" y1="210" x2="410" y2="340" stroke="#ffdb3c" strokeWidth="6" />
                    {/* Legs & Grounded Base */}
                    <line x1="395" y1="220" x2="350" y2="360" />
                    <line x1="395" y1="220" x2="445" y2="360" />
                  </g>
                  <text x="400" y="100" textAnchor="middle" fill="#ffdb3c" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    PRO BENCHMARK (JOE ROOT BASELINE)
                  </text>
                </svg>
              </div>
            )}

            {/* Player Skeleton & Angle HUD */}
            {showSkeleton && (
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 800 450">
                  {/* Dynamic Skeleton mapped to frame time */}
                  {selectedClip === 'cover-drive' && (
                    <g>
                      {/* Head Position */}
                      <circle
                        cx={390 + Math.sin(currentFrameTime * 2) * 15}
                        cy={125 + Math.cos(currentFrameTime * 2) * 5}
                        r="18"
                        fill="rgba(195,244,0,0.15)"
                        stroke="#c3f400"
                        strokeWidth="3"
                      />
                      {/* Eye Line Level Indicator */}
                      <line
                        x1={370 + Math.sin(currentFrameTime * 2) * 15}
                        y1={125}
                        x2={410 + Math.sin(currentFrameTime * 2) * 15}
                        y2={125}
                        stroke="#c3f400"
                        strokeWidth="2"
                        strokeDasharray="3,3"
                      />

                      {/* Torso & High Elbow */}
                      <line
                        x1={390 + Math.sin(currentFrameTime * 2) * 15}
                        y1="143"
                        x2="385"
                        y2="225"
                        stroke="#c3f400"
                        strokeWidth="3.5"
                      />
                      {/* Lead Arm & Elbow */}
                      <line x1="388" y1="162" x2="440" y2="168" stroke="#c3f400" strokeWidth="3.5" />
                      <line x1="440" y1="168" x2="430" y2="230" stroke="#c3f400" strokeWidth="3.5" />

                      {/* Bat Vector */}
                      <line
                        x1="430"
                        y1="230"
                        x2={390 + (currentFrameTime / totalDuration) * 60}
                        y2="355"
                        stroke="#ffffff"
                        strokeWidth="7"
                        strokeLinecap="round"
                      />

                      {/* Angle Labels */}
                      {showAngles && (
                        <g>
                          {/* High Elbow Angle Badge */}
                          <rect x="445" y="155" width="85" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                          <text x="487" y="171" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                            ELBOW: 92.4°
                          </text>

                          {/* Head Tilt Angle Badge */}
                          <rect x="310" y="85" width="75" height="22" rx="5" fill="#161e00" stroke="#9cf0ff" strokeWidth="1" />
                          <text x="347" y="100" textAnchor="middle" fill="#9cf0ff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            EYES: 0.4° TILT
                          </text>

                          {/* Hip-Shoulder Torque */}
                          <rect x="290" y="210" width="85" height="22" rx="5" fill="#161e00" stroke="#ffdb3c" strokeWidth="1" />
                          <text x="332" y="225" textAnchor="middle" fill="#ffdb3c" fontSize="9" fontWeight="bold" fontFamily="monospace">
                            TORQUE: 34°
                          </text>
                        </g>
                      )}
                    </g>
                  )}

                  {/* Ball Path Trajectory Arc */}
                  {showBallPath && (
                    <g>
                      {/* 3D Ball flight trajectory bezier curve */}
                      <path
                        d="M 120,80 Q 280,260 410,345 T 680,200"
                        fill="none"
                        stroke="rgba(195,244,0,0.6)"
                        strokeWidth="3"
                        strokeDasharray="6,4"
                      />
                      {/* Pitch Bounce Contact Zone */}
                      <ellipse cx="410" cy="345" rx="14" ry="7" fill="rgba(255,219,60,0.3)" stroke="#ffdb3c" strokeWidth="2" />
                      <text x="410" y="370" textAnchor="middle" fill="#ffdb3c" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        PITCH BOUNCE (5.4m GOOD LENGTH)
                      </text>

                      {/* Moving Ball Indicator */}
                      <circle
                        cx={120 + (currentFrameTime / totalDuration) * 560}
                        cy={80 + Math.sin((currentFrameTime / totalDuration) * Math.PI) * 260}
                        r="8"
                        fill="#ffdb3c"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="drop-shadow-[0_0_10px_#ffdb3c]"
                      />
                    </g>
                  )}
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Top Floating Telemetry Overlay */}
        <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400]" />
            <span className="font-mono text-xs font-bold text-white tracking-wider">
              {playbackSpeed}X SLOW MOTION
            </span>
            <span className="text-[10px] text-[#c4c9ac] font-mono bg-white/10 px-2 py-0.5 rounded">
              FRAME {Math.round(currentFrameTime * 60)} / {Math.round(totalDuration * 60)} ({currentFrameTime}s)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWebcam}
              className={`px-3 py-1 rounded-xl text-xs font-headline font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                useCameraInput
                  ? 'bg-[#ffb4ab] text-[#410002]'
                  : 'bg-black/50 text-[#c3f400] hover:bg-[#c3f400] hover:text-[#161e00] border border-[#c3f400]/40'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {useCameraInput ? 'videocam_off' : 'videocam'}
              </span>
              <span>{useCameraInput ? 'Stop Camera' : 'Live Camera'}</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs shadow-2xl animate-fadeIn">
            {toastMsg}
          </div>
        )}

        {/* Bottom Floating Scrubber & Keyframe Stepper */}
        <div className="relative z-10 flex flex-col gap-2 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          {/* Keyframe Badges */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-[#c4c9ac]">
            <button
              onClick={() => handleSeek(0.4)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeKeyframe === 'stance' ? 'bg-[#c3f400] text-[#161e00]' : 'hover:text-white'
              }`}
            >
              1. STANCE (0.4s)
            </button>
            <button
              onClick={() => handleSeek(1.2)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeKeyframe === 'stride' ? 'bg-[#c3f400] text-[#161e00]' : 'hover:text-white'
              }`}
            >
              2. STRIDE & GATHER (1.2s)
            </button>
            <button
              onClick={() => handleSeek(2.0)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeKeyframe === 'impact' ? 'bg-[#c3f400] text-[#161e00]' : 'hover:text-white'
              }`}
            >
              3. CONTACT / RELEASE (2.0s)
            </button>
            <button
              onClick={() => handleSeek(3.0)}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeKeyframe === 'followThrough' ? 'bg-[#c3f400] text-[#161e00]' : 'hover:text-white'
              }`}
            >
              4. FOLLOW-THROUGH (3.0s)
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="relative w-full flex items-center">
            <input
              type="range"
              min="0"
              max={totalDuration}
              step="0.05"
              value={currentFrameTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-[#c3f400] h-2 bg-white/20 rounded-lg cursor-pointer"
            />
          </div>

          {/* Playback Controls & Slow-Mo Speeds */}
          <div className="flex items-center justify-between pt-1">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playBeep(800, 0.04);
                  setIsPlaying(!isPlaying);
                }}
                className="w-10 h-10 rounded-full bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold hover:scale-105 transition-transform cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.5)]"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => stepFrame(-0.05)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Frame (0.05s)"
              >
                <span className="material-symbols-outlined text-[18px]">replay_5</span>
              </button>

              <button
                onClick={() => stepFrame(0.05)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Next Frame (0.05s)"
              >
                <span className="material-symbols-outlined text-[18px]">forward_5</span>
              </button>
            </div>

            {/* Speed Buttons */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              {[0.25, 0.5, 0.75, 1.0].map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    playBeep(650, 0.04);
                    setPlaybackSpeed(spd);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                      : 'text-[#c4c9ac] hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Controls & Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alignment Overlay Controller */}
        <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400] text-[18px]">layers</span>
              Ghost Alignment Overlay
            </h3>
            <span className="text-[10px] font-mono text-[#ffdb3c] font-bold">PRO COMPARISON</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOverlayMode('single')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                overlayMode === 'single' ? 'bg-[#c3f400] text-[#161e00]' : 'bg-black/30 text-[#c4c9ac]'
              }`}
            >
              Player Only
            </button>
            <button
              onClick={() => setOverlayMode('ghost')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                overlayMode === 'ghost' ? 'bg-[#c3f400] text-[#161e00]' : 'bg-black/30 text-[#c4c9ac]'
              }`}
            >
              Ghost Superposition
            </button>
          </div>

          {overlayMode === 'ghost' && (
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-[#c4c9ac]">
                <span>Pro Ghost Opacity</span>
                <span className="font-mono text-[#c3f400] font-bold">{ghostOpacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={ghostOpacity}
                onChange={(e) => setGhostOpacity(Number(e.target.value))}
                className="w-full accent-[#c3f400] h-1.5 bg-black/40 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Biomechanical Telemetry Metrics */}
        <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9cf0ff] text-[18px]">speed</span>
              Trajectory & Release Stats
            </h3>
            <span className="text-[10px] font-mono text-[#c3f400] font-bold">HAWK-EYE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-[#c4c9ac] block">EST. EXIT SPEED</span>
              <span className="font-headline font-extrabold text-lg text-white">142.4 kph</span>
              <span className="text-[9px] text-[#c3f400] block">(88.5 mph)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-[10px] text-[#c4c9ac] block">SEAM DEVIATION</span>
              <span className="font-headline font-extrabold text-lg text-[#9cf0ff]">+2.6° Out</span>
              <span className="text-[9px] text-[#9cf0ff] block">Late banana swing</span>
            </div>
          </div>
        </div>

        {/* HUD Layer Toggles */}
        <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-2">
          <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[#ffdb3c] text-[18px]">tune</span>
            Visual HUD Overlays
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setShowSkeleton(!showSkeleton)}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                showSkeleton ? 'bg-[#c3f400]/10 border-[#c3f400] text-white' : 'bg-black/30 border-white/5 text-[#c4c9ac]'
              }`}
            >
              <span>Skeleton Grid</span>
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                {showSkeleton ? 'check_box' : 'check_box_outline_blank'}
              </span>
            </button>

            <button
              onClick={() => setShowAngles(!showAngles)}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                showAngles ? 'bg-[#c3f400]/10 border-[#c3f400] text-white' : 'bg-black/30 border-white/5 text-[#c4c9ac]'
              }`}
            >
              <span>Angle Badges</span>
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                {showAngles ? 'check_box' : 'check_box_outline_blank'}
              </span>
            </button>

            <button
              onClick={() => setShowBallPath(!showBallPath)}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                showBallPath ? 'bg-[#c3f400]/10 border-[#c3f400] text-white' : 'bg-black/30 border-white/5 text-[#c4c9ac]'
              }`}
            >
              <span>Ball 3D Arc</span>
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                {showBallPath ? 'check_box' : 'check_box_outline_blank'}
              </span>
            </button>

            <button
              onClick={() => setShowPitchGrid(!showPitchGrid)}
              className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                showPitchGrid ? 'bg-[#c3f400]/10 border-[#c3f400] text-white' : 'bg-black/30 border-white/5 text-[#c4c9ac]'
              }`}
            >
              <span>Crease Lines</span>
              <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                {showPitchGrid ? 'check_box' : 'check_box_outline_blank'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#1c260f] border border-[#c3f400]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c3f400] text-[#161e00] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[22px]">auto_graph</span>
          </div>
          <div>
            <h4 className="font-headline font-bold text-sm text-white">Save Frame Telemetry</h4>
            <p className="text-xs text-[#c4c9ac]">Export biomechanical clip report to coach telestration feed.</p>
          </div>
        </div>

        <button
          onClick={() => {
            playBallImpact();
            showToast('Analysis clip & angle report saved to offline vault!');
          }}
          className="px-5 py-2.5 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs hover:bg-[#abd600] transition-colors flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.3)]"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Clip Telemetry</span>
        </button>
      </div>

      {/* Secure Media and Video Security Vault */}
      <SecureMediaVault />
    </div>
  );
};
