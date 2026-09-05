import React, { useState, useEffect, useRef } from 'react';
import { ScreenType, UserProfile, PitchCalibrationState } from '../../types';
import { playBeep, playBallImpact } from '../../utils/audioFeedback';
import { scrubImageExif, scrubVideoMetadata, SanitizedMediaResult } from '../../utils/exifScrubber';
import { CameraCalibrationHUD } from '../recording/CameraCalibrationHUD';
import { VirtualStumpsOverlay } from '../recording/VirtualStumpsOverlay';
import { getStoredCalibrationState, saveCalibrationState } from '../../utils/pitchCalibrationManager';
import { BeehiveVisualizer } from '../telemetry/BeehiveVisualizer';
import { AutoSlicerLiveTray } from '../recording/AutoSlicerLiveTray';
import { NetSessionPlaylistFeed } from '../telemetry/NetSessionPlaylistFeed';
import { QuickUploadAndCaptureModal } from '../videoAnalysis/QuickUploadAndCaptureModal';

interface RecordScreenProps {
  onNavigate: (screen: ScreenType) => void;
  currentUser?: UserProfile;
}

export const RecordScreen: React.FC<RecordScreenProps> = ({ onNavigate, currentUser }) => {
  // State for recording simulation
  const [seconds, setSeconds] = useState(134); // 02:14
  const [isRecording, setIsRecording] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(142);
  const [releaseAngle, setReleaseAngle] = useState(42);
  const [heartRate, setHeartRate] = useState(164);
  const [pitchLength, setPitchLength] = useState<'Good Length' | 'Full' | 'Short'>('Good Length');
  const [pitchLine, setPitchLine] = useState<'Off Stump' | 'Middle Stump' | 'Outside Off'>('Off Stump');

  // Fulltrack-style Pitch & Virtual Stumps Calibration
  const [calibrationState, setCalibrationState] = useState<PitchCalibrationState>(getStoredCalibrationState);
  const [showCalibrationHUD, setShowCalibrationHUD] = useState<boolean>(false);
  const [showBeehiveModal, setShowBeehiveModal] = useState<boolean>(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
  const [lastDelivery, setLastDelivery] = useState<{ speed: number; length: string; line: string; timestamp: string } | undefined>({
    speed: 142,
    length: 'Good Length',
    line: 'Off Stump',
    timestamp: '02:14',
  });

  // HUD Toggles
  const [showLayers, setShowLayers] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [deliveryCount, setDeliveryCount] = useState(6);
  const [flaggedMoments, setFlaggedMoments] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadedMediaResult, setUploadedMediaResult] = useState<SanitizedMediaResult | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Timer interval
  useEffect(() => {
    if (!isRecording || isPaused) return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Real camera support
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useRealCamera && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.warn('Camera access error or rejected:', err);
          setUseRealCamera(false);
          showToast('Camera not available, running simulated stadium view');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulateDelivery = () => {
    playBallImpact();
    const speeds = [138, 140, 142, 144, 145, 141, 143];
    const angles = [41, 42, 43, 40, 44];
    const lengths: ('Good Length' | 'Full' | 'Short')[] = ['Good Length', 'Good Length', 'Full', 'Short'];
    const lines: ('Off Stump' | 'Middle Stump' | 'Outside Off')[] = ['Off Stump', 'Off Stump', 'Middle Stump', 'Outside Off'];

    const newSpeed = speeds[Math.floor(Math.random() * speeds.length)];
    const newAngle = angles[Math.floor(Math.random() * angles.length)];
    const newLength = lengths[Math.floor(Math.random() * lengths.length)];
    const newLine = lines[Math.floor(Math.random() * lines.length)];

    setSpeed(newSpeed);
    setReleaseAngle(newAngle);
    setPitchLength(newLength);
    setPitchLine(newLine);
    setDeliveryCount((c) => c + 1);
    setHeartRate((hr) => Math.min(185, hr + Math.floor(Math.random() * 4) - 1));
    setLastDelivery({
      speed: newSpeed,
      length: newLength,
      line: newLine,
      timestamp: formatTime(seconds),
    });
    showToast(`⚡ Delivery #${deliveryCount + 1} Logged: ${newSpeed} km/h on ${newLength}!`);
  };

  const handleFlagDelivery = () => {
    playBeep(980, 0.15);
    const timestamp = formatTime(seconds);
    setFlaggedMoments((prev) => [...prev, `${timestamp} (${speed} km/h - ${pitchLength})`]);
    showToast(`🚩 Flagged delivery at ${timestamp} for coach review`);
  };

  const handleStopRecording = () => {
    playBeep(440, 0.2, 'sawtooth');
    setIsRecording(false);
    showToast('Session Saved! Navigating to Feedback & Telemetry...');
    setTimeout(() => {
      onNavigate('feedback');
    }, 1000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScrubbing(true);
    playBeep(600, 0.1);

    try {
      let result: SanitizedMediaResult;
      if (file.type.startsWith('video/')) {
        result = await scrubVideoMetadata(file);
      } else {
        result = await scrubImageExif(file);
      }

      setUploadedMediaResult(result);
      setIsScrubbing(false);
      playBeep(880, 0.15);
      showToast(`🛡️ Safeguard Cleaned: ${result.strippedTags.length} privacy tags & GPS removed!`);
    } catch (err) {
      console.error('Scrubbing error:', err);
      setIsScrubbing(false);
      showToast('Error processing media privacy metadata.');
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[600px] overflow-hidden bg-[#131313] select-none">
      {/* Hidden file input for media sanitization */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*,image/*"
        className="hidden"
      />
      {/* Background: Real Camera or Authentic Stadium Bowler POV */}
      {useRealCamera ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4V2lqITe0VXgLQ8OkAsU0DNfNyxEdwh7ef9pkqzxKT-hoOYmv7nH2_lsb7NjmVyNT2JaGHX-ye0tsORcjec48bsI270086obHOL_MN-CNkwFlRROFbXtrMlbSG4EvRcuiJuVuR675hXubMmn_3xkteDM8WV1fNNplImkY2d0oq70Suc089zTCSMJSLqkkOb21InEetxFVPqGD6vtdU4WRqNx50-0ImIPbSVucU9ycRW8m9KNb09-e')`
          }}
        />
      )}

      {/* Scrims & Cinematic Gradients */}
      <div className="absolute inset-0 bg-[#131313]/30 backdrop-blur-[1px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-[#131313]/70 pointer-events-none" />

      {/* Top HUD Row: Timer & Heart Rate */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10 shadow-lg">
          <span className={`w-2.5 h-2.5 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-[#ffb4ab] animate-pulse'}`} />
          <span className="font-headline font-bold text-sm text-white tracking-wider">
            {formatTime(seconds)}
          </span>
          {isPaused && (
            <span className="text-[10px] uppercase font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
              PAUSED
            </span>
          )}
        </div>

        {/* Real-time Heart Rate / Load */}
        <div className="glass rounded-xl p-3 flex flex-col items-end gap-1 border border-white/10 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#ffb4ab] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              favorite
            </span>
            <span className="font-headline font-bold text-sm text-white">{heartRate} BPM</span>
          </div>
          <div className="flex items-center gap-1 text-[#c4c9ac]">
            <span className="material-symbols-outlined text-[13px]">speed</span>
            <span className="text-[11px] font-semibold text-[#c4c9ac]">
              {heartRate > 160 ? 'High Load' : 'Optimal Load'}
            </span>
          </div>
        </div>
      </div>

      {/* Left HUD: Speed & Release Angle */}
      {showLayers && (
        <div className="absolute top-[20%] left-4 flex flex-col gap-3 z-20 animate-fadeIn">
          {/* Speed Card */}
          <div className="glass rounded-2xl p-3 w-36 relative overflow-hidden group border border-[#c3f400]/30 shadow-xl">
            <div className="absolute inset-y-0 left-0 w-1 bg-[#c3f400] shadow-[0_0_8px_#c3f400]" />
            <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-0.5 pl-1">
              Speed
            </span>
            <div className="flex items-baseline gap-1 pl-1">
              <span className="font-headline font-extrabold text-2xl text-white drop-shadow-[0_0_8px_rgba(195,244,0,0.5)]">
                {speed}
              </span>
              <span className="text-xs text-[#c4c9ac] font-medium">km/h</span>
            </div>
            <div className="mt-2 h-1.5 w-full bg-[#353534] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#c3f400] rounded-full shadow-[0_0_8px_#c3f400] transition-all duration-300"
                style={{ width: `${Math.min(100, ((speed - 100) / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Release Angle Card */}
          <div className="glass rounded-2xl p-3 w-36 relative overflow-hidden border border-white/10 shadow-xl">
            <span className="text-[10px] font-bold text-[#c4c9ac] uppercase tracking-wider block mb-0.5">
              Release Angle
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline font-extrabold text-2xl text-white">{releaseAngle}</span>
              <span className="text-xs text-[#c4c9ac] font-medium">deg</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#c3f400]">
                arrow_outward
              </span>
              <span className="text-[11px] font-bold text-[#c3f400]">Optimal</span>
            </div>
          </div>

          {/* Camera toggle pill */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                playBeep(700, 0.1);
                setUseRealCamera(!useRealCamera);
              }}
              className="px-2.5 py-1 rounded-lg bg-black/40 glass border border-white/10 hover:border-[#c3f400]/40 text-[10px] font-bold text-white flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#c3f400]">
                {useRealCamera ? 'videocam_off' : 'photo_camera'}
              </span>
              {useRealCamera ? 'Switch to Sim' : 'Live Camera'}
            </button>

            {/* Upload Video / Photo with EXIF Scrubber */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScrubbing}
              title="Upload media with automated GPS & EXIF privacy scrubbing"
              className="px-2.5 py-1 rounded-lg bg-black/40 glass border border-[#4ade80]/30 hover:border-[#4ade80] text-[10px] font-bold text-[#4ade80] flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isScrubbing ? 'sync' : 'security'}
              </span>
              {isScrubbing ? 'Scrubbing...' : 'Upload & Scrub EXIF'}
            </button>

            {/* Quick Practice Presets & Studio Ingestion */}
            <button
              onClick={() => setShowQuickModal(true)}
              className="px-2.5 py-1 rounded-lg bg-black/40 glass border border-[#c3f400]/40 hover:border-[#c3f400] text-[10px] font-bold text-[#c3f400] flex items-center gap-1.5 w-fit cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">video_library</span>
              <span>Reels &amp; Presets</span>
            </button>
          </div>

          {uploadedMediaResult && (
            <div className="p-2 rounded-xl bg-[#121c12] border border-[#4ade80]/30 text-[10px] text-[#c4c9ac] space-y-1">
              <span className="text-[#4ade80] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">verified_user</span>
                EXIF / GPS Stripped
              </span>
              <p className="text-[9px] line-clamp-2">
                Removed: {uploadedMediaResult.strippedTags.slice(0, 3).join(', ')}...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Right HUD: Floating Telemetry Toggles */}
      <div className="absolute top-[20%] right-4 flex flex-col gap-3 z-20">
        <button
          onClick={() => {
            playBeep(600, 0.08);
            setShowLayers(!showLayers);
          }}
          title="Toggle Layers"
          className={`glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
            showLayers ? 'text-[#c3f400] border border-[#c3f400]/40 shadow-[0_0_12px_rgba(195,244,0,0.25)]' : 'text-white hover:text-[#c3f400]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: showLayers ? "'FILL' 1" : "'FILL' 0" }}>
            layers
          </span>
        </button>

        <button
          onClick={() => {
            playBeep(600, 0.08);
            setShowGrid(!showGrid);
          }}
          title="Toggle Pitch Grid"
          className={`glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
            showGrid ? 'text-[#c3f400] border border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.35)]' : 'text-white hover:text-[#c3f400]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">grid_4x4</span>
        </button>

        <button
          onClick={() => {
            playBeep(600, 0.08);
            setShowSkeleton(!showSkeleton);
          }}
          title="Toggle Biomechanics Skeleton"
          className={`glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
            showSkeleton ? 'text-[#c3f400] border border-[#c3f400]/40 shadow-[0_0_12px_rgba(195,244,0,0.25)]' : 'text-white hover:text-[#c3f400]'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">settings_accessibility</span>
        </button>

        {/* Fulltrack Calibration Button */}
        <button
          onClick={() => {
            playBeep(700, 0.08);
            setShowCalibrationHUD(true);
          }}
          title="Fulltrack Stumps & Pitch Calibration"
          className={`glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
            calibrationState.isVirtualStumpsLocked
              ? 'text-[#c3f400] border border-[#c3f400] shadow-[0_0_15px_rgba(195,244,0,0.35)]'
              : 'text-amber-400 border border-amber-400/80 animate-pulse'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">view_in_ar</span>
        </button>

        {/* Fulltrack Beehive & 3D Flight Arc Button */}
        <button
          onClick={() => {
            playBeep(750, 0.08);
            setShowBeehiveModal(true);
          }}
          title="Live Stumps Beehive & 3D Flight Arc"
          className="glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 text-white hover:text-[#c3f400] border border-white/15 hover:border-[#c3f400]/40"
        >
          <span className="material-symbols-outlined text-[22px]">sports_cricket</span>
        </button>

        {/* Auto-Slicer Net Playlist Feed Button */}
        <button
          onClick={() => {
            playBeep(800, 0.08);
            setShowPlaylistModal(true);
          }}
          title="Ball-by-Ball Auto-Slicer Playlist Feed"
          className="glass w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 text-white hover:text-[#c3f400] border border-white/15 hover:border-[#c3f400]/40"
        >
          <span className="material-symbols-outlined text-[22px]">video_library</span>
        </button>
      </div>

      {/* Center Pitch Reticle & AI Target Oval */}
      {showGrid && (
        <div
          onClick={handleSimulateDelivery}
          title="Tap pitch to simulate ball release"
          className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 sm:w-64 h-72 sm:h-80 z-10 opacity-60 cursor-crosshair group"
        >
          <svg className="w-full h-full stroke-[#c3f400] fill-none stroke-[0.8]" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Pitch Corridor Guidelines */}
            <path d="M20,90 L40,10 L60,10 L80,90" strokeDasharray="3 4" className="stroke-[#c3f400]" />
            {/* Target Good Length Oval */}
            <ellipse cx="50" cy="50" rx="16" ry="12" className="stroke-[#e9c400] stroke-[1.5] group-hover:stroke-[#c3f400] transition-colors" />
            {/* Crosshairs */}
            <path d="M0,50 L100,50" className="stroke-[#353534]" />
            <path d="M50,0 L50,100" className="stroke-[#353534]" />
            {/* Good Length zone dashed lines */}
            <line x1="30" y1="35" x2="70" y2="35" strokeDasharray="2 3" className="stroke-[#c3f400]/60" />
            <line x1="25" y1="65" x2="75" y2="65" strokeDasharray="2 3" className="stroke-[#c3f400]/60" />
          </svg>

          {/* Prompt to simulate delivery */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="px-2.5 py-1 rounded bg-[#131313]/80 border border-[#c3f400] text-[10px] font-bold text-[#c3f400] shadow-lg">
              Click to Bowl / Log Delivery
            </span>
          </div>
        </div>
      )}

      {/* Skeleton Tracking Overlay */}
      {showSkeleton && (
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-60 pointer-events-none z-10 opacity-70">
          <svg viewBox="0 0 100 120" className="w-full h-full stroke-[#c3f400] stroke-[1.5] fill-none">
            {/* Head circle */}
            <circle cx="50" cy="20" r="8" className="stroke-[#ffdb3c] fill-[#ffdb3c]/10 animate-pulse" />
            {/* Spine */}
            <line x1="50" y1="28" x2="50" y2="65" />
            {/* Arms */}
            <line x1="50" y1="35" x2="25" y2="45" />
            <line x1="25" y1="45" x2="15" y2="25" />
            <line x1="50" y1="35" x2="75" y2="42" />
            <line x1="75" y1="42" x2="85" y2="30" />
            {/* Legs */}
            <line x1="50" y1="65" x2="35" y2="95" />
            <line x1="35" y1="95" x2="30" y2="115" />
            <line x1="50" y1="65" x2="65" y2="92" />
            <line x1="65" y1="92" x2="70" y2="115" />
            {/* Joints */}
            <circle cx="50" cy="35" r="2.5" fill="#c3f400" />
            <circle cx="25" cy="45" r="2.5" fill="#c3f400" />
            <circle cx="75" cy="42" r="2.5" fill="#c3f400" />
            <circle cx="50" cy="65" r="2.5" fill="#c3f400" />
            <circle cx="35" cy="95" r="2.5" fill="#c3f400" />
            <circle cx="65" cy="92" r="2.5" fill="#c3f400" />
          </svg>
        </div>
      )}

      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-[#201f1f]/95 border border-[#c3f400] text-xs font-bold text-[#c3f400] shadow-[0_0_20px_rgba(195,244,0,0.3)] animate-fadeIn flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">info</span>
          {toastMessage}
        </div>
      )}

      {/* Bottom HUD: Auto-Slicer Tray, Length/Line Badges + Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3 z-20 px-4 max-w-2xl mx-auto">
        {/* Fulltrack-Style Continuous Auto-Slicer Buffer Tray */}
        <AutoSlicerLiveTray
          isRecording={isRecording && !isPaused}
          onOpenPlaylistModal={() => setShowPlaylistModal(true)}
        />

        {/* Pitch Area Status Chips */}
        <div className="flex items-center gap-3">
          <div className="glass px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-[#e9c400] shadow-[0_0_6px_#e9c400]" />
            <span className="text-xs font-semibold text-white">{pitchLength}</span>
          </div>
          <div className="glass px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-[#c3f400]/30 shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c3f400] shadow-[0_0_6px_#c3f400]" />
            <span className="text-xs font-semibold text-white">{pitchLine}</span>
          </div>
        </div>

        {/* Primary Controls Row */}
        <div className="flex items-center justify-center gap-8 w-full max-w-sm">
          {/* Pause / Resume Button */}
          <button
            onClick={() => {
              playBeep(500, 0.1);
              setIsPaused(!isPaused);
              showToast(isPaused ? 'Recording resumed' : 'Recording paused');
            }}
            title={isPaused ? 'Resume Recording' : 'Pause Recording'}
            className="w-14 h-14 rounded-full glass border border-white/15 flex items-center justify-center text-white active:scale-90 hover:bg-white/10 transition-all shadow-xl"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>

          {/* Big Stop Button */}
          <button
            onClick={handleStopRecording}
            title="Stop & Analyze Session"
            className="w-20 h-20 rounded-full bg-[#93000a] flex items-center justify-center text-[#ffdad6] shadow-[0_0_25px_rgba(147,0,10,0.65)] active:scale-90 transition-all relative group cursor-pointer border-2 border-[#ffb4ab]/40"
          >
            <div className="absolute inset-1 rounded-full bg-[#93000a] opacity-50 group-hover:animate-ping" />
            <span className="material-symbols-outlined text-[36px] relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
              stop
            </span>
          </button>

          {/* Bookmark / Flag Button */}
          <button
            onClick={handleFlagDelivery}
            title="Flag Moment for Coach"
            className="w-14 h-14 rounded-full glass border border-white/15 flex items-center justify-center text-white active:scale-90 hover:text-[#c3f400] hover:bg-white/10 transition-all shadow-xl"
          >
            <span className="material-symbols-outlined text-[24px]">flag</span>
          </button>
        </div>

        {/* Delivery counter & quick trigger */}
        <div className="flex items-center gap-3 text-xs text-[#c4c9ac]">
          <span>Delivery #{deliveryCount}</span>
          <span>•</span>
          <button
            onClick={handleSimulateDelivery}
            className="text-[#c3f400] font-bold hover:underline cursor-pointer"
          >
            + Bowl Next Delivery
          </button>
        </div>
      </div>

      {/* Persistent Fulltrack Virtual Stumps & Corridor Overlay */}
      <VirtualStumpsOverlay
        calibrationState={calibrationState}
        showGrid={showGrid}
        onOpenCalibration={() => {
          playBeep(700, 0.08);
          setShowCalibrationHUD(true);
        }}
        lastDelivery={lastDelivery}
      />

      {/* Fulltrack Camera & Virtual Stumps Calibration Interactive Drawer */}
      <CameraCalibrationHUD
        isOpen={showCalibrationHUD}
        onClose={() => setShowCalibrationHUD(false)}
        calibrationState={calibrationState}
        onUpdateCalibration={(updated) => {
          setCalibrationState(updated);
          saveCalibrationState(updated);
        }}
      />

      {/* Fulltrack Stumps Beehive & 3D Flight Arc Modal */}
      {showBeehiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 p-4 sm:p-6 shadow-2xl">
            <button
              onClick={() => setShowBeehiveModal(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
            <BeehiveVisualizer />
          </div>
        </div>
      )}

      {/* Auto-Slicer Net Session Playlist Feed Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto rounded-3xl bg-[#141414] border border-white/15 p-4 sm:p-6 shadow-2xl">
            <NetSessionPlaylistFeed
              onClose={() => setShowPlaylistModal(false)}
              onOpenBeehive={() => {
                setShowPlaylistModal(false);
                setShowBeehiveModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Video Presets & Ingestion Modal */}
      <QuickUploadAndCaptureModal
        isOpen={showQuickModal}
        onClose={() => setShowQuickModal(false)}
        onSelectPreset={(preset) => {
          setToastMessage(`Loaded Preset: ${preset.title}`);
          setSpeed(preset.discipline === 'bowling' ? 142 : 118);
          playBallImpact();
        }}
        onCustomUploadComplete={(info) => {
          setToastMessage(`Uploaded: ${info.name} • 120 FPS Telemetry Ready`);
          playBallImpact();
        }}
      />
    </div>
  );
};
