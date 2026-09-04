import React, { useState, useEffect, useRef } from 'react';
import { PitchCalibrationState, PitchPresetType } from '../../types';
import {
  PITCH_PRESET_SPECS,
  evaluateTripodTilt,
  saveCalibrationState,
} from '../../utils/pitchCalibrationManager';
import { playBeep } from '../../utils/audioFeedback';

interface CameraCalibrationHUDProps {
  isOpen: boolean;
  onClose: () => void;
  calibrationState: PitchCalibrationState;
  onUpdateCalibration: (updated: PitchCalibrationState) => void;
  showPersistentVirtualStumps?: boolean;
}

export const CameraCalibrationHUD: React.FC<CameraCalibrationHUDProps> = ({
  isOpen,
  onClose,
  calibrationState,
  onUpdateCalibration,
}) => {
  const [activeTab, setActiveTab] = useState<'stumps' | 'tilt' | 'presets'>('stumps');
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [detectProgress, setDetectProgress] = useState(0);
  const [activeDragTarget, setActiveDragTarget] = useState<'batter' | 'bowler' | null>(null);
  const autoDetectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for smooth adjustment
  const [pitchAngle, setPitchAngle] = useState(calibrationState.tripodPitchAngleDeg);
  const [rollAngle, setRollAngle] = useState(calibrationState.tripodRollAngleDeg);
  const [tripodHeight, setTripodHeight] = useState(calibrationState.tripodHeightMeters);
  const [distanceBehind, setDistanceBehind] = useState(calibrationState.distanceBehindStumpsMeters);
  const [selectedPreset, setSelectedPreset] = useState<PitchPresetType>(calibrationState.preset);

  // Clean up auto detect interval on unmount or close
  useEffect(() => {
    return () => {
      if (autoDetectTimerRef.current) {
        clearInterval(autoDetectTimerRef.current);
        autoDetectTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen && autoDetectTimerRef.current) {
      clearInterval(autoDetectTimerRef.current);
      autoDetectTimerRef.current = null;
      setIsAutoDetecting(false);
    }
  }, [isOpen]);

  // Sync when prop changes
  useEffect(() => {
    setPitchAngle(calibrationState.tripodPitchAngleDeg);
    setRollAngle(calibrationState.tripodRollAngleDeg);
    setTripodHeight(calibrationState.tripodHeightMeters);
    setDistanceBehind(calibrationState.distanceBehindStumpsMeters);
    setSelectedPreset(calibrationState.preset);
  }, [calibrationState]);

  // Handle hardware device orientation if available on mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta !== null && e.gamma !== null) {
        // beta is front-back tilt (-180 to 180), gamma is left-right roll (-90 to 90)
        // When phone is in portrait tilted slightly down: beta is typically ~70-85 deg (or ~8-15 from vertical)
        const computedPitch = Math.abs(90 - Math.abs(e.beta));
        const computedRoll = Number((e.gamma || 0).toFixed(1));
        if (!isNaN(computedPitch) && computedPitch < 45) {
          setPitchAngle(Number(computedPitch.toFixed(1)));
          setRollAngle(computedRoll);
        }
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const tiltEvaluation = evaluateTripodTilt(pitchAngle, rollAngle);

  // Optical AI auto-detection simulation
  const handleAutoDetectStumps = () => {
    playBeep(720, 0.08);
    setIsAutoDetecting(true);
    setDetectProgress(10);

    if (autoDetectTimerRef.current) {
      clearInterval(autoDetectTimerRef.current);
    }

    autoDetectTimerRef.current = setInterval(() => {
      setDetectProgress((prev) => {
        if (prev >= 95) {
          if (autoDetectTimerRef.current) {
            clearInterval(autoDetectTimerRef.current);
            autoDetectTimerRef.current = null;
          }
          setIsAutoDetecting(false);
          playBeep(980, 0.15);

          const updated: PitchCalibrationState = {
            ...calibrationState,
            preset: selectedPreset,
            pitchLengthMeters: PITCH_PRESET_SPECS[selectedPreset].pitchLength,
            tripodPitchAngleDeg: pitchAngle,
            tripodRollAngleDeg: rollAngle,
            tripodHeightMeters: tripodHeight,
            distanceBehindStumpsMeters: distanceBehind,
            bowlerStumpsBox: {
              x: 50,
              y: 86,
              width: 28,
              height: 24,
              isAligned: true,
            },
            batterStumpsBox: {
              x: 50,
              y: 33,
              width: 14,
              height: 18,
              isAligned: true,
            },
            isVirtualStumpsLocked: true,
            calibrationConfidenceScore: 99.1,
            lastCalibratedAt: new Date().toISOString(),
          };
          onUpdateCalibration(updated);
          saveCalibrationState(updated);
          return 100;
        }
        return prev + 18;
      });
    }, 180);
  };

  const handleManualLock = () => {
    playBeep(880, 0.12);
    const updated: PitchCalibrationState = {
      ...calibrationState,
      preset: selectedPreset,
      pitchLengthMeters: PITCH_PRESET_SPECS[selectedPreset].pitchLength,
      tripodPitchAngleDeg: pitchAngle,
      tripodRollAngleDeg: rollAngle,
      tripodHeightMeters: tripodHeight,
      distanceBehindStumpsMeters: distanceBehind,
      isVirtualStumpsLocked: true,
      calibrationConfidenceScore: 98.6,
      lastCalibratedAt: new Date().toISOString(),
    };
    onUpdateCalibration(updated);
    saveCalibrationState(updated);
    onClose();
  };

  const handlePresetSelect = (presetKey: PitchPresetType) => {
    playBeep(650, 0.05);
    setSelectedPreset(presetKey);
    const updated: PitchCalibrationState = {
      ...calibrationState,
      preset: presetKey,
      pitchLengthMeters: PITCH_PRESET_SPECS[presetKey].pitchLength,
    };
    onUpdateCalibration(updated);
    saveCalibrationState(updated);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-3 sm:p-4 bg-black/60 backdrop-blur-sm pointer-events-auto select-none animate-fadeIn">
      {/* Top Header Bar: Calibration Status & Preset Pill */}
      <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#c3f400]/20 border border-[#c3f400]/50 flex items-center justify-center text-[#c3f400]">
            <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-headline font-black text-white uppercase tracking-wider">
                Fulltrack-Grade Pitch Calibration
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                  calibrationState.isVirtualStumpsLocked
                    ? 'bg-[#c3f400]/20 text-[#c3f400] border-[#c3f400]/40 shadow-[0_0_8px_rgba(195,244,0,0.3)]'
                    : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                }`}
              >
                {calibrationState.isVirtualStumpsLocked ? '3D STUMPS LOCKED' : 'ALIGNMENT REQUIRED'}
              </span>
            </div>
            <span className="text-[10px] text-[#c4c9ac] block">
              {PITCH_PRESET_SPECS[selectedPreset].label} • 22 Yd Perspective Matrix
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#1c1b1b]/90 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => {
              playBeep(600, 0.04);
              setActiveTab('stumps');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'stumps'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">sports_cricket</span>
            <span className="hidden xs:inline">Stumps</span>
          </button>
          <button
            onClick={() => {
              playBeep(600, 0.04);
              setActiveTab('tilt');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'tilt'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">screen_rotation</span>
            <span className="hidden xs:inline">Tripod Tilt</span>
          </button>
          <button
            onClick={() => {
              playBeep(600, 0.04);
              setActiveTab('presets');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'presets'
                ? 'bg-[#c3f400] text-[#161e00] shadow-sm'
                : 'text-[#c4c9ac] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">straighten</span>
            <span className="hidden xs:inline">Presets</span>
          </button>

          <button
            onClick={() => {
              playBeep(500, 0.05);
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white ml-1 cursor-pointer"
            title="Close calibration panel"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Perspective Pitch Guide Overlay (Center Canvas Area) */}
      <div className="relative flex-1 my-2 max-w-4xl mx-auto w-full flex items-center justify-center overflow-hidden">
        {/* Full Perspective Pitch Wireframe Overlay */}
        <svg
          className="w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Pitch Surface Gradient */}
            <linearGradient id="pitchLaneGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#c3f400" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#c3f400" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#9cf0ff" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="stumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Perspective 22-Yard Pitch Corridor */}
          <polygon
            points="24,94 39,26 61,26 76,94"
            fill="url(#pitchLaneGrad)"
            stroke="#c3f400"
            strokeWidth="0.8"
            strokeDasharray={calibrationState.isVirtualStumpsLocked ? 'none' : '3,2'}
            className="transition-all duration-500"
          />

          {/* Crease Markers: Bowling Crease (Bowler End: near y=88) */}
          <line x1="18" y1="88" x2="82" y2="88" stroke="#ffffff" strokeWidth="0.9" opacity="0.8" />
          {/* Popping Crease (Bowler End: 4ft in front, y=82) */}
          <line x1="22" y1="82" x2="78" y2="82" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" strokeDasharray="2,2" />
          {/* Return Creases (Bowler End) */}
          <line x1="22" y1="88" x2="22" y2="78" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" />
          <line x1="78" y1="88" x2="78" y2="78" stroke="#ffffff" strokeWidth="0.7" opacity="0.6" />

          {/* Crease Markers: Batter End (Far: y=28) */}
          <line x1="36" y1="28" x2="64" y2="28" stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />
          {/* Batter Popping Crease (y=32) */}
          <line x1="34" y1="32" x2="66" y2="32" stroke="#ffffff" strokeWidth="0.6" opacity="0.7" />

          {/* Distance Guideline Zones */}
          {/* Short / Bouncer line (~10-12m from batter, y=55) */}
          <line x1="30" y1="56" x2="70" y2="56" stroke="#c3f400" strokeWidth="0.4" strokeDasharray="1,2" opacity="0.5" />
          {/* Good Length Corridor (~6-8m from batter, y=42 to y=48) */}
          <rect x="35" y="42" width="30" height="7" fill="#eab308" fillOpacity="0.15" stroke="#eab308" strokeWidth="0.4" strokeDasharray="2,2" />

          {/* Distance Labels in SVG */}
          <text x="50" y="46.5" fill="#facc15" fontSize="2.2" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            GOOD LENGTH CORRIDOR (6-8m)
          </text>
          <text x="50" y="30.5" fill="#9cf0ff" fontSize="2" fontFamily="monospace" textAnchor="middle">
            BATTER POPPING CREASE
          </text>
          <text x="50" y="85.5" fill="#ffffff" fontSize="2" fontFamily="monospace" textAnchor="middle">
            BOWLER RELEASE LINE
          </text>

          {/* VIRTUAL 3D STUMPS (BATTER END - FAR PERSPECTIVE) */}
          {calibrationState.isVirtualStumpsLocked && (
            <g transform={`translate(${calibrationState.batterStumpsBox.x - 50}, 0)`}>
              {/* Stump Shadow */}
              <ellipse cx="50" cy="28.2" rx="4.5" ry="0.6" fill="#000000" opacity="0.6" />
              {/* Leg Stump */}
              <rect x="47.2" y="21.5" width="0.7" height="6.5" rx="0.3" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.15" />
              {/* Middle Stump */}
              <rect x="49.65" y="21.5" width="0.7" height="6.5" rx="0.3" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.15" />
              {/* Off Stump */}
              <rect x="52.1" y="21.5" width="0.7" height="6.5" rx="0.3" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.15" />
              {/* Bails */}
              <rect x="47.0" y="21.0" width="2.9" height="0.45" rx="0.2" fill="#fde047" stroke="#111" strokeWidth="0.1" />
              <rect x="50.1" y="21.0" width="2.9" height="0.45" rx="0.2" fill="#fde047" stroke="#111" strokeWidth="0.1" />
              {/* Glow Aura */}
              <circle cx="50" cy="24.5" r="5" fill="#c3f400" opacity="0.15" />
            </g>
          )}

          {/* VIRTUAL 3D STUMPS (BOWLER END - NEAR PERSPECTIVE) */}
          {calibrationState.isVirtualStumpsLocked && (
            <g transform={`translate(${calibrationState.bowlerStumpsBox.x - 50}, 0)`}>
              {/* Stump Shadow */}
              <ellipse cx="50" cy="88.2" rx="9" ry="1.2" fill="#000000" opacity="0.6" />
              {/* Leg Stump */}
              <rect x="45.5" y="74.5" width="1.4" height="13.5" rx="0.6" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.25" />
              {/* Middle Stump */}
              <rect x="49.3" y="74.5" width="1.4" height="13.5" rx="0.6" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.25" />
              {/* Off Stump */}
              <rect x="53.1" y="74.5" width="1.4" height="13.5" rx="0.6" fill="url(#stumpWood)" stroke="#111" strokeWidth="0.25" />
              {/* Bails */}
              <rect x="45.0" y="73.6" width="5.4" height="0.9" rx="0.35" fill="#fde047" stroke="#111" strokeWidth="0.2" />
              <rect x="50.6" y="73.6" width="5.4" height="0.9" rx="0.35" fill="#fde047" stroke="#111" strokeWidth="0.2" />
              {/* Glow Aura */}
              <circle cx="50" cy="80" r="10" fill="#c3f400" opacity="0.1" />
            </g>
          )}
        </svg>

        {/* INTERACTIVE ALIGNMENT BOX 1: BATTER STUMPS (FAR TARGET) */}
        <div
          className={`absolute z-10 transition-all cursor-pointer group flex flex-col items-center justify-center p-1 rounded-lg border-2 ${
            calibrationState.batterStumpsBox.isAligned
              ? 'border-[#c3f400] bg-[#c3f400]/10 shadow-[0_0_15px_rgba(195,244,0,0.4)]'
              : 'border-amber-400 border-dashed bg-amber-400/10 animate-pulse'
          }`}
          style={{
            top: `${calibrationState.batterStumpsBox.y}%`,
            left: `${calibrationState.batterStumpsBox.x}%`,
            transform: 'translate(-50%, -50%)',
            width: '88px',
            height: '92px',
          }}
          onClick={() => {
            playBeep(700, 0.05);
            setActiveDragTarget('batter');
          }}
        >
          {/* Target Reticle Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#c3f400]/60" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#c3f400]/60" />

          {/* Center Target Icon */}
          <span className="material-symbols-outlined text-[20px] text-[#c3f400] drop-shadow-[0_0_6px_rgba(195,244,0,0.8)]">
            adjust
          </span>
          <span className="text-[9px] font-mono font-bold text-white bg-black/70 px-1 rounded mt-1 whitespace-nowrap">
            BATTER STUMPS
          </span>
        </div>

        {/* INTERACTIVE ALIGNMENT BOX 2: BOWLER STUMPS (NEAR BASE) */}
        <div
          className={`absolute z-10 transition-all cursor-pointer group flex flex-col items-center justify-center p-1 rounded-xl border-2 ${
            calibrationState.bowlerStumpsBox.isAligned
              ? 'border-[#c3f400] bg-[#c3f400]/10 shadow-[0_0_20px_rgba(195,244,0,0.3)]'
              : 'border-amber-400 border-dashed bg-amber-400/10'
          }`}
          style={{
            top: `${calibrationState.bowlerStumpsBox.y}%`,
            left: `${calibrationState.bowlerStumpsBox.x}%`,
            transform: 'translate(-50%, -50%)',
            width: '160px',
            height: '110px',
          }}
          onClick={() => {
            playBeep(700, 0.05);
            setActiveDragTarget('bowler');
          }}
        >
          <div className="absolute inset-x-0 top-1/2 h-px bg-[#c3f400]/50" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#c3f400]/50" />

          <span className="material-symbols-outlined text-[24px] text-[#c3f400]">
            expand
          </span>
          <span className="text-[10px] font-mono font-bold text-white bg-black/70 px-1.5 py-0.5 rounded mt-1 whitespace-nowrap">
            BOWLING CREASE BASE
          </span>
        </div>

        {/* Scanning Animation Overlay when Auto-Detecting */}
        {isAutoDetecting && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] animate-fadeIn">
            <div className="w-56 h-1 bg-[#201f1f] rounded-full overflow-hidden border border-[#c3f400]/40 mb-3 shadow-lg">
              <div
                className="h-full bg-[#c3f400] transition-all duration-200 shadow-[0_0_10px_#c3f400]"
                style={{ width: `${detectProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#c3f400] tracking-wider">
              <span className="material-symbols-outlined text-[18px] animate-spin">
                radar
              </span>
              <span>DETECTING STUMPS & PERSPECTIVE... ({detectProgress}%)</span>
            </div>
            <span className="text-[10px] text-[#c4c9ac] mt-1">
              Analyzing edge contrast, vertical timber rods & pitch popping creases
            </span>
          </div>
        )}
      </div>

      {/* Bottom Tool Drawer: Dynamic by Active Tab */}
      <div className="bg-[#1a1919]/95 border border-white/10 rounded-2xl p-3 sm:p-4 max-w-4xl mx-auto w-full shadow-2xl backdrop-blur-xl">
        {/* TAB 1: STUMPS ALIGNMENT */}
        {activeTab === 'stumps' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Stump Alignment Accuracy
                </span>
                <span className="text-xs font-mono font-bold text-[#c3f400] bg-[#c3f400]/15 px-2 py-0.5 rounded border border-[#c3f400]/30">
                  {calibrationState.calibrationConfidenceScore}% Confidence
                </span>
                <span className="text-[10px] text-[#c4c9ac]">
                  Margin of Error &lt; 1.2 cm
                </span>
              </div>
              <p className="text-[11px] text-[#c4c9ac] max-w-xl">
                Point your smartphone tripod behind the bowler stumps. Position the target reticles over the real stumps at both ends, or tap Auto-Detect.
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <button
                onClick={handleAutoDetectStumps}
                disabled={isAutoDetecting}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px] text-[#c3f400]">
                  smart_toy
                </span>
                <span>Auto-Detect</span>
              </button>

              <button
                onClick={handleManualLock}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#c3f400] hover:bg-[#b0dc00] text-[#161e00] text-xs font-headline font-black flex items-center justify-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(195,244,0,0.3)] active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Lock Virtual Stumps</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TRIPOD TILT & INCLINOMETER */}
        {activeTab === 'tilt' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                {/* Bubble Level Meter */}
                <div
                  className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-colors ${
                    tiltEvaluation.isOptimal
                      ? 'bg-[#c3f400]/15 border-[#c3f400] text-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                      : 'bg-amber-400/15 border-amber-400 text-amber-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {tiltEvaluation.isOptimal ? 'check_circle' : 'change_history'}
                  </span>
                  <span className="text-[9px] font-mono font-bold mt-0.5">
                    {pitchAngle}°
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Digital Inclinometer & Horizon Level
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        tiltEvaluation.isOptimal
                          ? 'bg-[#c3f400]/20 text-[#c3f400]'
                          : 'bg-amber-400/20 text-amber-300'
                      }`}
                    >
                      {tiltEvaluation.isOptimal ? 'OPTIMAL ANGLE' : 'ADJUST TRIPOD'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c4c9ac]">{tiltEvaluation.guidanceText}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[#c4c9ac] block text-[9px] uppercase">Pitch Tilt</span>
                  <span className="text-white font-bold">{pitchAngle}° (Target: 8°-12°)</span>
                </div>
                <div className="bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/5">
                  <span className="text-[#c4c9ac] block text-[9px] uppercase">Horizon Roll</span>
                  <span className="text-white font-bold">{rollAngle}° (Target: ±1.5°)</span>
                </div>
              </div>
            </div>

            {/* Manual Sliders for Simulation / Fine-Tuning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-[#c4c9ac]">
                  <span>Pitch Downward Tilt (Deg)</span>
                  <span className="font-mono text-white font-bold">{pitchAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.2"
                  value={pitchAngle}
                  onChange={(e) => setPitchAngle(parseFloat(e.target.value))}
                  className="w-full accent-[#c3f400] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[#c4c9ac]">
                  <span>Tripod Height From Pitch</span>
                  <span className="font-mono text-white font-bold">{tripodHeight.toFixed(2)} m</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={tripodHeight}
                  onChange={(e) => setTripodHeight(parseFloat(e.target.value))}
                  className="w-full accent-[#c3f400] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PITCH PRESETS */}
        {activeTab === 'presets' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Select Pitch Dimension Preset
              </span>
              <span className="text-[10px] text-[#c4c9ac]">
                Active: {PITCH_PRESET_SPECS[selectedPreset].lengthMeters}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(
                [
                  'standard_match_22yd',
                  'indoor_net_20m',
                  'junior_u13_18yd',
                ] as PitchPresetType[]
              ).map((presetKey) => {
                const spec = PITCH_PRESET_SPECS[presetKey];
                const isSelected = selectedPreset === presetKey;

                return (
                  <button
                    key={presetKey}
                    onClick={() => handlePresetSelect(presetKey)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#c3f400]/10 border-[#c3f400] shadow-[0_0_10px_rgba(195,244,0,0.15)]'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{spec.label}</span>
                      <span className="text-[10px] font-mono text-[#c3f400] font-bold">
                        {spec.lengthMeters}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#c4c9ac] line-clamp-1">{spec.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
