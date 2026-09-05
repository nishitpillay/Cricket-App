import React, { useState, useRef, useEffect } from 'react';
import { ScreenType, CricketDiscipline, VideoKeyframe, CoachVideoComment, QuickUploadVideoPreset } from '../../types';
import { playBeep, playBallImpact, playCelebration } from '../../utils/audioFeedback';
import { SecureMediaVault } from './SecureMediaVault';
import { FrameByFrameStepper } from './FrameByFrameStepper';
import { CoachVideoCommentsOverlay } from './CoachVideoCommentsOverlay';
import { SideBySideComparisonView } from './SideBySideComparisonView';
import { ProgressOverTimeReel } from './ProgressOverTimeReel';
import { QuickUploadAndCaptureModal } from './QuickUploadAndCaptureModal';
import {
  mockVideoDisciplines,
  mockKeyframesByDiscipline,
  mockCoachVideoComments
} from '../../data/videoDevelopmentData';

interface VideoAnalysisToolProps {
  onNavigate: (screen: ScreenType) => void;
  initialDiscipline?: CricketDiscipline;
}

export const VideoAnalysisTool: React.FC<VideoAnalysisToolProps> = ({
  onNavigate,
  initialDiscipline = 'bowling'
}) => {
  // Discipline & Active Sub-Tab
  const [discipline, setDiscipline] = useState<CricketDiscipline>(initialDiscipline);
  const [activeTab, setActiveTab] = useState<'slowmo' | 'compare' | 'comments' | 'progress'>('slowmo');

  // Video playback & slow motion
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.5); // 0.1, 0.25, 0.5, 0.75, 1.0
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrameTime, setCurrentFrameTime] = useState<number>(1.8); // seconds
  const totalDuration = 3.6;

  // Alignment & Overlay Modes
  const [overlayMode, setOverlayMode] = useState<'single' | 'ghost'>('ghost');
  const [ghostOpacity, setGhostOpacity] = useState<number>(55); // 0 to 100%

  // Biomechanical Angle & Alignment Toggles
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const [showBallPath, setShowBallPath] = useState<boolean>(true);
  const [showPitchGrid, setShowPitchGrid] = useState<boolean>(true);

  // Active Keyframe
  const [activeKeyframeId, setActiveKeyframeId] = useState<string>('kf-bowl-3');

  // Comments state
  const [comments, setComments] = useState<CoachVideoComment[]>(mockCoachVideoComments);

  // Telestrator Drawing State
  const [isTelestratorActive, setIsTelestratorActive] = useState<boolean>(false);
  const [drawTool, setDrawTool] = useState<'pen' | 'line' | 'circle' | 'angle'>('pen');
  const [drawColor, setDrawColor] = useState<string>('#c3f400');
  const [annotations, setAnnotations] = useState<Array<{ id: string; type: string; color: string; coords: number[] }>>([
    { id: 'ann-1', type: 'line', color: '#c3f400', coords: [440, 95, 470, 70] },
    { id: 'ann-2', type: 'circle', color: '#ffdb3c', coords: [390, 125, 24] }
  ]);

  // Real Camera & Quick Upload Modal
  const [useCameraInput, setUseCameraInput] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [currentClipTitle, setCurrentClipTitle] = useState<string>('142.4 km/h Late Outswing Release (120 FPS)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const currentKeyframes = mockKeyframesByDiscipline[discipline] || mockKeyframesByDiscipline.bowling;

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
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Keyboard shortcut listener for Frame-by-Frame navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
        playBeep(750, 0.03);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        playBeep(650, 0.02);
        setCurrentFrameTime((prev) => Math.max(0, Number((prev - 0.0166).toFixed(2))));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        playBeep(700, 0.02);
        setCurrentFrameTime((prev) => Math.min(totalDuration, Number((prev + 0.0166).toFixed(2))));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalDuration]);

  // Sync active keyframe based on time
  useEffect(() => {
    const match = currentKeyframes.reduce((prev, curr) => {
      return Math.abs(curr.timestampSec - currentFrameTime) < Math.abs(prev.timestampSec - currentFrameTime)
        ? curr
        : prev;
    }, currentKeyframes[0]);

    if (match) {
      setActiveKeyframeId(match.id);
    }
  }, [currentFrameTime, currentKeyframes]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleSeek = (time: number) => {
    setCurrentFrameTime(time);
    playBeep(600, 0.03);
  };

  const stepFrame = (deltaSec: number) => {
    setIsPlaying(false);
    playBeep(700, 0.03);
    setCurrentFrameTime((prev) => {
      const next = Math.max(0, Math.min(totalDuration, prev + deltaSec));
      return Number(next.toFixed(2));
    });
  };

  const handleSelectKeyframe = (kf: VideoKeyframe) => {
    setIsPlaying(false);
    playBeep(800, 0.04);
    setCurrentFrameTime(kf.timestampSec);
    setActiveKeyframeId(kf.id);
    showToast(`Snapped to ${kf.name}`);
  };

  const handleAddComment = (newComment: Omit<CoachVideoComment, 'id'>) => {
    const commentWithId: CoachVideoComment = {
      ...newComment,
      id: `comm-${Date.now()}`
    };
    setComments((prev) => [commentWithId, ...prev]);
    showToast('Coach comment & frame critique saved!');
  };

  const handleSelectPreset = (preset: QuickUploadVideoPreset) => {
    setDiscipline(preset.discipline);
    setCurrentClipTitle(`${preset.title} (${preset.resolution})`);
    setCurrentFrameTime(1.5);
    playBallImpact();
    showToast(`Loaded ${preset.title} into Motion Lab`);
  };

  const handleCustomUpload = (fileInfo: { name: string; size: string; duration: string; discipline: CricketDiscipline }) => {
    setDiscipline(fileInfo.discipline);
    setCurrentClipTitle(`${fileInfo.name} (${fileInfo.size})`);
    setCurrentFrameTime(1.2);
    playCelebration();
    showToast(`Uploaded ${fileInfo.name} • 120 FPS Telemetry Ready`);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-28 gap-5 animate-fadeIn">
      {/* Top Banner: Video Centerpiece Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e231b] p-4 rounded-3xl border border-[#c3f400]/30 shadow-2xl glass">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-[10px] uppercase tracking-wider">
              Video Mastery Center
            </span>
            <span className="text-xs text-[#c4c9ac] font-medium">Core Player Development Hub</span>
          </div>
          <h1 className="font-headline font-extrabold text-xl text-white">
            Motion Lab & Frame-by-Frame Studio
          </h1>
          <p className="text-xs text-[#c4c9ac] mt-0.5">
            Active Clip: <span className="text-[#c3f400] font-bold font-mono">{currentClipTitle}</span>
          </p>
        </div>

        {/* Action Controls: Quick Upload / Tripod Capture */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playBeep(700, 0.05);
              setIsUploadModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-headline font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            <span>Upload / Presets</span>
          </button>

          <button
            onClick={() => {
              playBallImpact();
              onNavigate('record');
            }}
            className="px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#abd600] transition-colors cursor-pointer shadow-[0_0_12px_rgba(195,244,0,0.4)]"
          >
            <span className="material-symbols-outlined text-[18px]">videocam</span>
            <span>Record Camera</span>
          </button>
        </div>
      </div>

      {/* Discipline Selector (Batting, Bowling, Fielding) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {mockVideoDisciplines.map((d) => {
          const isSelected = discipline === d.id;
          return (
            <button
              key={d.id}
              onClick={() => {
                setDiscipline(d.id);
                playBeep(680, 0.04);
              }}
              className={`p-3 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-[#182615] border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.2)]'
                  : 'bg-black/30 border-white/5 hover:border-white/15 text-[#c4c9ac]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-[#c3f400]' : 'text-white'}`}>
                    {d.icon}
                  </span>
                  <span className={`font-headline font-bold text-sm ${isSelected ? 'text-white' : 'text-[#c4c9ac]'}`}>
                    {d.label}
                  </span>
                </div>
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-[#c3f400] text-[#161e00] font-extrabold' : 'bg-white/5 text-[#8e918f]'}`}>
                  {d.badge}
                </span>
              </div>
              <p className="text-[11px] text-[#c4c9ac] line-clamp-2 leading-tight">
                {d.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Primary Video Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('slowmo')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'slowmo'
              ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">slow_motion_video</span>
          <span>Slow-Mo & Angles</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'compare'
              ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
          <span>Side-by-Side Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'comments'
              ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
          <span>Coach Comments & Telestrator</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-headline font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'progress'
              ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
              : 'text-[#c4c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">timeline</span>
          <span>Progress Over Time Reel</span>
        </button>
      </div>

      {/* TAB 1: SLOW-MO & ANGLE ANALYSIS STAGE */}
      {activeTab === 'slowmo' && (
        <div className="flex flex-col gap-4">
          {/* Main Video Viewport */}
          <div
            ref={stageRef}
            className="relative w-full aspect-video sm:aspect-[16/9] bg-black rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between select-none"
          >
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
                    <div className="absolute bottom-16 left-0 w-full h-[1px] bg-white/20" />
                    <div className="absolute top-0 bottom-0 left-[48%] w-16 border-x border-[#c3f400]/20 bg-[#c3f400]/5" />
                    <span className="absolute bottom-18 left-4 text-[9px] font-mono text-[#c4c9ac]/60">
                      POPPING CREASE (RETURN LINE)
                    </span>
                    <span className="absolute top-4 left-[49%] text-[9px] font-mono text-[#c3f400]">
                      CORRIDOR OF UNCERTAINTY
                    </span>
                  </div>
                )}

                {/* Pro Ghost Overlay */}
                {overlayMode === 'ghost' && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                    style={{ opacity: ghostOpacity / 100 }}
                  >
                    <svg className="w-full h-full" viewBox="0 0 800 450">
                      <g stroke="#ffdb3c" strokeWidth="3" strokeLinecap="round" opacity="0.85">
                        <circle cx="400" cy="120" r="16" fill="none" strokeWidth="2.5" />
                        <line x1="400" y1="136" x2="395" y2="220" />
                        <line x1="395" y1="160" x2="435" y2="160" />
                        <line x1="435" y1="160" x2="435" y2="210" />
                        <line x1="435" y1="210" x2="410" y2="340" stroke="#ffdb3c" strokeWidth="6" />
                        <line x1="395" y1="220" x2="350" y2="360" />
                        <line x1="395" y1="220" x2="445" y2="360" />
                      </g>
                      <text x="400" y="100" textAnchor="middle" fill="#ffdb3c" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        PRO BENCHMARK (GOLD STANDARD)
                      </text>
                    </svg>
                  </div>
                )}

                {/* Player Dynamic Biomechanical Skeleton & Angles */}
                {showSkeleton && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 800 450">
                      {discipline === 'bowling' && (
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
                          {/* Torso & Hip Separation */}
                          <line x1="390" y1="143" x2="385" y2="230" stroke="#c3f400" strokeWidth="4" />
                          {/* High Release Arm */}
                          <line x1="390" y1="160" x2="440" y2="90" stroke="#c3f400" strokeWidth="4" />
                          <line x1="440" y1="90" x2="445" y2="60" stroke="#c3f400" strokeWidth="4" />
                          {/* Rigid Front Knee Brace (172°) */}
                          <line x1="385" y1="230" x2="350" y2="360" stroke="#c3f400" strokeWidth="4" />
                          <line x1="385" y1="230" x2="455" y2="360" stroke="#c3f400" strokeWidth="5" />

                          {showAngles && (
                            <g>
                              <rect x="465" y="55" width="105" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                              <text x="517" y="71" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                RELEASE: 11:30
                              </text>

                              <rect x="465" y="340" width="115" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                              <text x="522" y="356" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                KNEE BRACE: 172.4°
                              </text>
                            </g>
                          )}
                        </g>
                      )}

                      {discipline === 'batting' && (
                        <g>
                          <circle cx="390" cy="125" r="18" fill="rgba(195,244,0,0.15)" stroke="#c3f400" strokeWidth="3" />
                          <line x1="390" y1="143" x2="385" y2="225" stroke="#c3f400" strokeWidth="3.5" />
                          <line x1="388" y1="162" x2="440" y2="168" stroke="#c3f400" strokeWidth="3.5" />
                          <line x1="440" y1="168" x2="430" y2="230" stroke="#c3f400" strokeWidth="3.5" />
                          {/* Bat Vector */}
                          <line x1="430" y1="230" x2={390 + (currentFrameTime / totalDuration) * 60} y2="355" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />

                          {showAngles && (
                            <g>
                              <rect x="445" y="155" width="95" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                              <text x="492" y="171" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                HIGH ELBOW: 92.4°
                              </text>
                            </g>
                          )}
                        </g>
                      )}

                      {discipline === 'fielding' && (
                        <g>
                          <circle cx="400" cy="180" r="16" fill="rgba(195,244,0,0.2)" stroke="#c3f400" strokeWidth="3" />
                          <line x1="400" y1="196" x2="410" y2="260" stroke="#c3f400" strokeWidth="3.5" />
                          <line x1="410" y1="260" x2="460" y2="320" stroke="#c3f400" strokeWidth="4" />
                          <line x1="405" y1="210" x2="470" y2="310" stroke="#c3f400" strokeWidth="3.5" />

                          {showAngles && (
                            <g>
                              <rect x="420" y="130" width="115" height="24" rx="6" fill="#161e00" stroke="#c3f400" strokeWidth="1" />
                              <text x="477" y="146" textAnchor="middle" fill="#c3f400" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                REACTION: 0.24s
                              </text>
                            </g>
                          )}
                        </g>
                      )}

                      {/* Ball Arc */}
                      {showBallPath && (
                        <g>
                          <path d="M 120,80 Q 280,260 410,345 T 680,200" fill="none" stroke="rgba(195,244,0,0.6)" strokeWidth="3" strokeDasharray="6,4" />
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

                {/* Telestrator Drawing Overlay Layer */}
                {isTelestratorActive && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 800 450">
                      {annotations.map((ann) => {
                        if (ann.type === 'line') {
                          return (
                            <line
                              key={ann.id}
                              x1={ann.coords[0]}
                              y1={ann.coords[1]}
                              x2={ann.coords[2]}
                              y2={ann.coords[3]}
                              stroke={ann.color}
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                          );
                        }
                        if (ann.type === 'circle') {
                          return (
                            <circle
                              key={ann.id}
                              cx={ann.coords[0]}
                              cy={ann.coords[1]}
                              r={ann.coords[2]}
                              fill="none"
                              stroke={ann.color}
                              strokeWidth="3"
                              strokeDasharray="4,4"
                            />
                          );
                        }
                        return null;
                      })}
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* Top Floating HUD Status */}
            <div className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#c3f400] animate-pulse shadow-[0_0_8px_#c3f400]" />
                <span className="font-mono text-xs font-bold text-white tracking-wider">
                  {playbackSpeed}X SLOW MOTION
                </span>
                <span className="text-[10px] text-[#c4c9ac] font-mono bg-white/10 px-2 py-0.5 rounded">
                  FRAME {Math.round(currentFrameTime * 60)} / {Math.round(totalDuration * 60)} ({currentFrameTime.toFixed(2)}s)
                </span>
              </div>

              {/* Telestrator Quick Controls */}
              {isTelestratorActive && (
                <div className="flex items-center gap-1.5 bg-black/80 px-3 py-1 rounded-xl border border-[#c3f400]/40">
                  <span className="text-[10px] font-mono text-[#c3f400] font-bold">TELESTRATOR:</span>
                  <button
                    onClick={() => {
                      setAnnotations((prev) => [
                        ...prev,
                        { id: `ann-${Date.now()}`, type: 'line', color: drawColor, coords: [380, 200, 460, 200] }
                      ]);
                      playBeep(800, 0.03);
                    }}
                    className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold cursor-pointer"
                  >
                    + Line
                  </button>
                  <button
                    onClick={() => {
                      setAnnotations((prev) => [
                        ...prev,
                        { id: `ann-${Date.now()}`, type: 'circle', color: '#ffdb3c', coords: [400, 160, 30] }
                      ]);
                      playBeep(800, 0.03);
                    }}
                    className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold cursor-pointer"
                  >
                    + Circle
                  </button>
                  <button
                    onClick={() => {
                      setAnnotations([]);
                      playBeep(600, 0.03);
                    }}
                    className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Toast Message */}
            {toastMsg && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-[#c3f400] text-[#161e00] font-headline font-bold text-xs shadow-2xl animate-fadeIn">
                {toastMsg}
              </div>
            )}
          </div>

          {/* Precision Frame-by-Frame Stepper Component */}
          <FrameByFrameStepper
            currentFrameTime={currentFrameTime}
            totalDuration={totalDuration}
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            keyframes={currentKeyframes}
            activeKeyframeId={activeKeyframeId}
            discipline={discipline}
            onSeek={handleSeek}
            onStepFrame={stepFrame}
            onTogglePlay={() => {
              playBeep(750, 0.04);
              setIsPlaying(!isPlaying);
            }}
            onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
            onSelectKeyframe={handleSelectKeyframe}
          />

          {/* Biomechanical Telemetry & Overlays Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ghost Superposition */}
            <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c3f400] text-[18px]">layers</span>
                  Ghost Alignment Overlay
                </h3>
                <span className="text-[10px] font-mono text-[#ffdb3c] font-bold">PRO BENCHMARK</span>
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
                  Ghost Overlay
                </button>
              </div>

              {overlayMode === 'ghost' && (
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-[#c4c9ac]">
                    <span>Ghost Opacity</span>
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

            {/* Trajectory & Release Stats */}
            <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9cf0ff] text-[18px]">speed</span>
                  Release & Speed Metrics
                </h3>
                <span className="text-[10px] font-mono text-[#c3f400] font-bold">HAWK-EYE</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] block">EST. VELOCITY</span>
                  <span className="font-headline font-extrabold text-lg text-white">142.4 kph</span>
                  <span className="text-[9px] text-[#c3f400] block">+6.2 kph gain</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                  <span className="text-[10px] text-[#c4c9ac] block">RELEASE ANGLE</span>
                  <span className="font-headline font-extrabold text-lg text-[#9cf0ff]">11:30 Pos</span>
                  <span className="text-[9px] text-[#9cf0ff] block">High arm plane</span>
                </div>
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="p-4 rounded-2xl bg-[#201f1f] border border-white/10 glass flex flex-col gap-2">
              <h3 className="font-headline font-bold text-sm text-white flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#ffdb3c] text-[18px]">tune</span>
                Visual HUD Toggles
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setShowSkeleton(!showSkeleton)}
                  className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    showSkeleton ? 'bg-[#c3f400]/10 border-[#c3f400] text-white' : 'bg-black/30 border-white/5 text-[#c4c9ac]'
                  }`}
                >
                  <span>Skeleton</span>
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
                  <span>Angles</span>
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
                  <span>Ball Arc</span>
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
                  <span>Crease</span>
                  <span className="material-symbols-outlined text-[16px] text-[#c3f400]">
                    {showPitchGrid ? 'check_box' : 'check_box_outline_blank'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIDE-BY-SIDE SYNCHRONIZED COMPARISON */}
      {activeTab === 'compare' && (
        <SideBySideComparisonView
          discipline={discipline}
          onNavigate={onNavigate}
          onSelectDrill={(drillId) => onNavigate('drills-vault')}
        />
      )}

      {/* TAB 3: COACH COMMENTS & TELESTRATOR */}
      {activeTab === 'comments' && (
        <CoachVideoCommentsOverlay
          comments={comments}
          currentFrameTime={currentFrameTime}
          discipline={discipline}
          onSeekToComment={(time) => {
            setActiveTab('slowmo');
            handleSeek(time);
            showToast(`Seeking to Frame ${Math.round(time * 60)}`);
          }}
          onAddComment={handleAddComment}
          isTelestratorActive={isTelestratorActive}
          onToggleTelestrator={() => {
            setIsTelestratorActive(!isTelestratorActive);
            setActiveTab('slowmo');
            showToast(isTelestratorActive ? 'Telestrator Deactivated' : 'Telestrator Active on Slow-Mo Viewport');
          }}
        />
      )}

      {/* TAB 4: PROGRESS OVER TIME REEL */}
      {activeTab === 'progress' && (
        <ProgressOverTimeReel
          discipline={discipline}
          onSelectClipToAnalyze={(clipId) => {
            setActiveTab('slowmo');
            showToast(`Loaded Session ${clipId} into Slow-Mo Lab`);
          }}
          onLaunchComparison={() => setActiveTab('compare')}
          onNavigate={onNavigate}
        />
      )}

      {/* Quick Upload & Tripod Capture Modal */}
      <QuickUploadAndCaptureModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        onCustomUploadComplete={handleCustomUpload}
      />

      {/* Secure Media and Video Security Vault */}
      <SecureMediaVault />
    </div>
  );
};
