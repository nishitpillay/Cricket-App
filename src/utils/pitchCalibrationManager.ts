import { PitchCalibrationState, PitchPresetType } from '../types';

const STORAGE_KEY = 'pitch_precision_pitch_calibration_v1';

export const PITCH_PRESET_SPECS: Record<
  PitchPresetType,
  { label: string; lengthMeters: string; description: string; pitchLength: number }
> = {
  standard_match_22yd: {
    label: '22 Yards (Standard Match)',
    lengthMeters: '20.12 m',
    description: 'Senior club, academy & ICC standard turf/artificial match pitch.',
    pitchLength: 20.12,
  },
  indoor_net_20m: {
    label: '20m Indoor Net Bay',
    lengthMeters: '20.00 m',
    description: 'Enclosed indoor training bay with standard net surrounds.',
    pitchLength: 20.00,
  },
  junior_u13_18yd: {
    label: '18 Yards (Junior / U13)',
    lengthMeters: '16.46 m',
    description: 'ECB & Cricket Australia junior youth developmental pitch length.',
    pitchLength: 16.46,
  },
  custom: {
    label: 'Custom Backyard / Net',
    lengthMeters: 'User Defined',
    description: 'Custom pitch length for specialized coaching drills or home nets.',
    pitchLength: 20.12,
  },
};

export const DEFAULT_CALIBRATION_STATE: PitchCalibrationState = {
  preset: 'standard_match_22yd',
  pitchLengthMeters: 20.12,
  tripodPitchAngleDeg: 10.2, // ~10° downward
  tripodRollAngleDeg: 0.2,   // Near flat
  tripodHeightMeters: 1.55,  // 1.55m
  distanceBehindStumpsMeters: 4.0, // 4 meters
  bowlerStumpsBox: {
    x: 50,
    y: 86,
    width: 28,
    height: 24,
    isAligned: true,
  },
  batterStumpsBox: {
    x: 50,
    y: 34,
    width: 14,
    height: 18,
    isAligned: true,
  },
  isVirtualStumpsLocked: true,
  calibrationConfidenceScore: 98.4,
  lensFovHorizontalDeg: 68.0,
  lightingEstimatedLux: 560,
  lastCalibratedAt: new Date().toISOString(),
};

export function getStoredCalibrationState(): PitchCalibrationState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CALIBRATION_STATE, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Unable to load stored pitch calibration state, fallback to defaults', e);
  }
  return { ...DEFAULT_CALIBRATION_STATE };
}

export function saveCalibrationState(state: PitchCalibrationState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Unable to save pitch calibration state', e);
  }
}

export function evaluateTripodTilt(pitchDeg: number, rollDeg: number): {
  isOptimal: boolean;
  pitchVerdict: 'optimal' | 'too_steep' | 'too_flat';
  rollVerdict: 'level' | 'tilted_left' | 'tilted_right';
  guidanceText: string;
} {
  const isPitchOptimal = pitchDeg >= 7.5 && pitchDeg <= 13.0;
  const isRollOptimal = Math.abs(rollDeg) <= 1.8;

  let pitchVerdict: 'optimal' | 'too_steep' | 'too_flat' = 'optimal';
  if (pitchDeg < 7.5) pitchVerdict = 'too_flat';
  if (pitchDeg > 13.0) pitchVerdict = 'too_steep';

  let rollVerdict: 'level' | 'tilted_left' | 'tilted_right' = 'level';
  if (rollDeg < -1.8) rollVerdict = 'tilted_left';
  if (rollDeg > 1.8) rollVerdict = 'tilted_right';

  let guidanceText = 'Tripod angle & horizon level are OPTIMAL for 3D trajectory tracking.';
  if (pitchVerdict === 'too_flat') {
    guidanceText = 'Tilt camera DOWNWARD slightly (~8°-12°) to bring entire 22-yard pitch into view.';
  } else if (pitchVerdict === 'too_steep') {
    guidanceText = 'Tilt camera UPWARD slightly to ensure bowler release point is not cropped.';
  } else if (rollVerdict !== 'level') {
    guidanceText = `Adjust tripod horizon level: phone is tilted ${rollVerdict === 'tilted_left' ? 'left' : 'right'}.`;
  }

  return {
    isOptimal: isPitchOptimal && isRollOptimal,
    pitchVerdict,
    rollVerdict,
    guidanceText,
  };
}
