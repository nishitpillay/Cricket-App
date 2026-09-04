import {
  AutoSlicerConfig,
  AutoSlicedDeliveryClip,
  NetSessionPlaylist,
  AutoSlicerTriggerMethod,
} from '../types';
import { mockBeehiveDeliveries } from './beehiveData';

export const DEFAULT_AUTOSLICER_CONFIG: AutoSlicerConfig = {
  isEnabled: true,
  preRollSeconds: 1.5,
  postRollSeconds: 2.2,
  soundThresholdDb: -16,
  motionSensitivity: 'MEDIUM',
  autoBookmarkWickets: true,
  hapticFeedbackOnSlice: true,
  audioFeedbackOnSlice: true,
  slowMoFrameRateFps: 120,
};

const AUTOSLICER_CONFIG_KEY = 'pitch_precision_autoslicer_config_v1';
const AUTOSLICER_PLAYLISTS_KEY = 'pitch_precision_autoslicer_playlists_v1';

export function getStoredAutoSlicerConfig(): AutoSlicerConfig {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUTOSLICER_CONFIG_KEY);
      if (raw) {
        return { ...DEFAULT_AUTOSLICER_CONFIG, ...JSON.parse(raw) };
      }
    }
  } catch (e) {
    console.warn('Unable to load stored autoslicer config:', e);
  }
  return DEFAULT_AUTOSLICER_CONFIG;
}

export function saveAutoSlicerConfig(cfg: AutoSlicerConfig): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.setItem(AUTOSLICER_CONFIG_KEY, JSON.stringify(cfg));
    }
  } catch (e) {
    console.warn('Unable to save autoslicer config:', e);
  }
}

// Generate high quality thumbnail URLs based on cricket training & action shots
const CLIP_THUMBNAILS = [
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?w=600&auto=format&fit=crop&q=80',
];

export const mockAutoSlicedClips: AutoSlicedDeliveryClip[] = mockBeehiveDeliveries.map((del, idx) => {
  const triggerTypes: AutoSlicerTriggerMethod[] = [
    'DUAL_VISION_AUDIO_FUSION',
    'OPTICAL_MOTION_RELEASE',
    'ACOUSTIC_SNICK_TRIGGER',
  ];

  const durationSec = 4.2 + (idx % 4) * 0.3; // 4.2s - 5.1s clip duration
  const trigger = triggerTypes[idx % triggerTypes.length];
  const confidence = 96.5 + (idx % 4) * 0.9;

  let tags: string[] = [del.lengthCategory, del.lineCategory];
  if (del.outcome === 'Wicket') tags.push('Wicket Highlight', del.wicketType || 'Clean Bowled');
  if (del.speedKmh >= 143) tags.push('Express 140+');
  if (del.isStumpHit) tags.push('Stump Hit');

  return {
    id: `clip-${del.id}`,
    ballNumber: del.ballNumber,
    overNumber: del.overNumber,
    sessionTitle: "Lord's Elite Fast Bowling Nets",
    timestamp: `Today, 10:${15 + idx * 2} AM`,
    durationSeconds: parseFloat(durationSec.toFixed(1)),
    thumbnailUrl: CLIP_THUMBNAILS[idx % CLIP_THUMBNAILS.length],
    videoSimUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    triggerMethod: trigger,
    detectionConfidencePct: parseFloat(confidence.toFixed(1)),
    isBookmarked: del.outcome === 'Wicket' || del.speedKmh >= 145,
    coachNotes:
      del.outcome === 'Wicket'
        ? 'Superb seam presentation upright on 4th stump channel. Late dip generated inside edge onto off peg.'
        : del.speedKmh >= 144
        ? 'High brace knee angle at front-foot contact. Maximum arm acceleration achieved.'
        : undefined,
    tags,
    delivery: del,
  };
});

export const mockNetSessionPlaylists: NetSessionPlaylist[] = [
  {
    id: 'playlist-session-1',
    title: "Lord's Elite Fast Bowling Nets #4",
    date: 'Today, 10:15 AM',
    venue: "Lord's Indoor Cricket Centre, St John's Wood",
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Ben Stokes & Joe Root',
    pitchCondition: 'Turf',
    totalDeliveries: mockAutoSlicedClips.length,
    topSpeedKmh: 146.2,
    avgSpeedKmh: 142.2,
    dotBallPct: 41.6,
    stumpHitPct: 58.3,
    clips: mockAutoSlicedClips,
  },
  {
    id: 'playlist-session-2',
    title: 'MCG Death Overs Yorker & Slower Ball Drill',
    date: 'Yesterday, 4:30 PM',
    venue: 'MCG High Performance Centre, Bay 2',
    bowlerName: 'Jasprit Bumrah',
    batterName: 'Harry Brook',
    pitchCondition: 'Synthetic Matting',
    totalDeliveries: 8,
    topSpeedKmh: 144.8,
    avgSpeedKmh: 139.5,
    dotBallPct: 50.0,
    stumpHitPct: 62.5,
    clips: mockAutoSlicedClips.slice(0, 8),
  },
];

export function getStoredPlaylists(): NetSessionPlaylist[] {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUTOSLICER_PLAYLISTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('Unable to load stored playlists:', e);
  }
  return mockNetSessionPlaylists;
}

export function saveStoredPlaylists(playlists: NetSessionPlaylist[]): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      localStorage.setItem(AUTOSLICER_PLAYLISTS_KEY, JSON.stringify(playlists));
    }
  } catch (e) {
    console.warn('Unable to save playlists:', e);
  }
}
