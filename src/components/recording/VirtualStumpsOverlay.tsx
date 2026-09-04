import React from 'react';
import { PitchCalibrationState } from '../../types';
import { PITCH_PRESET_SPECS } from '../../utils/pitchCalibrationManager';

interface VirtualStumpsOverlayProps {
  calibrationState: PitchCalibrationState;
  showGrid: boolean;
  onOpenCalibration: () => void;
  lastDelivery?: {
    speed: number;
    length: string;
    line: string;
    timestamp: string;
  };
}

export const VirtualStumpsOverlay: React.FC<VirtualStumpsOverlayProps> = ({
  calibrationState,
  showGrid,
  onOpenCalibration,
  lastDelivery,
}) => {
  if (!showGrid && !calibrationState.isVirtualStumpsLocked) return null;

  const presetSpec = PITCH_PRESET_SPECS[calibrationState.preset] || PITCH_PRESET_SPECS.standard_match_22yd;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* 1. Perspective Pitch Corridor & Virtual Stumps SVG */}
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="liveStumpWood" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          <linearGradient id="livePitchGlow" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#c3f400" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#c3f400" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Perspective Pitch Corridor */}
        {showGrid && (
          <polygon
            points="24,94 39,28 61,28 76,94"
            fill="url(#livePitchGlow)"
            stroke="#c3f400"
            strokeWidth="0.6"
            strokeDasharray={calibrationState.isVirtualStumpsLocked ? 'none' : '3,3'}
            opacity={calibrationState.isVirtualStumpsLocked ? 0.7 : 0.4}
          />
        )}

        {/* Popping Crease (Batter End) */}
        {showGrid && (
          <line
            x1="35"
            y1="32"
            x2="65"
            y2="32"
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity="0.6"
          />
        )}

        {/* Good Length corridor highlighting */}
        {showGrid && (
          <rect
            x="36"
            y="43"
            width="28"
            height="6"
            fill="#eab308"
            fillOpacity="0.12"
            stroke="#eab308"
            strokeWidth="0.3"
            strokeDasharray="2,2"
          />
        )}

        {/* BATTER-END VIRTUAL 3D STUMPS (Target at 22 Yards) */}
        {calibrationState.isVirtualStumpsLocked && (
          <g transform={`translate(${calibrationState.batterStumpsBox.x - 50}, 0)`}>
            {/* Ground shadow */}
            <ellipse cx="50" cy="28.2" rx="4.5" ry="0.6" fill="#000000" opacity="0.6" />

            {/* Leg Stump */}
            <rect
              x="47.2"
              y="21.5"
              width="0.75"
              height="6.5"
              rx="0.3"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.15"
              className="drop-shadow-[0_0_3px_rgba(195,244,0,0.5)]"
            />
            {/* Middle Stump */}
            <rect
              x="49.65"
              y="21.5"
              width="0.75"
              height="6.5"
              rx="0.3"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.15"
              className="drop-shadow-[0_0_3px_rgba(195,244,0,0.5)]"
            />
            {/* Off Stump */}
            <rect
              x="52.1"
              y="21.5"
              width="0.75"
              height="6.5"
              rx="0.3"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.15"
              className="drop-shadow-[0_0_3px_rgba(195,244,0,0.5)]"
            />
            {/* Bails */}
            <rect
              x="47.0"
              y="21.0"
              width="2.9"
              height="0.45"
              rx="0.2"
              fill="#fde047"
              stroke="#111"
              strokeWidth="0.1"
            />
            <rect
              x="50.1"
              y="21.0"
              width="2.9"
              height="0.45"
              rx="0.2"
              fill="#fde047"
              stroke="#111"
              strokeWidth="0.1"
            />

            {/* Glowing Wicket Zone Target Circle */}
            <circle
              cx="50"
              cy="24.5"
              r="4.5"
              fill="none"
              stroke="#c3f400"
              strokeWidth="0.3"
              strokeDasharray="1,1"
              className="animate-pulse"
            />
          </g>
        )}

        {/* BOWLER-END VIRTUAL 3D STUMPS (Foreground) */}
        {calibrationState.isVirtualStumpsLocked && (
          <g transform={`translate(${calibrationState.bowlerStumpsBox.x - 50}, 0)`}>
            <ellipse cx="50" cy="88.2" rx="9" ry="1.2" fill="#000000" opacity="0.6" />
            <rect
              x="45.5"
              y="74.5"
              width="1.4"
              height="13.5"
              rx="0.6"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.25"
            />
            <rect
              x="49.3"
              y="74.5"
              width="1.4"
              height="13.5"
              rx="0.6"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.25"
            />
            <rect
              x="53.1"
              y="74.5"
              width="1.4"
              height="13.5"
              rx="0.6"
              fill="url(#liveStumpWood)"
              stroke="#111"
              strokeWidth="0.25"
            />
            <rect
              x="45.0"
              y="73.6"
              width="5.4"
              height="0.9"
              rx="0.35"
              fill="#fde047"
              stroke="#111"
              strokeWidth="0.2"
            />
            <rect
              x="50.6"
              y="73.6"
              width="5.4"
              height="0.9"
              rx="0.35"
              fill="#fde047"
              stroke="#111"
              strokeWidth="0.2"
            />
          </g>
        )}
      </svg>

      {/* 2. Top Subtle Calibrated Pill (Clickable to Re-Calibrate) */}
      <div className="absolute top-16 left-4 z-20 pointer-events-auto">
        <button
          onClick={onOpenCalibration}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-[#c3f400]/40 text-[#c3f400] text-xs font-mono font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
          title="Click to open Fulltrack Camera & Pitch Calibration HUD"
        >
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse" />
          <span>{presetSpec.lengthMeters} CALIBRATED</span>
          <span className="text-[10px] text-gray-300 ml-1">({calibrationState.tripodPitchAngleDeg}°)</span>
          <span className="material-symbols-outlined text-[14px]">tune</span>
        </button>
      </div>

      {/* 3. Last Delivery Vector Highlight */}
      {lastDelivery && (
        <div className="absolute top-16 right-4 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1b1b]/80 backdrop-blur-md border border-white/10 text-xs shadow-lg">
            <span className="text-[#c3f400] font-bold font-mono">{lastDelivery.speed} km/h</span>
            <span className="text-gray-400">•</span>
            <span className="text-white text-[11px]">{lastDelivery.length}</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#9cf0ff] text-[11px]">{lastDelivery.line}</span>
          </div>
        </div>
      )}
    </div>
  );
};
